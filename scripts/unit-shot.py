#!/usr/bin/env python3
"""unit-shot.py — screenshot a lab view/section on an engine (per-unit cycle).

Usage:
  uv run python scripts/unit-shot.py <view:catalog|compose> <out.png> \
      [width] [height] [engine] [fullpage] [fontscale] [section]

Defaults: 360x780, chromium, viewport-only, font 100%, whole view.
Uses the gates' own session machinery (DS_VIEW + resolve_page_target) so the
URL and wait conditions match exactly what the gates verify.
Also prints the horizontal-overflow quick check like lab-shot.py.
"""
import os
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, resolve_page_target, wait_lab_ready  # noqa: E402


def main() -> None:
    view = sys.argv[1]
    out = sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 360
    height = int(sys.argv[4]) if len(sys.argv) > 4 else 780
    engine = sys.argv[5] if len(sys.argv) > 5 else 'chromium'
    fullpage = sys.argv[6] == '1' if len(sys.argv) > 6 else False
    fontscale = float(sys.argv[7]) if len(sys.argv) > 7 else 100.0
    section = sys.argv[8] if len(sys.argv) > 8 else None

    os.environ['DS_VIEW'] = view
    kind, value = resolve_page_target('')
    if kind != 'server':
        raise SystemExit(f'cannot open view {view}: {value}')
    server, url = value
    try:
        with browser_session(engine) as s:
            page = s.page(viewport={'width': width, 'height': height},
                          device_scale_factor=1)
            page.goto(url, wait_until='load', timeout=30000)
            wait_lab_ready(page)
            if fontscale != 100.0:
                page.evaluate(f'document.documentElement.style.zoom = "{fontscale / 100.0}"')
                page.wait_for_timeout(200)
            if section:
                el = page.locator(f'#{section}')
                el.scroll_into_view_if_needed()
                page.wait_for_timeout(150)
                el.screenshot(path=out)
            else:
                page.screenshot(path=out, full_page=fullpage)
            overflow = page.evaluate(
                'document.documentElement.scrollWidth - document.documentElement.clientWidth')
            print(f'{out}: {width}x{height} {engine} {view} full={fullpage} '
                  f'font={fontscale}% section={section} h-overflow={overflow}px')
    finally:
        server.stop()


if __name__ == '__main__':
    main()
