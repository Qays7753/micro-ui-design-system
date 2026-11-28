"""After the gate's press on see-all opens the sheet: do the sheet's own
rows come next in the scan (pressing one closes it), and do the LATER
stage buttons fail only while the sheet is open? Print the scan-order
texts around 39..50 and after pressing element 40 (first sheet row),
whether the fixed sheet is gone.
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
              return {i, text: (el.textContent || '').trim().slice(0, 18),
                      inFixedSheet: !!el.closest('.mds-sheet') && getComputedStyle(el.closest('.mds-sheet')).position === 'fixed'}; });
        }""")
        for e in els[36:52]:
            print(e)
        # press 39 (see-all), then press 40 (should be a sheet row)
        def press(i):
            c = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{i}"]`);
              if (!el) return null;
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              return {{x: r.x + r.width/2, y: r.y + r.height/2}};
            }}""")
            if c is None:
                return None
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            page.mouse.up()
            page.wait_for_timeout(250)
            return True
        press(39)
        state1 = page.evaluate("""() => !!document.querySelector('.mds-sheet[style*="position: fixed"], .mds-sheet') &&
          [...document.querySelectorAll('.mds-sheet')].some(sh => getComputedStyle(sh).position === 'fixed')""")
        print('after press 39, fixed sheet open:', state1)
        # now the sheet's rows: find buttons INSIDE the fixed sheet
        rows = page.evaluate("""() => {
          const out = [];
          for (const sh of document.querySelectorAll('.mds-sheet')) {
            if (getComputedStyle(sh).position !== 'fixed') continue;
            for (const b of sh.querySelectorAll('button, [role="button"]')) {
              if (b.offsetParent !== null) out.push({text: (b.textContent || '').trim().slice(0, 20), probe: b.getAttribute('data-ds-state-probe')});
            }
          }
          return out;
        }""")
        print('buttons inside the fixed sheet:', rows[:6])
finally:
    server.stop()
