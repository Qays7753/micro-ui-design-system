"""verify-fab-clear.py — the tools fab must cover NO content at any scroll.

Samples every scroll position (0..max in 24px steps) and checks, at the fab's
center point, that no content element (inside .lab-compose-content) is ever
hit by elementsFromPoint. Also verifies the fab clears ContextBar and TabBar.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / 'previews' / 'ds-lab' / 'standalone.html'

ENGINE = sys.argv[1] if len(sys.argv) > 1 else 'chromium'
W, H = 390, 844

JS = """
() => {
  const fab = document.querySelector('.lab-tools-fab');
  if (!fab) return {error: 'no fab'};
  const r = fab.getBoundingClientRect();
  const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
  const hits = document.elementsFromPoint(cx, cy);
  const content = document.querySelector('.lab-compose-content');
  const contentHit = hits.some(el => content.contains(el) && el !== content);
  // any element that is a *child* of the content column counts as covered
  const names = hits.slice(0, 4).map(e =>
    (e.className && typeof e.className === 'string') ? e.className.split(' ')[0] : e.tagName);
  return {fab: {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)},
          contentHit, names};
}
"""

with browser_session(ENGINE) as s:
    page = s.page()
    page.set_viewport_size({'width': W, 'height': H})
    page.goto(SRC.as_uri() + '?view=compose')
    wait_lab_ready(page)
    page.wait_for_timeout(400)

    info = page.evaluate(JS)
    print('AT REST   ', info)
    if info.get('contentHit'):
        raise SystemExit('FAIL: content under fab at rest')

    max_scroll = page.evaluate(
        "() => { const el = document.querySelector('.lab-compose-content');"
        " return el.scrollHeight - el.clientHeight; }"
    )
    print('max scroll', max_scroll)
    failures = 0
    st = 0
    while st <= max_scroll:
        page.evaluate(f"() => document.querySelector('.lab-compose-content').scrollTop = {st}")
        page.wait_for_timeout(30)
        info = page.evaluate(JS)
        if info.get('contentHit'):
            print(f'FAIL at scroll {st}:', info['names'])
            failures += 1
        st += 24
    # also at exact max
    page.evaluate(f"() => document.querySelector('.lab-compose-content').scrollTop = {max_scroll}")
    page.wait_for_timeout(60)
    info = page.evaluate(JS)
    print('AT MAX    ', info)
    if info.get('contentHit'):
        failures += 1

    # the fab must not cover ContextBar or TabBar either
    bars = page.evaluate(
        "() => { const out = {};"
        " for (const sel of ['.mds-context-bar', '.mds-tab-bar']) {"
        "  const el = document.querySelector('.lab-compose-screen ' + sel);"
        "  if (el) { const r = el.getBoundingClientRect(); out[sel] = {y: Math.round(r.y), h: Math.round(r.height)}; } }"
        " return out; }"
    )
    print('BARS      ', bars)
    fab = page.evaluate(JS)['fab']
    for sel, r in bars.items():
        oy = min(fab['y'] + fab['h'], r['y'] + r['h']) - max(fab['y'], r['y'])
        if oy > 0:
            print(f'FAIL: fab overlaps {sel} by {oy}px')
            failures += 1

    print('RESULT    ', 'FAIL' if failures else 'PASS — the fab covers no content at any scroll, and clears ContextBar/TabBar')
    raise SystemExit(1 if failures else 0)
