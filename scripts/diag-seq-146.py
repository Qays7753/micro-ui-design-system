"""[146] fails only after [144]/[145] ran before it (the transfer rows).
Print the FULL raw snapshot values of [146]'s disabled samples in the
exact sequence: probe [144], isolate, then probe [146] with raw values.
If the color stays 16,23,25 the restyle is somehow blocked; if the
values flip midway we see it.
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

def probe(page, el, verbose=False):
    arg = {'i': el['i'], 'path': el['path'], 'text': el['text'], 'sec': el.get('sec',''), 'tag': el['tag']}
    page.evaluate(STABLE_JS, arg)
    b = page.evaluate(SNAPSHOT_JS, arg)
    center = page.evaluate(CENTER_JS, arg)
    if center is None or b is None:
        return 'gone'
    page.mouse.move(center['x'], center['y'])
    page.mouse.down()
    page.wait_for_timeout(70)
    page.evaluate(SNAPSHOT_JS, arg)
    page.wait_for_timeout(80)
    page.wait_for_timeout(110)
    page.mouse.up()
    oa = page.evaluate(OVERLAYS_JS)
    if oa:
        stuck = page.evaluate(ISOLATE_JS)
        if verbose:
            print(f"  [{el['i']}] overlays after press: {oa} -> stuck: {stuck}")
        if not stuck:
            page.wait_for_timeout(150)
    page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`); if (el) el.disabled = true; }", arg)
    vals = []
    for ms in (60, 140, 200, 240):
        page.wait_for_timeout(ms)
        vals.append(page.evaluate(SNAPSHOT_JS, arg))
    page.evaluate("(args) => { let el = document.querySelector(`[data-ds-state-probe=\"${args.i}\"]`); if (el) el.disabled = false; }", arg)
    page.evaluate(CLEANUP_JS)
    ok = any(v is not None and v != b for v in vals)
    if verbose or not ok:
        print(f"  [{el['i']}] «{el['text'][:18]}» ok={ok}")
        print(f"    base: {b[:95]}")
        for n, v in enumerate(vals):
            print(f"    s{n}: {str(v)[:95]}")
    return ok

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(150)
        els = page.evaluate(BASE_JS)
        by_text = {e['i']: e for e in els}
        # the full sequence: 143,144,145 then 146
        for i in (143, 144, 145):
            r = probe(page, by_text[i], verbose=True)
        print('--- target 146 ---')
        r = probe(page, by_text[146], verbose=True)
finally:
    server.stop()
