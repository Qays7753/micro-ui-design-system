"""Bisect the poisoner: press elements one by one from index prev-20 to
prev-1; after each press, check whether an OVERLAY (fixed sheet/scrim)
exists that covers the gallery arrows' center. Print the first index
whose press leaves a covering overlay.
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
        prev_idx = next(e['i'] for e in els if e['text'] == 'السابق')
        print('prev idx:', prev_idx)
        for k in range(prev_idx - 20, prev_idx):
            e = els[k]
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
            page.wait_for_timeout(300)
            # is there now a fixed overlay covering the gallery arrows?
            probe = page.evaluate(f"""() => {{
              const el = document.querySelector(`[data-ds-state-probe="{prev_idx}"]`);
              if (!el) return {{gone: true}};
              el.scrollIntoView({{block: 'center'}});
              const r = el.getBoundingClientRect();
              const cx = r.x + r.width/2, cy = r.y + r.height/2;
              const hit = document.elementFromPoint(cx, cy);
              const covered = hit && hit !== el && !el.contains(hit);
              return {{covered, by: covered ? hit.tagName + '.' + (hit.className || '').toString().slice(0, 50) : '-',
                       overlayOpen: !!document.querySelector('.mds-sheet-scrim:not([style*="display: none"])')}};
            }}""")
            mark = ' <<< POISONER' if probe.get('covered') else ''
            print(f"[{k}] «{e['text']}» -> {probe}{mark}", flush=True)
            if probe.get('covered'):
                break
finally:
    server.stop()
