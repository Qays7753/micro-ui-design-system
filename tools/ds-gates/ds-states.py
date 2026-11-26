#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-states — pressed and disabled states actually change the style (BRIEF 23.2, task S2 #15).

For every visible interactive element (button, [role="button"]) on the page,
on Chromium AND WebKit:
  - :active  — the element is really pressed (mouse down on its center) and
    the computed style (background-color, color, border-color, opacity,
    transform) must differ from the resting state (23.2: الضغط يغيّر الخلفية
    أو scale — لا عنصر تفاعلي صامت اللمس)
  - :disabled — native buttons get disabled temporarily; the computed style
    must differ from the resting state (disabled-fg / disabled-bg, 23.2)
[role="button] elements are exempt from the disabled half (no native
disabled semantics — 23.18 handles that per component).
"""
import json
from pathlib import Path

from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT, LocalServer, resolve_page_target, wait_lab_ready

STYLE_PROPS = ("backgroundColor", "color", "borderTopColor", "opacity", "transform")

BASE_JS = """
() => Array.from(document.querySelectorAll('button, [role="button"]'))
  .filter(el => el.offsetParent !== null)
  // Lab chrome that swaps catalog/compose views unmounts the probed
  // DOM mid-scan; such view toggles are outside the 23.2 scope. The
  // exemption is SCOPED to the view-toggle token: a bare
  // data-ds-exempt="" (a size exemption for ds-small-screen) must NOT
  // exclude a button from the press scan (23.2 applies to everything).
  .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'))
  .map((el, i) => {
    el.setAttribute('data-ds-state-probe', i);
    const r = el.getBoundingClientRect();
    return {i, tag: el.tagName.toLowerCase(), x: r.x + r.width / 2, y: r.y + r.height / 2,
            w: r.width, h: r.height, text: (el.textContent || '').trim().slice(0, 20)};
  })
"""

SNAPSHOT_JS = """
(i) => {
  const el = document.querySelector(`[data-ds-state-probe="${i}"]`);
  const st = getComputedStyle(el);
  const props = %s;
  return props.map(p => st[p]).join('|');
}
""" % json.dumps(list(STYLE_PROPS))

# Fixture helper: resolve a probed element's id (exempt-scope proof).
ID_PROBE_JS = """
(i) => document.querySelector(`[data-ds-state-probe="${i}"]`).id
"""

# Center after scrolling: the lab pages grow stage by stage, so the gate
# scrolls every element into the viewport before pressing it (a mouse event
# outside the viewport never hits the element and would fake a violation).
CENTER_JS = """
(i) => {
  const el = document.querySelector(`[data-ds-state-probe="${i}"]`);
  el.scrollIntoView({ block: 'center' });
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}
"""


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-states/interaction", resolved)
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
            n_elements = 0
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)
                    wait_lab_ready(page)
                    page.wait_for_timeout(150)
                    elements = page.evaluate(BASE_JS)
                    n_elements = len(elements)
                    for el in elements:
                        base = page.evaluate(SNAPSHOT_JS, el["i"])
                        # --- :active via a real press (mouse down, hold) ---
                        center = page.evaluate(CENTER_JS, el["i"])
                        page.mouse.move(center["x"], center["y"])
                        page.mouse.down()
                        page.wait_for_timeout(120)
                        active = page.evaluate(SNAPSHOT_JS, el["i"])
                        page.mouse.up()
                        if active == base:
                            problems.append(
                                f"<{el['tag']}> «{el['text']}» shows no :active style change "
                                "(23.2: الضغط يغيّر الخلفية/الشكل)")
                        # --- :disabled (native buttons only) ---
                        if el["tag"] == "button":
                            page.evaluate(
                                "(i) => document.querySelector(`[data-ds-state-probe=\"${i}\"]`).disabled = true", el["i"])
                            page.wait_for_timeout(60)
                            disabled = page.evaluate(SNAPSHOT_JS, el["i"])
                            page.evaluate(
                                "(i) => document.querySelector(`[data-ds-state-probe=\"${i}\"]`).disabled = false", el["i"])
                            if disabled == base:
                                problems.append(
                                    f"<button> «{el['text']}» shows no :disabled style change (23.2)")
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            if problems:
                gate.fail(f"ds-states/interaction/{engine}", f"{n_elements} interactive elements, {len(problems)} violations")
                for p in problems[:15]:
                    gate.fail(f"ds-states/violation/{engine}", p)
            else:
                gate.ok(f"ds-states/interaction/{engine}",
                        f"{n_elements} interactive elements, every :active and :disabled differs from rest")

        # --- exempt-scope fixture: proves the press scan's exclusion is
        # scoped to the view-toggle token ONLY. A bare data-ds-exempt=""
        # (a SIZE exemption for ds-small-screen) must stay scanned. ---
        if args.engine in ("both", "chromium"):
            fixture_dir = Path(__file__).resolve().parent / "fixtures" / "ds-states-exempt-scope"
            fserver = LocalServer(fixture_dir)
            try:
                base_url = fserver.start()
                with browser_session("chromium") as fsess:
                    fpg = fsess.page(**DEFAULT_CONTEXT)
                    fpg.goto(base_url + "/page.html")
                    fpg.wait_for_timeout(100)
                    scanned = fpg.evaluate(BASE_JS)
                    ids = []
                    for el in scanned:
                        ids.append(fpg.evaluate(ID_PROBE_JS, el["i"]))
                if "size-exempt" in ids and "plain" in ids and "view-toggle" not in ids:
                    gate.ok("ds-states/exempt-scope-fixture",
                            "bare data-ds-exempt stays scanned; view-toggle excluded")
                else:
                    gate.fail("ds-states/exempt-scope-fixture",
                              f"press scan set wrong: {sorted(ids)}")
            finally:
                fserver.stop()
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-states", run))
