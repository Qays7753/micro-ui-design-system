"""Hover collision hypothesis: SegmentedControl has
  @media (hover:hover) and (pointer:fine) .mds-segmented-segment:not(:disabled):hover
  { background-color: surface-pressed }  — the SAME color as :active.
The gate snapshots BASE while the mouse has ALREADY MOVED onto the
element (CENTER_JS scrolls, then mouse.move in the press). If the BASE
snapshot is taken while HOVERING, base == active == surface-pressed for
segments — a false violation. Why only in the full scan and only the
first editor? Because the previous element's press left the mouse ON a
spot that... no wait — in my isolated probe I also mouse.move first and
it PASSED. The difference in the FULL scan: mouse.move happens, then
STABLE waits (up to 800ms) — hover styles are applied instantly, so base
should catch hover in isolation too. BUT: in the full scan the previous
element (the X button) left the mouse somewhere INSIDE the editor, and
the segment under the cursor is ALREADY hovered... Let me just measure:
in the full-scan cadence, what are base and active for «سعر واحد»?
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
        # Simulate the FULL-scan situation: the mouse has been moving around
        # the page (many prior presses) and now sits at the X of the first
        # editor, which was just pressed (remount). Then probe the seg with
        # the EXACT gate order: STABLE -> BASE -> CENTER(scroll) -> move -> down.
        page.evaluate("""() => {
          const stages = [...document.querySelectorAll('.lab-sheet-stage')];
          const editor = stages.find(st => st.textContent.includes('أرسل للمراجعة'));
          const x = editor.querySelector('.mds-icon-button');
          const seg = [...editor.querySelectorAll('.mds-segmented-segment')].find(b => b.textContent.trim() === 'سعر واحد');
          x.setAttribute('data-diag-x', '1');
          seg.setAttribute('data-diag-seg', '1');
          const r = x.getBoundingClientRect();
          window.__xy = {x: r.x + r.width/2, y: r.y + r.height/2};
        }""")
        xy = page.evaluate("() => window.__xy")
        # a prior press on the X (like the scan: 244..252 before the segs)
        page.mouse.move(xy['x'], xy['y'])
        page.mouse.down(); page.wait_for_timeout(120); page.mouse.up()
        page.wait_for_timeout(300)
        # gate-exact probe of the seg — NOTE the order: STABLE, BASE, CENTER
        page.evaluate("""() => {
          const seg = document.querySelector('[data-diag-seg]');
          seg.scrollIntoView({block: 'center'});
        }""")
        page.evaluate("""async () => {
          const el = document.querySelector('[data-diag-seg]');
          const t0 = performance.now();
          while (performance.now() - t0 < 800) {
            const nodes = [];
            for (let n = el; n && n !== document.documentElement; n = n.parentElement) nodes.push(n);
            const anims = nodes.flatMap(n => (n.getAnimations ? n.getAnimations({subtree: true}) : []));
            if (!anims.some(a => a.playState === 'running')) break;
            await new Promise(r => setTimeout(r, 40));
          }
        }""")
        b = page.evaluate("""() => {
          const el = document.querySelector('[data-diag-seg]');
          const st = getComputedStyle(el);
          return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
        }""")
        c = page.evaluate("""() => {
          const el = document.querySelector('[data-diag-seg]');
          const r = el.getBoundingClientRect();
          return {x: r.x + r.width/2, y: r.y + r.height/2};
        }""")
        page.mouse.move(c['x'], c['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        a = page.evaluate("""() => {
          const el = document.querySelector('[data-diag-seg]');
          const st = getComputedStyle(el);
          return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
        }""")
        page.mouse.up()
        print('base  :', b[:110])
        print('active:', a[:110])
        print('result:', 'CHANGED' if b != a else 'UNCHANGED — hover-collision or silent press')
finally:
    server.stop()
