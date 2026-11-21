#!/usr/bin/env python3
"""Run every quality gate and build check for the Micro UI library.

Runs each gate as a subprocess (so each keeps its own exit code and output),
prints a per-gate summary line, and exits non-zero if any gate failed.

Gate set (see tools/README.md for the full classification):
  - package build first (R2.3): node tools/build-package.mjs — real build of
    dist/ (esm/iife/css/assets) from the ESM source; consumers serve from it
  - build tools in --check mode: standalone, catalog, manifest, package
    (node tools/build-package.mjs --check: entries, ESM exports, no import
      side effects, types for every entry — dist/ is untracked, R-D4)
  - package-install (R3): npm pack + install in a temp project, Node import
    of every entry without DOM, exports targets, tsc against the installed
    package, a Chromium importmap page with manual init, and a git install
    whose prepare builds dist/
  - static gates: static (light-static-check), lint (eslint no-undef on
    components/ and shared/), links (link-check), hardcoded-text (Arabic
    strings in JS, labels imports, d.ts coverage)
  - browser gates: audit, product-context, light-release, mobile-experience,
    light-calendar, light-data, component-consumption, integration-boundaries,
    clone-lifecycle, api-lifecycle, numeric-geometry, ui-system-showcase,
    preview-runtime
  - visual regression (D12/R-D12) against reference captures generated from
    a git ref (default v0.2.0) inside a temporary worktree — no baseline
    images or machine-specific paths outside the repository
  - git diff --check

Usage:
    uv run python tools/check-all.py [--quick] [--skip-visual]
      --quick        static + build gates + link-check + git diff --check only.
      --skip-visual  skip the visual regression gate (manual debugging only;
                     CI runs it too).
"""
import argparse
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PY = [sys.executable]
SERVER_PORT = 5000
BASE_URL = f"http://127.0.0.1:{SERVER_PORT}"


def build_gates(quick, out, skip_visual):
    matrix = [
        ("standalone", PY + ["tools/build-ui-system-showcase-standalone.py", "--check"]),
        ("catalog", PY + ["tools/component-catalog-build.py", "--check"]),
        ("manifest", PY + ["tools/manifest-build.py", "--check"]),
        ("package", ["node", "tools/build-package.mjs", "--check"]),
        ("static", PY + ["tools/light-static-check.py"]),
        ("lint", ["npm", "run", "lint"]),
        ("link-check", PY + ["tools/link-check.py"]),
        ("hardcoded-text", PY + ["tools/hardcoded-text-check.py"]),
        ("labels-doc", PY + ["tools/labels-doc-build.py", "--check"]),
    ]
    if quick:
        return matrix
    matrix += [
        ("package-install", ["node", "tools/package-install-check.mjs"]),
        ("labels-override", PY + ["tools/labels-override-check.py", "--out", str(out / "labels-override")]),
        ("audit", PY + ["tools/component-audit-check.py", "--out", str(out / "audit")]),
        ("product-context", PY + ["tools/product-context-check.py", "--out", str(out / "product")]),
        ("light-release", PY + ["tools/light-release-check.py", "--review-scope",
                                "--out", str(out / "release")]),
        ("mobile-experience", PY + ["tools/mobile-experience-check.py", "--out", str(out / "mobile")]),
        ("light-calendar", PY + ["tools/light-calendar-check.py"]),
        ("light-data", PY + ["tools/light-data-check.py", "--out", str(out / "light-data")]),
        ("component-consumption", PY + ["tools/component-consumption-contract-check.py"]),
        ("integration-boundaries", PY + ["tools/integration-boundaries-check.py"]),
        ("clone-lifecycle", PY + ["tools/clone-lifecycle-check.py"]),
        ("api-lifecycle", PY + ["tools/api-lifecycle-check.py", "--out", str(out / "api-lifecycle")]),
        ("screen", PY + ["tools/screen-check.py", "--out", str(out / "screen")]),
        ("text-scale", PY + ["tools/text-scale-check.py", "--out", str(out / "text-scale")]),
        ("numeric-geometry", PY + ["tools/numeric-geometry-check.py"]),
        ("ui-system-showcase", PY + ["tools/ui-system-showcase-check.py"]),
        ("preview-runtime", PY + ["tools/preview-runtime-check.py",
                                  "--base", BASE_URL, "--out", str(out / "preview-runtime")]),
    ]
    if not skip_visual:
        matrix += [
            ("visual-regression", PY + ["tools/visual-regression-check.py",
                                        "--out", str(out / "visual")]),
        ]
    return matrix


def port_open(port):
    s = socket.socket()
    s.settimeout(0.3)
    try:
        s.connect(("127.0.0.1", port))
        return True
    except OSError:
        return False
    finally:
        s.close()


def start_server():
    """Start the preview server for gates that expect http://127.0.0.1:5000."""
    if port_open(SERVER_PORT):
        return None
    proc = subprocess.Popen([sys.executable, "tools/preview-server.py"], cwd=ROOT,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        if port_open(SERVER_PORT):
            break
        time.sleep(0.25)
    return proc


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--quick", action="store_true", help="skip browser and visual gates")
    parser.add_argument("--skip-visual", action="store_true",
                        help="skip the visual regression gate (manual debugging only)")
    args = parser.parse_args()

    # R2.3: أول خطوة بناء فعلي للحزمة — كل المستهلكين داخل المستودع
    # يخدمون من dist/iife المبني (R-D5)، فتبنى الحزمة قبل أي بوابة.
    build = subprocess.run(["node", "tools/build-package.mjs"], cwd=ROOT,
                           capture_output=True, text=True)
    print(f"=== build: {'OK' if build.returncode == 0 else 'FAIL'} | {build.stdout.strip().splitlines()[-1] if build.stdout.strip() else ''}", flush=True)
    if build.returncode != 0:
        print(build.stdout[-3000:])
        print(build.stderr[-2000:])
        return 1

    out = Path(tempfile.mkdtemp(prefix="micro-check-all-"))
    matrix = build_gates(args.quick, out, args.skip_visual)
    needs_server = not args.quick
    server = start_server() if needs_server else None
    if needs_server and not port_open(SERVER_PORT):
        print("check-all: failed to start the preview server on port 5000")
        if server:
            server.terminate()
        return 1

    results = []
    try:
        for name, command in matrix:
            print(f"=== gate: {name} ({' '.join(command[1:])})", flush=True)
            proc = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
            tail = ""
            for line in reversed((proc.stdout or "").strip().splitlines()):
                if line.strip():
                    tail = line.strip()
                    break
            if proc.returncode != 0:
                print((proc.stdout or "")[-4000:])
                print((proc.stderr or "")[-2000:])
            results.append((name, proc.returncode, tail))
            print(f"=== gate: {name} -> {'OK' if proc.returncode == 0 else 'FAIL'}"
                  f"{f' | {tail}' if tail else ''}", flush=True)
    finally:
        if server:
            server.terminate()

    whitespace = subprocess.run(["git", "diff", "--check"], cwd=ROOT,
                                capture_output=True, text=True)
    results.append(("git-diff-check", whitespace.returncode,
                    (whitespace.stdout or "").strip().splitlines()[-1]
                    if (whitespace.stdout or "").strip() else ""))

    failed = [(name, code) for name, code, _ in results if code != 0]
    print("\n===== check-all summary =====")
    for name, code, tail in results:
        line = f"  {'OK  ' if code == 0 else 'FAIL'} {name}"
        if tail:
            line += f" | {tail}"
        print(line)
    print(f"total: {len(results)} gates, {len(results) - len(failed)} ok, {len(failed)} failed")
    if failed:
        print("failed gates:", ", ".join(name for name, _ in failed))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
