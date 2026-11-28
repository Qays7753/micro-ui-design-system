"""16 object-row :disabled violations on chromium with the WIDE disabled
window. Measure the actual mechanism on ONE row, gate-exact:
1. press «درج الكاش...» (its :active opens the object sheet)
2. run isolation (should close it)
3. set disabled, sample at 60/140/200/240 cumulative, print each
Also print: does the row have a real :disabled rule AT ALL? (maybe
ObjectRow's restyle arrives through [aria-disabled] not :disabled, and
the earlier 60ms-only version passed because it snapshotted BEFORE the
sheet's scrim finished covering the row — i.e. the old pass was the
accident, and the wide window is the honest one exposing a REAL gap.)
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
        # the plain object-row garden (not the sheet specimen)
        r = page.evaluate("""() => {
          const rows = Array.from(document.querySelectorAll('button'))
            .filter(el => el.offsetParent !== null && el.textContent.includes('درج الكاش'))
            .map((el, i) => { el.setAttribute('data-diag', i);
              const sec = el.closest('section');
              return {i, sec: sec ? sec.id : '-', cls: el.className.toString().slice(0, 40)}; });
          return rows;
        }""")
        print('rows:', r[:3])
        # probe the first CATALOG-garden row (skip the sheet specimen's)
        target = next(x for x in r if x['sec'] == 'object-row')
        page.evaluate(f"""() => {{
          const el = document.querySelector('[data-diag="{target["i"]}"]');
          el.scrollIntoView({{block: 'center'}});
        }}""")
        page.wait_for_timeout(300)
        snap = """() => {
          const el = document.querySelector('[data-diag="%s"]');
          const st = getComputedStyle(el);
          return ['backgroundColor','color','borderTopColor','opacity','transform'].map(p => st[p]).join('|');
        }""" % target['i']
        base_style = page.evaluate(snap)
        # does it have a :disabled rule at all?
        rule = page.evaluate(f"""() => {{
          const el = document.querySelector('[data-diag="{target['i']}"]');
          el.disabled = true;
          return new Promise((res) => setTimeout(() => {{
            const st = getComputedStyle(el);
            res({{bg: st.backgroundColor, color: st.color}});
          }}, 250));
        }}""")
        print('row class:', target['cls'])
        print('base :', base_style[:100])
        print('after disabled=true (250ms):', rule)
        # WHAT does the stylesheet define for this class + :disabled?
        css = page.evaluate("""() => {
          let out = [];
          for (const sheet of document.styleSheets) {
            let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
            const walk = (list) => {
              for (const rule of list) {
                if (rule.selectorText && rule.selectorText.includes(':disabled') &&
                    rule.selectorText.includes('object')) out.push(rule.selectorText + ' {' + rule.style.cssText + '}');
                if (rule.cssRules) walk(rule.cssRules);
              }
            };
            walk(rules);
          }
          return out.slice(0, 6);
        }""")
        print('object :disabled rules:', css)
finally:
    server.stop()
