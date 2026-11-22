#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-browsers — the build only ships what the target floor can run (plan section 2, K17).

1. ds/package.json browserslist must be exactly the plan's floor:
   iOS >= 16.4, Chrome >= 116, ChromeAndroid >= 116, Samsung >= 23.
2. ds/vite.config.ts must derive its esbuild/css targets from that browserslist
   query (structural check: the config imports browserslist and computes
   targets from it; no hardcoded target list).
3. ds/src CSS must not use syntax the floor cannot parse (explicit list in
   config.json: @scope, light-dark()). :has() is supported since Chrome 105 /
   Safari 15.4 and is NOT on the list. The authoritative per-declaration check
   is stylelint-no-unsupported-browser-features, which runs inside
   `ds/npm run lint` — this list is the belt for at-rule/function syntax.
"""
import json
import re
from pathlib import Path

from common import CONFIG, Gate, gate_main, source_files, rel_of


def run(gate: Gate, target, args):
    root = Path(target)
    required = CONFIG["browserslist_required"]
    unsupported = CONFIG["css_unsupported_features"]

    # ---- 1) browserslist floor ----
    pkg_path = root / "ds" / "package.json"
    if not pkg_path.is_file():
        gate.na("ds-browsers/browserslist", "no ds/package.json under target")
    else:
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        actual = pkg.get("browserslist") or []
        if actual != required:
            gate.fail("ds-browsers/browserslist",
                      f"ds/package.json browserslist {actual} != required floor {required} (plan section 2)")
        else:
            gate.ok("ds-browsers/browserslist", f"browserslist matches the plan floor: {required}")

    # ---- 2) vite targets derive from browserslist ----
    vite_path = root / "ds" / "vite.config.ts"
    if not vite_path.is_file():
        gate.na("ds-browsers/vite-targets", "no ds/vite.config.ts under target")
    else:
        cfg = vite_path.read_text(encoding="utf-8")
        problems = []
        if "browserslist" not in cfg:
            problems.append("vite.config.ts does not consult browserslist (targets would be hardcoded)")
        if re.search(r"target\s*:\s*['\"][a-z0-9.]+['\"]", cfg):
            problems.append("vite.config.ts contains a literal build target string (must come from browserslist)")
        if problems:
            gate.fail("ds-browsers/vite-targets", "; ".join(problems))
        else:
            gate.ok("ds-browsers/vite-targets", "esbuild/css targets derive from the package browserslist query")

    # ---- 3) unsupported CSS syntax ----
    files = source_files(target, "ds/src", ["*.css"])
    if not files:
        gate.na("ds-browsers/css-syntax", "no ds/src CSS under target")
    else:
        found = []
        for path in files:
            rel = rel_of(path, target)
            for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
                if line.lstrip().startswith(("/*", "*")):
                    continue
                for feature in unsupported:
                    if feature in line:
                        found.append(f"{rel}:{lineno} uses '{feature}' — unsupported on iOS 16.4 / Chrome 116 / Samsung 23")
        if found:
            gate.fail("ds-browsers/css-syntax", f"{len(found)} unsupported CSS constructs")
            for f in found:
                gate.fail("ds-browsers/unsupported-css", f)
        else:
            gate.ok("ds-browsers/css-syntax",
                    f"{len(files)} css files scanned; {unsupported} absent (per-decision support: ds lint stylelint)")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-browsers", run))
