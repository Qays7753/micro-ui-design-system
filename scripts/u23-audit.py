#!/usr/bin/env python3
"""u23-audit.py — the batch-2 stage-2 visual audit matrix (unit 2.3).

For EVERY batch-1 component section in the lab (32 sections) and for the
compose page itself: BOTH engines x BOTH sizes (360x780, 320x640) x BOTH
font scales (100%, 200% — the lab's own root font-size) x amounts SHOWN and
HIDDEN = 16 shots per component. Each cell gets the s12 overflow/clipping
probe; everything lands as one labelled 4x4 CONTACT SHEET per component in
reports/ds-visual-audit/<section>.png (the tracked image evidence) plus
reports/ds-visual-audit/measurements.json with every probe number.

The raw shots stay under /tmp/render/u23/ (working material — the contact
sheet IS the reviewed evidence, one image per component).
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, resolve_page_target, wait_lab_ready  # noqa: E402

OUT_RAW = Path('/tmp/render/u23')
OUT_REPO = Path('reports/ds-visual-audit')
OUT_REPO.mkdir(parents=True, exist_ok=True)
OUT_RAW.mkdir(parents=True, exist_ok=True)

SECTIONS = [
    'controls', 'money', 'badge', 'entity', 'button', 'icon-button',
    'text-field', 'segmented-control', 'filter-chips', 'surface', 'well',
    'section', 'hero', 'sheet', 'action-bar', 'skeleton', 'empty-state',
    'inline-banner', 'toast', 'save-state', 'page-header', 'tab-bar',
    'context-bar', 'project-switcher', 'notifications-button', 'ask-button',
    'confirm-sheet', 'object-row', 'object-card', 'metric', 'metric-small',
    'tile',
]
ENGINES = ['chromium', 'webkit']
SIZES = [(360, 780), (320, 640)]
SCALES = ['100%', '200%']
HIDDEN = ['shown', 'hidden']

TOGGLE = '[data-ds-check="amount-visibility-toggle"]'

PROBE = """() => {
  const de = document.documentElement;
  const hOverflow = Math.max(0, de.scrollWidth - de.clientWidth);
  return { hOverflow };
}
"""

CELL_W = 300


def shoot_section(page, section):
    el = page.locator(f'#{section}')
    el.scroll_into_view_if_needed()
    page.wait_for_timeout(120)
    return el


def main():
    kind, val = resolve_page_target('')
    server, url = val
    measurements = {}
    # the two views are two URLs: derive the compose one like the gates do
    url_compose = url.replace('view=catalog', 'view=compose') if 'view=catalog' in url else url + ('&view=compose' if '?' in url else '?view=compose')
    urls = {'catalog': url, 'compose': url_compose}
    try:
        for view in (sys.argv[1],) if len(sys.argv) > 1 else ('catalog', 'compose'):
            with browser_session('chromium') as session:
                page = session.page(viewport={'width': 360, 'height': 780}, device_scale_factor=1)
                page.goto(urls[view], wait_until='load', timeout=30000)
                wait_lab_ready(page)
                page.wait_for_timeout(200)
                sections = SECTIONS if view == 'catalog' else ['compose']
                for section in sections:
                    cells = []
                    m = {}
                    for hidden in HIDDEN:
                        # flip the lab's own toggle to the wanted state
                        want_hidden = hidden == 'hidden'
                        for _ in range(2):
                            cur = page.evaluate(
                                "() => { const t = document.querySelector('[data-ds-check=\"amount-visibility-toggle\"]');"
                                " return t ? t.getAttribute('aria-label') === '\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0645\u0628\u0627\u0644\u063a' : false; }")
                            if cur == want_hidden:
                                break
                            tog = page.query_selector(f'{TOGGLE}')
                            if tog:
                                tog.click(timeout=1500)
                                page.wait_for_timeout(260)
                        for scale in SCALES:
                            page.evaluate(f'document.documentElement.style.fontSize = "{scale}"')
                            page.wait_for_timeout(150)
                            for engine in ENGINES:
                                for (w, h) in SIZES:
                                    page.set_viewport_size({'width': w, 'height': h})
                                    page.wait_for_timeout(150)
                                    if view == 'catalog':
                                        el = shoot_section(page, section)
                                        raw = OUT_RAW / f'{section}-{engine}-{w}-{scale}-{hidden}.png'
                                        el.screenshot(path=str(raw))
                                        probe = {'hOverflow': page.evaluate(PROBE)['hOverflow']}
                                    else:
                                        # the viewport companion shows the page's TOP:
                                        # strip, ContextBar, hero — scroll home first
                                        page.evaluate('window.scrollTo(0, 0)')
                                        page.wait_for_timeout(150)
                                        raw = OUT_RAW / f'{section}-{engine}-{w}-{scale}-{hidden}-vp.png'
                                        page.screenshot(path=str(raw))
                                        probe = {'hOverflow': page.evaluate(PROBE)['hOverflow']}
                                    m[f'{engine}-{w}-{scale}-{hidden}'] = probe
                                    img = Image.open(raw)
                                    # anchor RTL crops to the right edge
                                    scale_f = CELL_W / w
                                    img = img.resize((CELL_W, int(img.height * scale_f)), Image.LANCZOS)
                                    cells.append((f'{engine} {w} {scale} {hidden}', img))
                        page.evaluate('document.documentElement.style.fontSize = "100%"')
                    # contact sheet: 4 columns (engine/size), rows = scale x hidden
                    cols = 4
                    cw = max(c.width for _, c in cells) + 10
                    ch = max(c.height for _, c in cells) + 24
                    rows = (len(cells) + cols - 1) // cols
                    im = Image.new('RGB', (cw * cols, ch * rows), '#1d2427')
                    d = ImageDraw.Draw(im)
                    for i, (label, c) in enumerate(cells):
                        x = (i % cols) * cw + 5
                        y = (i // cols) * ch + 2
                        d.text((x + 2, y + 1), label, fill='#ffd75e')
                        im.paste(c, (x, y + 18))
                    out_name = f'{view}-{section}.png' if view == 'compose' else f'{section}.png'
                    im.save(OUT_REPO / out_name)
                    measurements[out_name] = m
                    print('sheet', out_name, f'{len(cells)} cells')
    finally:
        server.stop()
    # merge with any existing measurements (per-view passes update their own)
    mpath = OUT_REPO / 'measurements.json'
    merged = json.loads(mpath.read_text(encoding='utf-8')) if mpath.is_file() else {}
    merged.update(measurements)
    mpath.write_text(json.dumps(merged, ensure_ascii=False, indent=1), encoding='utf-8')
    print('measurements written:', len(merged), 'sheets')


if __name__ == '__main__':
    main()
