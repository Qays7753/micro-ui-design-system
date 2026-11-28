"""Press ONLY the reason chip (248) on a fresh page — gate-exact flow —
and print base/active. If it passes alone, the poison is cumulative;
if it fails alone, the chip itself never changes style on press.
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
        page.evaluate("""() => {
          const els = Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'));
          els[248].setAttribute('data-ds-state-probe', '248');
        }""")
        c = page.evaluate("""() => {
          const el = document.querySelector('[data-ds-state-probe="248"]');
          el.scrollIntoView({block: 'center'});
          const r = el.getBoundingClientRect();
          return {x: r.x + r.width/2, y: r.y + r.height/2};
        }""")
        b = page.evaluate("""() => {
          const el = document.querySelector('[data-ds-state-probe="248"]');
          const st = getComputedStyle(el);
          return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
            .map(p => st[p]).join('|');
        }""")
        page.mouse.move(c['x'], c['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        a = page.evaluate("""() => {
          const el = document.querySelector('[data-ds-state-probe="248"]');
          const st = getComputedStyle(el);
          return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
            .map(p => st[p]).join('|');
        }""")
        page.mouse.up()
        print('chip alone:', 'CHANGED (passes alone)' if b != a else 'UNCHANGED (fails ALONE — the chip itself)')
        print('base  :', b[:100])
        print('active:', a[:100])
finally:
    server.stop()
