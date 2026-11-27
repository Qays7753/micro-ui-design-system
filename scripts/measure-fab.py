"""measure-fab.py — where do the fab and the finance tile sit at 390x844?

The owner reported: the lab tools fab covers the finance tile's text in
«مشروع اليوم». Measures at rest and after a small scroll, on the compose
screen (default layout, tools folded behind the fab).
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / 'previews' / 'ds-lab' / 'standalone.html'

ENGINE = sys.argv[1] if len(sys.argv) > 1 else 'chromium'
W, H = 390, 844


def rect(page, sel):
    return page.evaluate(
        "s => { const el = document.querySelector(s); if (!el) return null;"
        " const r = el.getBoundingClientRect();"
        " return {x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom}; }",
        sel,
    )


def content_info(page):
    return page.evaluate(
        "() => { const el = document.querySelector('.lab-compose-content');"
        " return {sh: el.scrollHeight, ch: el.clientHeight, st: el.scrollTop}; }"
    )


with browser_session(ENGINE) as s:
    page = s.page()
    page.set_viewport_size({'width': W, 'height': H})
    page.goto(SRC.as_uri() + '?view=compose')
    wait_lab_ready(page)
    page.wait_for_timeout(400)

    fab = rect(page, '.lab-tools-fab')
    print('FAB      ', fab)
    print('CONTENT  ', content_info(page))

    tiles = page.evaluate(
        "() => Array.from(document.querySelectorAll('.lab-compose-screen .mds-tile'))"
        ".map(el => { const r = el.getBoundingClientRect();"
        " return {label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24),"
        " x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)}; })"
    )
    for t in tiles:
        print('TILE     ', t)

    # overlap test at rest
    if fab and tiles:
        for t in tiles:
            ox = max(0, min(fab['x'] + fab['w'], t['x'] + t['w']) - max(fab['x'], t['x']))
            oy = max(0, min(fab['y'] + fab['h'], t['y'] + t['h']) - max(fab['y'], t['y']))
            if ox > 0 and oy > 0:
                print(f'OVERLAP at rest with {t["label"]}: {ox:.0f}x{oy:.0f}px')

    # scroll the content to its end and re-test
    page.evaluate(
        "() => { const el = document.querySelector('.lab-compose-content');"
        " el.scrollTop = el.scrollHeight; }"
    )
    page.wait_for_timeout(300)
    print('CONTENT(end)', content_info(page))
    tiles2 = page.evaluate(
        "() => Array.from(document.querySelectorAll('.lab-compose-screen .mds-tile'))"
        ".map(el => { const r = el.getBoundingClientRect();"
        " return {label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24),"
        " x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)}; })"
    )
    for t in tiles2:
        print('TILE(end)', t)
    if fab:
        for t in tiles2:
            ox = max(0, min(fab['x'] + fab['w'], t['x'] + t['w']) - max(fab['x'], t['x']))
            oy = max(0, min(fab['y'] + fab['h'], t['y'] + t['h']) - max(fab['y'], t['y']))
            if ox > 0 and oy > 0:
                print(f'OVERLAP scrolled with {t["label"]}: {ox:.0f}x{oy:.0f}px')

    # what sits under the fab at full scroll (elementFromPoint at fab center)
    hits = page.evaluate(
        "fab => { const r = document.querySelector('.lab-tools-fab').getBoundingClientRect();"
        " const cx = r.x + r.width / 2, cy = r.y + r.height / 2;"
        " const els = document.elementsFromPoint(cx, cy).map(e =>"
        " (e.className && typeof e.className === 'string') ? e.className.split(' ')[0] : e.tagName);"
        " return els.slice(0, 6); }",
        None,
    )
    print('UNDER FAB(end)', hits)
