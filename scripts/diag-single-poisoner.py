"""Zero overlays ANYWHERE and «السابق» still fails at [225] with no
sheet involved. So the poison is NOT an overlay at all — it's inside the
press sequence itself. [220] «طحين أبيض 50 كغ2.500» is a ListingCard —
ITS press maybe triggers a state change that remounts/locks the GALLERY
specimen right after it (the gallery is the specimen NEXT to it in the
same section). Bisect: fresh page, press ONLY [220], then probe «السابق».
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
        # Fresh page: press a SINGLE predecessor, then probe the arrow.
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
            if c is None:
                return 'gone'
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
        # bisect over predecessors 210..224
        for k in range(210, 225):
            # fresh reload for a clean slate each time? No — cumulative is
            # the real question. Press k alone (others not pressed), probe.
            r = press(k)
            status = probe_arrow() if r else 'gone'
            print(f'after pressing [{k}] «{next((e["text"] for e in els if e["i"] == k), "?")}»: arrow {status}', flush=True)
finally:
    server.stop()
