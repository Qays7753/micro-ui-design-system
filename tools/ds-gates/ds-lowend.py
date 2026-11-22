#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-lowend — size budgets for mid-range phones (plan K12/K22, task S2 #10).

Budgets (config.json, documented because the plan fixes only K12 and woff2):
  - every woff2 (ds/src/fonts and dist/assets) <= 65KB
  - dist/index.js gzip <= base (16KB, S1 measured baseline + margin)
    + 8KB per built component (the K12 per-component allowance)
  - dist/styles.css gzip <= base 8KB + 2KB per built component
  - per-component size (K12: a single-component build <= 8KB gzip) is N/A
    until components exist — it lands with the builder and ds-size.
dist is a build output: when it is not built yet the js/css checks are
documented not-applicable; the tracked fonts are always checked.
"""
import json
from pathlib import Path

from common import CONFIG, Gate, gate_main, gzip_size, rel_of

BUDGET = CONFIG["lowend"]


def kb(n_bytes):
    return n_bytes / 1024.0


def run(gate: Gate, target, args):
    root = Path(target)
    budget_cfg = BUDGET

    # ---- component count (drives the per-component allowance) ----
    components = root / "ds" / "src" / "components"
    n_components = len([p for p in components.iterdir() if p.is_dir()]) if components.is_dir() else 0
    index_budget = budget_cfg["index_gzip_kb_base"] + budget_cfg["index_gzip_kb_per_component"] * n_components
    styles_budget = budget_cfg["styles_gzip_kb_base"] + budget_cfg["styles_gzip_kb_per_component"] * n_components

    # ---- woff2 fonts (tracked sources + built assets) ----
    woff2s = sorted(set(
        list((root / "ds" / "src" / "fonts").glob("*.woff2")) +
        list((root / "ds" / "dist" / "assets").glob("*.woff2"))
    ))
    if not woff2s:
        gate.na("ds-lowend/fonts", "no woff2 files under ds/src/fonts")
    else:
        over = []
        for path in woff2s:
            size_kb = kb(path.stat().st_size)
            if size_kb > budget_cfg["woff2_kb"]:
                over.append(f"{rel_of(path, target)} {size_kb:.1f}KB > {budget_cfg['woff2_kb']}KB")
        if over:
            gate.fail("ds-lowend/fonts", f"{len(woff2s)} woff2 checked, {len(over)} over budget")
            for o in over:
                gate.fail("ds-lowend/woff2", o)
        else:
            gate.ok("ds-lowend/fonts",
                    f"{len(woff2s)} woff2 <= {budget_cfg['woff2_kb']}KB each "
                    f"(max {max(kb(p.stat().st_size) for p in woff2s):.1f}KB)")

    # ---- built JS / CSS ----
    dist = root / "ds" / "dist"
    if not (dist / "index.js").is_file():
        gate.na("ds-lowend/dist", "ds/dist not built in this tree (build output, not tracked)")
    else:
        problems = []
        index_gz = kb(gzip_size(dist / "index.js"))
        if index_gz > index_budget:
            problems.append(f"dist/index.js gzip {index_gz:.1f}KB > budget {index_budget:.1f}KB "
                            f"({budget_cfg['index_gzip_kb_base']} base + {n_components} components x "
                            f"{budget_cfg['index_gzip_kb_per_component']}KB K12)")
        styles = dist / "styles.css"
        if styles.is_file():
            styles_gz = kb(gzip_size(styles))
            if styles_gz > styles_budget:
                problems.append(f"dist/styles.css gzip {styles_gz:.1f}KB > budget {styles_budget:.1f}KB")
        if problems:
            gate.fail("ds-lowend/dist", f"{len(problems)} size-budget violations ({n_components} components)")
            for p in problems:
                gate.fail("ds-lowend/budget", p)
        else:
            details = [f"index.js gzip {index_gz:.1f}KB / {index_budget:.1f}KB"]
            if styles.is_file():
                details.append(f"styles.css gzip {kb(gzip_size(styles)):.1f}KB / {styles_budget:.1f}KB")
            gate.ok("ds-lowend/dist", ", ".join(details))

    # ---- per-component chunk budget (K12) ----
    if n_components == 0:
        gate.na("ds-lowend/component-chunks",
                "no components yet — K12 single-component builds land with the builder (S3+)")
    else:
        gate.na("ds-lowend/component-chunks",
                f"{n_components} components — K12 per-component builds are exercised by the lab/consumer builds")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-lowend", run))
