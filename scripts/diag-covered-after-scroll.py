"""Check whether the failing buttons' centers, after scrollIntoView, are
COVERED by the ActionBar that sits at the panel's bottom (my stage made
the bar static INSIDE the scrolling panel — its last pixels may overlap
the scrolled button). ElementFromPoint tells the truth.
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
          const targets = ['محتوى مضلل', 'سعر غير صحيح', 'منتج مقلد', 'أرسل البلاغ',
                           'سعر واحد', 'شرائح', 'أرسل للمراجعة', 'السابق', 'التالي'];
          const out = [];
          for (const name of targets) {
            for (const b of document.querySelectorAll('button')) {
              if ((b.textContent || '').trim().slice(0, 20) !== name) continue;
              b.scrollIntoView({block: 'center'});
              const rect = b.getBoundingClientRect();
              const cx = rect.x + rect.width/2, cy = rect.y + rect.height/2;
              const hit = document.elementFromPoint(cx, cy);
              const hitIsSelf = hit === b || b.contains(hit);
              out.push({name, y: Math.round(cy), hitIsSelf,
                        coveredBy: hitIsSelf ? '-' : hit.tagName + '.' + (hit.className || '').toString().slice(0, 40)});
            }
          }
          return out;
        }""")
        for x in r:
            print(x)
finally:
    server.stop()
