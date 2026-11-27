"""Find overflow via offsetLeft+offsetWidth (layout boxes)."""
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
          const out = {
            htmlMargin: getComputedStyle(document.documentElement).margin,
            bodyMargin: getComputedStyle(document.body).margin,
            wide: []
          };
          for (const el of document.querySelectorAll('body *')) {
            if (el.offsetLeft + el.offsetWidth > 361) {
              out.wide.push({tag: el.tagName, cls: (el.className||'').toString().slice(0,40),
                             l: el.offsetLeft, w: el.offsetWidth});
            }
          }
          out.wide = out.wide.slice(0, 8);
          return out;
        }""")
        print(r)
finally:
    server.stop()
