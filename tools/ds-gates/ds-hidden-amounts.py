#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-hidden-amounts — hidden money leaks nothing (BRIEF 23.22 [مؤكد], task S2 #17).

Every element with data-ds-check="amount-hidden" (the id the components use
when amounts are hidden) must, on Chromium AND WebKit:
  - contain no digits at all (Western or Arabic-Indic) in textContent
  - render exactly four bullets •••• (U+2022, fixed shape, never the number)
  - show the unit «د»
  - keep digits out of aria-label / data-aria too (the real value must not be
    in the page at all — القيمة الحقيقية لا تكون في الصفحة أصلاً)
"""
from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT, resolve_page_target, wait_lab_ready

CHECK = CONFIG["hidden_amounts"]["check_attr"]
BULLETS = CONFIG["hidden_amounts"]["bullets"]
UNIT = CONFIG["hidden_amounts"]["unit"]

PROBE_JS = """
(attr) => Array.from(document.querySelectorAll(`[data-ds-check="${attr}"]`)).map(el => {
  const text = el.textContent || '';
  return {
    text: text.trim().slice(0, 40),
    digits: /[0-9\\u0660-\\u0669]/.test(text),
    bullets: (text.match(/\\u2022/g) || []).length,
    unit: text.includes('%s'),
    ariaDigits: /[0-9\\u0660-\\u0669]/.test(el.getAttribute('aria-label') || '')
              || /[0-9\\u0660-\\u0669]/.test(el.getAttribute('data-aria') || '')
  };
})
""" % UNIT


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-hidden-amounts/hidden", resolved)
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
                    wait_lab_ready(page)
                    for el in page.evaluate(PROBE_JS, CHECK):
                        found += 1
                        if el["digits"]:
                            problems.append(f"hidden amount shows digits: «{el['text']}» (23.22)")
                        if el["bullets"] != len(BULLETS):
                            problems.append(f"hidden amount shows {el['bullets']} bullets, must be exactly "
                                            f"{len(BULLETS)} (••••): «{el['text']}»")
                        if not el["unit"]:
                            problems.append(f"hidden amount missing the unit «{UNIT}»: «{el['text']}»")
                        if el["ariaDigits"]:
                            problems.append(f"hidden amount leaks digits through aria-label/data-aria (23.22)")
                    if found == 0:
                        problems.append(f"no element with data-ds-check=\"{CHECK}\" — the hidden-amount "
                                        "behavior is not exercised on this page")
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            if problems:
                gate.fail(f"ds-hidden-amounts/hidden/{engine}", f"{found} hidden amounts, {len(problems)} violations")
                for p in problems[:15]:
                    gate.fail(f"ds-hidden-amounts/violation/{engine}", p)
            else:
                gate.ok(f"ds-hidden-amounts/hidden/{engine}",
                        f"{found} hidden amounts: •••• + {UNIT}, zero digit leaks")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-hidden-amounts", run))
