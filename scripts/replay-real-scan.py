"""Everything I try in isolation PASSES. The full scan is the only place
«سعر واحد/شرائح» fail. Instead of guessing the difference, REPLAY the
real full scan but print every step around the failing elements. Use the
instrumented copy with isolation included: run the REAL gate loop from
element 0 with per-element progress prints, capture the exact base/active
snapshots of the failing two.
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
OVERLAYS_JS = SRC.split('OVERLAYS_JS = """')[1].split('"""')[0]
ISOLATE_JS = SRC.split('ISOLATE_JS = """')[1].split('"""')[0]
SNAP = """(args) => {
  let el = document.querySelector(`[data-ds-state-probe="${args.i}"]`);
  if (!el && args.path) {
    el = document.querySelector(args.path);
    if (el) el.setAttribute('data-ds-state-probe', String(args.i));
  }
  if (!el) return null;
  const st = getComputedStyle(el);
  return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
}"""

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(150)
        els = page.evaluate(BASE_JS)
        print('total:', len(els), flush=True)
        fail_at = []
        for el in els:
            arg = {'i': el['i'], 'path': el['path']}
            ob = page.evaluate(OVERLAYS_JS)
            page.evaluate(STABLE_JS, arg)
            b = page.evaluate(SNAP, arg)
            center = page.evaluate(CENTER_JS, arg)
            if center is None or b is None:
                print(f"[{el['i']}] «{el['text']}» gone", flush=True)
                continue
            page.mouse.move(center['x'], center['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            a = page.evaluate(SNAP, arg)
            page.mouse.up()
            if a is not None and a == b:
                print(f"*** [{el['i']}] «{el['text']}» ACTIVE-FAIL", flush=True)
                print(f"    base  = {b[:120]}", flush=True)
                print(f"    active= {a[:120]}", flush=True)
                fail_at.append(el['i'])
            # disabled probe
            if el['tag'] == 'button':
                page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                              "if (!el && args.path) { el = document.querySelector(args.path);"
                              "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                              "if (el) el.disabled = true; }", arg)
                page.wait_for_timeout(60)
                d = page.evaluate(SNAP, arg)
                page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                              "if (!el && args.path) { el = document.querySelector(args.path);"
                              "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                              "if (el) el.disabled = false; }", arg)
                if d is not None and d == b:
                    print(f"*** [{el['i']}] «{el['text']}» DISABLE-FAIL", flush=True)
                    fail_at.append(el['i'])
            # per-press isolation (the new logic)
            oa = page.evaluate(OVERLAYS_JS)
            if oa:
                stuck = page.evaluate(ISOLATE_JS)
                if stuck:
                    print(f"*** [{el['i']}] STUCK OVERLAY: {stuck}", flush=True)
                else:
                    page.wait_for_timeout(150)
            page.evaluate(CLEANUP_JS)
        print('SCAN DONE. fails:', fail_at, flush=True)
finally:
    server.stop()
