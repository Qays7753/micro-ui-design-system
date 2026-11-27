"""shot-3b4.py — section/viewport shots for the 3ب.4 units.

Usage: uv run python scripts/shot-3b4.py <out.png> [engine] [view] [section] [fontscale] [width] [height]
Defaults: chromium, catalog, section=hero, 100%, 360x780.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

out = sys.argv[1]
engine = sys.argv[2] if len(sys.argv) > 2 else 'chromium'
view = sys.argv[3] if len(sys.argv) > 3 else 'catalog'
section = sys.argv[4] if len(sys.argv) > 4 else 'hero'
fontscale = float(sys.argv[5]) if len(sys.argv) > 5 else 100.0
width = int(sys.argv[6]) if len(sys.argv) > 6 else 360
height = int(sys.argv[7]) if len(sys.argv) > 7 else 780

SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'

with browser_session(engine) as s:
    page = s.page()
    page.set_viewport_size({'width': width, 'height': height})
    page.goto(SRC.as_uri() + '?view=' + view)
    wait_lab_ready(page)
    if fontscale != 100.0:
        page.evaluate(f'document.documentElement.style.fontSize = "{fontscale / 100.0 * 100}%"')
        page.wait_for_timeout(300)
    if section and section != '-':
        el = page.locator('#' + section)
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        el.screenshot(path=out)
    else:
        page.screenshot(path=out)
    overflow = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
    print(f'{out}: {width}x{height} {engine} view={view} section={section} font={fontscale}% h-overflow={overflow}px')
