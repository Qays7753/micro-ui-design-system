"""Which button pressed right before «السابق» (gallery) opens an OVERLAY
that then covers the gallery arrows? Press each of the 8 predecessors in
gate order (WITH the gate's STABLE waits) and after each press, check
whether «السابق» still receives its own press.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()

PROBE_JS = """(i) => {
  const el = document.querySelector(`[data-ds-state-probe="${i}"]`);
  if (!el) return null;
  el.scrollIntoView({block: 'center'});
  const r = el.getBoundingClientRect();
  return {x: r.x + r.width/2, y: r.y + r.height/2};
}"""
SNAP_JS = """(i) => {
  const el = document.querySelector(`[data-ds-state-probe="${i}"]`);
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
        # collect like the gate, find gallery prev index
        els = page.evaluate("""() => {
          const pathOf = (el) => {
            const parts = [];
            let node = el;
            while (node && node.nodeType === 1 && node !== document.body) {
              if (node.id) { parts.unshift('#' + node.id); break; }
              let sel = node.tagName.toLowerCase();
              const parent = node.parentElement;
              if (parent) {
                const sibs = Array.from(parent.children).filter(c => c.tagName === node.tagName);
                if (sibs.length > 1) sel += ':nth-of-type(' + (sibs.indexOf(node) + 1) + ')';
              }
              parts.unshift(sel);
              node = parent;
            }
            return parts.join(' > ');
          };
          return Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'))
            .map((el, i) => { el.setAttribute('data-ds-state-probe', i);
              return {i, text: (el.textContent || '').trim().slice(0, 16), cls: el.className.toString().slice(0, 30)}; });
        }""")
        prev_idx = next(e['i'] for e in els if e['text'] == 'السابق')
        print('gallery prev index:', prev_idx)
        # press predecessors from prev_idx-8 .. prev_idx-1 one at a time,
        # and after each, test whether prev still changes on press
        for k in range(prev_idx - 8, prev_idx):
            e = els[k]
            c = page.evaluate(PROBE_JS, k)
            if c is None:
                continue
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            page.mouse.up()
            page.wait_for_timeout(250)
            # now probe prev exactly like the gate
            c2 = page.evaluate(PROBE_JS, prev_idx)
            if c2 is None:
                print(f'  after [{k}] «{e["text"]}»: prev GONE')
                continue
            b = page.evaluate(SNAP_JS, prev_idx)
            page.mouse.move(c2['x'], c2['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate(SNAP_JS, prev_idx)
            page.mouse.up()
            page.wait_for_timeout(120)
            status = 'ok' if (b is not None and a is not None and b != a) else 'POISONED'
            print(f'  after [{k}] «{e["text"]}»: prev press {status}')
finally:
    server.stop()
