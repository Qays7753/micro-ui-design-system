#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-compose — the demo-screen composition gate (unit 15; lesson rules as
corrected by و-2, plus the د3/د7 quality tokens).

The criteria scope to the demo-compose screen ([data-ds-check="compose"]) —
the catalog is a sample zoo, not a screen (the ds-signal precedent); on the
catalog view the gate reports the scope note instead of the screen checks.

  c17  (rule 17, و-2 item 10) exactly ONE hero-number component
       (HeroSurface or Metric) in the screen                          (limit 1)
  c18  (rule 18, و-2 item 11) ≤ 3 distinct AMOUNT font sizes — amounts only
       (money value/missing, hero value, metric value, row/card/tile
       values); the diff line's caption is not an amount               (≤ 3)
  c19  (rule 19, و-2 item 12) every text larger than `type.label` ABOVE the
       first section lives inside PageHeader or the hero surface — the hero
       is the screen's own opening number (23.21, the subject of rule 17),
       so it is the exemption with the header; any OTHER big text is a
       violation                                                        (0)
  c20  (rule 20, و-2 item 13) ≤ 1 Button before the first amount — Buttons
       only (mds-button), never IconButton or chrome                    (≤ 1)
  c21  (1.5 rule 21, in the plan's unit-15 list) ≤ 1 primary button visible
       in the screen                                                    (≤ 1)
  c22  (rule 22, و-2 item 14) no repeated action: no two buttons share one
       visible label (the creation verb lives in PageHeader alone)       (0)
  c8   (rule 8) the value starts at its label's edge — the hero label/value
       start edges (RTL: right) align within ±0.5px                     (0.5px)
  c31  (rule 31, و-3: kept as-is) vertical gaps between consecutive
       top-level children of the screen content ≤ layout.section-to-section;
       the content's last-child bottom padding is exempt                 (32)
  c36  (rule 36, و-2 item 23) the numeric grid (tile grid) leaves no empty
       cell: children % columns == 0                                    (0)
  c43  (rule 43, و-2 item 18) the screen title never shows in ContextBar
       and PageHeader at the SAME time                                   (0)
  c69  (rule 69) no zero count next to an empty-state message: when the
       count is 0 the EmptyState stands alone                            (0)
  c73  (rule 73, و-2 item 22) ≤ 2 control rows before the first content and
       no two display switches (SegmentedControl) in a row               (≤ 2)
  د3   quality.max-hub-sections: sections in the screen                  (≤ 6)
  د7   quality.max-text-lines (و-2 item 27: measured at font 100%, system
       texts only): every text block renders ≤ 2 lines                   (≤ 2)

All bounds come from docs/design-system/tokens.json (type.label,
layout.section-to-section, quality.max-hub-sections) — nothing hardcoded.
Fixtures: bad (mock anatomy violating c17/c18/c19/c20/c21/c22/c31/c36/c43/c69/
c73/د7) must fail; clean (the composed anatomy at every bound) must pass.
"""
import json
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, \
    read_tokens, resolve_page_target, wait_lab_ready

COMPOSE_JS = """
(args) => {
  const desc = (el) => {
    const cls = (typeof el.className === 'string' && el.className) || '';
    return el.tagName.toLowerCase() + (cls ? '.' + cls.split(/\\s+/).slice(0, 2).join('.') : '');
  };
  const screen = document.querySelector('[data-ds-check="compose"]');
  if (!screen) return { noscreen: true };
  const problems = [];
  const px = (v) => parseFloat(v) || 0;

  // c17 — one hero-number component
  const heroes = screen.querySelectorAll('.mds-hero-surface, .mds-metric');
  if (heroes.length !== 1) problems.push('[c17] hero-number components = ' + heroes.length + ' (limit 1): '
    + Array.from(heroes).map(desc).join(', '));

  // c18 — ≤ 3 distinct amount font sizes (amounts only)
  const amountSel = ['.mds-money-value', '.mds-money-missing', '.mds-hero-value',
    '.mds-metric-value', '.mds-object-row-value', '.mds-object-card-value', '.mds-tile-value'];
  const sizes = new Set();
  for (const el of screen.querySelectorAll(amountSel.join(','))) {
    sizes.add(getComputedStyle(el).fontSize + '/' + getComputedStyle(el).lineHeight);
  }
  if (sizes.size > 3) problems.push('[c18] distinct amount sizes = ' + sizes.size + ' > 3: '
    + Array.from(sizes).join(' | '));

  // first section anchor for the "before content" checks
  const firstSection = screen.querySelector('.mds-section');
  const before = [];
  const walk = (root) => { for (const el of root.querySelectorAll('*')) before.push(el); };
  if (firstSection) {
    const content = screen.querySelector('[data-ds-check="compose-content"]') || screen;
    for (const child of content.children) {
      if (child === firstSection || firstSection.contains(child)) break;
      walk(child);
    }
  }

  // c19 — big text before the first section must be header or hero content
  const labelPx = args.labelPx;
  for (const el of before) {
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const fs = px(getComputedStyle(el).fontSize);
    if (fs > labelPx + 0.5) {
      const inHeader = el.closest('.mds-page-header');
      const inHero = el.closest('.mds-hero-surface');
      if (!inHeader && !inHero) problems.push('[c19] text ' + fs + 'px > label above the first section, outside header/hero: ' + desc(el));
    }
  }

  // c20 — ≤ 1 Button before the first amount; c21 — ≤ 1 primary visible
  const amountEls = screen.querySelectorAll(amountSel.join(','));
  const firstAmount = amountEls[0];
  let buttonsBefore = 0;
  if (firstAmount) {
    for (const b of screen.querySelectorAll('.mds-button')) {
      if (b.contains(firstAmount)) continue;
      const pos = b.compareDocumentPosition(firstAmount);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) buttonsBefore++;
    }
  }
  if (buttonsBefore > 1) problems.push('[c20] Buttons before the first amount = ' + buttonsBefore + ' (limit 1)');
  const primaries = screen.querySelectorAll('.mds-button--primary');
  if (primaries.length > 1) problems.push('[c21] primary buttons = ' + primaries.length + ' (limit 1)');

  // c22 — no repeated action label
  const labels = {};
  for (const b of screen.querySelectorAll('.mds-button, .mds-icon-button')) {
    const t = (b.textContent || '').trim();
    if (!t) continue;
    labels[t] = (labels[t] || 0) + 1;
  }
  const dups = Object.entries(labels).filter(([k, v]) => v > 1);
  if (dups.length) problems.push('[c22] repeated action labels: ' + dups.map(([k, v]) => '«' + k + '»×' + v).join(', '));

  // c8 — the hero value starts at its label's edge (±0.5px, RTL right edge)
  const heroLabel = screen.querySelector('.mds-hero-surface .mds-hero-label');
  const heroValue = screen.querySelector('.mds-hero-surface .mds-hero-value');
  if (heroLabel && heroValue) {
    const lr = heroLabel.getBoundingClientRect(), vr = heroValue.getBoundingClientRect();
    const dx = Math.abs(lr.right - vr.right);
    if (dx > 0.5) problems.push('[c8] hero value starts ' + dx.toFixed(2) + 'px from its label edge (limit 0.5)');
  }

  // c31 — top-level vertical gaps ≤ section-to-section (last child exempt)
  const content = screen.querySelector('[data-ds-check="compose-content"]');
  if (content) {
    const kids = Array.from(content.children).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.height > 0;
    });
    for (let i = 1; i < kids.length; i++) {
      const prev = kids[i - 1].getBoundingClientRect();
      const cur = kids[i].getBoundingClientRect();
      const gap = cur.top - prev.bottom;
      if (gap > args.s2s + 0.5) problems.push('[c31] vertical gap ' + gap.toFixed(1) + 'px > '
        + args.s2s + ' between ' + desc(kids[i - 1]) + ' and ' + desc(kids[i]));
    }
  }

  // c36 — the numeric grid leaves no empty cell
  for (const grid of screen.querySelectorAll('.mds-tile-grid')) {
    const kids = grid.children.length;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(/\\s+/).filter(Boolean).length;
    if (cols > 0 && kids % cols !== 0) problems.push('[c36] grid ' + desc(grid) + ': ' + kids + ' items / ' + cols + ' columns leaves an empty cell');
  }

  // c43 — the title never shows in ContextBar and PageHeader together
  const title = screen.querySelector('.mds-page-header-title');
  const ctx = screen.querySelector('.mds-context-bar');
  if (title && ctx) {
    const t = (title.textContent || '').trim();
    if (t && (ctx.textContent || '').includes(t)) problems.push('[c43] screen title «' + t + '» also visible in ContextBar');
  }

  // c69 — a zero count never sits beside an empty-state message
  for (const count of screen.querySelectorAll('.mds-section-count')) {
    if ((count.textContent || '').trim() === '0') {
      problems.push('[c69] a section shows count 0 (the EmptyState must stand alone instead)');
    }
  }

  // c73 — ≤ 2 control rows before the first section; no switch after switch
  const controlSel = '.mds-segmented, .mds-filter-chips';
  let controlRows = 0;
  if (firstSection) {
    for (const el of before) {
      if (el.matches(controlSel)) controlRows++;
    }
    if (controlRows > 2) problems.push('[c73] control rows before the first section = ' + controlRows + ' (limit 2)');
  }
  const segs = screen.querySelectorAll('.mds-segmented');
  for (let i = 1; i < segs.length; i++) {
    if (segs[i - 1].nextElementSibling === segs[i]) {
      problems.push('[c73] two display switches (SegmentedControl) directly in a row');
      break;
    }
  }

  // د3 — hub sections
  const sections = screen.querySelectorAll('.mds-section');
  if (sections.length > args.maxSections) problems.push('[d3] sections = ' + sections.length + ' > quality.max-hub-sections ' + args.maxSections);

  // د7 — text blocks render ≤ 2 lines at font 100%
  for (const el of screen.querySelectorAll('[data-ds-check="compose-content"] *')) {
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el);
    if (cs.whiteSpace === 'nowrap' || cs.display.includes('flex') || cs.display === 'inline') continue;
    const lh = px(cs.lineHeight) || px(cs.fontSize) * 1.3;
    const lines = el.getBoundingClientRect().height / lh;
    if (lines > 2.2) problems.push('[d7] text block renders ~' + lines.toFixed(1) + ' lines > 2: ' + desc(el) + ' «' + (el.textContent || '').trim().slice(0, 20) + '»');
  }

  return { problems };
}
"""


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-compose/page", resolved)
        return
    url, server = (resolved, None) if kind == "url" else (resolved[1], resolved[0])
    tokens = read_tokens(ROOT)
    bounds = {
        "labelPx": float(tokens["type"]["label"]["size"]),
        "s2s": float(tokens["layout"]["section-to-section"]),
        "maxSections": int(tokens["quality"]["max-hub-sections"]),
    }

    for engine in CONFIG["engines"]:
        if args.engine != "both" and engine != args.engine:
            continue
        check_id = f"ds-compose/page/{engine}"
        try:
            with browser_session(engine) as session:
                page = session.page(**DEFAULT_CONTEXT)
                page.goto(url, wait_until="load", timeout=20000)
                wait_lab_ready(page)
                page.wait_for_timeout(150)
                result = page.evaluate(COMPOSE_JS, bounds)
                if result.get("noscreen"):
                    # no demo screen on this page (e.g. the catalog view is a
                    # sample zoo): the criteria's own scope is not here
                    gate.ok(check_id, "no [data-ds-check=compose] screen — composition criteria "
                            "scope to the demo-compose screen (ds-signal precedent)")
                    continue
                problems = result["problems"]
                if problems:
                    gate.fail(check_id, f"{len(problems)} violations")
                    for p in problems[:24]:
                        gate.fail("ds-compose/violation/" + engine, p)
                else:
                    gate.ok(check_id, "composition clean: one hero, ≤3 amount sizes, big-text scope, "
                            "buttons, gaps, grid, titles, empty, controls, hub, lines — all within bounds")
        except Exception as exc:
            gate.fail(check_id, f"browser error: {exc!r}")

    if server:
        server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-compose", run))
