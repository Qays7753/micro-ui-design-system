#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-raw-values — no raw design values outside the tokens (BRIEF 0.2, 29.1-م1, plan S2).

Scans ds/src/**/*.{ts,tsx,css} after stripping comments for:
  - hex colors  (#fff, #A9502F, #10171980)
  - rgb()/rgba() colors
  - px lengths  (12px)
  - ms durations (250ms)

Excluded (generated in S1, byte-verified by their own --check gates — the only
place raw values are allowed, REPORT S1 deviation 5):
  ds/src/tokens/tokens.css, ds/src/tokens/tailwind-theme.css,
  ds/src/tokens/tokens.ts (the typed view of the same tree),
  ds/src/icons/**, ds/src/fonts/**.
Test files (*.test.ts(x)) are excluded: vitest descriptions legitimately quote
units ("moves more than 8px") and tests never ship.
"""
import re
from pathlib import Path

from common import Gate, gate_main, source_files, strip_comments, rel_of

PATTERNS = [
    ("hex", re.compile(r"#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{8}\b")),
    ("rgb", re.compile(r"\brgba?\(\s*\d")),
    ("px", re.compile(r"\b\d+(?:\.\d+)?px\b")),
    ("ms", re.compile(r"\b\d+(?:\.\d+)?ms\b")),
]

EXCLUDE = [
    "ds/src/tokens/tokens.css",
    "ds/src/tokens/tokens.ts",
    "ds/src/tokens/tailwind-theme.css",
    "ds/src/icons/**",
    "ds/src/fonts/**",
    "ds/src/**/*.test.ts",
    "ds/src/**/*.test.tsx",
]


def run(gate: Gate, target, args):
    files = source_files(target, "ds/src", ["*.ts", "*.tsx", "*.css"], exclude=EXCLUDE)
    if not files:
        gate.na("ds-raw-values/scan", "no ds/src files found under target")
        return
    violations = []
    for path in files:
        rel = rel_of(path, target)
        code = strip_comments(path.read_text(encoding="utf-8"))
        for kind, rx in PATTERNS:
            for m in rx.finditer(code):
                line = code.count("\n", 0, m.start()) + 1
                snippet = code[max(0, m.start() - 30):m.end() + 20].replace("\n", " ")
                violations.append(f"{rel}:{line} raw {kind} value '{m.group(0)}' — …{snippet.strip()[:70]}…")
    gate.ok("ds-raw-values/no-raw-values", f"{len(files)} files scanned") if not violations else gate.fail(
        "ds-raw-values/no-raw-values", f"{len(files)} files scanned, {len(violations)} raw values")
    for v in violations[:40]:
        gate.fail("ds-raw-values/violation", v)
    if len(violations) > 40:
        gate.fail("ds-raw-values/violation", f"… and {len(violations) - 40} more")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-raw-values", run))
