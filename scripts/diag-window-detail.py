"""The failing window is exactly the market-domain stage buttons. Press
see-all (39) like the gate, then walk elements 240..255 pressing each
exactly like the gate (STABLE + scrollIntoView + real press), and for
EACH one print whether it changed AND what elementFromPoint returns at
its center at the moment of press. This shows the true blocker per element.
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
        els = page.evaluate("""() => {
          return Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'))
            .map((el, i) => { el.setAttribute('data-ds-state-probe', i);
              return {i, text: (el.textContent || '').trim().slice(0, 16)}; });
        }""")
        # press 39 (see-all) to open the fixed sheet, like the gate does
        def gate_press(i, probe=True):
            c = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{i}"]`);
              if (!el) return null;
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              const cx = r.x + r.width/2, cy = r.y + r.height/2;
              const hit = document.elementFromPoint(cx, cy);
              return {{x: cx, y: cy, hitSelf: hit === el || el.contains(hit),
                       hit: hit ? hit.tagName + '.' + (hit.className || '').toString().slice(0, 36) : 'none'}};
            }}""")
            if c is None:
                return None
            b = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{i}"]`);
              if (!el) return null;
              const st = getComputedStyle(el);
              return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
                .map(p => st[p]).join('|');
            }}""")
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{i}"]`);
              if (!el) return null;
              const st = getComputedStyle(el);
              return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
                .map(p => st[p]).join('|');
            }}""")
            page.mouse.up()
            page.wait_for_timeout(150)
            return {'text': next((e['text'] for e in els if e['i'] == i), '?'),
                    'hitSelf': c['hitSelf'], 'hit': c['hit'],
                    'changed': b is not None and a is not None and b != a}
        # press elements 0..39 like the gate would (simplified: only 39)
        gate_press(39)
        print('after pressing 39 (see-all): fixed sheet should be open')
        for i in range(240, 256):
            r = gate_press(i)
            if r:
                flag = 'OK' if r['changed'] else 'FAIL'
                print(f"[{i}] «{r['text']}» {flag} | hitSelf={r['hitSelf']} hit={r['hit'][:40]}")
finally:
    server.stop()
