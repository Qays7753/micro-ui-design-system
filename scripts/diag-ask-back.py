"""Measure the ask-button specimen vs the lab's own back key (m23 leftover)."""
import sys, os
sys.path.insert(0, os.path.join(os.getcwd(), 'tools', 'ds-gates'))
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=30000)
        page.wait_for_timeout(500)
        r = page.evaluate("""() => {
          const ask = document.querySelector('#ask-button button');
          const ab = ask.getBoundingClientRect();
          const back = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'رجوع');
          const bb = back.getBoundingClientRect();
          return {ask: {y: Math.round(ab.top), h: Math.round(ab.height), x: Math.round(ab.left), w: Math.round(ab.width)},
                  back: {y: Math.round(bb.top), h: Math.round(bb.height), x: Math.round(bb.left), w: Math.round(bb.width)},
                  backParentCls: (back.parentElement.className || '').toString().slice(0, 40),
                  backParentPos: getComputedStyle(back.parentElement).position};
        }""")
        print(r)
finally:
    server.stop()
