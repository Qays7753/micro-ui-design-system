#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-bidi — visual order of numeric runs matches the logical text (A3).

Every element marked data-ds-check="bidi" (numeric values in the lab and
the fixtures) is measured PER CHARACTER on Chromium AND WebKit with
Range.getClientRects(). For each maximal numeric run in the logical text
(sign? digits with , . separators):
  1. numeric-order — the characters' visual x positions must be
     non-decreasing (LTR inside the run): the rendered order equals the
     logical order, so «1,245.750» can never read «750.1,245»;
  2. sign-first — a leading +/− sits entirely LEFT of the first digit
     (inside the LTR isolation, adjacent to it): «+2.250», never «2.250+»;
  3. fraction-after-whole — the decimal point and the fils digits follow
     the integer part: «.750» to the RIGHT of «1,245», never before it.
The lab page must carry at least three marked numeric elements; the
fixtures prove the gate itself: bad (sign outside the isolation in a bare
RTL paragraph — the bidi algorithm pushes it to the run's far side) must
FAIL, clean (numbers inside <bdi dir="ltr">) must PASS.
"""
import re

from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT, resolve_page_target, wait_lab_ready

# Numeric run: optional sign, then digits with digit-group and decimal
# separators (Western plus Arabic thousands «٬»).
NUM_RUN = re.compile(r"[+−-]?[0-9][0-9.,٬]*")
# Kerning/rounding slack for x monotonicity, in px.
TOL_X = 1.0

PROBE_JS = """
() => Array.from(document.querySelectorAll('[data-ds-check="bidi"]')).map(el => {
  const chars = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (/\\s/.test(ch)) continue;
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      const r = rects[0];
      if (r.width === 0 && r.height === 0) continue;
      chars.push({ch, x: r.x, w: r.width});
    }
  }
  return {text: (el.textContent || '').trim(), chars};
})
"""


def check_element(el, problems, engine):
    """Run the three checks on one marked element's per-char rects."""
    text = el["text"]
    chars = el["chars"]
    if not chars:
        problems.append(f"«{text}» produced no client rects (hidden or not rendered)")
        return
    logical = "".join(c["ch"] for c in chars)
    n_runs = 0
    for m in NUM_RUN.finditer(logical):
        start, end = m.span()
        run = chars[start:end]
        if not run:
            continue
        n_runs += 1
        xs = [c["x"] for c in run]
        # 1. visual order == logical order: x non-decreasing along the run.
        for i in range(len(xs) - 1):
            if xs[i + 1] < xs[i] - TOL_X:
                problems.append(
                    f"«{m.group(0)}» in «{text}»: visual order breaks the logical one "
                    f"at char «{run[i + 1]['ch']}» (x {xs[i + 1]:.1f} < previous {xs[i]:.1f})")
                break
        # 2. sign entirely left of the first digit.
        first = run[0]
        if first["ch"] in "+−-" and len(run) > 1:
            digit_x = run[1]["x"]
            if first["x"] + first["w"] > digit_x + TOL_X:
                problems.append(
                    f"«{m.group(0)}» in «{text}»: sign not before the first digit "
                    f"(sign right edge {first['x'] + first['w']:.1f} vs digit x {digit_x:.1f})")
        # 3. the fraction follows the whole part.
        run_text = m.group(0)
        dot = run_text.find(".")
        if dot != -1 and 0 < dot < len(run_text) - 1:
            dot_char = run[dot]
            frac_x = run[dot + 1]["x"]
            if frac_x < dot_char["x"] - TOL_X:
                problems.append(
                    f"«{run_text}» in «{text}»: fils digits not after the decimal point")
    return n_runs


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-bidi/numeric-order", resolved)
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
            runs = 0
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)
                    wait_lab_ready(page)
                    page.wait_for_timeout(120)
                    probes = page.evaluate(PROBE_JS)
                    found = len(probes)
                    if found < 3:
                        problems.append(f"need at least three [data-ds-check=\"bidi\"] numeric "
                                        f"elements, found {found}")
                    for el in probes:
                        runs += check_element(el, problems, engine) or 0
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            if problems:
                gate.fail(f"ds-bidi/numeric-order/{engine}",
                          f"{found} marked elements / {runs} numeric runs, {len(problems)} violations")
                for p in problems[:15]:
                    gate.fail(f"ds-bidi/violation/{engine}", p)
            else:
                gate.ok(f"ds-bidi/numeric-order/{engine}",
                        f"{found} marked elements, {runs} numeric runs: visual order == logical, "
                        "sign before first digit, fils after the whole")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-bidi", run))
