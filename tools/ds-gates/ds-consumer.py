#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-consumer — the package contract a consumer installs (plan D1/D7/D10, section 4).

Checks ds/package.json as the consumer's package manager sees it:
  - exports exposes exactly '.' and './styles.css', '.' with types + import
  - every JS entry in exports has a types entry
  - peerDependencies are exactly react ^19, react-dom ^19, vaul ^1 (D7: zero
    other runtime dependencies; an empty "dependencies" section)
  - sideEffects lists CSS only
  - "files" ships dist
  - main/module/types point into dist
"""
import json
from pathlib import Path

from common import Gate, gate_main

REQUIRED_PEERS = {"react": "^19", "react-dom": "^19", "vaul": "^1"}
EXPECTED_EXPORTS = {".", "./styles.css"}


def run(gate: Gate, target, args):
    pkg_path = Path(target) / "ds" / "package.json"
    if not pkg_path.is_file():
        gate.na("ds-consumer/exports", "no ds/package.json under target")
        return
    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    problems = []

    # ---- exports ----
    exports = pkg.get("exports") or {}
    keys = set(exports)
    if keys != EXPECTED_EXPORTS:
        problems.append(f"exports keys {sorted(keys)} != {sorted(EXPECTED_EXPORTS)}")
    root_export = exports.get(".")
    if isinstance(root_export, dict):
        if "types" not in root_export:
            problems.append("exports '.' has no types condition (K-types for every entry)")
        if "import" not in root_export:
            problems.append("exports '.' has no import condition")
    elif root_export is not None:
        problems.append("exports '.' should be a conditional object {types, import}")
    for key, cond in exports.items():
        if key.endswith(".js") and isinstance(cond, dict) and "types" not in cond:
            problems.append(f"exports '{key}' has no types condition")
    if "./styles.css" not in keys:
        problems.append("exports is missing './styles.css' (the CSS entry)")

    # ---- peer dependencies ----
    peers = pkg.get("peerDependencies") or {}
    if peers != REQUIRED_PEERS:
        problems.append(f"peerDependencies {peers} != {REQUIRED_PEERS} (D7)")
    if pkg.get("dependencies"):
        problems.append(f"runtime dependencies present: {sorted(pkg['dependencies'])} (D7: zero)")

    # ---- side effects ----
    side = pkg.get("sideEffects")
    if side is None or side is True:
        problems.append("sideEffects missing/true — tree-shaking of JS would break")
    else:
        entries = side if isinstance(side, list) else [side]
        non_css = [e for e in entries if isinstance(e, str) and not e.endswith(".css")]
        if non_css:
            problems.append(f"sideEffects lists non-CSS entries: {non_css}")

    # ---- files + entry points ----
    files = pkg.get("files") or []
    if "dist" not in files:
        problems.append(f'"files" does not include dist: {files}')
    for field in ("main", "module", "types"):
        value = pkg.get(field)
        if not value or not value.startswith("./dist/"):
            problems.append(f'"{field}" must point into ./dist/, got {value!r}')

    if problems:
        gate.fail("ds-consumer/package", f"{len(problems)} package-contract problems")
        for p in problems:
            gate.fail("ds-consumer/problem", p)
    else:
        gate.ok("ds-consumer/package",
                "exports ./ ./styles.css with types, peers react/react-dom/vaul only, sideEffects CSS only, files include dist")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-consumer", run))
