"""shots-4-10.py — DateQuickChips designer-eye shots (unit 4.10).

Captures at 360×780 on BOTH engines: the catalog section (garden with
«اليوم» selected + the custom-date sample), the interim picker sheet open,
and the compose movement sheet carrying the date chips.

Usage: uv run python scripts/shots-4-10.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-10'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        # 1. the catalog section
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        el = page.locator('#date-quick-chips')
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=str(REPORTS / f'{prefix}-section-{engine}.png'))
        # 2. the interim picker sheet (the «تاريخ آخر» press)
        page.locator('#date-quick-chips button', has_text='تاريخ آخر').first.click()
        page.wait_for_timeout(500)
        page.screenshot(path=str(REPORTS / f'{prefix}-picker-{engine}.png'))
        # close it: THE PICKER's own scrim (the catalog also carries staged
        # hidden sheet specimens whose scrim would match a bare selector)
        page.click('.mds-sheet[aria-label="تاريخ آخر"] .mds-sheet-scrim', position={'x': 180, 'y': 60})
        page.wait_for_timeout(900)
        page.wait_for_selector('.mds-sheet[aria-label="تاريخ آخر"]', state='detached', timeout=4000)
        page.wait_for_timeout(300)
        # 3. the movement sheet with the date chips (compose view)
        page.goto(SRC.as_uri() + '?view=compose')
        wait_lab_ready(page)
        page.wait_for_timeout(200)
        page.click('.lab-tools-fab')
        page.wait_for_timeout(400)
        page.locator('.mds-sheet button', has_text='فراغ').first.click()
        page.wait_for_timeout(400)
        page.click('.mds-sheet-scrim', position={'x': 180, 'y': 60})
        page.wait_for_timeout(900)
        page.locator('button', has_text='سجّل حركة').first.click()
        page.wait_for_timeout(500)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-{engine}.png'))
        print(f'{engine}: section + picker + movement-sheet shots done')
