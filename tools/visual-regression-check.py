#!/usr/bin/env python3
"""D12 visual regression gate: capture 360x780 RTL Light full-page screenshots
of every page (reusing tools/visual-baseline-capture.py via subprocess so the
capture method is identical), then compare each page against the reference
baseline PNGs.

A page passes when the number of differing pixels is <= 0.1% of total pixels
(D12). Mismatched image sizes fail that page. Pages that exist only in the
current tree (new) or only in the baseline (deleted) are reported as
"no baseline -- new/deleted" and do NOT fail the gate.

Usage:
    uv run python tools/visual-regression-check.py --out <dir> [--baseline <dir>]

Baseline default: the newest `pre-phase*` directory under
/home/z/my-project/visual-baseline (outside the repository). When pre-phase4
exists it is used for phases 4-7; pre-phase1 stays as historical evidence.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
BASELINE_ROOT = Path("/home/z/my-project/visual-baseline")
TOLERANCE = 0.001  # D12: differing pixels <= 0.1% of total pixels


def default_baseline():
    if not BASELINE_ROOT.is_dir():
        return None
    candidates = sorted(p for p in BASELINE_ROOT.iterdir()
                        if p.is_dir() and p.name.startswith("pre-phase"))
    return candidates[-1] if candidates else None


def diff_ratio(current: Path, reference: Path):
    """Return (ratio_of_differing_pixels, total_pixels) or ('size', None)."""
    a = Image.open(current).convert("RGB")
    b = Image.open(reference).convert("RGB")
    if a.size != b.size:
        return "size", None
    total = a.size[0] * a.size[1]
    diff = ImageChops.difference(a, b)
    if diff.getbbox() is None:
        return 0.0, total
    colors = diff.getcolors(maxcolors=1 << 24) or []
    differing = sum(count for count, rgb in colors if rgb != (0, 0, 0))
    return differing / total, total


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", type=Path, required=True,
                    help="temp dir for the fresh capture and the JSON report")
    ap.add_argument("--baseline", type=Path, default=None,
                    help="baseline dir (default: newest pre-phase* under "
                         "/home/z/my-project/visual-baseline)")
    args = ap.parse_args()
    baseline = args.baseline or default_baseline()
    if baseline is None or not (baseline / "manifest.json").is_file():
        print(f"visual-regression: no baseline found under {BASELINE_ROOT}; "
              "capture one with tools/visual-baseline-capture.py first")
        return 2

    capture_dir = args.out / "capture"
    capture_dir.mkdir(parents=True, exist_ok=True)
    print(f"visual-regression: capturing current pages -> {capture_dir}", flush=True)
    proc = subprocess.run(
        [sys.executable, str(ROOT / "tools" / "visual-baseline-capture.py"),
         "--out", str(capture_dir)],
        cwd=ROOT)
    if proc.returncode != 0:
        print("visual-regression: baseline capture failed")
        return 1

    baseline_manifest = json.loads(
        (baseline / "manifest.json").read_text(encoding="utf-8"))["pages"]
    current_manifest = json.loads(
        (capture_dir / "manifest.json").read_text(encoding="utf-8"))["pages"]

    report = {"baseline": str(baseline), "tolerance": TOLERANCE,
              "compared": 0, "passed": 0, "failed": 0,
              "new": [], "deleted": [], "failures": []}
    for rel, info in current_manifest.items():
        if rel not in baseline_manifest:
            report["new"].append(rel)
            continue
        report["compared"] += 1
        ratio, total = diff_ratio(capture_dir / info["file"],
                                  baseline / baseline_manifest[rel]["file"])
        if ratio == "size":
            report["failed"] += 1
            report["failures"].append({"page": rel, "reason": "size-mismatch"})
        elif ratio <= TOLERANCE:
            report["passed"] += 1
        else:
            report["failed"] += 1
            report["failures"].append(
                {"page": rel, "ratio": round(ratio, 6),
                 "percent": round(ratio * 100, 4)})
    for rel in baseline_manifest:
        if rel not in current_manifest:
            report["deleted"].append(rel)

    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")

    print(f"visual-regression: baseline={baseline}")
    print(f"  compared: {report['compared']}  passed: {report['passed']}  "
          f"failed: {report['failed']}")
    print(f"  no baseline -- new: {len(report['new'])}  "
          f"deleted: {len(report['deleted'])}")
    for rel in report["new"]:
        print(f"    new: {rel}")
    for rel in report["deleted"]:
        print(f"    deleted: {rel}")
    for failure in report["failures"]:
        if failure["reason"] == "size-mismatch":
            print(f"    FAIL {failure['page']}: size mismatch")
        else:
            print(f"    FAIL {failure['page']}: "
                  f"{failure['percent']}% pixels differ (> 0.1%)")
    print(f"  report: {args.out / 'report.json'}")
    return 1 if report["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
