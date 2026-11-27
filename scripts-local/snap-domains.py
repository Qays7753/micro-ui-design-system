#!/usr/bin/env python3
"""snap-domains.py — screenshot the domains lab sections for the designer
eye pass (plan B cycle step 4). Catalog view, Chromium, 360x780 @3x like
DEFAULT_CONTEXT; one clip per section id, saved under
/tmp/domain-snaps/<id>.png. Usage: python snap-domains.py <id>...
(no args = every domains section found in the page index)."""
import sys
from pathlib import Path

sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

OUT = Path('/tmp/domain-snaps')
ROOT = Path(__file__).resolve().parent.parent


def main():
    wanted = sys.argv[1:]
    OUT.mkdir(parents=True, exist_ok=True)
    server = LocalServer(ROOT / 'previews' / 'ds-lab')
    base = server.start()
    url = base + '/standalone.html?view=catalog&tools=1'
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(**DEFAULT_CONTEXT)
        page = ctx.new_page()
        page.goto(url, wait_until='load', timeout=30000)
        page.wait_for_selector('.lab-index a', timeout=10000)
        ids = page.eval_on_selector_all(
            '.lab-index a', 'els => els.map(a => a.getAttribute("href").slice(1))')
        domain_ids = [i for i in ids if i in (
            'movement-row', 'payment-progress')] if not wanted else wanted
        for sec_id in domain_ids:
            page.evaluate(f"document.getElementById({sec_id!r})?.scrollIntoView()")
            page.wait_for_timeout(250)
            el = page.query_selector(f'#{sec_id}')
            if el:
                el.screenshot(path=str(OUT / f'{sec_id}.png'))
                print(f'snapped {sec_id}')
        browser.close()
    server.stop()


if __name__ == '__main__':
    main()
