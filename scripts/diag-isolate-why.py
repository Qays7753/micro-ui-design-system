"""Why did the isolated full-catalog run STILL see the 12 market-stage
violations? Two suspects:
A) The opener press never leaves a dialog OPEN at isolate time — e.g. the
   sheet opens AND its own CLEANUP (which runs right after) closes it via
   the sheet's close BUTTON (the old path), so isolation never even fires,
   but something about the close/remount cycle breaks the NEXT elements.
B) The overlays ARE there but OVERLAYS_JS misses them (selector or the
   .lab-sheet-stage filter).
Replay the exact element sequence around the gallery arrows with the
gate's own loop INCLUDING CLEANUP_JS, printing the overlay set before and
after every press.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()

BASE_JS = open('tools/ds-gates/ds-states.py').read().split('BASE_JS = """')[1].split('"""')[0]
STABLE_JS = open('tools/ds-gates/ds-states.py').read().split('STABLE_JS = """')[1].split('"""')[0]
CENTER_JS = open('tools/ds-gates/ds-states.py').read().split('CENTER_JS = """')[1].split('"""')[0]
CLEANUP_JS = open('tools/ds-gates/ds-states.py').read().split('CLEANUP_JS = """')[1].split('"""')[0]
OVERLAYS_JS = open('tools/ds-gates/ds-states.py').read().split('OVERLAYS_JS = """')[1].split('"""')[0]

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        els = page.evaluate(BASE_JS)
        print('total:', len(els), flush=True)
        # find the window: press everything from 39 (a see-all) up to the
        # gallery arrows, with the gate's full per-element cycle
        arrow_idx = next(e['i'] for e in els if e['text'] == 'السابق')
        start = max(0, arrow_idx - 10)
        for e in els:
            if not (start <= e['i'] <= arrow_idx):
                continue
            arg = {'i': e['i'], 'path': e['path']}
            ob = page.evaluate(OVERLAYS_JS)
            page.evaluate(STABLE_JS, arg)
            base_snap = page.evaluate(
                "(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                "if (!el && args.path) { el = document.querySelector(args.path);"
                "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                "if (!el) return null; const st = getComputedStyle(el);"
                "return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|'); }", arg)
            center = page.evaluate(CENTER_JS, arg)
            if center is None or base_snap is None:
                print(f"[{e['i']}] «{e['text']}» gone", flush=True)
                continue
            page.mouse.move(center['x'], center['y'])
            page.mouse.down()
            page.wait_for_timeout(120)
            active = page.evaluate(
                "(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                "if (!el && args.path) { el = document.querySelector(args.path);"
                "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                "if (!el) return null; const st = getComputedStyle(el);"
                "return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|'); }", arg)
            page.mouse.up()
            changed = active is not None and active != base_snap
            oa = page.evaluate(OVERLAYS_JS)
            print(f"[{e['i']}] «{e['text']}» changed={changed} | overlays before={len(ob)} after={len(oa)}", flush=True)
            page.evaluate(CLEANUP_JS)
        print('done', flush=True)
finally:
    server.stop()
