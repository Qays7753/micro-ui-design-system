"""shots-4-14.py — MonthGrid designer-eye shots (unit 4.14).

Captures at 360×780 on BOTH engines: the catalog section (the three
gardens — single with today/selected/items, range with the band, view),
and the single garden alone at a closer crop.

Usage: uv run python scripts/shots-4-14.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-14'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        # 1. the single garden (today ring on 27, selected 30, dots)
        el = page.locator('#month-grid .mds-month-grid').first
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=str(REPORTS / f'{prefix}-single-{engine}.png'))
        # 2. the range garden (the band joining 02–05 with the two circles)
        rng = page.locator('#month-grid .mds-month-grid').nth(1)
        rng.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        rng.screenshot(path=str(REPORTS / f'{prefix}-range-{engine}.png'))
        # 3. the view garden (no buttons, dots)
        view = page.locator('#month-grid .mds-month-grid').nth(2)
        view.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        view.screenshot(path=str(REPORTS / f'{prefix}-view-{engine}.png'))
        print(f'{engine}: single + range + view shots done')
