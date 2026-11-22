#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-structure — one component = one folder, closed list (plan K5, section 4, BRIEF 9).

For every folder under ds/src/components/<Name>:
  - <Name> is in the batch-1 closed list (32 names, read from the S0 table in
    docs/plans/design-system-batch1/REPORT.md — the source of truth, not a copy)
  - <Name>.tsx, <Name>.css and index.ts exist (plan section 4: the seven files;
    these three are the S2 gate floor, the rest lands with the builder)
  - <Name>.tsx actually exports a component named <Name>
Today (no components yet) the gate is not applicable and says so.
"""
import re
from pathlib import Path

from common import Gate, gate_main, component_closed_list, rel_of

REQUIRED = ("{name}.tsx", "{name}.css", "index.ts")


def run(gate: Gate, target, args):
    root = Path(target)
    components = root / "ds" / "src" / "components"

    names, err = component_closed_list(target)
    if names is None:
        gate.fail("ds-structure/closed-list", f"cannot read the closed list: {err}")
        return
    gate.ok("ds-structure/closed-list", f"{len(names)} batch-1 components from REPORT.md S0 table")

    if not components.is_dir() or not any(components.iterdir()):
        gate.na("ds-structure/components", "no components under ds/src/components yet (builder starts at S3)")
        return

    folders = sorted(p for p in components.iterdir() if p.is_dir())
    closed = set(names)
    problems = []
    for folder in folders:
        name = folder.name
        rel = rel_of(folder, target)
        if name not in closed:
            problems.append(f"{rel}/ not in the batch-1 closed list (BRIEF section 9)")
            continue
        for tpl in REQUIRED:
            if not (folder / tpl.format(name=name)).is_file():
                problems.append(f"{rel}/{tpl.format(name=name)} missing (plan section 4: one component = one folder)")
        tsx = folder / f"{name}.tsx"
        if tsx.is_file():
            code = tsx.read_text(encoding="utf-8")
            export_rx = re.compile(
                rf"export\s+(?:default\s+)?(?:function|const|class)\s+{re.escape(name)}\b"
                rf"|export\s*\{{[^}}]*\b{re.escape(name)}\b")
            if not export_rx.search(code):
                problems.append(f"{rel}/{name}.tsx does not export a component named '{name}'")

    if problems:
        gate.fail("ds-structure/components", f"{len(folders)} component folders, {len(problems)} problems")
        for p in problems:
            gate.fail("ds-structure/problem", p)
    else:
        gate.ok("ds-structure/components",
                f"{len(folders)} component folders, all in the closed list with {REQUIRED} files")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-structure", run))
