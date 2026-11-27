"""Identify the covered primary buttons (m23)."""
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
          const out = [];
          for (const b of document.querySelectorAll('button.mds-button--primary')) {
            const bb = b.getBoundingClientRect();
            const cx = bb.left + bb.width/2, cy = bb.top + bb.height/2;
            const el = document.elementFromPoint(cx, cy);
            if (el !== b && !b.contains(el)) {
              out.push({sec: b.closest('section')?.id, cover: (el.className||'').toString().slice(0,40), y: Math.round(cy)});
            }
          }
          return out.slice(0, 6);
        }""")
        for x in r:
            print(x)
finally:
    server.stop()
