"""shots-4-16.py — PartyPicker designer-eye shots (unit 4.16).

Captures at 360×780 on BOTH engines: the catalog section (the empty
client field + the supplier-mode empty list), the sheet open on the
client garden (focused search, the four rows with phone/debt lines), and
the chosen field after a pick (mark + name + clear).

Usage: uv run python scripts/shots-4-16.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-16'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        el = page.locator('#party-picker')
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=str(REPORTS / f'{prefix}-section-{engine}.png'))
        # 2. the sheet: the empty field's press opens it (search focused)
        page.locator('#party-picker .mds-party-field-box').first.click()
        page.wait_for_timeout(600)
        page.screenshot(path=str(REPORTS / f'{prefix}-sheet-{engine}.png'))
        # 3. pick سلمى — the chosen field (mark + name + clear)
        page.locator('#party-picker .mds-object-row', has_text='سلمى الحوراني').first.click()
        page.wait_for_timeout(900)
        page.locator('#party-picker').first.screenshot(path=str(REPORTS / f'{prefix}-chosen-{engine}.png'))
        print(f'{engine}: section + sheet + chosen shots done')
