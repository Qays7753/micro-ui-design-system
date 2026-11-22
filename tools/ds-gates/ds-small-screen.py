#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-small-screen — nothing breaks at 360×780 (plan K21, BRIEF 29.1-م3, task S2 #20).

At the 360×780 phone viewport, on Chromium AND WebKit:
  - document.documentElement.scrollWidth <= 360 — no horizontal scrolling
  - every visible interactive element (button, [role=button], a[href], input,
    select, textarea) is at least size.touch-min (48) in both dimensions —
    the BRIEF/tokens touch floor (29.1-م3; the task's "44" loses to the
    tokens, which the plan section 8 gate is built to enforce). Elements
    marked data-ds-exempt are excluded.
"""
from common import CONFIG, Gate, gate_main, browser_session, read_tokens, ROOT, \
    resolve_page_target, token_by_path

SS = CONFIG["small_screen"]

PROBE_JS = """
(touchMin) => {
  const doc = document.documentElement;
  const interactives = Array.from(document.querySelectorAll(
    'button, [role="button"], a[href], input, select, textarea'))
    .filter(el => !el.hasAttribute('data-ds-exempt') && el.offsetParent !== null)
    .map(el => {
      const r = el.getBoundingClientRect();
      return {tag: el.tagName.toLowerCase(), w: r.width, h: r.height,
              label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 20)};
    });
  return {scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, interactives};
}
"""


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-small-screen/fit", resolved)
        return
    if kind == "url":
        url, server = resolved, None
    else:
        server, url = resolved

    tokens = read_tokens(target if target else ROOT) or read_tokens(ROOT) or {}
    touch_min = float(token_by_path(tokens, "size.touch-min")) if tokens else 48.0

    try:
        for engine in CONFIG["engines"]:
            if args.engine != "both" and engine != args.engine:
                continue
            problems = []
            n_interactive = 0
            try:
                with browser_session(engine) as session:
                    page = session.page(viewport={"width": SS["width"], "height": SS["height"]},
                                        device_scale_factor=3)
                    page.goto(url, wait_until="load", timeout=20000)
                    page.wait_for_timeout(150)
                    info = page.evaluate(PROBE_JS, touch_min)
                    n_interactive = len(info["interactives"])
                    if info["scrollWidth"] > SS["width"]:
                        problems.append(f"horizontal scroll: documentElement.scrollWidth "
                                        f"{info['scrollWidth']}px > {SS['width']}px (K21)")
                    for el in info["interactives"]:
                        if el["w"] < touch_min - 0.5 or el["h"] < touch_min - 0.5:
                            problems.append(f"<{el['tag']}> «{el['label']}» is {el['w']:.0f}×{el['h']:.0f}px, "
                                            f"touch target must be >= {touch_min:g}×{touch_min:g} (م3)")
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            if problems:
                gate.fail(f"ds-small-screen/fit/{engine}",
                          f"{SS['width']}×{SS['height']}: {n_interactive} interactive elements, {len(problems)} violations")
                for p in problems[:15]:
                    gate.fail(f"ds-small-screen/violation/{engine}", p)
            else:
                gate.ok(f"ds-small-screen/fit/{engine}",
                        f"{SS['width']}×{SS['height']}: no horizontal scroll, {n_interactive} interactive "
                        f"elements >= {touch_min:g}px")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-small-screen", run))
