"""The FULL scan fails ONLY [264] «سعر واحد» and [265] «شرائح» — with
base=WHITE (selected) for 264 and base=TRANSPARENT for 265 — and NO
change when pressed. No overlay recorded. The editor has TWO specimens;
[264]/[265] are in the FIRST (عرض جديد). In my isolated tests the first
specimen's segs answered presses... but WAIT: in the full scan, elements
BEFORE them (the first editor's X and its other buttons) were pressed.
The X press → remount (key change) → the specimen's state RESETS: mode
goes back to 'single' (سعر واحد SELECTED — white capsule) and the scan's
path-based re-resolution may now match the SECOND editor's seg...

Simplest direct question: after the full-scan presses up to 263, print
which DOM node index 264/265 resolve to (which section, which editor
instance, its state), and whether an ancestors' hover pointer sits on it.
Run the full scan UP TO 263, then STOP and dump the resolved nodes.
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

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(150)
        els = page.evaluate(BASE_JS)
        # run the scan up to 263 inclusive
        for el in els:
            if el['i'] > 263:
                break
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
                              "if (!el && args.path) { el = document.querySelector(args.path);"
                              "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                              "if (el) el.disabled = true; }", arg)
                page.wait_for_timeout(60)
                page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`);"
                              "if (!el && args.path) { el = document.querySelector(args.path);"
                              "if (el) el.setAttribute('data-ds-state-probe', String(args.i)); }"
                              "if (el) el.disabled = false; }", arg)
            oa = page.evaluate(OVERLAYS_JS)
            if oa:
                page.evaluate(ISOLATE_JS)
                page.wait_for_timeout(150)
            page.evaluate(CLEANUP_JS)
        # dump the resolved 264/265 nodes
        for idx in (264, 265):
            r = page.evaluate(f"""() => {{
              let el = document.querySelector(`[data-ds-state-probe="{idx}"]`);
              const byPath = document.querySelector({els[idx]['path']!r});
              const node = el || byPath;
              if (!node) return {{idx, gone: true}};
              const rect = node.getBoundingClientRect();
              const cx = rect.x + rect.width/2, cy = rect.y + rect.height/2;
              const hit = document.elementFromPoint(cx, cy);
              return {{
                idx: {idx},
                text: node.textContent.trim().slice(0, 14),
                sec: node.closest('section')?.id,
                stageIndex: [...document.querySelectorAll('.lab-sheet-stage')].indexOf(node.closest('.lab-sheet-stage')),
                selected: node.className.includes('--selected'),
                hitSelf: hit === node || node.contains(hit),
                hit: (hit ? hit.tagName + '.' + (hit.className || '').toString().slice(0, 30) : 'none'),
                pointerOnIt: document.querySelector(':hover') === node
              }};
            }}""")
            print(r, flush=True)
finally:
    server.stop()
