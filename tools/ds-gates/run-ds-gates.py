#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""run-ds-gates — the S2 ds gate runner used by tools/check-all.py (task S2 #22).

Runs every ds gate as a subprocess (each keeps its own exit code), prints one
summary line per gate, and exits non-zero if any gate failed.

  uv run python tools/ds-gates/run-ds-gates.py            # current state
  uv run python tools/ds-gates/run-ds-gates.py --prove    # acceptance for S2:
      every gate must pass its current state AND fail on its violation
      fixture and pass its clean fixture; writes
      reports/ds-batch1/s2-gate-proof.json with both exit codes per gate.
"""
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

GATES_DIR = Path(__file__).resolve().parent
ROOT = GATES_DIR.parent.parent

# Static gates first (fast), then browser gates (Chromium + WebKit).
GATES = [
    "ds-raw-values",
    "ds-banned",
    "ds-structure",
    "ds-props",
    "ds-imports",
    "ds-dup",
    "ds-copy",
    "ds-browsers",
    "ds-consumer",
    "ds-lowend",
    "ds-standalone-mode",
    "ds-lab-fresh",
    "ds-measure",
    "ds-a11y",
    "ds-states",
    "ds-motion",
    "ds-hidden-amounts",
    "ds-font-shift",
    "ds-tabular",
    "ds-bidi",
    "ds-small-screen",
]

BROWSER_GATES = {
    "ds-standalone-mode", "ds-measure", "ds-a11y", "ds-states", "ds-motion",
    "ds-hidden-amounts", "ds-font-shift", "ds-tabular", "ds-bidi",
    "ds-small-screen",
}


def run_gate(name, extra=()):
    cmd = [sys.executable, str(GATES_DIR / f"{name}.py")] + list(extra)
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=600)


def last_line(text):
    lines = [ln for ln in (text or "").strip().splitlines() if ln.strip()]
    return lines[-1].strip() if lines else ""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prove", action="store_true",
                        help="also prove every gate on its fixtures (bad must fail, clean must pass)")
    parser.add_argument("--out", default="reports/ds-batch1/s2-gate-proof.json",
                        help="proof JSON destination (prove mode only)")
    args = parser.parse_args()

    results = []
    for name in GATES:
        kind = "browser" if name in BROWSER_GATES else "static"
        started = time.time()
        current = run_gate(name)
        prove = run_gate(name, ["--prove"]) if args.prove else None

        ok = current.returncode == 0 and (prove is None or prove.returncode == 0)
        tail = last_line(current.stdout)
        prove_tail = last_line(prove.stdout) if prove else ""
        print(f"=== ds gate: {name} ({kind}) -> {'OK' if ok else 'FAIL'} | current exit {current.returncode}"
              + (f" | prove exit {prove.returncode} ({prove_tail})" if prove else "")
              + (f" | {tail}" if tail else ""), flush=True)
        if not ok:
            print((current.stdout or "")[-2500:], flush=True)
            print((current.stderr or "")[-1200:], flush=True)
            if prove is not None:
                print((prove.stdout or "")[-2500:], flush=True)
                print((prove.stderr or "")[-1200:], flush=True)
        results.append({
            "gate": name, "kind": kind,
            "current_exit": current.returncode, "current_tail": tail,
            "prove_exit": prove.returncode if prove else None,
            "prove_tail": prove_tail,
            "seconds": round(time.time() - started, 1),
        })

    failed = [r for r in results if (r["current_exit"] != 0) or (r["prove_exit"] not in (None, 0))]
    print("\n===== ds gates summary =====", flush=True)
    for r in results:
        line = f"  {'OK  ' if r not in failed else 'FAIL'} {r['gate']}"
        if r["current_tail"]:
            line += f" | {r['current_tail']}"
        print(line, flush=True)
    print(f"total: {len(results)} gates, {len(results) - len(failed)} ok, {len(failed)} failed", flush=True)
    if failed:
        print("failed gates:", ", ".join(r["gate"] for r in failed), flush=True)

    if args.prove:
        proof = {
            "stage": "S2 — أدوات الفحص (وكيل الفحوص)",
            "date": time.strftime("%Y-%m-%d"),
            "mode": "prove + current-state",
            "definition": "لكل بوابة: الشاهد المخالف يجب أن يفشل (بوابة --prove تتوقع exit 1 من الشاهد المخالف وexit 0 من النظيف؛ تخرج 0 فقط إذا حدث ذلك)، والحالة الحالية تنجح (exit 0). بوابة لم تثبت فشلها على مخالفتها مرفوضة.",
            "gates": [],
        }
        for r in results:
            proof["gates"].append({
                "gate": r["gate"],
                "engine": r["kind"] + (" (chromium+webkit)" if r["kind"] == "browser" else ""),
                "violation_fixture": f"tools/ds-gates/fixtures/{r['gate']}/bad",
                "clean_fixture": f"tools/ds-gates/fixtures/{r['gate']}/clean",
                "expected_failure_exit": 1,
                "expected_success_exit": 0,
                "failure_detected_on_violation": r["prove_exit"] == 0,  # prove exit 0 == bad failed + clean passed
                "current_state_exit": r["current_exit"],
                "current_state_tail": r["current_tail"],
                "prove_exit": r["prove_exit"],
            })
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(proof, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"proof evidence written: {out}", flush=True)

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
