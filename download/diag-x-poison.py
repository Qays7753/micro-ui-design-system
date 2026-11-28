"""Press [247] (the sheet's X icon-button) then immediately [248] (reason
chip) on a FRESH page — gate-exact. If 248 fails right after 247, the X
press is the poison; if it passes, walk further back.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()

def snap_js(i):
    return f"""() => {{
      const el = document.querySelector('[data-ds-state-probe="{i}"]');
      if (!el) return null;
      const st = getComputedStyle(el);
      return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
        .map(p => st[p]).join('|');
    }}"""

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        page.evaluate("""() => {
          const els = Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'));
          [247, 248].forEach(i => els[i].setAttribute('data-ds-state-probe', String(i)));
        }""")
        def press(i):
            c = page.evaluate(f"""() => {{
              const el = document.querySelector('[data-ds-state-probe="{i}"]');
              if (!el) return null;
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              return {{x: r.x + r.width/2, y: r.y + r.height/2}};
            }}""")
            if c is None:
                return None
            b = page.evaluate(snap_js(i))
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate(snap_js(i))
            page.mouse.up()
            page.wait_for_timeout(150)
            return b is not None and a is not None and b != a
        r247 = press(247)
        print('247 (X) pressed, changed:', r247)
        r248 = press(248)
        print('248 (chip) after X:', 'CHANGED — passes' if r248 else 'UNCHANGED — POISONED BY THE X PRESS')
finally:
    server.stop()
