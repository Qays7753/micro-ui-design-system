"""After the X press + remount loop, does a fresh isolated press on the
segmented buttons and the arrows work? Press X (247), wait 600ms for the
remount to settle, then gate-press each of the remaining failing names.
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

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        # press the sheet's X (the remount trigger)
        page.evaluate("""() => {
          const els = Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'));
          const x = els[247];
          x.scrollIntoView({block: 'center'});
          const r = x.getBoundingClientRect();
          window.__xy = {x: r.x + r.width/2, y: r.y + r.height/2};
        }""")
        xy = page.evaluate("() => window.__xy")
        page.mouse.move(xy['x'], xy['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        page.mouse.up()
        # let the exit motion finish and the remount land
        page.wait_for_timeout(700)
        # now gate-press each failing name in its FIRST occurrence
        def press_text(name, occurrence=0):
            found = page.evaluate(f"""() => {{
              const els = [...document.querySelectorAll('button')].filter(b => (b.textContent || '').trim().slice(0, 20) === {name!r});
              const el = els[{occurrence}];
              if (!el) return null;
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              return {{x: r.x + r.width/2, y: r.y + r.height/2, sel: null}};
            }}""")
            if not found:
                return 'NOT FOUND'
            # tag it for snapshot
            page.evaluate(f"""() => {{
              const els = [...document.querySelectorAll('button')].filter(b => (b.textContent || '').trim().slice(0, 20) === {name!r});
              els[{occurrence}].setAttribute('data-diag-probe', '1');
            }}""")
            b = page.evaluate(SNAP, '[data-diag-probe="1"]')
            page.mouse.move(found['x'], found['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate(SNAP, '[data-diag-probe="1"]')
            page.mouse.up()
            page.evaluate("() => document.querySelectorAll('[data-diag-probe]').forEach(e => e.removeAttribute('data-diag-probe'))")
            return 'CHANGED' if (b is not None and a is not None and b != a) else 'UNCHANGED'
        for name in ['السابق', 'التالي', 'محتوى مضلل', 'سعر واحد', 'شرائح']:
            print(name, '->', press_text(name))
finally:
    server.stop()
