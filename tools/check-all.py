#!/usr/bin/env python3
"""Run every quality gate and build check for the Micro UI library.

Runs each gate as a subprocess (so each keeps its own exit code and output),
prints a per-gate summary line, and exits non-zero if any gate failed.
Phase 4 of the integration-readiness plan extends this runner as gates are
consolidated; the command itself is the single entry point referenced by
AGENTS.md and CI.

Usage: uv run python tools/check-all.py [--quick]
  --quick skips the slower browser gates (static + build checks only).
"""
import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UV = [sys.executable]


def gates(quick):
    out = Path(tempfile.mkdtemp(prefix="micro-check-all-"))
    matrix = [
        ("standalone", UV + ["tools/build-ui-system-showcase-standalone.py", "--check"]),
        ("catalog", UV + ["tools/component-catalog-build.py", "--check"]),
        ("manifest", UV + ["tools/manifest-build.py", "--check"]),
        ("static", UV + ["tools/light-static-check.py"]),
    ]
    if not quick:
        matrix += [
            ("audit", UV + ["tools/component-audit-check.py", "--out", str(out / "audit")]),
            ("product-context", UV + ["tools/product-context-check.py", "--out", str(out / "product")]),
            ("light-release", UV + ["tools/light-release-check.py", "--review-scope", "--out", str(out / "release")]),
            ("mobile-experience", UV + ["tools/mobile-experience-check.py", "--out", str(out / "mobile")]),
        ]
    return matrix


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--quick", action="store_true", help="skip slower browser gates")
    args = parser.parse_args()
    results = []
    for name, command in gates(args.quick):
        print(f"=== gate: {name} ({' '.join(command[1:])})", flush=True)
        proc = subprocess.run(command, cwd=ROOT)
        results.append((name, proc.returncode))
        print(f"=== gate: {name} -> {'OK' if proc.returncode == 0 else 'FAIL'}", flush=True)
    whitespace = subprocess.run(["git", "diff", "--check"], cwd=ROOT)
    results.append(("git-diff-check", whitespace.returncode))

    failed = [name for name, code in results if code != 0]
    print("\n===== check-all summary =====")
    for name, code in results:
        print(f"  {'OK  ' if code == 0 else 'FAIL'} {name}")
    print(f"total: {len(results)} gates, {len(results) - len(failed)} ok, {len(failed)} failed")
    if failed:
        print("failed gates:", ", ".join(failed))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
