"""Walk the tree: whose scrollWidth exceeds its clientWidth?"""
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
          const walk = (el) => {
            if (el.scrollWidth && el.scrollWidth > (el.clientWidth || 0) + 1) {
              hits.push({cls: (el.className||'').toString().slice(0,44), tag: el.tagName,
                         sw: el.scrollWidth, cw: el.clientWidth});
            }
            for (const c of el.children) walk(c);
          };
          walk(document.body);
          return hits.slice(0, 12);
        }""")
        for h in r:
            print(h)
finally:
    server.stop()
