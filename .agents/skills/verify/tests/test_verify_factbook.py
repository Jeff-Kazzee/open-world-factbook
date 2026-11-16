import importlib.util
import json
import os
from pathlib import Path
import shutil
import signal
import sys
import tempfile
import time
import unittest

sys.dont_write_bytecode = True
SCRIPT = Path(__file__).resolve().parents[1] / "scripts/verify_factbook.py"
SPEC = importlib.util.spec_from_file_location("factbook_verifier", SCRIPT)
verifier = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(verifier)


class CleanupTests(unittest.TestCase):
    def scratch(self):
        root = Path(tempfile.mkdtemp(prefix="factbook-verify-test-"))
        self.addCleanup(shutil.rmtree, root, ignore_errors=True)
        (root / ".owner.json").write_text(json.dumps({"token": "owned"}))
        return root

    def test_evidence_survives_real_scratch_deletion(self):
        scratch = self.scratch()
        with tempfile.TemporaryDirectory() as folder:
            evidence = Path(folder)
            proof = evidence / "proof.txt"
            proof.write_text("observed action and state")
            expected = verifier.digest(proof)
            verifier.remove_scratch(scratch, "owned", evidence)
            self.assertFalse(scratch.exists())
            self.assertEqual(verifier.digest(proof), expected)

    def test_nested_evidence_prevents_deletion(self):
        scratch = self.scratch()
        proof = scratch / "evidence"
        proof.mkdir()
        (proof / "capture.txt").write_text("retain this")
        with self.assertRaisesRegex(RuntimeError, "nested evidence"):
            verifier.remove_scratch(scratch, "owned", proof)
        self.assertTrue((proof / "capture.txt").exists())

    def test_wrong_marker_preserves_scratch(self):
        scratch = self.scratch()
        with self.assertRaisesRegex(RuntimeError, "ownership marker"):
            verifier.remove_scratch(scratch, "wrong", Path(tempfile.gettempdir()) / "retained-proof")
        self.assertTrue(scratch.exists())

    def test_linked_scratch_cannot_delete_target(self):
        scratch = self.scratch()
        alias = scratch.parent / (scratch.name + "-alias")
        alias.symlink_to(scratch, target_is_directory=True)
        self.addCleanup(alias.unlink)
        with self.assertRaisesRegex(RuntimeError, "linked scratch"):
            verifier.remove_scratch(alias, "owned", scratch.parent / "retained-proof")
        self.assertTrue((scratch / ".owner.json").is_file())


@unittest.skipUnless(sys.platform.startswith("linux"), "Process ownership checks use Linux /proc")
class ProcessTests(unittest.TestCase):
    def start(self, cwd, log, code="import time; time.sleep(30)"):
        owned = verifier.OwnedProcess([sys.executable, "-c", code], cwd, os.environ.copy(), log)

        def stop():
            if owned.process.poll() is None:
                os.killpg(owned.process.pid, signal.SIGKILL)
            owned.process.wait(timeout=5)

        self.addCleanup(stop)
        return owned

    def test_stop_preserves_an_independent_process(self):
        with tempfile.TemporaryDirectory() as folder, open(os.devnull, "wb") as log:
            cwd = Path(folder)
            owned = self.start(cwd, log)
            sibling = self.start(cwd, log)
            owned.stop()
            self.assertIsNotNone(owned.process.poll())
            self.assertIsNone(sibling.process.poll())

    def test_changed_identity_refuses_signal(self):
        with tempfile.TemporaryDirectory() as folder, open(os.devnull, "wb") as log:
            owned = self.start(Path(folder), log)
            owned.started = "different start identity"
            with self.assertRaisesRegex(RuntimeError, "identity changed"):
                owned.stop()
            self.assertIsNone(owned.process.poll())

    def test_surviving_child_prevents_successful_cleanup_claim(self):
        with tempfile.TemporaryDirectory() as folder, open(os.devnull, "wb") as log:
            cwd = Path(folder)
            owned = self.start(cwd, log, """
import os, signal, time
from pathlib import Path
child = os.fork()
if child == 0:
    signal.signal(signal.SIGTERM, signal.SIG_IGN)
    Path('child.pid').write_text(str(os.getpid()))
    time.sleep(30)
    os._exit(0)
time.sleep(30)
""")
            deadline = time.monotonic() + 3
            while not (cwd / "child.pid").exists() and time.monotonic() < deadline:
                time.sleep(0.01)
            child = int((cwd / "child.pid").read_text())
            child_fd = os.pidfd_open(child)

            def stop_child():
                try:
                    signal.pidfd_send_signal(child_fd, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                finally:
                    os.close(child_fd)

            self.addCleanup(stop_child)
            with self.assertRaisesRegex(RuntimeError, "process group still has running members"):
                owned.stop()


class PreparedInputTests(unittest.TestCase):
    def test_wrong_source_fails_before_build_reuse(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "package.json").write_text("changed source")
            with self.assertRaisesRegex(RuntimeError, "source mismatch"):
                verifier.check_prepared(root, {"package.json": "expected source digest"})


if __name__ == "__main__":
    unittest.main()
