"""Identify elements 40-48 by DOM context (class + section) — the early
replay2 failures the real gate does NOT see. If these carry a common
class (e.g. filter chips row), compare their press behavior with and
without the preceding TabBar/FilterChips presses.
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
          const pathOf = (el) => {
            const parts = [];
            let node = el;
            while (node && node.nodeType === 1 && node !== document.body) {
              if (node.id) { parts.unshift('#' + node.id); break; }
              let sel = node.tagName.toLowerCase();
              const parent = node.parentElement;
              if (parent) {
                const sibs = Array.from(parent.children).filter(c => c.tagName === node.tagName);
                if (sibs.length > 1) sel += ':nth-of-type(' + (sibs.indexOf(node) + 1) + ')';
              }
              parts.unshift(sel);
              node = parent;
            }
            return parts.join(' > ');
          };
          const els = Array.from(document.querySelectorAll('button, [role="button"]'))
            .filter(el => el.offsetParent !== null)
            .filter(el => !el.closest('[data-ds-exempt~="view-toggle"]'))
            .map((el, i) => ({i, text: (el.textContent || '').trim().slice(0, 16),
                              cls: el.className.toString().slice(0, 36),
                              sec: el.closest('section')?.id || '-'}));
          return els.filter(e => e.i >= 38 && e.i <= 49);
        }""")
        for x in r:
            print(x)
finally:
    server.stop()
