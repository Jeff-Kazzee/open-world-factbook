#!/usr/bin/env python3
"""Drive an isolated, prebuilt Factbook instance and retain proof after cleanup."""

from __future__ import annotations

import argparse
import hashlib
import http.client
import importlib.metadata
import io
import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import tarfile
import tempfile
import time
from urllib.parse import urlsplit
import uuid


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, indent=2) + "\n")


def git(repo: Path, *args: str) -> bytes:
    env = {**os.environ, "GIT_OPTIONAL_LOCKS": "0"}
    return subprocess.check_output(["git", *args], cwd=repo, env=env)


def source_state(repo: Path) -> dict:
    index = Path(git(repo, "rev-parse", "--git-path", "index").decode().strip())
    if not index.is_absolute():
        index = repo / index
    names = git(repo, "ls-files", "-z").split(b"\0")
    names += git(repo, "ls-files", "--others", "--exclude-standard", "-z").split(b"\0")
    return {
        "head": git(repo, "rev-parse", "HEAD").decode().strip(),
        "tree": git(repo, "rev-parse", "HEAD^{tree}").decode().strip(),
        "refs_sha256": hashlib.sha256(git(repo, "show-ref", "--head")).hexdigest(),
        "index_sha256": digest(index),
        "status": git(repo, "status", "--porcelain=v1", "--untracked-files=all").decode(),
        "files_sha256": {name.decode(): digest(repo / name.decode()) for name in names if name},
    }


def app_files(repo: Path) -> dict[str, str]:
    files = {}
    for record in git(repo, "ls-tree", "-rz", "HEAD").split(b"\0"):
        if not record:
            continue
        metadata, raw_name = record.split(b"\t", 1)
        mode, kind, blob = metadata.split()
        name = raw_name.decode()
        if name == "README.md" or name.startswith(".agents/skills/verify/"):
            continue
        if kind != b"blob" or mode == b"120000":
            raise RuntimeError(f"Unsupported source entry: {name}")
        data = (repo / name).read_bytes()
        actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        if actual != blob.decode():
            raise RuntimeError(f"Uncommitted application input: {name}")
        files[name] = hashlib.sha256(data).hexdigest()
    for raw_name in git(repo, "ls-files", "--others", "--exclude-standard", "-z").split(b"\0"):
        name = raw_name.decode()
        if name and not name.startswith(".agents/skills/verify/"):
            raise RuntimeError(f"Untracked input outside this verifier: {name}")
    return files


def check_prepared(prepared: Path, files: dict[str, str]) -> dict:
    for name, expected in files.items():
        path = prepared / name
        if not path.is_file() or path.is_symlink() or digest(path) != expected:
            raise RuntimeError(f"Prepared application source mismatch: {name}")
    for folder in ("node_modules", ".next"):
        if not (prepared / folder).is_dir() or (prepared / folder).is_symlink():
            raise RuntimeError(f"Missing prepared {folder}; use the skill's preparation recipe")
        for base, dirs, names in os.walk(prepared / folder, followlinks=False):
            for name in dirs + names:
                path = Path(base) / name
                if path.is_symlink() and (
                    path.readlink().is_absolute() or not path.resolve().is_relative_to(prepared)
                ):
                    raise RuntimeError(f"Prepared symlink is not self-contained: {path}")
    declared = json.loads((prepared / "package.json").read_text())["dependencies"]["next"]
    installed = json.loads((prepared / "node_modules/next/package.json").read_text())["version"]
    if declared != installed:
        raise RuntimeError("Prepared Next version does not match the declared exact pin")
    return {"next": installed, "build_id": (prepared / ".next/BUILD_ID").read_text().strip()}


def process_start(pid: int) -> str:
    return Path(f"/proc/{pid}/stat").read_text().rsplit(")", 1)[1].split()[19]


def running_group_members(group: int) -> list[int]:
    members = []
    for entry in Path("/proc").iterdir():
        if not entry.name.isdigit():
            continue
        try:
            fields = (entry / "stat").read_text().rsplit(")", 1)[1].split()
        except (FileNotFoundError, ProcessLookupError):
            continue
        if int(fields[2]) == group and fields[0] != "Z":
            members.append(int(entry.name))
    return members


class OwnedProcess:
    def __init__(self, args: list[str], cwd: Path, env: dict, log):
        self.process = subprocess.Popen(
            args, cwd=cwd, env=env, stdout=log, stderr=subprocess.STDOUT,
            start_new_session=True,
        )
        self.started = process_start(self.process.pid)
        self.cwd = cwd.resolve()

    def assert_identity(self) -> None:
        pid = self.process.pid
        if self.process.poll() is not None:
            raise RuntimeError(f"Owned server exited with {self.process.returncode}")
        if process_start(pid) != self.started or os.getpgid(pid) != pid:
            raise RuntimeError("Owned process identity changed; refusing to signal it")
        if Path(f"/proc/{pid}/cwd").resolve() != self.cwd:
            raise RuntimeError("Owned process directory changed")

    def stop(self) -> None:
        if self.process.poll() is None:
            self.assert_identity()
            os.killpg(self.process.pid, signal.SIGTERM)
            try:
                self.process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.assert_identity()
                os.killpg(self.process.pid, signal.SIGKILL)
                self.process.wait(timeout=5)
        else:
            self.process.wait()
        deadline = time.monotonic() + 2
        remaining = running_group_members(self.process.pid)
        while remaining and time.monotonic() < deadline:
            time.sleep(0.05)
            remaining = running_group_members(self.process.pid)
        if remaining:
            raise RuntimeError(f"Owned process group still has running members {remaining}; "
                               "retaining scratch and refusing signals without the leader identity")


def listening_inodes(port: int) -> set[str]:
    inodes = set()
    for line in Path("/proc/net/tcp").read_text().splitlines()[1:]:
        row = line.split()
        if row[1] == f"0100007F:{port:04X}" and row[3] == "0A":
            inodes.add(f"socket:[{row[9]}]")
    return inodes


def owns_listener(server: OwnedProcess, port: int) -> bool:
    server.assert_identity()
    inodes = listening_inodes(port)
    for fd in Path(f"/proc/{server.process.pid}/fd").iterdir():
        try:
            if os.readlink(fd) in inodes:
                return True
        except FileNotFoundError:
            pass
    return False


def doctor(server: OwnedProcess, port: int, timeout: float = 30) -> bytes:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        server.assert_identity()
        if owns_listener(server, port):
            connection = http.client.HTTPConnection("127.0.0.1", port, timeout=2)
            try:
                connection.request("GET", "/")
                response = connection.getresponse()
                body = response.read()
                if response.status == 200 and b"Open World Factbook" in body:
                    return body
            except (OSError, http.client.HTTPException):
                pass
            finally:
                connection.close()
        time.sleep(0.1)
    raise RuntimeError("Owned loopback server did not become usable")


def remove_scratch(scratch: Path, token: str, evidence: Path) -> None:
    if scratch.is_symlink() or evidence.resolve().is_relative_to(scratch.resolve()):
        raise RuntimeError("Refusing cleanup with a linked scratch root or nested evidence")
    if (scratch.parent.resolve() != Path(tempfile.gettempdir()).resolve()
            or not scratch.name.startswith("factbook-verify-")):
        raise RuntimeError("Scratch root is outside the temporary directory")
    if json.loads((scratch / ".owner.json").read_text()).get("token") != token:
        raise RuntimeError("Scratch ownership marker differs; refusing deletion")
    shutil.rmtree(scratch)


def run_journey(page, evidence: Path, origin: str, fail_after_capture: bool) -> None:
    from playwright.sync_api import expect

    def action(name: str, value: str = "") -> None:
        with (evidence / "actions.jsonl").open("a") as log:
            log.write(json.dumps({"event": "action", "name": name, "value": value}) + "\n")

    def capture(name: str) -> None:
        page.screenshot(path=str(evidence / f"{name}.png"), full_page=False)
        (evidence / f"{name}.aria.txt").write_text(page.locator("body").aria_snapshot())
        with (evidence / "actions.jsonl").open("a") as log:
            log.write(json.dumps({"event": "observed", "state": name, "url": page.url}) + "\n")

    field = page.get_by_placeholder("Search countries, regions, capitals...", exact=True)
    area = field.locator("..")
    japan = area.locator('a[href="/country/japan"]')
    expect(page.get_by_role("heading", name="Open World Factbook", exact=True, level=1)).to_be_visible()
    expect(field).to_be_visible()
    capture("home")
    if fail_after_capture:
        raise RuntimeError("Deliberate failed-drive control after the first capture")
    action("fill search", "jap")
    field.fill("jap")
    expect(japan).to_be_visible()
    capture("search-jap")
    action("press Escape")
    field.press("Escape")
    expect(japan).to_have_count(0)
    expect(field).to_have_value("jap")
    capture("escape")
    action("refocus search")
    page.get_by_role("heading", name="Open World Factbook", exact=True, level=1).click()
    field.click()
    expect(japan).to_be_visible()
    action("click outside")
    page.get_by_role("heading", name="Open World Factbook", exact=True, level=1).click()
    expect(japan).to_have_count(0)
    capture("outside")
    action("fill unmatched query", "zzzxqv-verify-991734")
    field.fill("zzzxqv-verify-991734")
    expect(area.get_by_text('No countries found for "zzzxqv-verify-991734"', exact=True)).to_be_visible()
    capture("no-results")
    action("clear query")
    field.fill("")
    expect(area.get_by_text("No countries found for", exact=False)).to_have_count(0)
    expect(area.locator("a")).to_have_count(0)
    capture("cleared")
    action("fill search and open Japan", "jap")
    field.fill("jap")
    expect(japan).to_be_visible()
    japan.click()
    expect(page).to_have_url(origin + "/country/japan")
    expect(page.get_by_role("heading", name="Japan", exact=True, level=1)).to_be_visible()
    capture("japan")


def run_other_feature(page, evidence: Path, origin: str, feature: str) -> None:
    from playwright.sync_api import expect

    def visit(name: str, selector: str, heading: str) -> None:
        with (evidence / "actions.jsonl").open("a") as log:
            log.write(json.dumps({"event": "action", "name": name, "selector": selector}) + "\n")
        page.locator(selector).click()
        expect(page.get_by_role("heading", name=heading, exact=True, level=1)).to_be_visible()
        page.screenshot(path=str(evidence / f"{name}.png"))
        (evidence / f"{name}.aria.txt").write_text(page.locator("body").aria_snapshot())

    if feature == "countries":
        visit("country-index", 'a[href="/countries"]', "All Countries")
        page.locator('a[href="#letter-J"]').click()
        expect(page).to_have_url(origin + "/countries#letter-J")
        visit("index-japan", '#letter-J a[href="/country/japan"]', "Japan")
    elif feature == "regions":
        visit("home-region", 'a[href="/region/east-n-southeast-asia"]', "East & Southeast Asia")
        visit("region-japan", 'a[href="/country/japan"]', "Japan")
        visit("region-home", 'a[href="/"]', "Open World Factbook")
        visit("regions-index", 'a[href="/countries"]', "All Countries")
        visit("index-region", 'a[href="/region/east-n-southeast-asia"]', "East & Southeast Asia")
    elif feature == "profile":
        with (evidence / "actions.jsonl").open("a") as log:
            log.write(json.dumps({"event": "action", "name": "direct Japan", "url": origin + "/country/japan"}) + "\n")
        response = page.goto(origin + "/country/japan", wait_until="networkidle")
        if response.status != 200:
            raise RuntimeError("Japan profile did not return HTTP200")
        expect(page.get_by_role("heading", name="Japan", exact=True, level=1)).to_be_visible()
        page.screenshot(path=str(evidence / "profile-japan.png"))
        (evidence / "profile-japan.aria.txt").write_text(page.locator("body").aria_snapshot())
        visit("profile-home", 'a[href="/"]', "Open World Factbook")
    elif feature == "information":
        for route, heading in [("about", "About Open World Factbook"), ("api-docs", "Data Access"), ("contribute", "Contribute")]:
            visit(route, f'footer a[href="/{route}"]', heading)
            visit(route + "-home", 'a[href="/"]', "Open World Factbook")
    else:
        raise RuntimeError(f"Unknown feature: {feature}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prepared-app", type=Path, required=True)
    parser.add_argument("--node", type=Path, default=shutil.which("node"))
    parser.add_argument("--chromium", type=Path, default=shutil.which("chromium"))
    parser.add_argument("--evidence-root", type=Path, required=True)
    parser.add_argument("--journey", choices=["search", "countries", "regions", "profile", "information"], default="search")
    parser.add_argument("--fail-after-capture", action="store_true")
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[4]
    evidence_root = args.evidence_root.resolve()
    if evidence_root.is_relative_to(repo) or args.node is None or args.chromium is None:
        parser.error("Use evidence outside the repo and provide approved Node/Chromium executables")
    evidence = evidence_root / (time.strftime("%Y%m%dT%H%M%S") + "-" + uuid.uuid4().hex[:10])
    evidence.mkdir(parents=True)
    initial = source_state(repo)
    scratch = Path(tempfile.mkdtemp(prefix="factbook-verify-"))
    token = uuid.uuid4().hex
    write_json(scratch / ".owner.json", {"token": token})
    server = None
    server_log = None
    error = None
    cleanup_errors = []
    manifest = {"source": initial, "helper_sha256": digest(Path(__file__)), "feature": args.journey,
                "evidence": str(evidence), "scratch": str(scratch),
                "deliberate_failure": args.fail_after_capture,
                "external_visuals": "blocked; fonts, flags and maps are not verified"}
    try:
        files = app_files(repo)
        manifest["app_files_sha256"] = files
        manifest["build_reuse_exclusions"] = ["README.md", ".agents/skills/verify/"]
        manifest["prepared"] = check_prepared(args.prepared_app.resolve(), files)
        node = args.node.resolve()
        version = subprocess.check_output([str(node), "--version"], text=True).strip()
        if version != "v24.22.3":
            raise RuntimeError(f"Expected the CI Node v24.22.3, observed {version}")
        manifest["node"] = {"version": version, "path": str(node)}
        manifest["python"] = {"version": sys.version, "path": sys.executable}
        manifest["chromium"] = {"path": str(args.chromium.resolve()),
                                "version": subprocess.check_output(
                                    [str(args.chromium), "--version"], text=True).strip()}
        manifest["playwright"] = importlib.metadata.version("playwright")
        if manifest["playwright"] != "1.62.0":
            raise RuntimeError("This driver was validated with Python Playwright1.62.0")
        instance = scratch / "app"
        instance.mkdir()
        with tarfile.open(fileobj=io.BytesIO(git(repo, "archive", "HEAD"))) as archive:
            archive.extractall(instance, filter="data")
        for folder in ("node_modules", ".next"):
            shutil.copytree(args.prepared_app / folder, instance / folder, symlinks=True)
        temp = scratch / "tmp"
        temp.mkdir()
        env = {key: value for key, value in os.environ.items() if key in {
            "PATH", "LANG", "LC_ALL", "TZ", "HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY",
            "http_proxy", "https_proxy", "no_proxy", "NODE_EXTRA_CA_CERTS", "SSL_CERT_FILE", "SSL_CERT_DIR",
        }}
        env.update({"PATH": str(node.parent) + os.pathsep + env.get("PATH", ""),
                    "TMPDIR": str(temp), "NEXT_TELEMETRY_DISABLED": "1",
                    "SKIP_UNRS_RESOLVER_FALLBACK": "1", "NODE_ENV": "production",
                    "XDG_CONFIG_HOME": str(scratch / "config"), "XDG_CACHE_HOME": str(scratch / "cache")})
        with socket.socket() as reservation:
            reservation.bind(("127.0.0.1", 0))
            port = reservation.getsockname()[1]
        origin = f"http://127.0.0.1:{port}"
        manifest["origin"] = origin
        server_log = (evidence / "server.log").open("wb")
        server = OwnedProcess([str(node), "node_modules/next/dist/bin/next", "start",
                               "--hostname", "127.0.0.1", "--port", str(port)], instance, env, server_log)
        manifest["server"] = {"pid": server.process.pid, "start": server.started, "cwd": str(instance)}
        write_json(evidence / "manifest.json", manifest)
        (evidence / "doctor-home.html").write_bytes(doctor(server, port))
        write_json(evidence / "doctor.json", {"owned_listener": True, "http_status": 200,
                   "build": manifest["prepared"], "browser_usability": "not assessed by doctor"})
        from playwright.sync_api import sync_playwright

        page_errors = []
        requests = []
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=str(args.chromium), headless=True,
                chromium_sandbox=True, env=env, args=["--disable-background-networking"])
            context = None
            try:
                context = browser.new_context(viewport={"width": 1280, "height": 900}, service_workers="block")
                initial_storage = context.storage_state()
                if initial_storage != {"cookies": [], "origins": []}:
                    raise RuntimeError("Fresh browser context was not empty")
                write_json(evidence / "initial-storage.json", initial_storage)

                def route(request_route):
                    url = urlsplit(request_route.request.url)
                    allowed = url.scheme == "http" and url.netloc == f"127.0.0.1:{port}"
                    requests.append({"url": url.scheme + "://" + url.netloc + url.path, "allowed": allowed})
                    request_route.continue_() if allowed else request_route.abort()

                context.route("**/*", route)
                context.tracing.start(screenshots=True, snapshots=True, sources=False)
                page = context.new_page()
                page.on("pageerror", lambda failure: page_errors.append(str(failure)))
                page.goto(origin, wait_until="networkidle", timeout=30000)
                if args.journey == "search":
                    run_journey(page, evidence, origin, args.fail_after_capture)
                else:
                    if args.fail_after_capture:
                        raise RuntimeError("Use the search journey for the failed-drive control")
                    run_other_feature(page, evidence, origin, args.journey)
                if page_errors:
                    raise RuntimeError("Browser JavaScript errors were observed")
                manifest["journey_completed"] = True
            finally:
                if context:
                    try:
                        context.tracing.stop(path=str(evidence / "trace.zip"))
                    except Exception as failure:
                        cleanup_errors.append(f"Trace finalization: {failure}")
                    try:
                        context.close()
                    except Exception as failure:
                        cleanup_errors.append(f"Context cleanup: {failure}")
                try:
                    browser.close()
                except Exception as failure:
                    cleanup_errors.append(f"Browser cleanup: {failure}")
                if browser.is_connected():
                    cleanup_errors.append("Browser remained connected after cleanup")
                write_json(evidence / "browser-cleanup.json", {"disconnected": not browser.is_connected(),
                           "sandbox_requested": True})
                write_json(evidence / "page-errors.json", page_errors)
                write_json(evidence / "requests.json", requests)
    except BaseException as failure:
        error = f"{type(failure).__name__}: {failure}"
        if server and server.process.poll() is None:
            try:
                doctor(server, port, timeout=2)
                write_json(evidence / "doctor-after-failure.json", {"owned_server_healthy": True})
            except Exception as diagnostic:
                write_json(evidence / "doctor-after-failure.json", {"error": str(diagnostic)})
    finally:
        if server:
            try:
                server.stop()
                manifest["server_stopped"] = server.process.poll() is not None
                manifest["server_group_empty"] = True
                manifest["listener_gone"] = not listening_inodes(port)
                if not manifest["listener_gone"]:
                    raise RuntimeError("The loopback port has a listener after owned-server cleanup")
            except Exception as failure:
                cleanup_errors.append(str(failure))
        if server_log:
            server_log.close()
        try:
            if source_state(repo) != initial:
                raise RuntimeError("Source, index, refs or application data changed during verification")
        except Exception as failure:
            cleanup_errors.append(str(failure))
        write_json(evidence / "manifest.json", manifest)
        frozen = {path.name: digest(path) for path in evidence.iterdir() if path.is_file()}
        try:
            if cleanup_errors:
                raise RuntimeError("Retaining scratch state because cleanup or source checks failed")
            remove_scratch(scratch, token, evidence)
            if any(not (evidence / name).is_file() or digest(evidence / name) != sha for name, sha in frozen.items()):
                raise RuntimeError("Evidence was removed or changed during scratch cleanup")
        except Exception as failure:
            cleanup_errors.append(str(failure))
        result = {"result": "PASS" if error is None and not cleanup_errors else "FAIL", "error": error,
                  "cleanup_errors": cleanup_errors, "scratch_removed": not scratch.exists(),
                  "evidence_retained": all((evidence / name).is_file() and digest(evidence / name) == sha
                                           for name, sha in frozen.items()),
                  "artifact_sha256": frozen, "source_head": initial["head"], "evidence": str(evidence)}
        write_json(evidence / "result.json", result)
        print(json.dumps(result))
    return 0 if result["result"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
