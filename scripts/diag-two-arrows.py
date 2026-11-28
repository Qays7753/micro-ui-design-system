"""The arrow fails even on a fresh page pressed directly — but PASSED in
the clamped 244-256 run and in my earlier isolated tests. The difference
must be in HOW the arrow is probed. In the earlier passing tests I
tagged the element by searching ALL buttons for its text; here I use the
GATE's own BASE_JS indexing. Maybe the gate's arrow index and my text-
found arrow differ — there are TWO galleries («السابق» appears twice?).
Check: how many «السابق» buttons exist, which index each has, and probe
BOTH directly on a fresh page.
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
              return {i, text: (el.textContent || '').trim().slice(0, 16),
                      cls: el.className.toString().slice(0, 30),
                      sec: el.closest('section')?.id || '-'}; });
        }""")
        arrows = [e for e in els if 'السابق' in e['text'] or 'التالي' in e['text']]
        for a in arrows:
            print(a)
        # probe EACH arrow directly (fresh, nothing else pressed)
        for a in arrows:
            i = a['i']
            c = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{i}"]`);
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              return {{x: r.x + r.width/2, y: r.y + r.height/2, w: r.width, h: r.height}};
            }}""")
            b = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{i}"]`);
              const st = getComputedStyle(el);
              return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
            }}""")
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a2 = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{i}"]`);
              const st = getComputedStyle(el);
              return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
            }}""")
            page.mouse.up()
            print(f"[{i}] {a['text']} ({c['w']}x{c['h']}):", 'CHANGED' if b != a2 else 'UNCHANGED')
finally:
    server.stop()
