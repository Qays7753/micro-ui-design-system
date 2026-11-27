"""sim-shots.py — screenshot the simulation's screens on a real viewport.

Usage:
  uv run python ds/sim/tools/sim-shots.py <url> <outdir> [engine] [width] [height]

Serves nothing itself — point it at a running `vite preview` (or dev) URL.
Walks the §5.1 screens: the role picker, then every role's screens in
order, pressing the real buttons (the library's use-press needs real
pointer events), and writes one PNG per screen plus the console errors.
"""
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / 'tools' / 'ds-gates'))
from common import browser_session  # noqa: E402

# (name, role-row-text, then the presses after entering the role)
ROLE_FIRST_SCREEN = {
    'owner': ('ورشة الياسمين للخياطة', 'today'),
    'driver': ('عمر الزعبي', 'driverOrders'),
    'supplier': ('مخبز الأصيل للجملة', 'myListings'),
    'reviewer': ('مراجعة المنصة', 'review'),
}

FLOWS = {
    'owner': {
        'today': [],
        'finance': ['tile:المالية'],
        'orders': ['tab:الطلبات'],
        'ordersCalendar': ['tab:الطلبات', 'seg:التقويم'],
        'delivery': ['tab:التوصيل'],
        'market': ['tab:السوق'],
        'movements': ['tile:المالية', 'all:'],
    },
    'driver': {
        'driverOrders': [],
        'myJobs': ['seg:مهامي'],
    },
    'supplier': {
        'myListings': [],
        'market': ['seg:السوق'],
    },
    'reviewer': {
        'review': [],
        'reports': ['tab:البلاغات'],
        'drivers': ['tab:السائقون'],
    },
}


def press(page, kind: str, label: str) -> None:
    """A press through Playwright's real pointer events."""
    if kind == 'tab':
        page.get_by_role('tab', name=label).click()
    elif kind == 'tile':
        page.get_by_text(label, exact=True).first.click()
    elif kind == 'seg':
        page.get_by_role('button', name=label).first.click()
    elif kind == 'all':
        page.locator('.mds-section-see-all').first.click()
    else:
        raise ValueError(kind)


def main() -> None:
    url = sys.argv[1]
    outdir = pathlib.Path(sys.argv[2])
    engine = sys.argv[3] if len(sys.argv) > 3 else 'chromium'
    width = int(sys.argv[4]) if len(sys.argv) > 4 else 390
    height = int(sys.argv[5]) if len(sys.argv) > 5 else 844
    outdir.mkdir(parents=True, exist_ok=True)
    errors: list[str] = []

    with browser_session(engine) as s:
        page = s.page()
        page.set_viewport_size({'width': width, 'height': height})
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(url)
        page.wait_for_selector('[data-sim-role-screen]', timeout=15000)
        # The splash overlays the role screen — wait until it is gone.
        page.wait_for_selector('[data-sim-splash]', state='detached', timeout=15000)
        page.wait_for_timeout(250)
        page.screenshot(path=str(outdir / f'00-role-{engine}.png'))

        # The owner's screens (SA7أ).
        page.get_by_text('ورشة الياسمين للخياطة').click()
        page.wait_for_selector('[data-sim-screen-body="today"]', timeout=8000)
        page.wait_for_timeout(400)
        for screen, steps in FLOWS['owner'].items():
            for step in steps:
                kind, _, label = step.partition(':')
                press(page, kind, label)
                page.wait_for_timeout(350)
            page.evaluate('window.scrollTo(0, 0)')
            page.wait_for_timeout(150)
            page.screenshot(path=str(outdir / f'owner-{screen}-{engine}.png'))
            # The scroll-bottom half (the sticky TabBar's real resting place).
            page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
            page.wait_for_timeout(150)
            page.screenshot(path=str(outdir / f'owner-{screen}-bottom-{engine}.png'))

        # The other roles (SA7ب/ج/د): back to the role screen each time.
        for role in ('driver', 'supplier', 'reviewer'):
            page.reload()
            page.wait_for_selector('[data-sim-role-screen]', timeout=15000)
            page.wait_for_selector('[data-sim-splash]', state='detached', timeout=15000)
            row, first = ROLE_FIRST_SCREEN[role]
            page.get_by_text(row).click()
            page.wait_for_selector(f'[data-sim-screen-body="{first}"]', timeout=8000)
            page.wait_for_timeout(400)
            for screen, steps in FLOWS[role].items():
                for step in steps:
                    kind, _, label = step.partition(':')
                    press(page, kind, label)
                    page.wait_for_timeout(350)
                page.evaluate('window.scrollTo(0, 0)')
                page.wait_for_timeout(150)
                page.screenshot(path=str(outdir / f'{role}-{screen}-{engine}.png'))

        # The shared sheets.
        page.get_by_role('button', name='ورشة الياسمين للخياطة').first.click()
        page.wait_for_timeout(450)
        page.screenshot(path=str(outdir / f'owner-sheet-project-{engine}.png'))
        page.keyboard.press('Escape')
        page.locator('.mds-notifications-button, [data-ds-notifications]').first.click()
        page.wait_for_timeout(450)
        page.screenshot(path=str(outdir / f'owner-sheet-notifications-{engine}.png'))
        page.keyboard.press('Escape')

        overflow = page.evaluate(
            'document.documentElement.scrollWidth - document.documentElement.clientWidth'
        )
        (outdir / f'summary-{engine}.json').write_text(
            json.dumps({'engine': engine, 'h-overflow': overflow, 'consoleErrors': errors}, ensure_ascii=False),
            encoding='utf8',
        )
        print(f'{engine}: {width}x{height} h-overflow={overflow}px consoleErrors={len(errors)}')


if __name__ == '__main__':
    main()
