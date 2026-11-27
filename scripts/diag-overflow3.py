"""Check html width, vw widths, min-widths for the 376 scrollWidth."""
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
          const out = {scrollW: document.documentElement.scrollWidth,
                       htmlRectW: document.documentElement.getBoundingClientRect().width};
          const vwHits = [];
          for (const el of document.querySelectorAll('body *')) {
            const cs = getComputedStyle(el);
            if ((cs.minWidth && cs.minWidth !== 'auto' && parseFloat(cs.minWidth) > 0) ||
                (cs.width && cs.width.includes('vw'))) {
              vwHits.push({cls: (el.className||'').toString().slice(0,40),
                           minWidth: cs.minWidth, width: cs.width,
                           w: Math.round(el.getBoundingClientRect().width)});
            }
          }
          out.vwHits = vwHits.slice(0, 8);
          return out;
        }""")
        print(r)
finally:
    server.stop()
