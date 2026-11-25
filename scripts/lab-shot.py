"""lab-shot.py — screenshot the ds lab standalone (or URL) at a given viewport.

Usage:
  uv run python scripts/lab-shot.py <source.html-or-url> <out.png> [width] [height] [engine] [fullpage] [fontscale]

Defaults: 360x780, chromium, fullpage=0 (viewport only), fontscale=100.
Reads file:// sources directly; http(s) URLs also supported.
"""
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402


def main() -> None:
    src = sys.argv[1]
    out = sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 360
    height = int(sys.argv[4]) if len(sys.argv) > 4 else 780
    engine = sys.argv[5] if len(sys.argv) > 5 else 'chromium'
    fullpage = sys.argv[6] == '1' if len(sys.argv) > 6 else False
    fontscale = float(sys.argv[7]) if len(sys.argv) > 7 else 100.0
    section = sys.argv[8] if len(sys.argv) > 8 else None

    url = src if src.startswith('http') else pathlib.Path(src).resolve().as_uri()

    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': width, 'height': height})
        page.goto(url)
        wait_lab_ready(page)
        if fontscale != 100.0:
            # The tokens are px, so the 200% font test rides zoom.
            page.evaluate(f'document.documentElement.style.zoom = "{fontscale / 100.0}"')
            page.wait_for_timeout(200)
        if section:
            el = page.locator(f'#{section}')
            el.scroll_into_view_if_needed()
            page.wait_for_timeout(150)
            el.screenshot(path=out)
        else:
            page.screenshot(path=out, full_page=fullpage)
        # Also report horizontal overflow, the quick template check.
        overflow = page.evaluate(
            'document.documentElement.scrollWidth - document.documentElement.clientWidth'
        )
        print(f'{out}: {width}x{height} {engine} full={fullpage} font={fontscale}% section={section} h-overflow={overflow}px')


if __name__ == '__main__':
    main()
