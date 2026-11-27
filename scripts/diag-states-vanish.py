"""Diagnose the ds-states vanish: lazy mounting? fixed overlays? section ids?"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html', wait_until='load', timeout=30000)
        page.wait_for_timeout(600)
        r = page.evaluate("""() => {
          const drc = document.querySelectorAll('.mds-delivery-request-card').length;
          const secs = [...document.querySelectorAll('section, [id]')]
            .filter(e => e.querySelector && e.querySelector('.mds-delivery-request-card'))
            .map(e => e.id || e.className.toString().slice(0,30));
          const fixed = [...document.querySelectorAll('*')]
            .filter(e => getComputedStyle(e).position === 'fixed')
            .map(e => (e.className||'').toString().slice(0,40));
          // empty-name interactives NOW (post freeze)
          const empty = [];
          for (const b of document.querySelectorAll('button, [role="button"]')) {
            const name = (b.getAttribute('aria-label') || b.textContent || '').trim();
            if (!name && b.offsetParent !== null) empty.push((b.className||'').toString().slice(0,50));
          }
          return {drc, secs: secs.slice(0,6), fixed: fixed.slice(0,5), empty: empty.slice(0,5)};
        }""")
        print(r)
finally:
    server.stop()
