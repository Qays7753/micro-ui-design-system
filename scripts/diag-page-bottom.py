"""Are the three failing sections at the page BOTTOM, where scrollIntoView
cannot center them and the fixed TabBar/AskButton covers their press
points? Measure element 245/248/253's center after scrollIntoView with
the page at max scroll, and what covers it then.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        r = page.evaluate("""() => {
          const els = Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'));
          const out = [];
          for (const idx of [244, 245, 248, 253, 255, 260, 272]) {
            const el = els[idx];
            if (!el) continue;
            el.scrollIntoView({block: 'center'});
            const rect = el.getBoundingClientRect();
            const cx = rect.x + rect.width/2, cy = rect.y + rect.height/2;
            const hit = document.elementFromPoint(cx, cy);
            out.push({idx, text: (el.textContent || '').trim().slice(0, 12),
                      cy: Math.round(cy), vh: window.innerHeight,
                      scrollY: Math.round(window.scrollY),
                      maxScroll: Math.round(document.documentElement.scrollHeight - window.innerHeight),
                      hitSelf: hit === el || el.contains(hit),
                      hit: hitSelf(hit, el)});
          }
          function hitSelf(hit, el) { return hit === el || el.contains(hit) ? '-' : hit.tagName + '.' + (hit.className || '').toString().slice(0, 34); }
          return out;
        }""")
        for x in r:
            print(x)
finally:
    server.stop()
