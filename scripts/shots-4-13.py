"""shots-4-13.py — PeriodSwitcher designer-eye shots (unit 4.13).

Captures at 360×780 on BOTH engines: the catalog section (the four gardens
— month, week, day, month-only — all starting at the current period), the
month garden stepped back with the compact «هذا الشهر» jump button (the
criterion-2 outside state), and the size sheet open on its SegmentedControl.

Usage: uv run python scripts/shots-4-13.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-13'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        # 1. the catalog section — the four gardens
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        el = page.locator('#period-switcher')
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=str(REPORTS / f'{prefix}-section-{engine}.png'))
        # 2. the criterion-2 outside state: «السابق» steps the month garden
        #    back a month and the compact «هذا الشهر» jump appears
        month_row = page.locator('#period-switcher .mds-period-switcher').first
        month_row.locator('.mds-icon-button').first.click()
        page.wait_for_timeout(500)
        month_row.screenshot(path=str(REPORTS / f'{prefix}-jump-{engine}.png'))
        # 3. the size sheet: the label button opens it (SegmentedControl)
        page.locator('#period-switcher button[aria-label^="الفترة"]').nth(1).click()
        page.wait_for_timeout(600)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-{engine}.png'))
        # close the sheet through its own scrim (the month garden's sheet)
        page.click('.mds-sheet[aria-label="حجم الفترة"] .mds-sheet-scrim', position={'x': 180, 'y': 60})
        page.wait_for_timeout(900)
        page.wait_for_selector('.mds-sheet[aria-label="حجم الفترة"]', state='detached', timeout=4000)
        print(f'{engine}: section + jump + sheet shots done')
