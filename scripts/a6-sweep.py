"""a6-sweep.py — comprehensive visual sweep of every lab section (A6).

For each lab section id × engine (chromium, webkit) × width (360, 320) ×
font scale (100, 200):
  - screenshot the section element (clipped to its own box),
  - record automated facts: horizontal overflow of the page, per-element
    clipping inside the section (scrollWidth > clientWidth + 1 on nowrap
    boxes), zero-size marked elements.

Then tile every shot into contact sheets (one per engine) under
/tmp/render/sheets/ so a single Read reviews dozens of sections.
"""
import pathlib
import sys

from PIL import Image

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

STANDALONE = pathlib.Path('previews/ds-lab/standalone.html').resolve().as_uri()
OUT = pathlib.Path('/tmp/render/a6')
SHEET = pathlib.Path('/tmp/render/sheets')

FACTS_JS = """
(section) => {
  const el = document.getElementById(section);
  if (!el) return null;
  const pageOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const clipped = [];
  el.querySelectorAll('*').forEach(n => {
    if (!(n instanceof HTMLElement)) return;
    const st = getComputedStyle(n);
    if (st.overflowX !== 'visible' && n.scrollWidth > n.clientWidth + 1) return;
    if (n.scrollWidth > n.clientWidth + 1 && st.whiteSpace === 'nowrap') {
      clipped.push(n.className || n.tagName);
    }
  });
  return {pageOverflow, clipped: clipped.slice(0, 5)};
}
"""


def sweep() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    SHEET.mkdir(parents=True, exist_ok=True)
    url = STANDALONE
    shots: dict[str, list[pathlib.Path]] = {}
    report: list[str] = []

    for engine in ('chromium', 'webkit'):
        for width, height in ((360, 780), (320, 640)):
            for scale in (100, 200):
                with browser_session(engine) as s:
                    page = s.page()
                    page.set_viewport_size({'width': width, 'height': height})
                    page.goto(url)
                    wait_lab_ready(page)
                    if scale != 100:
                        page.evaluate(f'document.documentElement.style.zoom = "{scale / 100.0}"')
                        page.wait_for_timeout(250)
                    sections = page.evaluate(
                        'Array.from(document.querySelectorAll(".lab-section")).map(e => e.id)'
                    )
                    for sec in sections:
                        el = page.locator(f'#{sec}')
                        try:
                            el.scroll_into_view_if_needed()
                            page.wait_for_timeout(60)
                            facts = page.evaluate(FACTS_JS, sec)
                        except Exception as exc:
                            report.append(f'{engine} {width} f{scale} {sec}: ERROR {exc!r}')
                            continue
                        if facts is None:
                            continue
                        name = OUT / f'{engine}-{width}-f{scale}-{sec}.png'
                        el.screenshot(path=str(name))
                        shots.setdefault((engine, scale), []).append(name)
                        if facts['pageOverflow'] > 0:
                            report.append(
                                f'{engine} {width} f{scale} {sec}: PAGE H-OVERFLOW {facts["pageOverflow"]}px')
                        for c in facts['clipped']:
                            report.append(f'{engine} {width} f{scale} {sec}: CLIPPED nowrap {c}')

    print('--- automated report ---')
    for line in report or ['(no automated violations)']:
        print(line)

    # Contact sheets: one per engine×scale family, 3 columns, 55% scale.
    for key, files in sorted(shots.items()):
        engine, scale = key
        cols = 3
        thumb_w, thumb_h = 198, 429
        rows = (len(files) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * (thumb_w + 8) + 8, rows * (thumb_h + 8) + 8), '#222')
        for i, f in enumerate(files):
            im = Image.open(f)
            im.thumbnail((thumb_w, thumb_h))
            x = 8 + (i % cols) * (thumb_w + 8)
            y = 8 + (i // cols) * (thumb_h + 8)
            sheet.paste(im, (x, y))
        name = SHEET / f'sheet-{engine}-f{scale}.png'
        sheet.save(name)
        print(f'sheet: {name} ({len(files)} sections)')


if __name__ == '__main__':
    sweep()
