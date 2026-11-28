"""shots-4-15.py — DatePicker designer-eye shots (unit 4.15).

Captures at 360×780 on BOTH engines: the catalog section (the chosen and
empty fields), the field's own sheet open (the composition — PeriodSwitcher
month-only + MonthGrid single, full-bleed), and the DateQuickChips'
«تاريخ آخر» press opening THE SAME sheet (the 4.10 wiring closing).

Usage: uv run python scripts/shots-4-15.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-15'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        # 1. the DatePicker catalog section (the two fields)
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        el = page.locator('#date-picker')
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=str(REPORTS / f'{prefix}-section-{engine}.png'))
        # 2. the field's own sheet: the chosen field opens the composition
        page.locator('#date-picker .mds-date-field-text').first.click()
        page.wait_for_timeout(600)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-{engine}.png'))
        # close through the sheet's OWN scrim (the catalog also carries
        # staged sheet specimens whose scrim would match a bare selector)
        page.click('.mds-sheet[aria-label="تاريخ الاستحقاق"] .mds-sheet-scrim', position={'x': 180, 'y': 60})
        page.wait_for_timeout(900)
        page.wait_for_selector('.mds-sheet[aria-label="تاريخ الاستحقاق"]', state='detached', timeout=4000)
        # 3. the DateQuickChips' «تاريخ آخر» opens THE SAME sheet (4.10's wiring)
        chips = page.locator('#date-quick-chips')
        chips.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        page.locator('#date-quick-chips button', has_text='تاريخ آخر').first.click()
        page.wait_for_timeout(600)
        page.screenshot(path=str(REPORTS / f'{prefix}-chips-sheet-{engine}.png'))
        print(f'{engine}: section + sheet + chips-sheet shots done')
