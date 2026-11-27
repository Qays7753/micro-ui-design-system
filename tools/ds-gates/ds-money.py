#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-money — the amount pipeline gate (addendum 1.6 lesson rules 1 and 4 as
corrected by و-2 items 8 and 9, unit 15).

Rule 1  every amount is shown through Money (a sentence amount is allowed —
        و-2 item 8). Automatic form: any TEXT NODE that carries digit(s) AND
        the currency marker («د» or the hidden shape «••••») must sit inside
        a Money element (class mds-money*) — the count outside Money = 0.
        Money's own DOM splits value and unit into sibling nodes, so a correct
        Money (bare, in a sentence, hidden, or debt form) never trips this;
        a raw sentence «دفعت 120 د» does. The future AmountField's static
        «د» inside its caption is exempt by و-2 item 8 (not built yet — the
        exemption is documented here for the day it lands).
Rule 4  the unit sits ONE layout.amount-unit-gap from the number inside Money
        (و-2 item 9 corrections): the computed column-gap of every rendered
        .mds-money-visual equals the tokens.json value ±0.5px, and the three
        accepted forms render — «—» ALONE without the unit, «•••• د» (hidden
        keeps the unit), «لك 45 د» (debt word + number + unit). The trio
        presence is checked on the catalog view only (it is the sample zoo
        that demonstrates the forms; the compose screen is a screen, not a
        zoo). The gap check runs on BOTH views and BOTH engines.

The token value is read from docs/design-system/tokens.json — nothing
hardcoded. Fixtures: bad (a raw sentence amount + a mock visual with the wrong
gap) must fail; clean (the three forms at the token gap) must pass.
"""
import json
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, \
    read_tokens, resolve_page_target, wait_lab_ready

MONEY_JS = """
(args) => {
  const hasDigit = /[0-9\\u0660-\\u0669]/;
  const desc = (el) => {
    const cls = (typeof el.className === 'string' && el.className) || '';
    return el.tagName.toLowerCase() + (cls ? '.' + cls.split(/\\s+/).slice(0, 2).join('.') : '');
  };
  // Rule 1: per TEXT NODE — digits together with the currency marker must be
  // inside a Money element (class mds-money*).
  const outside = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent || '';
    if (!hasDigit.test(text)) continue;
    if (!text.includes('د') && !text.includes('••••')) continue;
    const host = node.parentElement;
    if (host && host.closest('[class*="mds-money"]')) continue;
    // the documented future exemption: the static «د» inside AmountField's
    // caption (و-2 item 8) — not built yet; nothing to match today.
    outside.push(desc(host) + ' «' + text.trim().slice(0, 30) + '»');
  }
  // Rule 4a: the unit gap on every rendered Money visual = the token.
  const gaps = [];
  const token = args.gap;
  for (const visual of document.querySelectorAll('.mds-money-visual')) {
    const gap = parseFloat(getComputedStyle(visual).columnGap);
    if (!Number.isNaN(gap) && Math.abs(gap - token) > 0.5) {
      gaps.push(desc(visual) + ' gap ' + gap + 'px != token ' + token);
    }
  }
  // Rule 4b (catalog only): the three accepted forms render.
  const trio = {};
  if (args.wantTrio) {
    const missing = document.querySelector('.mds-money-missing');
    trio.missing = !!(missing && missing.textContent.trim() === '—'
      && missing.parentElement && !missing.parentElement.querySelector('.mds-money-unit'));
    let hidden = false, debt = false;
    for (const visual of document.querySelectorAll('.mds-money-visual')) {
      const bdi = visual.querySelector('.mds-money-value');
      const unit = visual.querySelector('.mds-money-unit');
      if (bdi && unit && (bdi.textContent || '').includes('••••')
          && (unit.textContent || '').includes('د')) hidden = true;
      const debtWord = visual.querySelector('.mds-money-debt');
      if (debtWord && unit && (debtWord.textContent || '').startsWith('لك')
          && (unit.textContent || '').includes('د')) debt = true;
    }
    trio.hidden = hidden;
    trio.debt = debt;
  }
  return { outside, gaps, trio };
}
"""


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-money/page", resolved)
        return
    url, server = (resolved, None) if kind == "url" else (resolved[1], resolved[0])
    tokens = read_tokens(ROOT)
    gap = float(tokens["layout"]["amount-unit-gap"])
    view = "compose" if "view=compose" in url else "catalog"

    for engine in CONFIG["engines"]:
        if args.engine != "both" and engine != args.engine:
            continue
        check_id = f"ds-money/page/{engine}"
        problems = []
        try:
            with browser_session(engine) as session:
                page = session.page(**DEFAULT_CONTEXT)
                page.goto(url, wait_until="load", timeout=20000)
                wait_lab_ready(page)
                page.wait_for_timeout(150)
                result = page.evaluate(MONEY_JS, {"gap": gap, "wantTrio": view == "catalog"})
                for hit in result["outside"]:
                    problems.append(f"[rule1] amount text outside Money: {hit}")
                for hit in result["gaps"]:
                    problems.append(f"[rule4] unit gap off the token: {hit}")
                if view == "catalog":
                    trio = result["trio"]
                    for form, ok in trio.items():
                        if not ok:
                            problems.append(
                                f"[rule4] accepted form «{form}» not demonstrated on the catalog "
                                "(missing «—» alone / «•••• د» / «لك 45 د»)")
        except Exception as exc:
            problems.append(f"browser error: {exc!r}")
        if problems:
            gate.fail(check_id, f"{len(problems)} violations")
            for p in problems[:20]:
                gate.fail("ds-money/violation/" + engine, p)
        else:
            gate.ok(check_id, f"rule1 outside=0, rule4 gap={gap:g} on every visual"
                     + (", trio demonstrated" if view == "catalog" else ""))


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-money", run))
