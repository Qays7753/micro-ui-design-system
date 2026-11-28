"""Measure precisely: inside a lab-sheet-stage specimen, with sticky bar,
does the component's own body padding-block-end (from :has(> .mds-action-bar))
give enough clearance for the LAST interactive element above the bar to
clear the bar at MAX scroll? Print: body scrollHeight, clientHeight, the
bar's top y at max scroll, and the last element above the bar's bottom y.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        r = page.evaluate("""() => {
          const stages = [...document.querySelectorAll('.lab-sheet-stage')];
          const editor = stages.find(st => st.textContent.includes('أرسل للمراجعة'));
          const body = editor.querySelector('.mds-sheet-body');
          const bar = editor.querySelector('.mds-action-bar');
          // scroll the body to the BOTTOM (max scroll) — the worst case
          body.scrollTop = body.scrollHeight;
          // then scroll the segmented INTO VIEW like the gate does
          const seg = [...editor.querySelectorAll('.mds-segmented-segment')].find(b => b.textContent.trim() === 'سعر واحد');
          seg.scrollIntoView({block: 'center'});
          const segR = seg.getBoundingClientRect();
          const barR = bar.getBoundingClientRect();
          const bodyR = body.getBoundingClientRect();
          const cx = segR.x + segR.width/2, cy = segR.y + segR.height/2;
          const hit = document.elementFromPoint(cx, cy);
          return {
            bodyScrollTop: Math.round(body.scrollTop),
            bodyScrollHeight: body.scrollHeight,
            bodyClientHeight: body.clientHeight,
            segTop: Math.round(segR.top), segBottom: Math.round(segR.bottom),
            barTop: Math.round(barR.top), barBottom: Math.round(barR.bottom),
            bodyBottom: Math.round(bodyR.bottom),
            hitSelf: hit === seg || seg.contains(hit),
            hit: hit.tagName + '.' + (hit.className || '').toString().slice(0, 40)
          };
        }""")
        for k, v in r.items():
            print(f'{k}: {v}')
finally:
    server.stop()
