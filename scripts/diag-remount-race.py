"""Reproduce the gate's EXACT timing: press X (the sheet's close), then
press the segmented button IMMEDIATELY (the gate's next iteration is
~300ms later), with the gate's STABLE wait on the NEW node resolved via
path. See whether the press lands during the enter transition.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()

SNAP = """(sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const st = getComputedStyle(el);
  return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
    .map(p => st[p]).join('|');
}"""

STABLE = """(sel) => {
  const el = document.querySelector(sel);
  if (!el) return false;
  const t0 = performance.now();
  return new Promise((resolve) => {
    const check = () => {
      const nodes = [];
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) nodes.push(n);
      const anims = nodes.flatMap(n => (n.getAnimations ? n.getAnimations({subtree: true}) : []));
      if (!anims.some(a => a.playState === 'running') || performance.now() - t0 > 800) resolve(true);
      else setTimeout(check, 40);
    };
    check();
  });
}"""

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        # press the X inside the NEW listing editor specimen (first one)
        page.evaluate("""() => {
          const stages = [...document.querySelectorAll('.lab-sheet-stage')];
          const editorStage = stages.find(st => st.querySelector('.mds-listing-editor') || st.textContent.includes('أرسل للمراجعة'));
          const x = editorStage.querySelector('.mds-icon-button');
          x.scrollIntoView({block: 'center'});
          const r = x.getBoundingClientRect();
          window.__xy = {x: r.x + r.width/2, y: r.y + r.height/2};
        }""")
        xy = page.evaluate("() => window.__xy")
        page.mouse.move(xy['x'], xy['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        page.mouse.up()
        page.wait_for_timeout(50)  # the gate's next-iteration latency
        # immediately gate-press the first segmented button of the remounted editor
        info = page.evaluate("""() => {
          const seg = [...document.querySelectorAll('.mds-segmented-segment')].find(b => b.textContent.trim() === 'سعر واحد');
          if (!seg) return null;
          seg.setAttribute('data-diag-probe', '1');
          seg.scrollIntoView({block: 'center'});
          const r = seg.getBoundingClientRect();
          return {x: r.x + r.width/2, y: r.y + r.height/2,
                  panelAnim: (() => { const p = seg.closest('.mds-sheet-panel');
                    return p ? (p.getAnimations({subtree: true}).map(a => a.playState).join(',')) : 'none'; })()};
        }""")
        print('seg found:', bool(info), '| panel anims at press time:', info.get('panelAnim') if info else '-')
        if info:
            page.evaluate(STABLE, '[data-diag-probe="1"]')
            b = page.evaluate(SNAP, '[data-diag-probe="1"]')
            page.mouse.move(info['x'], info['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate(SNAP, '[data-diag-probe="1"]')
            page.mouse.up()
            print('seg press:', 'CHANGED' if b != a else 'UNCHANGED — timing race reproduced')
finally:
    server.stop()
