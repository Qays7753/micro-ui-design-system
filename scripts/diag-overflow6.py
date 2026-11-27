"""Binary search: which lab-main child pushes body scrollWidth to 376?"""
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
          const secs = [...document.querySelectorAll('.lab-main > *, .lab-main section')];
          const results = [];
          const sw = () => document.body.scrollWidth;
          results.push({initial: sw(), n: secs.length});
          const was = secs.map(s => s.style.display);
          secs.forEach(s => s.style.display = 'none');
          results.push({allHidden: sw()});
          for (const s of secs) {
            s.style.display = '';
            const w = sw();
            if (w > 360) results.push({offender: (s.className || s.id || s.tagName).toString().slice(0,44), w});
            s.style.display = 'none';
          }
          secs.forEach((s, i) => s.style.display = was[i]);
          return results;
        }""")
        for x in r:
            print(x)
finally:
    server.stop()
