"""For each failing button: is its press point covered by the panel's OWN
sticky furniture (the ActionBar INSIDE the stage panel), i.e. the last
scrollable content can never clear the bar? Measure the button's center
vs the panel's scroll geometry at rest (no fixed sheet open).
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
          const names = ['السابق', 'التالي', 'محتوى مضلل', 'سعر غير صحيح', 'منتج مقلد',
                         'أرسل البلاغ', 'سعر واحد', 'شرائح', 'أرسل للمراجعة'];
          const out = [];
          for (const b of document.querySelectorAll('button')) {
            const label = (b.textContent || '').trim().slice(0, 20);
            if (!names.includes(label)) continue;
            b.scrollIntoView({block: 'center'});
            const rect = b.getBoundingClientRect();
            const cx = rect.x + rect.width/2, cy = rect.y + rect.height/2;
            const hit = document.elementFromPoint(cx, cy);
            const hitSelf = hit === b || b.contains(hit);
            // the scrolling panel this button lives in
            let panel = b.closest('.mds-sheet-panel, .mds-sheet-body');
            const pRect = panel ? panel.getBoundingClientRect() : null;
            // the panel's own action bar
            const bar = panel ? panel.querySelector('.mds-action-bar') : null;
            const bRect = bar ? bar.getBoundingClientRect() : null;
            out.push({label, hitSelf,
                      coveredBy: hitSelf ? '-' : hit.tagName + '.' + (hit.className || '').toString().slice(0, 30),
                      btnY: Math.round(cy),
                      panelBottom: pRect ? Math.round(pRect.bottom) : null,
                      barTop: bRect ? Math.round(bRect.top) : null,
                      barBottom: bRect ? Math.round(bRect.bottom) : null,
                      btnBottom: Math.round(rect.bottom)});
          }
          return out;
        }""")
        for x in r:
            print(x)
finally:
    server.stop()
