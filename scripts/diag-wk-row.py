"""The flapping webkit :disabled violations are object-row buttons in the
CATALOG («درج الكاش…»). Find them, and check what animations run on them
around the time of the gate's disabled probe. If a LONG animation
(skeleton pulse, count-up, landed one-shot) is running, the gate's
disabled snapshot can catch a mid-frame repaint that masks the disabled
restyle — or the object-row press opens a sheet whose CLEANUP cycles
while the disabled probe runs. Measure: locate the row, run the gate's
EXACT sequence on it (press->disabled probe), print running animations
and the style at each sample.
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
        rows = page.evaluate("""() => {
          return Array.from(document.querySelectorAll('button'))
            .filter(el => el.offsetParent !== null && el.textContent.includes('درج الكاش'))
            .map((el, i) => {
              el.setAttribute('data-diag-row', i);
              const r = el.getBoundingClientRect();
              return {i, text: el.textContent.trim().slice(0, 24),
                      x: r.x + r.width/2, y: r.y + r.height/2, sec: el.closest('section')?.id};
            });
        }""")
        print('cash-drawer rows:', len(rows))
        for row in rows[:4]:
            print(' ', row)
        if rows:
            page.evaluate(f"""() => {{
              const el = document.querySelector('[data-diag-row="0"]');
              el.scrollIntoView({{block: 'center'}});
            }}""")
            page.wait_for_timeout(300)
            r = page.evaluate("""() => {
              const el = document.querySelector('[data-diag-row="0"]');
              const st = getComputedStyle(el);
              // what animations run on it and its ancestors RIGHT NOW?
              const nodes = [];
              for (let n = el; n && n !== document.documentElement; n = n.parentElement) nodes.push(n);
              const anims = nodes.flatMap(n => (n.getAnimations ? n.getAnimations({subtree: true}) : [])
                .map(a => ({name: (a.animationName || a.transitionProperty || '?'), state: a.playState, dur: (a.effect && a.effect.getTiming) ? Math.round(a.effect.getTiming().duration) : -1})));
              return {bg: st.backgroundColor, color: st.color, nAnims: anims.length,
                      anims: anims.slice(0, 6)};
            }""")
            print('row at rest:', r)
finally:
    server.stop()
