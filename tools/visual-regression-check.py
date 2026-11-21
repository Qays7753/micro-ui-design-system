#!/usr/bin/env python3
"""D12/R-D12 visual regression gate: capture 360x780 RTL Light full-page
screenshots of every page (reusing tools/visual-baseline-capture.py so the
capture method is identical), then compare each page against reference
captures.

The reference is generated from a git ref (default v0.1.0) inside a temporary
git worktree: no baseline images live in the repository and no machine-specific
absolute paths are involved (R-D12). If the ref tree needs a package build
(package.json present and dist/ absent), the tool runs `node
tools/build-package.mjs` inside the worktree first. The worktree is always
removed, even on failure.

A page passes when the number of differing pixels is <= 0.1% of total pixels
(D12). Mismatched image sizes always fail that page. Pages listed in
tools/baselines/visual-allowlist.json are reported as "allowed difference" and
do not fail the gate, unless the size differs or the difference exceeds 15%
(both always fail, R-D13). Pages that exist only in the current tree (new) or
only in the reference (deleted) are reported and do NOT fail the gate.

Usage:
    uv run python tools/visual-regression-check.py --out <dir>
        [--baseline-ref <git-ref>]   (default v0.1.0)
        [--baseline <dir>]           ready captures dir with manifest.json
                                      (overrides --baseline-ref)
"""
import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
TOLERANCE = 0.001   # D12: differing pixels <= 0.1% of total pixels
ALLOWED_MAX = 0.15   # R-D13: an allowlisted page still fails above 15%
ALLOWLIST = ROOT / "tools" / "baselines" / "visual-allowlist.json"


def load_allowlist():
    if not ALLOWLIST.is_file():
        return {}
    data = json.loads(ALLOWLIST.read_text(encoding="utf-8"))
    return {entry["page"]: entry for entry in data.get("pages", [])}


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


def run(command, **kwargs):
    proc = subprocess.run(command, **kwargs)
    if proc.returncode != 0:
        raise RuntimeError(
            f"command failed ({proc.returncode}): {' '.join(str(c) for c in command)}")
    return proc


def capture(tree_root: Path, out: Path, label: str) -> Path:
    """Capture pages of tree_root into out/<label> using the current capture tool."""
    capture_dir = out / label
    capture_dir.mkdir(parents=True, exist_ok=True)
    print(f"visual-regression: capturing {label} ({tree_root}) -> {capture_dir}", flush=True)
    run([sys.executable, str(ROOT / "tools" / "visual-baseline-capture.py"),
         "--root", str(tree_root), "--out", str(capture_dir)], cwd=ROOT)
    return capture_dir


def reference_from_ref(ref: str, out: Path) -> Path:
    """Materialize the reference tree at `ref` in a temp worktree and capture it.

    The worktree is always removed afterwards, even when something fails."""
    worktree = Path(tempfile.mkdtemp(prefix="micro-visual-ref-"))
    try:
        run(["git", "worktree", "add", "--detach", str(worktree), ref], cwd=ROOT)
        # R-D12: a ref that ships no dist/ needs a build before its pages can
        # be served faithfully (v0.1.0 tracks dist/, so no build happens there).
        if (worktree / "package.json").is_file() and not (worktree / "dist").is_dir():
            print(f"visual-regression: building package inside worktree ({ref})", flush=True)
            run(["node", "tools/build-package.mjs"], cwd=worktree)
        return capture(worktree, out, "baseline")
    finally:
        subprocess.run(["git", "worktree", "remove", "--force", str(worktree)],
                       cwd=ROOT, capture_output=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", type=Path, required=True,
                    help="temp dir for the fresh captures and the JSON report")
    ap.add_argument("--baseline-ref", default="v0.1.0",
                    help="git ref the reference captures are generated from "
                         "(default: v0.1.0)")
    ap.add_argument("--baseline", type=Path, default=None,
                    help="ready captures dir with manifest.json (overrides "
                         "--baseline-ref)")
    args = ap.parse_args()

    try:
        if args.baseline is not None:
            baseline_dir = args.baseline
            if not (baseline_dir / "manifest.json").is_file():
                print(f"visual-regression: --baseline has no manifest.json: {baseline_dir}")
                return 2
            reference = str(baseline_dir)
        else:
            baseline_dir = reference_from_ref(args.baseline_ref, args.out)
            reference = f"{args.baseline_ref} (worktree)"
        current_dir = capture(ROOT, args.out, "capture")
    except RuntimeError as error:
        print(f"visual-regression: {error}")
        return 1

    allowlist = load_allowlist()
    baseline_manifest = json.loads(
        (baseline_dir / "manifest.json").read_text(encoding="utf-8"))["pages"]
    current_manifest = json.loads(
        (current_dir / "manifest.json").read_text(encoding="utf-8"))["pages"]

    report = {"reference": reference, "tolerance": TOLERANCE,
              "allowedMax": ALLOWED_MAX, "compared": 0, "passed": 0,
              "allowed": 0, "failed": 0, "new": [], "deleted": [],
              "allowedDifferences": [], "failures": []}
    for rel, info in current_manifest.items():
        if rel not in baseline_manifest:
            report["new"].append(rel)
            continue
        report["compared"] += 1
        ratio, _total = diff_ratio(current_dir / info["file"],
                                   baseline_dir / baseline_manifest[rel]["file"])
        allowed_entry = allowlist.get(rel)
        if ratio == "size":
            report["failed"] += 1
            report["failures"].append({"page": rel, "reason": "size-mismatch"})
        elif ratio <= TOLERANCE:
            report["passed"] += 1
        elif allowed_entry is not None and ratio <= ALLOWED_MAX:
            report["allowed"] += 1
            report["allowedDifferences"].append(
                {"page": rel, "percent": round(ratio * 100, 4),
                 "reason": allowed_entry.get("reason", ""),
                 "decision": allowed_entry.get("decision", "")})
        else:
            report["failed"] += 1
            report["failures"].append(
                {"page": rel, "ratio": round(ratio, 6),
                 "percent": round(ratio * 100, 4),
                 "allowlisted": allowed_entry is not None})
    for rel in baseline_manifest:
        if rel not in current_manifest:
            report["deleted"].append(rel)

    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")

    print(f"visual-regression: reference={reference}")
    print(f"  compared: {report['compared']}  passed: {report['passed']}  "
          f"allowed: {report['allowed']}  failed: {report['failed']}")
    print(f"  no reference -- new: {len(report['new'])}  "
          f"deleted: {len(report['deleted'])}")
    for rel in report["new"]:
        print(f"    new: {rel}")
    for rel in report["deleted"]:
        print(f"    deleted: {rel}")
    for entry in report["allowedDifferences"]:
        print(f"    allowed difference: {entry['page']} "
              f"({entry['percent']}% <= 15%, {entry['decision']})")
    for failure in report["failures"]:
        if failure.get("reason") == "size-mismatch":
            print(f"    FAIL {failure['page']}: size mismatch")
        else:
            suffix = " (allowlisted but above 15%)" if failure.get("allowlisted") else ""
            print(f"    FAIL {failure['page']}: "
                  f"{failure['percent']}% pixels differ{suffix}")
    print(f"  report: {args.out / 'report.json'}")
    return 1 if report["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
