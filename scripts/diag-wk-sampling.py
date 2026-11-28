"""WebKit full-scan-only failure of the SELECTED segment. One measurement
to split the world cleanly: in the FULL-scan cadence (many presses
before), press «سعر واحد» and sample its background at 0/60/120/240/400ms
while held. If bg flips to surface-pressed LATE, the gate's single 120ms
snapshot is too early (WebKit starts the transition late in a heavy
page); if it never flips, the press itself is not activating.
Run a REDUCED scan first (press everything up to 263 like the gate) then
sample. ~7 min on webkit is too slow, so press only a fast subset that
still poisons: from the last run the poison is somewhere in 0..263; the
cheapest reproduction is the gate's own full cadence on the LAST 40
elements (224..263: the listing cards + report sheet before the editor)
— my earlier chromium bisect showed the poison survives that window.
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
  return st.backgroundColor;
}"""

try:
    with browser_session('webkit') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(150)
        els = page.evaluate(BASE_JS)
        seg_idx = next(e['i'] for e in els if e['text'] == 'سعر واحد')
        # press the 40 elements before the segment, gate cadence
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
        # now the sampling press on the segment
        arg = {'i': seg_idx, 'path': els[seg_idx]['path']}
        page.evaluate(STABLE_JS, arg)
        center = page.evaluate(CENTER_JS, arg)
        b = page.evaluate(SNAP, arg)
        page.mouse.move(center['x'], center['y'])
        page.mouse.down()
        samples = {}
        for ms in (60, 120, 240, 400):
            page.wait_for_timeout(ms - (60 if ms == 120 else (0 if ms == 60 else (120 if ms == 240 else 240))))
            samples[ms] = page.evaluate(SNAP, arg)
        page.mouse.up()
        print('base  :', b)
        print('samples:', samples)
        flips = [ms for ms, v in samples.items() if v != b]
        print('VERDICT:', f'flips at {flips} — gate 120ms too early' if flips else 'NEVER flips in this window — press not landing')
finally:
    server.stop()
