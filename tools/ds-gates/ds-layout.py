#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-layout — the layout geometry gate (addendum 1.6 د8 + و-2 item 15, unit 12).

Four automatic criteria on BOTH engines and BOTH views:

  م21  no two text boxes intersect at font 100% — the leaf text elements'
       per-line boxes (getClientRects) must not overlap (epsilon 1px to
       stay clear of sub-pixel neighbors).
  م22  the gap between INDEPENDENT interactive elements with a visible
       boundary (painted background or border) is ≥ layout.touch-gap-min.
       Scope exactly per و-2 item 15: NOT parts of one component (same
       nearest component root), NOT list rows (object row/card), NOT bar
       elements (context/tab/action bars), and never pairs that overlap
       (that layering is م23's domain) or sit diagonally.
  م23  no element covers another: for every visible interactive element,
       document.elementFromPoint at its rect center returns the element
       itself or one of its descendants (rule 34's own probe; the
       ObjectCard stretched-link + sibling button design passes because
       neither element's CENTER sits under the other).
  م24  siblings of the same type (same first class, else tag) laid out in
       one horizontal row share ONE height (rule 25: the difference is 0;
       tolerance ±0.5px). Bar rows are excluded — the ActionBar's
       secondary+primary pair differs by design (23.20's width table).

The touch-gap minimum comes from tokens.json (layout.touch-gap-min);
component roots derive from ds/src/components/*; nothing is hardcoded.
"""
import re
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, \
    read_tokens, resolve_page_target, wait_lab_ready

LAYOUT_JS = """
(args) => {
  const GAP = args.gap;
  const ROOTS = args.componentRoots;
  const BARS = args.bars;
  const ROWS = args.rowRoots;
  const desc = (el) => {
    const cls = (typeof el.className === 'string' && el.className) || '';
    return el.tagName.toLowerCase() + (cls ? '.' + cls.split(/\\s+/).slice(0, 2).join('.') : '');
  };
  const visible = (el) => {
    if (!el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.01;
  };
  const rootOf = (el) => {
    let node = el;
    while (node) {
      const cls = typeof node.className === 'string' ? node.className.split(/\\s+/) : [];
      for (const c of cls) {
        if (ROOTS.includes(c)) return c + '#' + Array.prototype.indexOf.call(document.querySelectorAll('.' + c), node);
      }
      node = node.parentElement;
    }
    return null;
  };
  const insideAny = (el, classes) => {
    let node = el;
    while (node) {
      const cls = typeof node.className === 'string' ? node.className.split(/\\s+/) : [];
      if (cls.some((c) => classes.includes(c))) return true;
      node = node.parentElement;
    }
    return false;
  };

  const insideFixedOrSticky = (el) => {
    let node = el;
    while (node) {
      const pos = getComputedStyle(node).position;
      if (pos === 'fixed' || pos === 'sticky') return true;
      node = node.parentElement;
    }
    return false;
  };

  const clipRect = (el, r) => {
    let node = el.parentElement;
    let out = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    while (node) {
      const cs = getComputedStyle(node);
      if (['auto', 'hidden', 'scroll', 'clip'].includes(cs.overflowY)
          || ['auto', 'hidden', 'scroll', 'clip'].includes(cs.overflowX)) {
        const b = node.getBoundingClientRect();
        out = {
          left: Math.max(out.left, b.left),
          top: Math.max(out.top, b.top),
          right: Math.min(out.right, b.right),
          bottom: Math.min(out.bottom, b.bottom),
        };
      }
      node = node.parentElement;
    }
    return out;
  };
  const rectArea = (r) => Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top);

  // The lab mounts its sheet sample with focus, which scrolls the page on
  // load; every measurement starts from a deterministic scroll 0.
  window.scrollTo(0, 0);
  // ---------- م21: no two text boxes overlap ----------
  const textLeaves = [];
  for (const el of document.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const ownText = Array.from(el.childNodes)
      .some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!ownText) continue;
    const hasTextDescendant = Array.from(el.querySelectorAll('*'))
      .some((d) => Array.from(d.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()));
    if (hasTextDescendant) continue;
    // fixed/sticky chrome layers over content by design (23.15) — covering
    // is م23's center probe, not a text-overlap pair.
    if (insideFixedOrSticky(el)) continue;
    textLeaves.push(el);
  }
  const lineBoxes = (el) => Array.from(el.getClientRects())
    .map((r) => clipRect(el, r))
    .filter((r) => rectArea(r) > 4);
  const overlap = [];
  for (let i = 0; i < textLeaves.length; i++) {
    const a = lineBoxes(textLeaves[i]);
    if (!a.length) continue;
    for (let j = i + 1; j < textLeaves.length; j++) {
      if (textLeaves[i].contains(textLeaves[j]) || textLeaves[j].contains(textLeaves[i])) continue;
      const b = lineBoxes(textLeaves[j]);
      if (!b.length) continue;
      for (const ra of a) {
        for (const rb of b) {
          const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (ox > 1 && oy > 1) {
            overlap.push(desc(textLeaves[i]) + ' × ' + desc(textLeaves[j])
              + ' (+' + ox.toFixed(1) + '×' + oy.toFixed(1) + 'px)');
          }
        }
      }
    }
  }

  // ---------- م22: independent interactive elements keep the touch gap ----------
  const interactive = [];
  for (const el of document.querySelectorAll('button, a[href], input, select, textarea, [role="button"], [role="link"], [role="tab"]')) {
    if (!visible(el)) continue;
    if (el.disabled) continue;
    const cs = getComputedStyle(el);
    // opaque rgb() carries no alpha component — that is alpha 1, not NaN
    const alpha = (s) => {
      const m = (s || '').match(/^rgba?\\(\\s*(\\d+)\\s*[, ]\\s*(\\d+)\\s*[, ]\\s*(\\d+)(?:\\s*[,/]\\s*([\\d.]+))?/);
      return m ? (m[4] === undefined ? 1 : +m[4]) : 0;
    };
    const hasBorder = ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']
      .some((p) => alpha(cs[p]) > 0) && parseFloat(cs.borderTopWidth) > 0;
    const hasBg = alpha(cs.backgroundColor) > 0;
    // fixed/sticky chrome (bars, toast) layers over content by design —
    // its spacing to content underneath is not an adjacency gap.
    if ((hasBorder || hasBg) && !insideFixedOrSticky(el)) interactive.push(el);
  }
  const gaps = [];
  for (let i = 0; i < interactive.length; i++) {
    const ra = clipRect(interactive[i], interactive[i].getBoundingClientRect());
    if (rectArea(ra) <= 4) continue;
    for (let j = i + 1; j < interactive.length; j++) {
      const rb = clipRect(interactive[j], interactive[j].getBoundingClientRect());
      if (rectArea(rb) <= 4) continue;
      if (interactive[i].contains(interactive[j]) || interactive[j].contains(interactive[i])) continue;
      const dx = Math.max(ra.left - rb.right, rb.left - ra.right, 0);
      const dy = Math.max(ra.top - rb.bottom, rb.top - ra.bottom, 0);
      if (dx > 0 && dy > 0) continue;       // diagonal, not neighbors
      if (dx === 0 && dy === 0) continue;   // layered — م23's domain
      const gap = Math.max(dx, dy);
      if (gap >= GAP) continue;
      // و-2 item 15 scope cuts: same component root, list rows, bar elements
      const rootA = rootOf(interactive[i]);
      const rootB = rootOf(interactive[j]);
      if (rootA && rootA === rootB) continue;
      if (insideAny(interactive[i], ROWS) || insideAny(interactive[j], ROWS)) continue;
      if (insideAny(interactive[i], BARS) || insideAny(interactive[j], BARS)) continue;
      gaps.push(desc(interactive[i]) + ' ↔ ' + desc(interactive[j]) + ' gap ' + gap.toFixed(1) + 'px < ' + GAP + 'px');
    }
  }

  // ---------- م23: nothing covers an interactive element's center ----------
  const covered = [];
  const interactivesAll = [];
  for (const el of document.querySelectorAll('button, a[href], input, select, textarea, [role="button"], [role="link"], [role="tab"]')) {
    if (!visible(el) || el.disabled) continue;
    interactivesAll.push(el);
  }
  for (const el of interactivesAll) {
    el.scrollIntoView({ block: 'center', inline: 'nearest' });
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
    const hit = document.elementFromPoint(cx, cy);
    if (!hit || (hit !== el && !el.contains(hit))) {
      covered.push(desc(el) + ' center covered by ' + (hit ? desc(hit) : 'nothing'));
    }
  }

  // ---------- м24: same-type siblings in one horizontal row share height ----------
  const heightIssues = [];
  const seen = new Set();
  for (const parent of document.querySelectorAll('*')) {
    if (!visible(parent)) continue;
    if (insideAny(parent, BARS)) continue;
    const kids = Array.from(parent.children).filter(visible);
    if (kids.length < 2) continue;
    // one horizontal band: the children's y-ranges overlap pairwise centers
    const band = kids.filter((k) => k.getBoundingClientRect().height > 0);
    const tops = band.map((k) => k.getBoundingClientRect().top);
    const bottoms = band.map((k) => k.getBoundingClientRect().bottom);
    const bandTop = Math.min(...tops), bandBottom = Math.max(...bottoms);
    if (bandBottom - bandTop > Math.max(...bottoms.map((b, i) => b - tops[i])) + 1) {
      // children stack vertically — not one row
      continue;
    }
    const groups = new Map();
    for (const k of band) {
      const cls = typeof k.className === 'string' ? k.className.split(/\\s+/).filter(Boolean) : [];
      const key = cls[0] || k.tagName.toLowerCase();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(k);
    }
    for (const [key, members] of groups) {
      if (members.length < 2) continue;
      const hs = members.map((m) => m.getBoundingClientRect().height);
      const spread = Math.max(...hs) - Math.min(...hs);
      if (spread > 0.5) {
        const sig = members.map(desc).join('|');
        if (seen.has(sig)) continue;
        seen.add(sig);
        heightIssues.push(key + ' row: heights ' + hs.map((h) => h.toFixed(1)).join('/') + 'px');
      }
    }
  }

  return { overlap, gaps, covered, heightIssues };
}
"""


def kebab(name):
    return re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()


def component_root_classes():
    comps = ROOT / "ds" / "src" / "components"
    if not comps.is_dir():
        return []
    return sorted("mds-" + kebab(p.name) for p in comps.iterdir() if p.is_dir())


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-layout/geometry", resolved)
        return
    if kind == "url":
        url, server = resolved, None
    else:
        server, url = resolved

    tokens = read_tokens(target)
    if tokens is None:
        tokens = read_tokens(ROOT)
    if tokens is None:
        gate.fail("ds-layout/tokens", "tokens.json not found (repo or target)")
        return
    gap_min = float(tokens["layout"]["touch-gap-min"])

    payload = {
        "gap": gap_min,
        "componentRoots": component_root_classes(),
        "bars": ["mds-context-bar", "mds-tab-bar", "mds-action-bar"],
        "rowRoots": ["mds-object-row", "mds-object-card"],
    }

    try:
        for engine in CONFIG["engines"]:
            if args.engine != "both" and engine != args.engine:
                continue
            problems = []
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)
                    wait_lab_ready(page)
                    page.wait_for_timeout(150)
                    r = page.evaluate(LAYOUT_JS, payload)
                    if r["overlap"]:
                        problems.append(f"m21: {len(r['overlap'])} overlapping text pairs: "
                                        + "; ".join(r["overlap"][:5]))
                    if r["gaps"]:
                        problems.append(f"m22: {len(r['gaps'])} pairs under the {gap_min:g}px touch gap: "
                                        + "; ".join(r["gaps"][:5]))
                    if r["covered"]:
                        problems.append(f"m23: {len(r['covered'])} covered interactive centers: "
                                        + "; ".join(r["covered"][:5]))
                    if r["heightIssues"]:
                        problems.append(f"m24: {len(r['heightIssues'])} uneven same-type rows: "
                                        + "; ".join(r["heightIssues"][:5]))
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            check_id = f"ds-layout/geometry/{engine}"
            if problems:
                gate.fail(check_id, f"{len(problems)} violations")
                for p in problems[:10]:
                    gate.fail(f"ds-layout/violation/{engine}", p)
            else:
                gate.ok(check_id, "m21-m24 clean")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-layout", run))
