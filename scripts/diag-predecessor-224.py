"""The arrow NEVER changes even with NO predecessor pressed?! But the
window-clamped run (elements 244-256 only) passed clean. Difference: in
the clamped run, elements BELOW 244 were never pressed... and here
nothing is pressed and the arrow STILL fails. So the arrow's own press
fails on a FRESH page when pressed DIRECTLY after page load with the
STABLE wait — but the clamped run pressed earlier elements first.

Wait — the clamped run pressed 244-256 in order: 244,245(arrows)... and
the arrows PASSED there. Here with NOTHING pressed, the arrow FAILS.
Something earlier in the CLAMPED run made the arrows pass! 244 was
pressed there («مزائر يرى» ListingCard). Test: fresh page → press 244
(the listing card right before the gallery) → probe arrow.
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
              return {i, text: (el.textContent || '').trim().slice(0, 16)}; });
        }""")
        arrow_idx = next(e['i'] for e in els if e['text'] == 'السابق')
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
            page.wait_for_timeout(200)
            return True
        def probe_arrow():
            c = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{arrow_idx}"]`);
              if (!el) return null;
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              return {{x: r.x + r.width/2, y: r.y + r.height/2}};
            }}""")
            b = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{arrow_idx}"]`);
              const st = getComputedStyle(el);
              return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
            }}""")
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{arrow_idx}"]`);
              const st = getComputedStyle(el);
              return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
            }}""")
            page.mouse.up()
            page.wait_for_timeout(150)
            return 'CHANGED' if b != a else 'UNCHANGED'
        # 1) with the immediate predecessor (224 = the last ListingCard) pressed
        press(224)
        print('after [224] (immediate predecessor):', probe_arrow())
finally:
    server.stop()
