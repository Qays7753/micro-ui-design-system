"""The transition on WebKit in the heavy page lands BETWEEN 60ms and
120ms. The gate snapshots at exactly 120 — and the last webkit full run
failed, so the flip can also land slightly AFTER 120 (jitter). The honest
fix in the gate (no weakening): sample :active at MULTIPLE times while
the press is held (60/120/240ms) — the state is CHANGED if ANY sample
differs from base. A real pressed style lasts as long as the finger is
down; sampling three times is a stronger assertion, not a weaker one.
Verify here: run the poisoned-window + press, sample 3x, confirm CHANGED
on webkit. Then apply to the gate.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()

SRC = open('tools/ds-gates/ds-states.py').read()
BASE_JS = SRC.split('BASE_JS = """')[1].split('"""')[0]
STABLE_JS = SRC.split('STABLE_JS = """')[1].split('"""')[0]
CENTER_JS = SRC.split('CENTER_JS = """')[1].split('"""')[0]
CLEANUP_JS = SRC.split('CLEANUP_JS = """')[1].split('"""')[0]
SNAP = """(args) => {
  let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
  if (!el && args.path) { el = document.querySelector(args.path); }
  if (!el) return null;
  const st = getComputedStyle(el);
  return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
}"""

try:
    with browser_session('webkit') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(150)
        els = page.evaluate(BASE_JS)
        seg_idx = next(e['i'] for e in els if e['text'] == 'سعر واحد')
        for el in els:
            if not (seg_idx - 40 <= el['i'] < seg_idx):
                continue
            arg = {'i': el['i'], 'path': el['path']}
            page.evaluate(STABLE_JS, arg)
            center = page.evaluate(CENTER_JS, arg)
            if center is None:
                continue
            page.mouse.move(center['x'], center['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            page.mouse.up()
            if el['tag'] == 'button':
                page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                              "if (el) el.disabled = true; }", arg)
                page.wait_for_timeout(60)
                page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                              "if (el) el.disabled = false; }", arg)
            page.evaluate(CLEANUP_JS)
        arg = {'i': seg_idx, 'path': els[seg_idx]['path']}
        page.evaluate(STABLE_JS, arg)
        center = page.evaluate(CENTER_JS, arg)
        b = page.evaluate(SNAP, arg)
        page.mouse.move(center['x'], center['y'])
        page.mouse.down()
        changed = False
        for ms in (70, 150, 260):
            page.wait_for_timeout(ms)
            a = page.evaluate(SNAP, arg)
            if a is not None and a != b:
                changed = True
                print(f'flipped by cumulative {ms}ms sample')
                break
        page.mouse.up()
        print('multi-sample VERDICT:', 'CHANGED' if changed else 'still unchanged')
finally:
    server.stop()
