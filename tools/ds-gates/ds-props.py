#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-props — unified property names only (BRIEF 23.18, plan K9).

Two lists, both extensible from tools/ds-gates/config.json:
  - banned aliases that must never appear (onLongTap / onTouchTap instead of
    onLongPress, kind instead of variant, color instead of tone, type instead
    of variant, free design-value props …) — checked in JSX attributes and in
    component prop interfaces/types.
  - the unified 23.18 vocabulary — every prop declared in *.types.ts (and
    interface/type blocks of component .tsx) must be unified, aria-*/data-*
    passthrough or an explicitly allowed HTML prop.
HTML attribute pass-through on real elements (e.g. type="button") is not a
component prop and is not flagged.
Today (no components yet) the gate is not applicable and says so.
"""
import re
from pathlib import Path

from common import CONFIG, Gate, gate_main, source_files, strip_comments, rel_of

BANNED_JSX = CONFIG["banned_props_jsx"]
BANNED_TYPES = CONFIG["banned_props_types"]
UNIFIED = set(CONFIG["unified_props"])


def prop_blocks(code):
    """Yield (line, prop_name) for every property declared in interface/type blocks."""
    for m in re.finditer(r"\b(?:interface|type)\s+\w+[^{=]*\{", code):
        start = m.end()
        depth = 1
        i = start
        while i < len(code) and depth:
            if code[i] == "{":
                depth += 1
            elif code[i] == "}":
                depth -= 1
            i += 1
        block = code[start:i - 1]
        for pm in re.finditer(r"^\s*(?:readonly\s+)?([A-Za-z][A-Za-z0-9]*)\s*\??:", block, re.M):
            line = code.count("\n", 0, start) + block[:pm.start()].count("\n") + 1
            yield line, pm.group(1)


def run(gate: Gate, target, args):
    files = source_files(target, "ds/src/components", ["*.tsx", "*.ts"])
    if not files:
        gate.na("ds-props/unified", "no component source under ds/src/components yet (builder starts at S3)")
        return

    banned_hits, unknown_hits = [], []
    for path in files:
        rel = rel_of(path, target)
        code = strip_comments(path.read_text(encoding="utf-8"))

        # JSX attributes:  <Comp  prop={...}  /  prop="x"  (opening tags only)
        for m in re.finditer(r"<[A-Za-z][^>]*?>", code):
            tag = m.group(0)
            line = code.count("\n", 0, m.start()) + 1
            for prop in BANNED_JSX:
                if re.search(rf"[\s<]{re.escape(prop)}\s*=", tag):
                    banned_hits.append(f"{rel}:{line} JSX prop '{prop}' is banned (BRIEF 23.18)")
        # interface / type literal props
        for line, prop in prop_blocks(code):
            if prop in BANNED_TYPES:
                banned_hits.append(f"{rel}:{line} prop '{prop}' is a banned alias (BRIEF 23.18)")
            elif prop not in UNIFIED and not prop.startswith(("aria-", "data-")):
                unknown_hits.append(f"{rel}:{line} prop '{prop}' is outside the unified 23.18 vocabulary")

    if banned_hits:
        gate.fail("ds-props/banned-aliases", f"{len(banned_hits)} banned property aliases")
        for h in banned_hits:
            gate.fail("ds-props/banned-alias", h)
    else:
        gate.ok("ds-props/banned-aliases", f"no aliases among {sorted(set(BANNED_JSX + BANNED_TYPES))}")

    if unknown_hits:
        gate.fail("ds-props/unified", f"{len(unknown_hits)} props outside the 23.18 vocabulary")
        for h in unknown_hits:
            gate.fail("ds-props/unknown-prop", h)
    else:
        gate.ok("ds-props/unified", f"{len(files)} component files, every prop unified or passthrough")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-props", run))
