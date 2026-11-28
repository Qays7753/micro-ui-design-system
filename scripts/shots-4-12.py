"""shots-4-12.py — DurationPicker designer-eye shots (unit 4.12).

Captures at 360×780 on BOTH engines: the mini form at rest (time empty,
no duration field — criterion 2), the form after a time pick (the
duration field appeared), the open 50% sheet (number-lg + common chips +
stepper + apply), and the applied state.

Usage: uv run python scripts/shots-4-12.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-12'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        sec = page.locator('#duration-picker')
        sec.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        # 1. at rest: time empty, NO duration field (criterion 2)
        sec.screenshot(path=str(REPORTS / f'{prefix}-rest-{engine}.png'))
        # 2. pick a time through the time sheet (4:00 م)
        page.locator('#duration-picker .mds-picker-field-box').first.click()
        page.wait_for_timeout(450)
        time_sheet = page.locator('.mds-sheet:has(.mds-time-sheet-value)')
        time_sheet.locator('.mds-segmented-segment', has_text='م').click()
        page.wait_for_timeout(200)
        time_sheet.locator('.mds-time-slot-grid [role="radio"]', has_text='4').first.click()
        page.wait_for_timeout(200)
        time_sheet.locator('button', has_text='اعتمد الوقت').click()
        page.wait_for_timeout(600)
        sec.screenshot(path=str(REPORTS / f'{prefix}-timedone-{engine}.png'))
        # 3. open the duration sheet
        page.locator('#duration-picker .mds-picker-field-box').nth(1).click()
        page.wait_for_timeout(500)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-{engine}.png'))
        # 4. pick «45 دقيقة» and apply (§3.3-10's data)
        dur_sheet = page.locator('.mds-sheet:has(.mds-duration-sheet-value)')
        dur_sheet.locator('[role="radio"]', has_text='45 دقيقة').click()
        page.wait_for_timeout(250)
        page.screenshot(path=str(REPORTS / f'{prefix}-picked-{engine}.png'))
        dur_sheet.locator('button', has_text='اعتمد المدة').click()
        page.wait_for_timeout(600)
        sec.screenshot(path=str(REPORTS / f'{prefix}-applied-{engine}.png'))
        print(f'{engine}: rest + timedone + sheet + picked + applied done')
