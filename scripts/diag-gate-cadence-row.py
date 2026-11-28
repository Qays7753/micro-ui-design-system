"""The direct probe works (disabled color lands in 250ms standalone).
In the gate's cadence it never lands. The ONE difference left: the
gate's press ran right before (same element), leaving usePress state or
a pointer-capture state. Reproduce EXACTLY: press the row (gate cadence),
run isolation (nothing should open — this is the garden row, its onPress
is a no-op in the catalog), then disable and sample at cumulative
60/140/200/240ms. Print every sample.
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
        row = page.evaluate("""() => {
          const rows = Array.from(document.querySelectorAll('button'))
            .filter(el => el.offsetParent !== null && el.textContent.includes('درج الكاش') && el.closest('section')?.id === 'object-row');
          const el = rows[0];
          el.setAttribute('data-diag', 'r');
          el.scrollIntoView({block: 'center'});
          const r = el.getBoundingClientRect();
          return {x: r.x + r.width/2, y: r.y + r.height/2};
        }""")
        page.wait_for_timeout(300)
        snap = """() => {
          const el = document.querySelector('[data-diag="r"]');
          if (!el) return 'GONE';
          const st = getComputedStyle(el);
          return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
        }"""
        base_style = page.evaluate(snap)
        # gate press cadence on the SAME row
        page.mouse.move(row['x'], row['y'])
        page.mouse.down()
        page.wait_for_timeout(70)
        a = page.evaluate(snap)
        page.wait_for_timeout(80)
        page.wait_for_timeout(110)
        page.mouse.up()
        page.wait_for_timeout(100)
        after_press = page.evaluate(snap)
        # isolation step (nothing should be open for a garden row)
        stuck = page.evaluate("""async () => {
          const vis = (el) => el.getClientRects().length > 0;
          const open = () => Array.from(document.querySelectorAll('[role="dialog"], [class*="mds-confirm"]'))
            .filter(el => el.closest('.lab-sheet-stage') === null && vis(el));
          if (!open().length) return [];
          document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
          await new Promise(r => setTimeout(r, 220));
          return open().map(e => e.getAttribute('aria-label') || '?');
        }""")
        print('overlays after row press:', stuck)
        # disabled sampling, gate cadence
        page.evaluate("() => { document.querySelector('[data-diag=\"r\"]').disabled = true; }")
        samples = {}
        t = 0
        for ms in (60, 140, 200, 240):
            page.wait_for_timeout(ms)
            t += ms
            samples[t] = page.evaluate(snap)
        page.evaluate("() => { document.querySelector('[data-diag=\"r\"]').disabled = false; }")
        print('base       :', base_style[:100])
        print('press-held :', a[:100])
        print('after press:', after_press[:100])
        for k, v in samples.items():
            print(f'disabled@{k}ms:', v[:100])
finally:
    server.stop()
