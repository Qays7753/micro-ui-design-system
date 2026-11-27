"""Find what sets scrollWidth 376: absolutely positioned / hidden elements."""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=30000)
        page.wait_for_timeout(400)
        r = page.evaluate("""() => {
          const hits = [];
          for (const el of document.querySelectorAll('body *')) {
            const cs = getComputedStyle(el);
            if (cs.position === 'absolute' || cs.position === 'fixed') {
              const r = el.getBoundingClientRect();
              if (r.right > 360.5 || r.left < -0.5) {
                hits.push({tag: el.tagName, cls: (el.className||'').toString().slice(0,50),
                           pos: cs.position, right: Math.round(r.right), left: Math.round(r.left),
                           w: Math.round(r.width), disp: cs.display});
              }
            }
          }
          return {hits: hits.slice(0, 10), scrollW: document.documentElement.scrollWidth,
                  bodyW: document.body.scrollWidth};
        }""")
        print('scrollW:', r['scrollW'], 'bodyW:', r['bodyW'])
        for h in r['hits']:
            print(h)
finally:
    server.stop()
