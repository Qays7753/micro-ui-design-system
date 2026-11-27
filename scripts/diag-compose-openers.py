"""Test: does pressing the compose openers unmount the DRC cards?"""
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
        page.wait_for_timeout(500)
        before = page.evaluate("() => document.querySelectorAll('.mds-delivery-request-card').length")
        sw = page.evaluate_handle("() => document.querySelector('#delivery-compose .mds-project-switcher, #delivery-compose [class*=project]')")
        el = sw.as_element()
        if el:
            el.click()
            page.wait_for_timeout(300)
            after = page.evaluate("() => document.querySelectorAll('.mds-delivery-request-card').length")
            menu = page.evaluate("() => document.querySelectorAll('.mds-menu, [class*=menu], [role=listbox]').length")
            print({'before': before, 'after': after, 'menuOpen': menu})
        else:
            print('no switcher found; DRC count', before)
finally:
    server.stop()
