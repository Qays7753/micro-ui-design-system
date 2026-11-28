"""WebKit-only: «سعر واحد» (the SELECTED segment, white capsule) shows
no :active change. Chromium passes it. Hypothesis space (measure, don't
guess): (a) WebKit does not apply :active to the button while a
synthetic Playwright mouse press is held — but then «شرائح» (unselected,
same anatomy) would fail too, and it PASSED; (b) the :active rule's
background (surface-pressed) computes to the SAME value as the selected
capsule's white on WebKit — no, colors differ; (c) the selected segment
on WebKit has a transition that has not finished at snapshot time; (d)
the press point is computed differently (RTL + zoom). Measure directly:
computed styles base/held, and which element sits at the press point.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('webkit') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        r = page.evaluate("""() => {
          const stages = [...document.querySelectorAll('.lab-sheet-stage')];
          const editor = stages.find(st => st.textContent.includes('أرسل للمراجعة'));
          const seg = [...editor.querySelectorAll('.mds-segmented-segment')].find(b => b.textContent.trim() === 'سعر واحد');
          seg.setAttribute('data-diag-seg', '1');
          const st = getComputedStyle(seg);
          return {selected: seg.className.includes('--selected'),
                  bg: st.backgroundColor, transition: st.transition,
                  transitionDuration: st.transitionDuration};
        }""")
        print('at rest:', r)
        c = page.evaluate("""() => {
          const el = document.querySelector('[data-diag-seg]');
          el.scrollIntoView({block: 'center'});
          const rect = el.getBoundingClientRect();
          return {x: rect.x + rect.width/2, y: rect.y + rect.height/2, w: rect.width, h: rect.height};
        }""")
        b = page.evaluate("""() => {
          const st = getComputedStyle(document.querySelector('[data-diag-seg]'));
          return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
        }""")
        page.mouse.move(c['x'], c['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        a = page.evaluate("""() => {
          const st = getComputedStyle(document.querySelector('[data-diag-seg]'));
          return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
        }""")
        # what sits at the press point while held?
        hit = page.evaluate(f"""() => {{
          const n = document.elementFromPoint({c['x']}, {c['y']});
          return n ? n.tagName + '.' + (n.className || '').toString().slice(0, 40) : 'none';
        }}""")
        page.mouse.up()
        print('press point:', c)
        print('hit while held:', hit)
        print('base  :', b[:110])
        print('active:', a[:110])
        print('VERDICT:', 'CHANGED' if b != a else 'UNCHANGED on webkit too — reproduced')
finally:
    server.stop()
