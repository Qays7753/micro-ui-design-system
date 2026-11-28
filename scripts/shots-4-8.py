"""shots-4-8.py — MovementTypeControl designer-eye shots (unit 4.8).

Captures, at 360×780 on BOTH engines:
  1. the catalog section (#movement-type-control) — the garden («خارج»
     selected) and the save-error demo side by side,
  2. the compose movement sheet OPEN with the control as its first element
     (the real §1.5-1 position) and the error line after a refused save.

Usage: uv run python scripts/shots-4-8.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '48'
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
        el = page.locator('#movement-type-control')
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=str(REPORTS / f'{prefix}-section-{engine}.png'))
        # 2. the compose sheet with the control first, then the refused save
        page.goto(SRC.as_uri() + '?view=compose')
        wait_lab_ready(page)
        page.wait_for_timeout(200)
        # the today screen's empty state carries the sheet's entry button
        # (the tools sheet's «الفراغ» state key flips the page there)
        page.click('.lab-tools-fab')
        page.wait_for_timeout(400)
        page.locator('.mds-sheet button', has_text='فراغ').first.click()
        page.wait_for_timeout(400)
        # dismiss the tools sheet (its own scrim carries the dismiss)
        page.click('.mds-sheet-scrim', position={'x': 180, 'y': 60})
        page.wait_for_timeout(600)
        page.locator('button', has_text='سجّل حركة').first.click()
        page.wait_for_timeout(450)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-{engine}.png'))
        # the refused save: press the sheet's save with no type chosen
        page.locator('.mds-sheet button', has_text='احفظ الحركة').first.click()
        page.wait_for_timeout(300)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-error-{engine}.png'))
        print(f'{engine}: section + sheet + refused-save shots done')
