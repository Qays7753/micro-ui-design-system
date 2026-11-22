#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-dup — no duplicated CSS blocks between components (plan K4, BRIEF 26-16).

A declaration block is normalized (comments removed, whitespace collapsed,
property names lowercased) and fingerprinted by its ordered declarations.
The same fingerprint with more than 3 declarations appearing in two different
component CSS files is a violation — the rule belongs in lib/ or a shared
class, not copy-pasted (plan section 4 rule 7).
Today (no component CSS yet) the gate is not applicable and says so.
"""
import re
from collections import defaultdict
from pathlib import Path

from common import Gate, gate_main, source_files, rel_of


def css_blocks(text):
    """Yield (selector_line, fingerprint) for every innermost declaration block."""
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    for m in re.finditer(r"\{([^{}]*)\}", text):
        decls = []
        for raw in m.group(1).split(";"):
            raw = raw.strip()
            if not raw or ":" not in raw:
                continue
            prop, value = raw.split(":", 1)
            decls.append((prop.strip().lower(), re.sub(r"\s+", " ", value.strip())))
        if decls:
            line = text.count("\n", 0, m.start()) + 1
            yield line, tuple(decls)


def run(gate: Gate, target, args):
    files = source_files(target, "ds/src/components", ["*.css"])
    if not files:
        gate.na("ds-dup/css", "no component CSS under ds/src/components yet (builder starts at S3)")
        return

    seen = defaultdict(list)  # fingerprint -> [(file, line)]
    for path in files:
        rel = rel_of(path, target)
        for line, fp in css_blocks(path.read_text(encoding="utf-8")):
            if len(fp) > 3:  # "أكبر من 3 أسطر" — more than 3 declarations
                seen[fp].append((rel, line))

    dups = {fp: locs for fp, locs in seen.items() if len({rel for rel, _ in locs}) > 1}
    if dups:
        gate.fail("ds-dup/css", f"{len(files)} component css files, {len(dups)} duplicated blocks (>3 declarations)")
        for fp, locs in list(dups.items())[:20]:
            where = ", ".join(f"{rel}:{line}" for rel, line in sorted(set(locs)))
            gate.fail("ds-dup/duplicate", f"{where} — shared block {len(fp)} declarations: "
                                        f"{'; '.join(f'{p}: {v}' for p, v in list(fp)[:3])}…")
    else:
        gate.ok("ds-dup/css", f"{len(files)} component css files, no block >3 declarations shared between two components")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-dup", run))
