"""FINAL diagnosis: replay the gate's EXACT loop but ONLY for object-row
garden buttons (press predecessors first is NOT needed if the poison is
per-element). For each failing row, print every disabled sample's raw
value and whether evaluate ever returned None. This distinguishes
'restyle never lands' from 'evaluate fails / returns None mid-probe'.
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
SNAPSHOT_JS = SRC.split('SNAPSHOT_JS = """')[1].split('"""')[0] % "['backgroundColor','color','borderTopColor','opacity','transform']"

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(150)
        els = page.evaluate(BASE_JS)
        # only object-row garden buttons
        rows = [e for e in els if 'درج الكاش' in e['text'] or 'الحساب البنكي' in e['text'] or 'المحفظة' in e['text']]
        print('rows to probe:', len(rows))
        for el in rows[:4]:
            arg = {'i': el['i'], 'path': el['path'], 'text': el['text'], 'sec': el.get('sec',''), 'tag': el['tag']}
            page.evaluate(STABLE_JS, arg)
            b = page.evaluate(SNAPSHOT_JS, arg)
            center = page.evaluate(CENTER_JS, arg)
            if center is None or b is None:
                print(f"[{el['i']}] GONE at start"); continue
            page.mouse.move(center['x'], center['y'])
            page.mouse.down()
            active = None
            for ms in (70, 80, 110):
                page.wait_for_timeout(ms)
                active = page.evaluate(SNAPSHOT_JS, arg)
                if active is not None and active != b:
                    break
            page.mouse.up()
            # isolation (the new order: BEFORE disabled)
            oa = page.evaluate(OVERLAYS_JS)
            if oa:
                stuck = page.evaluate(ISOLATE_JS)
                if stuck:
                    print(f"[{el['i']}] STUCK: {stuck}")
                else:
                    page.wait_for_timeout(150)
            # disabled multi-sample with RAW prints
            page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`); if (el) el.disabled = true; }", arg)
            samples = []
            for ms in (60, 140, 200, 240):
                page.wait_for_timeout(ms)
                v = page.evaluate(SNAPSHOT_JS, arg)
                samples.append('None' if v is None else ('DIFF' if v != b else 'same'))
            page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`); if (el) el.disabled = false; }", arg)
            print(f"[{el['i']}] «{el['text'][:16]}» disabled samples: {samples}")
            page.evaluate(CLEANUP_JS)
finally:
    server.stop()
