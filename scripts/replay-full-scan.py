"""Full gate replay with per-element progress: run the EXACT gate loop
(BASE, STABLE, CENTER, press, SNAPSHOT, disabled probe) over all 273
elements, printing each index + text BEFORE probing it, so the first
failing element's identity and its predecessor are both known.
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
    return {i, path: pathOf(el), tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 20)};
  });
}"""

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        els = page.evaluate(BASE_JS)
        print(f'total {len(els)}', flush=True)
        for e in els:
            arg = {"i": e['i'], "path": e['path']}
            # STABLE wait exactly like the gate (ancestor-chain animations)
            page.evaluate('''async (args) => {
              let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
              if (!el && args.path) { el = document.querySelector(args.path);
                if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }
              if (!el) return false;
              const t0 = performance.now();
              while (performance.now() - t0 < 800) {
                const nodes = [];
                for (let n = el; n && n !== document.documentElement; n = n.parentElement) nodes.push(n);
                const anims = nodes.flatMap(n => (n.getAnimations ? n.getAnimations({subtree: true}) : []));
                if (!anims.some(a => a.playState === 'running')) return true;
                await new Promise(r => setTimeout(r, 40));
              }
              return true;
            }''', arg)
            # center
            c = page.evaluate("""(args) => {
              let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
              if (!el && args.path) { el = document.querySelector(args.path);
                if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }
              if (!el) return null;
              el.scrollIntoView({block: 'center'});
              const r = el.getBoundingClientRect();
              return {x: r.x + r.width/2, y: r.y + r.height/2};
            }""", arg)
            if c is None:
                print(f"[{e['i']}] «{e['text']}» NO CENTER", flush=True)
                continue
            base_snap = page.evaluate("""(args) => {
              let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
              if (!el) return null;
              const st = getComputedStyle(el);
              return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
                .map(p => st[p]).join('|');
            }""", arg)
            if base_snap is None:
                print(f"[{e['i']}] «{e['text']}» GONE", flush=True)
                continue
            page.mouse.move(c['x'], c['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            active_snap = page.evaluate("""(args) => {
              let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
              if (!el) return null;
              const st = getComputedStyle(el);
              return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
                .map(p => st[p]).join('|');
            }""", arg)
            page.mouse.up()
            if active_snap is None:
                print(f"[{e['i']}] «{e['text']}» GONE MID-PRESS", flush=True)
                continue
            if active_snap == base_snap:
                print(f"[{e['i']}] «{e['text']}» *** ACTIVE-FAIL", flush=True)
            # disabled probe (buttons only) — matches the gate
            if e['tag'] == 'button':
                page.evaluate("""(args) => { let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
                  if (!el && args.path) { el = document.querySelector(args.path);
                    if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }
                  if (el) el.disabled = true; }""", arg)
                page.wait_for_timeout(60)
                dis_snap = page.evaluate("""(args) => {
                  let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
                  if (!el) return null;
                  const st = getComputedStyle(el);
                  return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
                    .map(p => st[p]).join('|');
                }""", arg)
                page.evaluate("""(args) => { const el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
                  if (el) el.disabled = false; }""", arg)
                if dis_snap is not None and dis_snap == base_snap:
                    print(f"[{e['i']}] «{e['text']}» *** DISABLED-FAIL", flush=True)
        print('SCAN COMPLETE', flush=True)
finally:
    server.stop()
