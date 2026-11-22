#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-tabular — equal-width digits in the money font (BRIEF 8, 29.3-د9, task S2 #19).

Every element marked data-ds-check="tabular" (components use it on numeric
values rendered with the money font) must, on Chromium AND WebKit:
  - have computed font-variant-numeric containing tabular-nums
  - measure «111.111» and «888.888» with equal widths: all pairwise width
    differences <= max(0.1px, 0.6% of the smallest width) — the documented
    tolerance (S1 report decision 4: WebKit software rounding at 40px sizes)
The gate needs at least two such elements (the 111/888 pair).
"""
from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT, resolve_page_target

TOL = CONFIG["tabular_tolerance"]

PROBE_JS = """
() => Array.from(document.querySelectorAll('[data-ds-check="tabular"]')).map(el => {
  const r = el.getBoundingClientRect();
  return {text: (el.textContent || '').trim(), w: r.width,
          variant: getComputedStyle(el).fontVariantNumeric};
})
"""


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-tabular/numbers", resolved)
        return
    if kind == "url":
        url, server = resolved, None
    else:
        server, url = resolved
    try:
        for engine in CONFIG["engines"]:
            if args.engine != "both" and engine != args.engine:
                continue
            problems = []
            found = 0
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)
                    page.wait_for_timeout(120)
                    probes = page.evaluate(PROBE_JS)
                    found = len(probes)
                    if found < 2:
                        problems.append(f"need at least two [data-ds-check=\"tabular\"] elements "
                                        f"(«111.111» and «888.888»), found {found}")
                    widths = [p["w"] for p in probes]
                    for p in probes:
                        if "tabular-nums" not in p["variant"]:
                            problems.append(f"«{p['text']}» font-variant-numeric is '{p['variant']}' "
                                            "— tabular-nums missing (د9)")
                    if len(widths) >= 2:
                        limit = max(TOL["abs_px"], TOL["relative"] * min(widths))
                        for i in range(len(widths)):
                            for j in range(i + 1, len(widths)):
                                if abs(widths[i] - widths[j]) > limit:
                                    problems.append(
                                        f"width mismatch: «{probes[i]['text']}» {widths[i]:.2f}px vs "
                                        f"«{probes[j]['text']}» {widths[j]:.2f}px (tolerance {limit:.2f}px, د9)")
                                    break
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            if problems:
                gate.fail(f"ds-tabular/numbers/{engine}", f"{found} tabular elements, {len(problems)} violations")
                for p in problems[:15]:
                    gate.fail(f"ds-tabular/violation/{engine}", p)
            else:
                gate.ok(f"ds-tabular/numbers/{engine}",
                        f"{found} tabular elements, widths equal, tabular-nums applied")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-tabular", run))
