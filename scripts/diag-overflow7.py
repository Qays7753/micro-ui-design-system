"""Measure the driver-job card container and its offset parents."""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=30000)
        page.wait_for_timeout(400)
        r = page.evaluate("""() => {
          const sec = document.querySelector('#driver-job-card');
          document.querySelectorAll('.lab-main section').forEach(s => { if (s !== sec) s.style.display = 'none'; });
          const card = sec.querySelector('.mds-driver-job');
          const cr = card.getBoundingClientRect();
          const cs = getComputedStyle(card);
          const out = {cardW: cr.width, cardLeft: cr.left, cardRight: cr.right,
                       pad: cs.padding, margin: cs.margin, boxSizing: cs.boxSizing};
          // measure the lab-row and lab-section boxes too
          let n = card.parentElement;
          const chain = [];
          for (let i = 0; i < 4 && n; i++) {
            const b = n.getBoundingClientRect();
            const s = getComputedStyle(n);
            chain.push({cls: (n.className||'').toString().slice(0,30), w: Math.round(b.width), left: Math.round(b.left), right: Math.round(b.right), pad: s.padding, margin: s.margin});
            n = n.parentElement;
          }
          out.chain = chain;
          document.querySelectorAll('.lab-main section').forEach(s => s.style.display = '');
          return out;
        }""")
        print(r)
finally:
    server.stop()
