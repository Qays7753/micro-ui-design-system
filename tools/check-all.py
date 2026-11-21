#!/usr/bin/env python3
"""Run every quality gate and build check for the Micro UI library.

Runs each gate as a subprocess (so each keeps its own exit code and output),
prints a per-gate summary line, and exits non-zero if any gate failed.

Gate set (see tools/README.md for the full classification):
  - build tools in --check mode: standalone, catalog, manifest, package
    (node tools/build-package.mjs --check: src mirrors + deterministic dist)
  - static gates: static (light-static-check), links (link-check)
  - browser gates: audit, product-context, light-release, mobile-experience,
    light-calendar, light-data, component-consumption, integration-boundaries,
    clone-lifecycle, numeric-geometry, ui-system-showcase, preview-runtime
  - visual regression (D12) against the baseline under
    /home/z/my-project/visual-baseline (outside the repository)
  - git diff --check

Usage:
    uv run python tools/check-all.py [--quick] [--skip-visual]
      --quick        static + build gates + link-check + git diff --check only.
      --skip-visual  skip the D12 visual regression gate (used in CI, where the
                     baseline directory outside the repository is unavailable).
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
        ("link-check", PY + ["tools/link-check.py"]),
    ]
    if quick:
        return matrix
    matrix += [
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
                        help="skip the D12 visual regression gate (CI mode)")
    args = parser.parse_args()

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
