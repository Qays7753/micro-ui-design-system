#!/usr/bin/env python3
"""S8 critic review — geometric measurement of every ContextBar /
AskButton / NotificationsButton / ProjectSwitcher / TabBar / PageHeader
claim (BRIEF 9.1, 23.16, 23.20, 23.23, 23.24(2), 27.3) on both engines
against the lab's standalone.html. Run from the repo root.

Outputs reports/ds-batch1/s8-contextbar-measure.json (tracked) and
prints the verdict table.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools' / 'ds-gates'))

from common import browser_session, DEFAULT_CONTEXT  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TARGET = (ROOT / 'previews' / 'ds-lab' / 'standalone.html').resolve().as_uri()

CLAIMS = [
    # ContextBar (9.1, 23.16, 23.20)
    ("ContextBar min-height 56", "#context-bar .mds-context-bar",
     "getComputedStyle(el).minHeight"),
    ("ContextBar canvas background", "#context-bar .mds-context-bar",
     "getComputedStyle(el).backgroundColor"),
    ("no bottom hairline at rest (23.16)", "#context-bar .mds-context-bar:not(.mds-context-bar--scrolled)",
     "getComputedStyle(el).borderBottomWidth"),
    ("1px hairline while scrolled (caption)", "#context-bar .mds-context-bar--scrolled",
     "getComputedStyle(el).borderBottomWidth"),
    ("bars layer 20 (23.15)", "#context-bar .mds-context-bar",
     "getComputedStyle(el).zIndex"),
    ("safe-area env in top padding (27.3)", "#context-bar .mds-context-bar",
     "getComputedStyle(el).paddingBlockStart"),
    ("end pair: bell precedes Ask (Ask last, 9.1)",
     "#context-bar .mds-context-bar-end",
     "el.querySelector('.mds-notifications-button') && el.lastElementChild.contains(el.querySelector('.mds-ask-button')) ? 'ask-last' : 'order-wrong'"),
    ("end pair never shrinks (23.20)", "#context-bar .mds-context-bar-end",
     "getComputedStyle(el).flexGrow + '/' + getComputedStyle(el).flexShrink"),
    # AskButton (9.1, 23.24(2))
    ("AskButton touch zone 48", "#ask-button .mds-ask-button",
     "el.getBoundingClientRect().width + 'x' + el.getBoundingClientRect().height"),
    ("AskButton no rest background (symbol IS the button)", "#ask-button .mds-ask-button",
     "getComputedStyle(el).backgroundColor"),
    ("Ask symbol 28", "#ask-button .mds-ask-button svg",
     "el.getBoundingClientRect().width"),
    ("unread dot 6", "#ask-button .mds-ask-dot",
     "el.getBoundingClientRect().width"),
    ("unread dot centered in the 48 zone", "#ask-button .mds-ask-dot",
     "(() => { const b = el.closest('.mds-ask-button').getBoundingClientRect();"
     " const d = el.getBoundingClientRect();"
     " return Math.abs((b.left + b.width / 2) - (d.left + d.width / 2)).toFixed(1) + '/' +"
     " Math.abs((b.top + b.height / 2) - (d.top + d.height / 2)).toFixed(1); })()"),
    ("Ask unread instance carries the unread note (23.17)", "#ask-button",
     "(() => { const all = Array.from(document.querySelectorAll('#ask-button .mds-ask-button'));"
     " return all.map(b => b.getAttribute('aria-label')).join(' | '); })()"),
    # NotificationsButton (9.1, 23.24(2))
    ("bell icon 24", "#notifications-button .mds-notifications-button svg",
     "el.getBoundingClientRect().width"),
    ("unread dot 8", "#notifications-button .mds-notifications-dot",
     "el.getBoundingClientRect().width"),
    ("dot ringed 2px canvas", "#notifications-button .mds-notifications-dot",
     "getComputedStyle(el).boxShadow"),
    ("dot on the outer inline-end corner in RTL (farthest, 23.24(2))",
     "#notifications-button .mds-notifications-dot",
     "(() => { const b = el.closest('.mds-notifications-button').getBoundingClientRect();"
     " const d = el.getBoundingClientRect();"
     " return (d.left + d.width / 2) < (b.left + b.width / 2) ? 'outer-left=inlne-end-rtl' : 'inner-right-wrong'; })()"),
    ("bell names: plain at zero, count at three (23.17)", "#notifications-button",
     "(() => { const all = Array.from(document.querySelectorAll('#notifications-button .mds-notifications-button'));"
     " return all.map(b => b.getAttribute('aria-label')).join(' | '); })()"),
    # ProjectSwitcher (9.1, 23.20)
    ("switcher mark 32", "#project-switcher .mds-entity-mark",
     "el.getBoundingClientRect().height"),
    ("switcher name body-strong", "#project-switcher .mds-project-switcher-name",
     "getComputedStyle(el).fontWeight + '/' + getComputedStyle(el).fontSize"),
    ("switcher min-width 120 (23.20)", "#project-switcher .mds-project-switcher",
     "getComputedStyle(el).minWidth"),
    ("switcher touch floor 48", "#project-switcher .mds-project-switcher",
     "getComputedStyle(el).minHeight"),
    ("caret hidden for one project and role (9.1 locked)", "#project-switcher",
     "(() => { const sw = Array.from(document.querySelectorAll('#project-switcher .mds-project-switcher'));"
     " const carets = sw.map(b => Boolean(b.querySelector('.mds-project-switcher-caret')));"
     " return carets.length === 2 && !carets[1] ? 'locked-no-caret' : 'wrong:' + JSON.stringify(carets); })()"),
    ("name ellipsizes, never pushes (23.20)", "#project-switcher .mds-project-switcher-name",
     "getComputedStyle(el).textOverflow + '/' + getComputedStyle(el).overflow"),
    # TabBar (9.1, 23.16, 23.20, 23.17)
    ("TabBar root min-height 64", "#tab-bar .mds-tab-bar",
     "getComputedStyle(el).minHeight"),
    ("TabBar top hairline PERMANENT (23.16)", "#tab-bar .mds-tab-bar",
     "getComputedStyle(el).borderTopWidth + ' ' + getComputedStyle(el).borderTopColor"),
    ("TabBar white surface", "#tab-bar .mds-tab-bar",
     "getComputedStyle(el).backgroundColor"),
    ("safe-area inset bottom (27.3)", "#tab-bar .mds-tab",
     "getComputedStyle(el).paddingBlockEnd"),
    ("active tab NO background (9.1)", "#tab-bar .mds-tab--active",
     "getComputedStyle(el).backgroundColor"),
    ("active label text-primary", "#tab-bar .mds-tab--active .mds-tab-label",
     "getComputedStyle(el).color"),
    ("active icon brand-logo", "#tab-bar .mds-tab--active svg",
     "getComputedStyle(el).color"),
    ("label micro 12", "#tab-bar .mds-tab-label",
     "getComputedStyle(el).fontSize"),
    ("مشروع اليوم uncut with 5 tabs on 360 (23.20)", "#tab-bar .lab-row:first-of-type .mds-tab-label",
     "el.scrollWidth <= el.clientWidth ? 'fits:' + el.scrollWidth + '/' + el.clientWidth : 'CLIPPED'"),
    ("active carries aria-current=page (23.17)", "#tab-bar .mds-tab[aria-current]",
     "el.getAttribute('aria-current')"),
    ("tabs equal width (23.20)", "#tab-bar .lab-row:first-of-type .mds-tab",
     "(() => { const ws = Array.from(document.querySelectorAll('#tab-bar .lab-row:first-of-type .mds-tab')).map(t => t.getBoundingClientRect().width);"
     " return Math.max(...ws) - Math.min(...ws) < 0.6 ? 'equal' : 'unequal:' + ws.map(w => w.toFixed(1)).join(','); })()"),
    # PageHeader (9.1, 23.20)
    ("PageHeader title title-screen 28", "#page-header .mds-page-header-title",
     "getComputedStyle(el).fontSize + '/' + getComputedStyle(el).lineHeight"),
    ("title two lines max (23.20)", "#page-header .mds-page-header-title",
     "getComputedStyle(el).webkitLineClamp"),
    ("PageHeader on canvas", "#page-header .mds-page-header",
     "getComputedStyle(el).backgroundColor"),
    ("sub screen uses the real IconButton (owner rule د)", "#page-header .lab-row:nth-of-type(2) .mds-page-header",
     "el.querySelector('.mds-icon-button') ? 'icon-button' : 'no-real-icon-button'"),
    ("collapsed title label-strong beside the back button", "#page-header .mds-page-header--collapsed .mds-page-header-title",
     "getComputedStyle(el).fontSize + '/' + getComputedStyle(el).fontWeight"),
    ("main screen never collapses (9.1)", "#page-header .lab-row:nth-of-type(1) .mds-page-header-title",
     "getComputedStyle(el).fontSize"),
]

SPECIAL = """
() => {
  const out = {};
  // Ask long-press: pointerdown holds 600ms without pointerup.
  const ask = document.querySelector('#ask-button .mds-ask-button');
  out.askExists = Boolean(ask);
  // NotificationsButton hides the dot at 0 (the main-screen row).
  const bellRows = document.querySelectorAll('#notifications-button .mds-notifications-button');
  out.bellInstances = bellRows.length;
  out.dotHiddenAtZero = !bellRows[0].querySelector('.mds-notifications-dot');
  out.dotShownAtThree = Boolean(document.querySelector('#notifications-button .mds-notifications-dot'));
  // TabBar safe area: env() resolves to 0px in emulation but must not be raw.
  const tab = document.querySelector('#tab-bar .mds-tab');
  out.tabPaddingEnd = getComputedStyle(tab).paddingBlockEnd;
  return out;
}
"""


def measure(page):
    page.goto(TARGET)
    page.wait_for_selector('.mds-page-header', state='attached', timeout=8000)
    page.wait_for_timeout(150)
    out = []
    for claim, sel, expr in CLAIMS:
        try:
            val = page.evaluate(
                "([sel, expr]) => { const el = document.querySelector(sel);"
                " if (!el) return 'NO-ELEMENT';"
                " const f = new Function('el', 'return ' + expr + ';');"
                " return String(f(el)); }",
                [sel, expr],
            )
        except Exception as e:
            val = f"EVAL-ERROR: {e}".splitlines()[0]
        out.append((claim, val))
    special = page.evaluate(SPECIAL)
    return out, special


def main():
    results = {}
    special = {}
    for engine in ('chromium', 'webkit'):
        with browser_session(engine) as s:
            page = s.page(**DEFAULT_CONTEXT)
            rows, sp = measure(page)
            results[engine] = rows
            special[engine] = sp
    report = {
        'target': 'previews/ds-lab/standalone.html',
        'special': special,
        'engines': results,
    }
    out_path = ROOT / 'reports' / 'ds-batch1' / 's8-contextbar-measure.json'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    for engine, rows in results.items():
        print(f'===== {engine} =====')
        for claim, val in rows:
            print(f'  {claim:60s} -> {val}')
        print(f'  special: {special[engine]}')


if __name__ == '__main__':
    main()
