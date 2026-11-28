"""Find WHICH prior button poisons the chip probe: replay the gate's
scan for the 6 buttons that precede «محتوى مضلل» in DOM order, then
probe the chip exactly as the gate does. If the chip fails only after
certain predecessors, we see which.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()

BASE_JS = """() => {
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
  .map((el, i) => {
    el.setAttribute('data-ds-state-probe', i);
    return {i, path: pathOf(el), text: (el.textContent || '').trim().slice(0, 20)};
  });
}"""

SNAP = """(i) => {
  const el = document.querySelector(`[data-ds-state-probe="${i}"]`);
  if (!el) return null;
  const st = getComputedStyle(el);
  return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
    .map(p => st[p]).join('|');
}"""

CENTER = """(i) => {
  const el = document.querySelector(`[data-ds-state-probe="${i}"]`);
  if (!el) return null;
  el.scrollIntoView({block: 'center'});
  const r = el.getBoundingClientRect();
  return {x: r.x + r.width/2, y: r.y + r.height/2};
}"""

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        els = page.evaluate(BASE_JS)
        target_idx = next(i for i, e in enumerate(els) if e['text'] == 'محتوى مضلل')
        print(f'target index {target_idx} of {len(els)}')
        # replay presses for the window of predecessors before the target
        window_start = max(0, target_idx - 6)
        for k in range(window_start, target_idx):
            e = els[k]
            c = page.evaluate(CENTER, e['i'])
            if c is None:
                print(f'  [{k}] «{e["text"]}» — no center (skipped)')
                continue
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            page.mouse.up()
            page.wait_for_timeout(40)
            print(f'  pressed [{k}] «{e["text"]}»')
        # NOW probe the target exactly as the gate does
        c = page.evaluate(CENTER, els[target_idx]['i'])
        base_snap = page.evaluate(SNAP, els[target_idx]['i'])
        page.mouse.move(c['x'], c['y'])
        page.mouse.down()
        page.wait_for_timeout(120)
        active_snap = page.evaluate(SNAP, els[target_idx]['i'])
        page.mouse.up()
        changed = base_snap != active_snap
        print('target base  :', (base_snap or 'NULL')[:100])
        print('target active:', (active_snap or 'NULL')[:100])
        print('RESULT:', 'CHANGED (passes in sequence too)' if changed else 'UNCHANGED — sequence-poisoned')
finally:
    server.stop()
