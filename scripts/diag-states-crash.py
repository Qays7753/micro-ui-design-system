"""Diagnose the ds-states full-catalog crash: which element, which moment.

Runs the same interactive-element scan the gate runs (elementFromPoint at
center + :active/:disabled probes) but prints progress per element index,
flushing before each probe, so the last printed index is the killer. Uses
a plain launch (no gate harness) to see the raw browser behavior.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import DEFAULT_CONTEXT, LocalServer
from playwright.sync_api import sync_playwright
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        page = b.new_page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        els = page.evaluate("""() => {
          const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
          return [...document.querySelectorAll('button, a[href], input, select, textarea, [role=\\"button\\"]')]
            .filter(el => vis(el) && !el.disabled).length;
        }""")
        print(f'total interactive: {els}', flush=True)
        # replay the gate's exact loop with progress printing
        r = page.evaluate("""() => {
          const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
          const out = [];
          let i = 0;
          for (const el of document.querySelectorAll('button, a[href], input, select, textarea, [role=\\"button\\"]')) {
            if (!vis(el) || el.disabled) continue;
            i++;
            el.scrollIntoView({ block: 'center', inline: 'nearest' });
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
            document.elementFromPoint(cx, cy);
            out.push(i + '|' + el.tagName + '|' + (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 14));
          }
          return out;
        }""")
        print(f'scan complete, {len(r)} probed', flush=True)
        b.close()
        print('BROWSER-CLOSED-CLEAN', flush=True)
finally:
    server.stop()
