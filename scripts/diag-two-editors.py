"""The X-remount race does NOT reproduce in isolation. So what differs
in the full scan? The element list is collected ONCE — after the X press
remounts the editor, the scan re-resolves «سعر واحد» through the STABLE
PATH. If the path resolves to the WRONG instance (the SECOND ListingEditor
specimen's segmented button — «شرائح» mode — which is disabled/different),
the press hits a DIFFERENT button. Check: after the X press + remount,
does the old probe path still resolve to the FIRST editor's seg, or to
the second one? And does the second editor's seg answer a press?
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
          const editors = stages.filter(st => st.textContent.includes('أرسل للمراجعة') || st.textContent.includes('أرسل التعديل'));
          return editors.map((st, n) => ({
            n, x: !!st.querySelector('.mds-icon-button'),
            segs: [...st.querySelectorAll('.mds-segmented-segment')].map(b => b.textContent.trim()),
            head: (st.querySelector('h2, .mds-sheet-title')?.textContent || '').trim().slice(0, 20)
          }));
        }""")
        for x in r:
            print(x)
        # Probe the SECOND editor's «سعر واحد» — is it perhaps DISABLED there?
        r2 = page.evaluate("""() => {
          const stages = [...document.querySelectorAll('.lab-sheet-stage')];
          const editors = stages.filter(st => st.textContent.includes('أرسل'));
          const second = editors[1];
          if (!second) return {none: true};
          const seg = [...second.querySelectorAll('.mds-segmented-segment')].find(b => b.textContent.trim() === 'سعر واحد');
          if (!seg) return {noSeg: true};
          return {disabled: seg.disabled, cls: seg.className.toString().slice(0, 60)};
        }""")
        print('second editor seg:', r2)
finally:
    server.stop()
