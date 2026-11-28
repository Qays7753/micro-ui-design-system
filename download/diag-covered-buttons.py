"""Identify the covered primary buttons (m23): who covers whom, by name.

The gate accepts a hit inside the button itself (el.contains), so a real
m23 flag means ANOTHER element sits on top. This prints, for each flagged
button: its section, its label, and the covering element's tag/class/text.
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
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=30000)
        page.wait_for_timeout(500)
        r = page.evaluate("""() => {
          const out = [];
          for (const b of document.querySelectorAll('button')) {
            const bb = b.getBoundingClientRect();
            if (bb.width === 0) continue;
            const cx = bb.left + bb.width / 2, cy = bb.top + bb.height / 2;
            const hit = document.elementFromPoint(cx, cy);
            if (hit && hit !== b && !b.contains(hit) && !hit.contains(b)) {
              const coverBtn = hit.closest('button');
              out.push({
                sec: b.closest('section')?.id || '(no section)',
                btn: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 24),
                cls: b.className.toString().slice(0, 44),
                coveredBy: coverBtn
                  ? 'BUTTON «' + (coverBtn.getAttribute('aria-label') || coverBtn.textContent || '').trim().slice(0, 24) + '» [' + (coverBtn.className || '').toString().slice(0, 30) + ']'
                  : hit.tagName + '.' + (hit.className || '').toString().slice(0, 40),
                bySec: coverBtn ? (coverBtn.closest('section')?.id || '-') : '-',
              });
            }
          }
          return out;
        }""")
        for x in r:
            print(x)
        print('total covered:', len(r))
finally:
    server.stop()
