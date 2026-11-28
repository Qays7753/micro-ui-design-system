"""shots-3c1.py — the 3ج.1 live-override proof shots on the catalog page.

The «تجاوز النصوص» section at 360x780, both engines: at rest (library text
«سجّل حركة»), after the override press (the app word «دبّر الحركة»), and
after the reset press (the library word back).
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / 'previews' / 'ds-lab' / 'standalone.html'
OUT = ROOT / 'reports' / 'ds-addendum-1.7'

ENGINE = sys.argv[1] if len(sys.argv) > 1 else 'chromium'
W, H = 360, 780

with browser_session(ENGINE) as s:
    page = s.page()
    page.set_viewport_size({'width': W, 'height': H})
    page.goto(SRC.as_uri() + '?view=catalog')
    wait_lab_ready(page)
    page.wait_for_timeout(400)

    section = page.locator('#text-override')
    section.scroll_into_view_if_needed()
    page.wait_for_timeout(200)
    section.screenshot(path=str(OUT / f'3c1-override-rest-{ENGINE}.png'))
    print(f'3c1-override-rest-{ENGINE}.png')

    # press the override toggle — the target button's word flips
    page.locator('#text-override .mds-button').first.click()
    page.wait_for_timeout(400)
    section.screenshot(path=str(OUT / f'3c1-override-active-{ENGINE}.png'))
    print(f'3c1-override-active-{ENGINE}.png')

    # the target's word really changed (DOM proof)
    word = page.evaluate(
        "() => Array.from(document.querySelectorAll('#text-override .mds-button'))"
        ".map(b => (b.textContent || '').trim())")
    print('buttons now:', word)

    # press again — the library word returns
    page.locator('#text-override .mds-button').first.click()
    page.wait_for_timeout(400)
    section.screenshot(path=str(OUT / f'3c1-override-reset-{ENGINE}.png'))
    print(f'3c1-override-reset-{ENGINE}.png')
    word2 = page.evaluate(
        "() => Array.from(document.querySelectorAll('#text-override .mds-button'))"
        ".map(b => (b.textContent || '').trim())")
    print('buttons back:', word2)
print('done', ENGINE)
