"""shots-4-9.py — QuantityStepper designer-eye shots (unit 4.9).

Captures the catalog section (#quantity-stepper) at 360×780 on BOTH
engines: the live stepper with the polite live region.

Usage: uv run python scripts/shots-4-9.py <out-prefix>
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

prefix = sys.argv[1] if len(sys.argv) > 1 else '4-9'
SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'
REPORTS = pathlib.Path(__file__).resolve().parents[1] / 'reports' / 'ds-addendum-1.7'
REPORTS.mkdir(parents=True, exist_ok=True)

for engine in ('chromium', 'webkit'):
    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': 360, 'height': 780})
        page.goto(SRC.as_uri() + '?view=catalog')
        wait_lab_ready(page)
        el = page.locator('#quantity-stepper')
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=str(REPORTS / f'{prefix}-section-{engine}.png'))
        # the pressed state: hold plus a beat (the repeat steps 2 -> 3+)
        page.locator('#quantity-stepper button[aria-label="زيادة"]').click()
        page.wait_for_timeout(300)
        el.screenshot(path=str(REPORTS / f'{prefix}-stepped-{engine}.png'))
        print(f'{engine}: section + stepped shots done')
