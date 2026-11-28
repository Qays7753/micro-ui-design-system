"""shots-4-11.py — TimePicker designer-eye shots (unit 4.11).

Captures at 360×780 on BOTH engines: the empty field, the open 92% sheet
(number-lg + ص/م + hour grid + minute grid + apply bar), and the field
after applying «4:00 م» (with the clear button).

Usage: uv run python scripts/shots-4-11.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-11'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        el = page.locator('#time-picker')
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        # 1. the empty field (the garden's rest state)
        el.screenshot(path=str(REPORTS / f'{prefix}-field-{engine}.png'))
        # 2. open the sheet (press the field)
        page.locator('#time-picker .mds-time-field-box').click()
        page.wait_for_timeout(500)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-{engine}.png'))
        # 3. pick 4:00 م (pm, hour 4, minute 00) then apply — scoped to THE
        # time sheet (the catalog also carries staged hidden sheets)
        time_sheet = page.locator('.mds-sheet:has(.mds-time-sheet-value)')
        time_sheet.locator('.mds-segmented-segment', has_text='م').click()
        page.wait_for_timeout(250)
        time_sheet.locator('.mds-time-slot-grid [role="radio"]', has_text='4').first.click()
        page.wait_for_timeout(250)
        page.screenshot(path=str(REPORTS / f'{prefix}-picked-{engine}.png'))
        time_sheet.locator('button', has_text='اعتمد الوقت').click()
        page.wait_for_timeout(600)
        el.screenshot(path=str(REPORTS / f'{prefix}-applied-{engine}.png'))
        print(f'{engine}: field + sheet + picked + applied shots done')
