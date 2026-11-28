"""Reproduce ONE :active failure with the gate's EXACT real-mouse press.

Targets «أرسل البلاغ» (the report-sheet send): BASE probe-id assignment,
STABLE wait, scrollIntoView, mouse.move+down, 120ms, SNAPSHOT, compare.
Prints base and active property strings to see WHICH prop fails to move.
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
        # run the gate's real flow on this one button
        r = page.evaluate("""() => {
          const btns = [...document.querySelectorAll('button')];
          const b = btns.find(x => x.textContent.trim() === 'أرسل البلاغ');
          if (!b) return {err: 'not found'};
          b.setAttribute('data-ds-state-probe', '999');
          return {ok: true};
        }""")
        print('setup:', r)
        # STABLE
        stable = page.evaluate("""async () => {
          const el = document.querySelector('[data-ds-state-probe="999"]');
          const t0 = performance.now();
          while (performance.now() - t0 < 800) {
            const nodes = [];
            for (let n = el; n && n !== document.documentElement; n = n.parentElement) nodes.push(n);
            const anims = nodes.flatMap(n => (n.getAnimations ? n.getAnimations({subtree: true}) : []));
            if (!anims.some(a => a.playState === 'running')) return true;
            await new Promise(r => setTimeout(r, 40));
          }
          return true;
        }""")
        print('stable:', stable)
        # CENTER (scrollIntoView first)
        c = page.evaluate("""() => {
          const el = document.querySelector('[data-ds-state-probe="999"]');
          el.scrollIntoView({block: 'center'});
          const r = el.getBoundingClientRect();
          return {x: r.x + r.width / 2, y: r.y + r.height / 2, top: r.top, bottom: r.bottom,
                  vh: window.innerHeight, vw: window.innerWidth, w: r.width, h: r.height};
        }""")
        print('center:', c)
        # BASE snapshot with the gate's prop list
        base_snap = page.evaluate("""() => {
          const el = document.querySelector('[data-ds-state-probe="999"]');
          const st = getComputedStyle(el);
          return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
            .map(p => st[p]).join('|');
        }""")
        # real mouse press at the returned center
        page.mouse.move(c['x'], c['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        active_snap = page.evaluate("""() => {
          const el = document.querySelector('[data-ds-state-probe="999"]');
          const st = getComputedStyle(el);
          return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
            .map(p => st[p]).join('|');
        }""")
        page.mouse.up()
        print('base  :', base_snap[:120])
        print('active:', active_snap[:120])
        print('CHANGED' if base_snap != active_snap else 'UNCHANGED — REAL FAILURE REPRODUCED')
finally:
    server.stop()
