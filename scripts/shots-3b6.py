"""shots-3b6.py — the seven 3ب.6 proof shots, BEFORE and AFTER, on the
compose screen alone (no lab tools strip), at 390x844 on both engines.

The same seven views Claude Design diagnosed (01 today, 02 hidden, 03 record
movement, 04 project switch, 05 notifications, 06 Ask, 07 object details):

  BEFORE — the pre-fix standalone at 3bc40c7 (3ب.0: full-screen, all the
           section-5 errors of addendum 1.7 still present).
  AFTER  — the current standalone (3ب.2–3ب.5 + the tools-button dock fix).

Saved to reports/ds-addendum-1.7/3b6-{before,after}-<nn>-<name>-<engine>.png.

Usage: uv run python scripts/shots-3b6.py [engine]
"""
import pathlib
import subprocess
import sys
import tempfile

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[1]
AFTER = ROOT / 'previews' / 'ds-lab' / 'standalone.html'
# The BEFORE state is the pre-fix standalone at 3bc40c7 (3ب.0: full-screen
# with all the addendum-1.7 section-5 errors still present), extracted from
# git so the script runs from any clean clone.
BEFORE = pathlib.Path(tempfile.mkdtemp(prefix='3b6-before-')) / 'standalone.html'
BEFORE.write_bytes(subprocess.check_output(
    ['git', '-C', str(ROOT), 'show', '3bc40c7:previews/ds-lab/standalone.html']))
OUT = ROOT / 'reports' / 'ds-addendum-1.7'

ENGINE = sys.argv[1] if len(sys.argv) > 1 else 'chromium'
W, H = 390, 844


def close_sheet(page):
    """A real click on the topmost sheet's close button (the dispatch trick
    does not reach React's synthetic pointer handlers)."""
    page.locator('.mds-sheet .mds-sheet-close .mds-icon-button').last.click()


WAIT_TOAST = 900


def shot(page, tag, name):
    page.screenshot(path=str(OUT / f'3b6-{tag}-{name}-{ENGINE}.png'))
    print(f'3b6-{tag}-{name}-{ENGINE}.png')


def after_flow(page):
    """The AFTER screen: header eye, empty-state movement entry, the rest direct."""
    # 01 today — the screen at rest
    shot(page, 'after', '01-today')

    # 02 hidden amounts — the header's eye (ت1: the hide button lives in the
    # PageHeader's end on this screen)
    page.click('.lab-compose-screen .mds-amount-visibility-toggle')
    page.wait_for_timeout(400)
    shot(page, 'after', '02-hidden')
    page.click('.lab-compose-screen .mds-amount-visibility-toggle')
    page.wait_for_timeout(400)

    # 03 record movement — entering from the empty state (this screen's
    # header carries no creation action, so the EmptyState carries the one
    # secondary button — و-1 item 14). The page state flips through the
    # tools sheet: fab → «فراغ» key → close the tools sheet.
    page.click('.lab-tools-fab')
    page.wait_for_timeout(400)
    page.evaluate("Array.from(document.querySelectorAll('.lab-tools-sheet .lab-key')).find(k => k.textContent.includes('فراغ'))?.click()")
    page.wait_for_timeout(350)
    close_sheet(page)
    page.wait_for_timeout(500)
    page.click('.lab-compose-screen .mds-empty-state .mds-button')
    page.wait_for_timeout(500)
    shot(page, 'after', '03-record-movement')
    close_sheet(page)
    page.wait_for_timeout(500)
    page.click('.lab-tools-fab')
    page.wait_for_timeout(400)
    page.evaluate("Array.from(document.querySelectorAll('.lab-tools-sheet .lab-key')).find(k => k.textContent.includes('عادي'))?.click()")
    page.wait_for_timeout(350)
    close_sheet(page)
    page.wait_for_timeout(500)

    # 04 project switch — the ContextBar's switcher opens its sheet
    page.click('.lab-compose-screen .mds-project-switcher')
    page.wait_for_timeout(500)
    shot(page, 'after', '04-project-switch')
    close_sheet(page)
    page.wait_for_timeout(500)

    # 05 notifications — the bell
    page.click('.lab-compose-screen .mds-notifications-button')
    page.wait_for_timeout(500)
    shot(page, 'after', '05-notifications')
    close_sheet(page)
    page.wait_for_timeout(500)

    # 06 Ask — the ask button
    page.click('.lab-compose-screen .mds-ask-button')
    page.wait_for_timeout(500)
    shot(page, 'after', '06-ask')
    close_sheet(page)
    page.wait_for_timeout(500)

    # 07 object details — the first needs-you row
    page.click('.lab-compose-screen .mds-object-row')
    page.wait_for_timeout(500)
    shot(page, 'after', '07-object-details')
    close_sheet(page)
    page.wait_for_timeout(400)


def before_flow(page):
    """The BEFORE screen (3bc40c7): hero eye, header's create button, the rest direct."""
    # 01 today — the screen at rest (the pre-3ب.5 «اليوم»: hero, two rows,
    # the low-contrast create button in the header, the fixed fab)
    shot(page, 'before', '01-today')

    # 02 hidden amounts — the hero's own eye (23.22)
    page.click('.mds-hero-surface .mds-amount-visibility-toggle')
    page.wait_for_timeout(400)
    shot(page, 'before', '02-hidden')
    page.click('.mds-hero-surface .mds-amount-visibility-toggle')
    page.wait_for_timeout(400)

    # 03 record movement — the header's «سجّل حركة» button
    page.click('.lab-compose-screen .mds-page-header .mds-button')
    page.wait_for_timeout(500)
    shot(page, 'before', '03-record-movement')
    close_sheet(page)
    page.wait_for_timeout(500)

    # 04 project switch
    page.click('.lab-compose-screen .mds-project-switcher')
    page.wait_for_timeout(500)
    shot(page, 'before', '04-project-switch')
    close_sheet(page)
    page.wait_for_timeout(500)

    # 05 notifications
    page.click('.lab-compose-screen .mds-notifications-button')
    page.wait_for_timeout(500)
    shot(page, 'before', '05-notifications')
    close_sheet(page)
    page.wait_for_timeout(500)

    # 06 Ask
    page.click('.lab-compose-screen .mds-ask-button')
    page.wait_for_timeout(500)
    shot(page, 'before', '06-ask')
    close_sheet(page)
    page.wait_for_timeout(500)

    # 07 object details — the first needs-you row
    page.click('.lab-compose-screen .mds-object-row')
    page.wait_for_timeout(500)
    shot(page, 'before', '07-object-details')
    close_sheet(page)
    page.wait_for_timeout(400)


with browser_session(ENGINE) as s:
    page = s.page()
    page.set_viewport_size({'width': W, 'height': H})

    page.goto(BEFORE.as_uri() + '?view=compose')
    wait_lab_ready(page)
    page.wait_for_timeout(400)
    before_flow(page)

    page.goto(AFTER.as_uri() + '?view=compose')
    wait_lab_ready(page)
    page.wait_for_timeout(400)
    after_flow(page)

print('done', ENGINE)
