#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-signal — the terracotta (brand-signal) budget gate (addendum 1.6 أ-هـ, unit 11).

brand-signal #D97757 means «Micro» and «now»: drawing ONLY (line, dot, bar,
edge), never text, only on surface or brand-anchor, ≤ 3 uses in a screen and
≤ 1 in a component (the sparkline line + its endpoint dot are ONE use,
و-2 item 2), and never beside status-problem in the same surface. The gate
enforces the four automatic criteria of أ-هـ on BOTH engines and BOTH views:

  م17  no TEXT element whose computed color is brand-signal          (limit 0)
  م18  every brand-signal element sits on surface or brand-anchor
       (the nearest ancestor with a painted background)               (limit 0)
  م19  in the demo-compose screen ≤ 3 signal units; per component
       instance ≤ 1 unit (line+dot merged)                            (3 / 1)
  م20  no surface scope carries both a signal unit and a status-problem
       color (fg or bg) in the same subtree                           (limit 0)

Colors are read from docs/design-system/tokens.json (brand-signal,
status-problem-fg/bg, surface, brand-anchor) — nothing is hardcoded.
Component roots for م19 are derived from ds/src/components/* (class
mds-<kebab-name>), so nested instances (the toggle inside the hero) resolve
to their own root. The catalog view skips the screen count (it is a zoo of
samples, not a screen); the compose view runs it (the criterion's own scope).
"""
import re
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, \
    read_tokens, resolve_page_target, wait_lab_ready

SIGNAL_JS = """
(args) => {
  const parse = (s) => {
    if (!s || typeof s !== 'string') return null;
    const m = s.match(/^rgba?\\(\\s*(\\d+)\\s*[, ]\\s*(\\d+)\\s*[, ]\\s*(\\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  };
  const parseRGBA = (s) => {
    const m = (s || '').match(/^rgba?\\(\\s*(\\d+)\\s*[, ]\\s*(\\d+)\\s*[, ]\\s*(\\d+)(?:\\s*[,/]\\s*([\\d.]+))?/);
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : [0, 0, 0, 0];
  };
  const same = (a, b) => !!a && !!b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  const TERRA = args.terra, PROB_FG = args.probFg, PROB_BG = args.probBg;
  const BACK_OK = args.okBack;
  const desc = (el) => {
    const cls = (typeof el.className === 'string' && el.className) || '';
    return el.tagName.toLowerCase() + (cls ? '.' + cls.split(/\\s+/).slice(0, 2).join('.') : '');
  };
  // The Micro symbol inside the Ask button is the frozen brand logo (its
  // module palette IS the identity — AGENTS: logo files are never edited);
  // the addendum counts it as ONE screen use (م19) and exempts it from
  // م17/م18/م20 — it is a logo, not a UI signal drawing.
  const isBrandSymbol = (el) => !!el.closest('.mds-ask-button');

  const signals = [];
  const textHits = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const hasOwnText = Array.from(el.childNodes)
      .some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasOwnText && !isBrandSymbol(el) && same(parse(cs.color), TERRA)) {
      textHits.push(desc(el) + ' «' + el.textContent.trim().slice(0, 24) + '»');
    }
    const props = [];
    if (same(parse(cs.stroke), TERRA)) props.push('stroke');
    if (same(parse(cs.fill), TERRA)) props.push('fill');
    if (same(parse(cs.backgroundColor), TERRA)) props.push('background');
    for (const b of ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']) {
      if (same(parse(cs[b]), TERRA)) { props.push('border'); break; }
    }
    if (props.length) signals.push({ el, props, desc: desc(el), brand: isBrandSymbol(el) });
  }

  // The nearest ancestor (strictly above the element) with a painted
  // background — the surface the signal sits on (م18) and the م20 scope.
  const backdropEl = (el) => {
    let node = el.parentElement;
    while (node) {
      const s = getComputedStyle(node).backgroundColor;
      if (parse(s) && parseRGBA(s)[3] > 0) return node;
      node = node.parentElement;
    }
    return document.body;
  };
  const badBackdrop = [];
  for (const s of signals) {
    if (s.brand) continue;
    const back = parse(getComputedStyle(backdropEl(s.el)).backgroundColor);
    if (!BACK_OK.some((ok) => same(ok, back))) {
      badBackdrop.push(s.desc + ' (' + s.props.join('+') + ') on rgb(' + (back || [0, 0, 0]).join(', ') + ')');
    }
  }

  // Units: merge signals that share one drawing — the closest svg ancestor
  // (a polyline + its endpoint circle are ONE use, و-2 item 2; the brand
  // symbol's modules are one symbol) or direct containment.
  const unitKey = (el) => {
    let node = el;
    while (node && node.tagName && node.tagName.toLowerCase() !== 'svg') node = node.parentElement;
    return (node && node.tagName && node.tagName.toLowerCase() === 'svg') ? node : el;
  };
  const units = [];
  const unitOf = new Map();
  for (const s of signals) {
    const key = unitKey(s.el);
    let u = unitOf.get(key);
    if (!u) {
      u = { key, els: [], brand: s.brand };
      unitOf.set(key, u);
      units.push(u);
    }
    u.els.push(s);
    u.brand = u.brand || s.brand;
  }
  const merged = [];
  for (const u of units) {
    const host = merged.find((m) => m.key === u.key
      || (m.key.contains && m.key.contains(u.key))
      || (u.key.contains && u.key.contains(m.key)));
    if (host) { host.els.push(...u.els); host.brand = host.brand || u.brand; }
    else { merged.push(u); }
  }

  // Component roots: the closest ancestor whose class list carries a
  // component root class (mds-<component>).
  const ROOTS = args.componentRoots;
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
  const perComponent = new Map();
  for (const u of merged) {
    const root = rootOf(u.els[0].el);
    if (root) perComponent.set(root, (perComponent.get(root) || 0) + 1);
  }
  const componentViolations = [];
  for (const [root, count] of perComponent) {
    if (count > 1) componentViolations.push(root + ' carries ' + count + ' signal units');
  }

  // م20: for every non-brand signal unit, the surface it sits on (its
  // backdrop element) must not also carry a status-problem color.
  const problemEls = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (same(parse(cs.color), PROB_FG) || same(parse(cs.backgroundColor), PROB_BG)
        || same(parse(cs.backgroundColor), PROB_FG)) {
      problemEls.push(el);
    }
  }
  const problemPairs = [];
  for (const u of merged) {
    if (u.brand) continue;
    const scope = backdropEl(u.els[0].el);
    const hasProblem = problemEls.some((p) => p === scope || scope.contains(p));
    if (hasProblem) problemPairs.push(desc(scope) + ' (carries ' + u.els[0].desc + ')');
  }

  return {
    isCompose: !!document.querySelector('.lab-compose'),
    signalCount: merged.length,
    textHits,
    badBackdrop,
    componentViolations,
    problemPairs,
  };
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
        gate.na("ds-signal/terracotta", resolved)
        return
    if kind == "url":
        url, server = resolved, None
    else:
        server, url = resolved

    tokens = read_tokens(target)
    if tokens is None:
        tokens = read_tokens(ROOT)
    if tokens is None:
        gate.fail("ds-signal/tokens", "tokens.json not found (repo or target)")
        return

    def rgb_of(dotted):
        value = tokens
        for key in dotted.split("."):
            value = value[key]
        value = value.strip()
        m = re.match(r"^#([0-9a-fA-F]{6})$", value)
        return [int(m.group(1)[0:2], 16), int(m.group(1)[2:4], 16), int(m.group(1)[4:6], 16)]

    payload = {
        "terra": rgb_of("color.brand-signal"),
        "probFg": rgb_of("color.status-problem-fg"),
        "probBg": rgb_of("color.status-problem-bg"),
        "okBack": [rgb_of("color.surface"), rgb_of("color.brand-anchor")],
        "componentRoots": component_root_classes(),
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
                    r = page.evaluate(SIGNAL_JS, payload)
                    # م17 — text in terracotta: zero
                    if r["textHits"]:
                        problems.append(f"m17: {len(r['textHits'])} text element(s) in brand-signal: "
                                        + "; ".join(r["textHits"][:5]))
                    # م18 — terracotta only on surface / brand-anchor
                    if r["badBackdrop"]:
                        problems.append(f"m18: {len(r['badBackdrop'])} signal(s) off surface/brand-anchor: "
                                        + "; ".join(r["badBackdrop"][:5]))
                    # م19 — the screen budget applies to the compose screen
                    if r["isCompose"]:
                        if r["signalCount"] > 3:
                            problems.append(f"m19: {r['signalCount']} signal units in the compose screen (max 3)")
                    # م19 — one unit per component instance
                    if r["componentViolations"]:
                        problems.append(f"m19: " + "; ".join(r["componentViolations"][:5]))
                    # م20 — no terracotta beside status-problem in one surface
                    if r["problemPairs"]:
                        problems.append(f"m20: signal + status-problem in the same surface: "
                                        + "; ".join(r["problemPairs"][:5]))
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            check_id = f"ds-signal/terracotta/{engine}"
            if problems:
                gate.fail(check_id, f"{len(problems)} violations")
                for p in problems[:10]:
                    gate.fail(f"ds-signal/violation/{engine}", p)
            else:
                screen = f", screen units {r['signalCount']}" if r.get("isCompose") else ""
                gate.ok(check_id, f"m17-m20 clean{screen}")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-signal", run))
