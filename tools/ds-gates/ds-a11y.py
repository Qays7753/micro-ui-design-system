#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-a11y — accessibility floor on the target page (BRIEF 13, 29.1-م4/م6/م7, task S2 #14).

Opens the page (default: the lab standalone when it exists) on Chromium AND
WebKit and checks:
  1. icon-only buttons carry an accessible name (aria-label/labelledby/title)
  2. keyboard focus shows a ring: Tab walks the focusable elements and the
     focused element must render outline or box-shadow (م7)
  3. text contrast >= 4.5:1 for elements marked data-ds-check (computed color
     against the first non-transparent ancestor background, WCAG formula)
  4. amounts embed LTR: [data-ds-check="amount"] has dir="ltr" or a <bdi>
     descendant (BRIEF 8 — Western digits inside RTL text)
"""
import re

from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT, resolve_page_target

ICON_BUTTONS_JS = """
() => Array.from(document.querySelectorAll('button, [role="button"]')).map(el => {
  const label = (el.getAttribute('aria-label') || el.getAttribute('title') || '').trim();
  const labelledby = el.getAttribute('aria-labelledby');
  const text = (el.textContent || '').trim();
  const alt = Array.from(el.querySelectorAll('img[alt], svg[title]'))
    .some(n => (n.getAttribute('alt') || n.getAttribute('title') || '').trim());
  return {text, label, labelledby, alt, hasName: !!(label || labelledby || text || alt)};
})
"""

CONTRAST_JS = """
() => {
  function parse(color) {
    const m = color.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].split(',').map(s => parseFloat(s));
    return {r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1};
  }
  function bgOf(el) {
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) return c;
      node = node.parentElement;
    }
    return parse(getComputedStyle(document.body).backgroundColor) || {r: 255, g: 255, b: 255, a: 1};
  }
  function lum(c) {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  return Array.from(document.querySelectorAll('[data-ds-check]')).map(el => {
    const text = (el.textContent || '').trim();
    if (!text) return null;
    const fg = parse(getComputedStyle(el).color);
    const bg = bgOf(el);
    if (!fg) return null;
    const l1 = lum(fg), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return {check: el.getAttribute('data-ds-check'), ratio: Math.round(ratio * 100) / 100, text: text.slice(0, 30)};
  }).filter(Boolean);
}
"""

AMOUNTS_DIR_JS = """
() => Array.from(document.querySelectorAll('[data-ds-check="amount"]')).map(el => ({
  check: 'amount', dir: el.getAttribute('dir'), hasBdi: !!el.querySelector('bdi'),
  computedDir: getComputedStyle(el).direction
}))
"""


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-a11y/floor", resolved)
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
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)

                    # 1) icon-only buttons need a name
                    named = page.evaluate(ICON_BUTTONS_JS)
                    for btn in named:
                        if not btn["hasName"]:
                            problems.append(f"icon-only button with no accessible name "
                                            f"(aria-label/aria-labelledby/title) — text={btn['text']!r}")

                    # 2) keyboard focus ring (Tab, not programmatic focus)
                    focusables = page.evaluate("""() => Array.from(document.querySelectorAll(
  'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
)).filter(el => el.offsetParent !== null).length""")
                    ring_missing = 0
                    for _ in range(min(focusables, 12)):
                        page.keyboard.press("Tab")
                        info = page.evaluate("""() => {
                            const el = document.activeElement;
                            if (!el || el === document.body) return null;
                            const st = getComputedStyle(el);
                            const ring = (st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0)
                                       || (st.boxShadow && st.boxShadow !== 'none');
                            return {tag: el.tagName.toLowerCase(), label: (el.getAttribute('aria-label')
                                    || el.textContent || '').trim().slice(0, 20), ring};
                        }""")
                        if info and not info["ring"]:
                            ring_missing += 1
                            problems.append(f"focused <{info['tag']}> ({info['label']!r}) shows no focus ring "
                                            "(outline/box-shadow) — م7")
                    if focusables == 0:
                        pass  # nothing focusable: nothing to prove either way

                    # 3) contrast for data-ds-check text
                    contrast_checked = 0
                    for item in page.evaluate(CONTRAST_JS):
                        contrast_checked += 1
                        if item["ratio"] < 4.5:
                            problems.append(f"[{item['check']}] text «{item['text']}» contrast "
                                            f"{item['ratio']}:1 < 4.5:1 (م4)")

                    # 4) amounts embed LTR
                    for item in page.evaluate(AMOUNTS_DIR_JS):
                        if item["dir"] != "ltr" and not item["hasBdi"] and item["computedDir"] != "ltr":
                            problems.append("[amount] neither dir=ltr nor <bdi> — Western digits inside RTL (BRIEF 8)")

                summary = (f"named buttons {sum(1 for b in named if b['hasName'])}/{len(named)}, "
                           f"{focusables} focusables, {contrast_checked} contrast probes")
                if problems:
                    gate.fail(f"ds-a11y/floor/{engine}", f"{summary}, {len(problems)} violations")
                    for p in problems[:15]:
                        gate.fail(f"ds-a11y/violation/{engine}", p)
                else:
                    gate.ok(f"ds-a11y/floor/{engine}", summary + " — clean")
            except Exception as exc:
                gate.fail(f"ds-a11y/floor/{engine}", f"browser error: {exc!r}")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-a11y", run))
