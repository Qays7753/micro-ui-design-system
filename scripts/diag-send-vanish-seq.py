"""Replay elements 256..270 in gate cadence and print, after each press,
whether «أرسل للمراجعة» (the first editor's send) is still resolvable
through its ORIGINAL probe id and its structural path. Find the exact
press that makes it vanish.
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

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(150)
        els = page.evaluate(BASE_JS)
        send_idx = next(e['i'] for e in els if e['text'] == 'أرسل للمراجعة')
        print('send index:', send_idx)
        for el in els:
            if el['i'] < send_idx - 8 or el['i'] > send_idx:
                continue
            arg = {'i': el['i'], 'path': el['path']}
            page.evaluate(STABLE_JS, arg)
            center = page.evaluate(CENTER_JS, arg)
            if center is None:
                print(f"[{el['i']}] «{el['text']}» gone before press", flush=True)
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
            page.evaluate(CLEANUP_JS)
            # after THIS press: can the send still be resolved?
            alive = page.evaluate(f"""() => {{
              let el = document.querySelector(`[data-ds-state-probe="{send_idx}"]`);
              if (!el) {{
                el = document.querySelector({els[send_idx]['path']!r});
                if (el) el.setAttribute('data-ds-state-probe', String({send_idx}));
              }}
              return !!el;
            }}""")
            print(f"[{el['i']}] «{el['text']}» pressed -> send alive: {alive}", flush=True)
            if not alive:
                break
finally:
    server.stop()
