"""The failing set is exactly: gallery arrows (2) + report-sheet's four +
listing-editor's three. Between them pass: 247 and 252 (empty-text
buttons). Find what sections 247 and 252 belong to, and what makes the
THREE failing stages special. Suspect: these three stages each contain
an element the gate's DISABLED probe remounts (the probe sets
el.disabled = true — React re-renders and my specimens rebuild?), or:
these three stages are the ones whose LAST pressed button (the send)
starts the sheet's EXIT animation and the gate's STABLE wait catches
the REMOUNT (path re-resolution) — the fresh node's press lands while
the sheet is re-entering (opacity/transform mid-flight) so the computed
style change is masked by the running transition.
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
          const els = Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'))
            .map((el, i) => { el.setAttribute('data-ds-state-probe', i);
              return {i, text: (el.textContent || '').trim().slice(0, 14),
                      sec: el.closest('section')?.id || '-',
                      cls: el.className.toString().slice(0, 34)}; });
          return els.filter(e => e.i >= 244 && e.i <= 256);
        }""")
        for x in r:
            print(x)
finally:
    server.stop()
