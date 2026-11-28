"""Find the FIRST press that leaves an open overlay: press elements from
the START of the scan (index 0) and check after each whether an overlay
exists. Print the first index that opens one, plus what the overlay is.
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
                      cls: el.className.toString().slice(0, 40)}; });
        }""")
        print('total:', len(els), flush=True)
        for e in els:
            k = e['i']
            c = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{k}"]`);
              if (!el) return null;
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              return {{x: r.x + r.width/2, y: r.y + r.height/2}};
            }}""")
            if c is None:
                continue
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            page.mouse.up()
            page.wait_for_timeout(250)
            state = page.evaluate("""() => {
              const scrim = document.querySelector('.mds-sheet-scrim');
              const open = scrim && getComputedStyle(scrim).display !== 'none'
                && getComputedStyle(scrim.closest('.mds-sheet')).position === 'fixed'
                && parseFloat(getComputedStyle(scrim).opacity || '1') > 0.5;
              // any FIXED sheet present at all (visible scrim or panel)
              let fixedSheet = null;
              for (const sh of document.querySelectorAll('.mds-sheet')) {
                if (getComputedStyle(sh).position === 'fixed') {
                  const r = sh.getBoundingClientRect();
                  if (r.width > 0 && r.height > 0) { fixedSheet = sh.getAttribute('aria-label') || sh.className.toString().slice(0, 40); break; }
                }
              }
              return {open, fixedSheet};
            }""")
            if state.get('fixedSheet'):
                print(f"[{k}] «{e['text']}» ({e['cls']}) -> FIXED SHEET: {state['fixedSheet']}", flush=True)
                break
        else:
            print('no fixed sheet opened through the whole scan', flush=True)
finally:
    server.stop()
