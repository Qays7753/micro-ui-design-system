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
() => {
  // Stable CSS path for re-resolution: the honest close flow (و-2 item
  // 30: exit motion, THEN onDismiss, THEN the app removes it) makes the
  // lab's sheet samples remount MID-SCAN (the app removes + reopens the
  // specimen). The press assertion itself never changes — the scan only
  // follows the DOM when the tagged node is replaced by a fresh,
  // structurally identical one (same path, new node).
  const pathOf = (el) => {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      if (node.id) { parts.unshift('#' + (window.CSS && CSS.escape ? CSS.escape(node.id) : node.id)); break; }
      let sel = node.tagName.toLowerCase();
      const parent = node.parentElement;
      if (parent) {
        const sibs = Array.from(parent.children).filter(c => c.tagName === node.tagName);
        if (sibs.length > 1) sel += ':nth-of-type(' + (sibs.indexOf(node) + 1) + ')';
      }
      parts.unshift(sel);
      node = parent;
    }
    return parts.join(' > ');
  };
  return Array.from(document.querySelectorAll('button, [role="button"]'))
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
    return {i, path: pathOf(el), tag: el.tagName.toLowerCase(), x: r.x + r.width / 2, y: r.y + r.height / 2,
            w: r.width, h: r.height, text: (el.textContent || '').trim().slice(0, 20)};
  })
}
"""

# Re-resolve a probe: by tag first, by stable path when the tagged node
# was replaced (honest remount mid-scan — same assertion, fresh node).
RESOLVE_JS = """
(args) => {
  let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
  if (!el && args.path) {
    el = document.querySelector(args.path);
    if (el) el.setAttribute('data-ds-state-probe', String(args.i));
  }
  return !!el;
}
"""

SNAPSHOT_JS = """
(args) => {
  let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
  if (!el && args.path) {
    el = document.querySelector(args.path);
    if (el) el.setAttribute('data-ds-state-probe', String(args.i));
  }
  if (!el) return null;
  const st = getComputedStyle(el);
  const props = %s;
  return props.map(p => st[p]).join('|');
}
""" % json.dumps(list(STYLE_PROPS))

# Measure AT REST (23.2 is a resting-state contract): wait out any running
# animation/transition in the element's subtree (e.g. the honest sheet
# exit motion the previous probe's press started) before snapshotting.
STABLE_JS = """
async (args) => {
  let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
  if (!el && args.path) {
    el = document.querySelector(args.path);
    if (el) el.setAttribute('data-ds-state-probe', String(args.i));
  }
  if (!el) return false;
  const t0 = performance.now();
  while (performance.now() - t0 < 800) {
    // The element's own subtree AND its ancestor chain: the honest sheet
    // exit (و-2 item 30) runs on the PANEL — an ancestor of the probed
    // button — so subtree-only misses it and the press lands mid-flight.
    const nodes = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) nodes.push(n);
    const anims = nodes.flatMap(n => (n.getAnimations ? n.getAnimations({ subtree: true }) : []));
    if (!anims.some(a => a.playState === 'running')) return true;
    await new Promise(r => setTimeout(r, 40));
  }
  return true;
}
"""

# Fixture helper: resolve a probed element's id (exempt-scope proof).
ID_PROBE_JS = """
(i) => document.querySelector(`[data-ds-state-probe="${i}"]`).id
"""

# Center after scrolling: the lab pages grow stage by stage, so the gate
# scrolls every element into the viewport before pressing it (a mouse event
# outside the viewport never hits the element and would fake a violation).
CENTER_JS = """
(args) => {
  let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
  if (!el && args.path) {
    el = document.querySelector(args.path);
    if (el) el.setAttribute('data-ds-state-probe', String(args.i));
  }
  if (!el) return null;
  el.scrollIntoView({ block: 'center' });
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}
"""


CLEANUP_JS = """
async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const vis = (el) => el.getClientRects().length > 0;
  // The lab is LIVE (batch-2 2.1): a press opens real sheets/toasts. Close
  // the page-level sheets (never the static garden stages) and wait out the
  // page Toast (layer 70 intercepts the next press) so every element is
  // measured on the same clean page — the precondition the scan assumes.
  let rounds = 0;
  while (rounds < 5) {
    const sheets = Array.from(document.querySelectorAll('.mds-sheet, [class*="mds-confirm"]'))
      .filter(el => el.closest('.lab-sheet-stage') === null && vis(el));
    if (!sheets.length) break;
    for (const sheet of sheets) {
      // The Sheet's close button carries the SHEET's title as its
      // accessible name (not «إغلاق») — find it structurally: the header's
      // icon button. ConfirmSheet has none; its closer is «رجوع».
      const closer = sheet.querySelector('[class*="sheet-head"] .mds-icon-button, [class*="sheet"] > [class*="icon-button"]')
        || sheet.querySelector('.mds-icon-button')
        || Array.from(sheet.querySelectorAll('button'))
          .find(b => (b.textContent || '').trim() === 'رجوع');
      if (closer) {
        const o = { bubbles: true, cancelable: true, composed: true, pointerId: 1, isPrimary: true, pointerType: 'touch' };
        closer.dispatchEvent(new PointerEvent('pointerdown', o));
        closer.dispatchEvent(new PointerEvent('pointerup', o));
        closer.dispatchEvent(new MouseEvent('click', o));
      }
    }
    await sleep(240);
    rounds++;
  }
  let waited = 0;
  while (waited < 4200) {
    const toast = Array.from(document.querySelectorAll('.mds-toast'))
      .find(el => el.closest('.lab-toast-stage') === null && vis(el));
    if (!toast) break;
    await sleep(150);
    waited += 150;
  }
  return true;
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
                        arg = {"i": el["i"], "path": el["path"]}
                        await_stable = page.evaluate(STABLE_JS, arg)
                        base = page.evaluate(SNAPSHOT_JS, arg)
                        # --- :active via a real press (mouse down, hold) ---
                        center = page.evaluate(CENTER_JS, arg)
                        if center is None or base is None or not await_stable:
                            problems.append(f"<{el['tag']}> «{el['text']}» vanished from the page mid-scan")
                            continue
                        page.mouse.move(center["x"], center["y"])
                        page.mouse.down()
                        page.wait_for_timeout(120)
                        active = page.evaluate(SNAPSHOT_JS, arg)
                        page.mouse.up()
                        if active is None or active == base:
                            problems.append(
                                f"<{el['tag']}> «{el['text']}» shows no :active style change "
                                "(23.2: الضغط يغيّر الخلفية/الشكل)")
                        # --- :disabled (native buttons only) ---
                        if el["tag"] == "button":
                            page.evaluate(
                                "(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                                "if (!el && args.path) { el = document.querySelector(args.path);"
                                "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                                "if (el) el.disabled = true; }", arg)
                            page.wait_for_timeout(60)
                            disabled = page.evaluate(SNAPSHOT_JS, arg)
                            page.evaluate(
                                "(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                                "if (!el && args.path) { el = document.querySelector(args.path);"
                                "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                                "if (el) el.disabled = false; }", arg)
                            if disabled is None or disabled == base:
                                problems.append(
                                    f"<button> «{el['text']}» shows no :disabled style change (23.2)")
                        # live-lab hygiene: a press opens real sheets/toasts —
                        # restore the clean page before the next element
                        page.evaluate(CLEANUP_JS)
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
