"""THE decisive measurement: is the object-row's :disabled color restyle
BLOCKED while the object sheet («طلب 1175») is open over it?
Sequence: press the row (opens the sheet) -> SKIP closing -> set
disabled -> sample. If color stays 16,23,25 with the sheet open but
flips to 138,149,155 after the sheet closes, the gate's disabled probe
MUST run with the sheet closed — and the isolation IS running before
disabled in the current gate... unless the sheet CLOSE ITSELF takes
longer than the probe (exit motion 240ms + wait), or the isolation's
Escape works and something re-opens... Measure everything.
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
        # press -> sheet opens
        page.mouse.move(row['x'], row['y'])
        page.mouse.down()
        page.wait_for_timeout(260)
        page.mouse.up()
        page.wait_for_timeout(200)
        sheet_open = page.evaluate("""() => {
          const vis = (el) => el.getClientRects().length > 0;
          return Array.from(document.querySelectorAll('[role="dialog"]'))
            .filter(el => el.closest('.lab-sheet-stage') === null && vis(el)).length;
        }""")
        # disabled WITH the sheet open
        page.evaluate("() => { document.querySelector('[data-diag=\"r\"]').disabled = true; }")
        page.wait_for_timeout(300)
        with_sheet = page.evaluate(snap)
        # now close via Escape
        page.evaluate("() => document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))")
        page.wait_for_timeout(500)
        after_esc = page.evaluate("""() => {
          const vis = (el) => el.getClientRects().length > 0;
          return Array.from(document.querySelectorAll('[role="dialog"]'))
            .filter(el => el.closest('.lab-sheet-stage') === null && vis(el)).length;
        }""")
        still_disabled = page.evaluate(snap)
        page.evaluate("() => { document.querySelector('[data-diag=\"r\"]').disabled = false; }")
        print('sheets open after press:', sheet_open)
        print('base        :', base_style[:90])
        print('disabled+sheet open:', with_sheet[:90])
        print('sheets after Escape:', after_esc)
        print('after Escape (still disabled):', still_disabled[:90])
finally:
    server.stop()
