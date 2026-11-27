"""Find the nameless button the states gate flags: replicate BASE_JS listing."""
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
          // exact gate filter: visible buttons, not view-toggle exempt
          const els = Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'));
          return els.map((el, i) => {
            const r = el.getBoundingClientRect();
            return {i, text: (el.textContent || '').trim().slice(0, 20),
                    cls: (el.className || '').toString().slice(0, 60),
                    w: Math.round(r.width), h: Math.round(r.height),
                    sec: el.closest('section')?.id || '(no section)'};
          }).filter(x => !x.text);
        }""")
        print(r)
finally:
    server.stop()
