"""shots-47.py — the 4.7 AmountKeypad proof shots on the catalog page.

The «لوحة أرقام المبالغ» section at 360x780, both engines: the field with
the pad under it, after typing 145.750 through the keys (the spec's own
data), and after the long backspace press clears the field.
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

FIELD_VALUE = "() => document.querySelector('#amount-keypad input').value"

WORDS = {'0': 'صفر', '1': 'واحد', '2': 'اثنان', '3': 'ثلاثة', '4': 'أربعة',
         '5': 'خمسة', '6': 'ستة', '7': 'سبعة', '8': 'ثمانية', '9': 'تسعة',
         '.': 'فاصلة'}


def type_keys(page, glyphs: str):
    # REAL clicks (a synthetic down+up inside one JS task lands before
    # React commits the pressed state, so usePress drops the press).
    for g in glyphs:
        page.locator(f'#amount-keypad button[aria-label="{WORDS[g]}"]').click()
        page.wait_for_timeout(60)


with browser_session(ENGINE) as s:
    page = s.page()
    page.set_viewport_size({'width': W, 'height': H})
    page.goto(SRC.as_uri() + '?view=catalog')
    wait_lab_ready(page)
    page.wait_for_timeout(400)

    section = page.locator('#amount-keypad')
    section.scroll_into_view_if_needed()
    page.wait_for_timeout(250)
    section.screenshot(path=str(OUT / f'47-keypad-rest-{ENGINE}.png'))
    print(f'47-keypad-rest-{ENGINE}.png')

    # type the spec's own data: 145.750 through the keys
    type_keys(page, '145.750')
    page.wait_for_timeout(250)
    print('field value:', page.evaluate(FIELD_VALUE))
    section.screenshot(path=str(OUT / f'47-keypad-typed-{ENGINE}.png'))
    print(f'47-keypad-typed-{ENGINE}.png')

    # the fraction-full state: 9.999 — the «.» and digits go visibly off
    # (typed through the keys after clearing via long backspace)
    # the LONG press on backspace (a real mouse hold) clears the field
    box = page.locator('#amount-keypad .mds-keypad-key--backspace').bounding_box()
    page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
    page.mouse.down()
    page.wait_for_timeout(600)  # past the long-press delay
    page.mouse.up()
    page.wait_for_timeout(200)
    print('after long clear:', page.evaluate(FIELD_VALUE))
    type_keys(page, '9.999')
    page.wait_for_timeout(250)
    print('fraction-full value:', page.evaluate(FIELD_VALUE))
    disabled_count = page.evaluate(
        "() => Array.from(document.querySelectorAll('#amount-keypad button'))"
        ".filter(b => b.disabled).length")
    print('disabled keys at 9.999:', disabled_count)
    section.screenshot(path=str(OUT / f'47-keypad-fraction-full-{ENGINE}.png'))
    print(f'47-keypad-fraction-full-{ENGINE}.png')
print('done', ENGINE)
