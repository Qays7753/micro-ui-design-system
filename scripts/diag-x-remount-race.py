"""«سعر واحد/شرائح» (first ListingEditor specimen's segmented buttons)
fail only in the FULL scan. With per-press isolation now in the gate, no
overlay can cover them. Remaining suspect: the X press on the SAME
specimen (element right before them) remounts the editor via the honest
loop, and the gate's next-iteration STABLE (resolved through the probe
path) races the remount's ENTER transition — the press lands while the
sheet panel is transitioning, and SegmentedControl's press style is
masked by an ancestor transform mid-flight.

Reproduce: fresh page → gate-exact press of the FIRST ListingEditor's X
→ immediately (the gate's cadence) probe «سعر واحد» with the gate's
STABLE + press + snapshot, printing whether the panel was mid-transition
at press time.
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
        # locate the FIRST ListingEditor stage and its X + segmented button
        info = page.evaluate("""() => {
          const stages = [...document.querySelectorAll('.lab-sheet-stage')];
          const editor = stages.find(st => st.textContent.includes('أرسل للمراجعة'));
          if (!editor) return null;
          const x = editor.querySelector('.mds-icon-button');
          const seg = [...editor.querySelectorAll('button')].find(b => b.textContent.trim() === 'سعر واحد');
          x.setAttribute('data-diag-x', '1');
          seg.setAttribute('data-diag-seg', '1');
          return {has: true};
        }""")
        print('editor found:', bool(info))
        # press the X exactly like the gate (scroll, center, real mouse)
        c = page.evaluate("""() => {
          const el = document.querySelector('[data-diag-x]');
          el.scrollIntoView({block: 'center'});
          const r = el.getBoundingClientRect();
          return {x: r.x + r.width/2, y: r.y + r.height/2};
        }""")
        page.mouse.move(c['x'], c['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        page.mouse.up()
        # the gate's next-iteration cadence
        page.wait_for_timeout(80)
        # gate-exact probe of the (remounted) segmented button
        r = page.evaluate("""() => {
          const seg = document.querySelector('[data-diag-seg]') ||
            [...document.querySelectorAll('.mds-segmented-segment')].find(b => b.textContent.trim() === 'سعر واحد');
          if (!seg) return {gone: true};
          seg.setAttribute('data-diag-seg', '1');
          seg.scrollIntoView({block: 'center'});
          const rect = seg.getBoundingClientRect();
          const panel = seg.closest('.mds-sheet-panel');
          const anims = panel ? panel.getAnimations({subtree: true}).map(a => a.playState) : [];
          return {x: rect.x + rect.width/2, y: rect.y + rect.height/2, anims};
        }""")
        if r.get('gone'):
            print('seg gone after X press')
        else:
            print('panel anims at probe time:', r.get('anims'))
            b = page.evaluate("""() => {
              const el = document.querySelector('[data-diag-seg]');
              const st = getComputedStyle(el);
              return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
            }""")
            page.mouse.move(r['x'], r['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate("""() => {
              const el = document.querySelector('[data-diag-seg]');
              const st = getComputedStyle(el);
              return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
            }""")
            page.mouse.up()
            print('seg press after X:', 'CHANGED' if b != a else 'UNCHANGED — the X-remount race reproduced')
finally:
    server.stop()
