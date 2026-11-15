---
name: verify
description: Verify Open World Factbook on an isolated local production build using a real browser, retained evidence, and checked cleanup.
---

# Verify Open World Factbook

Use this skill for Factbook browser verification. Read [the feature map](features/README.md) and the relevant feature recipe before choosing a journey. This skill produces engineering evidence; it does not issue a merge receipt, register a company task, perform a managed security scan, or authorize publication.

Setup proof: the coordinator reports successful Linveo execution of the real search journey and deliberate post-capture failure control with this helper on an independently built matching-source candidate. Both runs closed the browser, stopped the server group, released the listener, removed scratch and retained verified evidence without cleanup errors. The earlier cloud sandbox failure remains separate historical evidence.

The tested input was source HEAD `01bcc30eeeda8406e60347890452f50ebccdd299` plus verifier draft tree `652c828c0550a0ab326a8405e28fbaeee881326d`, helper SHA-256 `04c93525779c19cc659098ce4b3ffaabba6435c5729cd27f103676eb9a84bff1`. Linveo used Node24.22.3/npm11.19.1, Python Playwright1.62.0 and sandboxed Chrome. Its scripts-disabled install, resolver check and build passed; Next16.4.5 build ID was `ZxA7upzKlubU_n370-nTC`. This is independent-build acceptance, not reproduction of the retained cloud build bytes. The coordinator reports normal result SHA-256 `33c286d54dec1a2b830757eda609afd3a6fc0d5d6bb0532c5c742350051dbc79` and deliberate-control result `ce818e7922fbfb6311a2dc8f9124afad400892f62eabe04fd8a78e06af9c286f`. Re-run only when relevant behavior or lifecycle code changes.

## Prerequisites and preparation

Run on Linux with Python 3.12 or newer, Python Playwright **1.62.0**, an approved Chromium executable with its sandbox available, and the CI Node **24.22.3**. The helper installs nothing. Keep the existing proxy and CA trust configuration. A browser launch failure is a failure; do not add `--no-sandbox` or change host security settings.

Supply a trusted, previously validated production checkout with `node_modules` and `.next/BUILD_ID`. Its tracked application files must match this checkout's committed source. The helper compares each file before copying it into fresh scratch space. README and this verification directory are excluded from build reuse because they are not application inputs. This comparison establishes source identity, not reproducible build provenance or a complete dependency-byte attestation; retain the original install/build record with the run.

If no suitable prepared checkout exists, prepare one in a separate disposable directory from the intended committed revision. Inspect its lifecycle scripts and use the official pinned toolchain and registry. For the current reviewed lockfile, use `npm ci --ignore-scripts --no-fund --no-audit`, then explicitly check the resolver binding with `SKIP_UNRS_RESOLVER_FALLBACK=1 node -e 'require("unrs-resolver")'` and run `npm run build` with telemetry disabled. Preserve the actual commands, tool versions, source identity, and outputs. Never reuse a build whose application source differs. Do not run preparation in the user's working tree or label a cached build as a new build.

## Launch and doctor

From the repository root, run the helper with existing validated inputs. For this cloud session, the matching prepared checkout and official Node installation are:

```bash
python3 -B .agents/skills/verify/scripts/verify_factbook.py \
  --prepared-app /tmp/factbook-ci-validation-s7il7du8 \
  --node /tmp/factbook-ci-preflight/node-v24.22.3-linux-x64/bin/node \
  --chromium /usr/bin/chromium \
  --evidence-root /workspace/factbook-verification-evidence \
  --journey search
```

These temporary input paths are session-specific. On another executor supply real, validated replacements; do not assume these paths exist. The executable helper is `scripts/verify_factbook.py`; passing it to Python as above is the supported invocation.

The helper archives committed source into a newly owned temporary directory and copies the prepared dependency/build trees. It creates a fresh temporary data/config/cache context and starts Next directly on `127.0.0.1` at an unused port. Factbook has no user database: its initial data is the tracked public country dataset. Doctor checks the owned PID's start identity, working directory, process group and listening socket, then checks HTTP 200 and the homepage body. The browser journey checks usability beyond HTTP readiness.

## Drive the real UI

The default `search` journey uses a fresh browser context with empty cookies and storage. It types `jap`, checks the Japan result, closes with Escape, refocuses, closes by clicking outside, checks a no-results query, clears it, and navigates to the Japan profile. Actions use visible controls and browser assertions. The helper also has `countries`, `regions`, `profile`, and `information` journeys documented in the map.

Browser page requests are limited to the owned loopback origin; external requests are aborted and recorded without query strings. Fonts, remote flags, maps, GitHub links and donation links are outside this verification. This routing policy is not a system-wide network sandbox. No production origin is contacted deliberately.

## Evidence and cleanup

Each invocation creates a unique evidence directory outside the repository and scratch directory. It retains source/ref/index/file hashes, runtime and build identities, doctor HTML/JSON, action records, screenshots, accessibility snapshots, browser trace, request decisions, page errors, server output and cleanup results. Read `result.json`, inspect the screenshots and accessibility snapshots for the claimed behavior, and preserve the parent install/build record. A `PASS` requires the journey, source-preservation check, owned-server cleanup, released listener, scratch removal, and unchanged retained evidence. Browser disconnection is recorded separately.

The helper signals only its own process group after checking PID identity, then checks for remaining running group members. If the leader has exited but children remain, cleanup fails and retains scratch; it refuses further signals without a verified leader identity. It deletes scratch only with its matching ownership marker and evidence outside scratch. It checks the source files, Git index and refs again after execution. A cleanup/source check failure retains scratch for diagnosis; report it and clean up only the confirmed owned resources. Never use a broad process-name kill or delete another run's directory.

Prove the failed-drive path once when changing this lifecycle helper by adding `--fail-after-capture` to the `search` command. Expect exit 1 and the deliberate failure in `result.json`, while cleanup and evidence retention still succeed. This is a negative control, not a passing journey.

## Helpers

Run the focused helper tests when changing ownership, reuse, or cleanup behavior:

```bash
python3 -B -m unittest discover -s .agents/skills/verify/tests -v
```

Record actual run paths, source revision/tree and helper hash in the private handoff. Do not invent a claim, verification receipt, hosted CI result, or skill-discovery result. Final-head review and existing publication/merge gates remain separate.
