"""Find 100vw / negative-margin elements causing the 16px overflow."""
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
            const w = cs.width;
            if (w === '360px' || (cs.marginLeft && parseFloat(cs.marginLeft) < 0)) {
              const b = el.getBoundingClientRect();
              hits.push({cls: (el.className||'').toString().slice(0,40), w,
                         ml: cs.marginLeft, left: Math.round(b.left), right: Math.round(b.right)});
            }
          }
          return hits.slice(0, 10);
        }""")
        for h in r:
            print(h)
finally:
    server.stop()
