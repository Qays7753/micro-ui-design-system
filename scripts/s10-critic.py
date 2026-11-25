#!/usr/bin/env python3
"""S10 critic review — measurement of the demo-compose page (the
standalone's DEFAULT view) and the two-view flow, on both engines.
Outputs reports/ds-batch1/s10-compose-measure.json and prints the
verdict table.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools' / 'ds-gates'))

from common import browser_session, DEFAULT_CONTEXT  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TARGET = (ROOT / 'previews' / 'ds-lab' / 'standalone.html').resolve().as_uri()

CLAIMS = [
    # Default view = compose (owner request).
    ("compose is the default view", ".lab-compose-screen",
     "Boolean(el)"),
    ("catalog sections absent without the query", ".lab-page",
     "Boolean(document.querySelector('.lab-page'))"),
    ("one button opens the catalog", ".lab-compose-top",
     "el.querySelectorAll('button').length"),
    # ContextBar anatomy on the page (9.1).
    ("bar: switcher mark shows the initial (23.5)", ".lab-compose-screen .mds-entity-mark",
     "el.textContent.trim().slice(0, 1)"),
    ("bar: unread dot on the bell", ".lab-compose-screen .mds-notifications-dot",
     "Boolean(el)"),
    ("bar: Ask is the LAST element in the corner", ".lab-compose-screen .mds-context-bar",
     "(() => { const end = el.querySelector('.mds-context-bar-end');"
     " return end.lastElementChild.contains(end.querySelector('.mds-ask-button')) ? 'ask-last' : 'wrong'; })()"),
    ("bar height 56", ".lab-compose-screen .mds-context-bar",
     "getComputedStyle(el).minHeight"),
    # PageHeader (9.1): creation action, no floating button.
    ("header title اليوم", ".lab-compose-screen .mds-page-header-title",
     "el.textContent"),
    ("header trailing = the creation button", ".lab-compose-screen .mds-page-header-end",
     "Boolean(el.querySelector('button'))"),
    # Content (unit 15).
    ("hero value logical order", ".lab-compose-screen .mds-hero-value",
     "el.textContent"),
    ("hero unit د.أ present", ".lab-compose-screen .mds-hero-unit",
     "el.textContent"),
    ("section needs-you with count 3", ".lab-compose-screen .mds-section-label, .lab-compose-screen [class*=section]",
     "document.querySelector('.lab-compose-screen').textContent.includes('يحتاجك') ? 'present' : 'missing'"),
    ("rows carry the 23.5 initials", ".lab-compose-screen .mds-object-row .mds-entity-mark-initial",
     "Array.from(document.querySelectorAll('.lab-compose-screen .mds-object-row .mds-entity-mark-initial')).map(i => i.textContent).join(',')"),
    ("four tiles with distinct 23.23 icons", ".lab-compose-screen .mds-tile-grid",
     "(() => { const icons = Array.from(el.querySelectorAll('.mds-tile svg'));"
     " const paths = new Set(icons.map(i => i.querySelector('path')?.getAttribute('d').slice(0, 24)));"
     " return icons.length + ' icons / ' + paths.size + ' distinct'; })()"),
    ("tile sparkline on finance only (23.9)", ".lab-compose-screen .mds-tile-grid",
     "el.querySelectorAll('svg polyline').length === 1 ? 'one-sparkline' : 'wrong:' + el.querySelectorAll('svg polyline').length"),
    # TabBar (9.1).
    ("tabbar five tabs, active Fill brand-logo", ".lab-compose-screen .mds-tab-bar",
     "(() => { const tabs = el.querySelectorAll('.mds-tab');"
     " const active = el.querySelector('.mds-tab--active');"
     " return tabs.length + '/active-color:' + (active ? getComputedStyle(active).color : 'none'); })()"),
    ("active tab carries aria-current (23.17)", ".lab-compose-screen .mds-tab[aria-current]",
     "el.getAttribute('aria-current')"),
]

def measure(page):
    page.goto(TARGET)
    page.wait_for_selector('.lab-compose-screen', state='attached', timeout=8000)
    page.wait_for_timeout(200)
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
    flow = run_flow(page)
    page.goto(TARGET)
    page.wait_for_selector('.lab-compose-screen', state='attached', timeout=8000)
    page.wait_for_timeout(200)
    states = run_states(page)
    return out, flow, states



def run_flow(page):
    """Sheet + confirm + toast flows, one React flush per step."""
    page.click('.lab-compose-screen .mds-page-header-end button')
    page.wait_for_timeout(250)
    flow = {}
    flow['sheetOpened'] = page.locator('.mds-sheet .mds-sheet-panel').count() > 0
    flow['sheetHasField'] = page.locator('.mds-sheet input').count() > 0
    flow['sheetHasBar'] = page.locator('.mds-sheet .mds-action-bar').count() > 0
    page.click('.mds-sheet .mds-action-bar button:has-text("حفظ")')
    page.wait_for_timeout(300)
    flow['toastRaised'] = page.locator('.mds-toast').count() > 0
    flow['toastText'] = page.locator('.mds-toast-text').first.text_content() if flow['toastRaised'] else ''
    rows = page.locator('.lab-compose-screen .mds-object-row')
    rows.nth(1).click()
    page.wait_for_timeout(250)
    flow['confirmOpened'] = page.locator('[class*=confirm]').count() > 0
    del_btn = page.locator('button:has-text("احذف")')
    if del_btn.count():
        del_btn.first.click()
        page.wait_for_timeout(300)
    flow['toastAfterConfirm'] = page.locator('.mds-toast-text').first.text_content() if page.locator('.mds-toast').count() else ''
    return flow


def run_states(page):
    """The four page states + the two-view flow, one flush per step."""
    states = {}

    def key(name):
        return page.locator(f'.lab-compose-top button:has-text("{name}")')

    key('تحميل').click()
    page.wait_for_timeout(250)
    states['loadingSkeletons'] = page.locator('.lab-compose-content .mds-skeleton').count()
    key('فراغ').click()
    page.wait_for_timeout(250)
    states['emptyGhosts'] = page.locator('.lab-compose-content .mds-empty-state-ghost').count()
    states['emptySentence'] = page.locator('.lab-compose-content .mds-empty-state-sentence').first.text_content()
    key('عادي').click()
    page.wait_for_timeout(250)
    states['normalRows'] = page.locator('.lab-compose-content .mds-object-row').count()
    page.click('.lab-compose-top [aria-label*="المبالغ"]')
    page.wait_for_timeout(300)
    states['heroWhileHidden'] = page.locator('.lab-compose-content .mds-hero-value').first.text_content()
    states['rowsBullets'] = page.locator('.lab-compose-content').first.text_content().find('••••') >= 0
    page.click('.lab-compose-top [aria-label*="المبالغ"]')
    page.wait_for_timeout(200)
    page.click('.lab-compose-top button:has-text("الكل")')
    page.wait_for_timeout(300)
    states['catalogOpens'] = page.locator('.lab-page').count() > 0
    page.click('.lab-index button:has-text("رجوع")')
    page.wait_for_timeout(300)
    states['backToCompose'] = page.locator('.lab-compose-screen').count() > 0
    return states


def main():
    results = {}
    extras = {}
    for engine in ('chromium', 'webkit'):
        with browser_session(engine) as s:
            page = s.page(**DEFAULT_CONTEXT)
            rows, flow, states = measure(page)
            results[engine] = rows
            extras[engine] = {'flow': flow, 'states': states}
    report = {
        'target': 'previews/ds-lab/standalone.html (default compose view)',
        'engines': results,
        'extras': extras,
    }
    out_path = ROOT / 'reports' / 'ds-batch1' / 's10-compose-measure.json'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    for engine, rows in results.items():
        print(f'===== {engine} =====')
        for claim, val in rows:
            print(f'  {claim:58s} -> {val}')
        print(f'  flow: {extras[engine]["flow"]}')
        print(f'  states: {extras[engine]["states"]}')


if __name__ == '__main__':
    main()
