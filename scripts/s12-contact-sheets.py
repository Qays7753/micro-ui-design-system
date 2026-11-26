#!/usr/bin/env python3
"""Build readable contact sheets from the S12/2 critic shots for the
section-26 visual checklist. Top-viewport crops per (view, scale) sheet,
plus mid-catalog crops (rows/tiles/metrics region) per scale — 6 sheets,
4 cells each (chromium/webkit x 360/320)."""
from PIL import Image, ImageDraw
from pathlib import Path

SRC = Path('/tmp/render/s12-critic')
OUT = SRC / 'sheets'
OUT.mkdir(exist_ok=True)
CELL_W = 340          # display width per cell
CROP_TOP = 780        # CSS px of the top crop
CROP_MID_H = 1000


def cell(img, w, h_css, y0, h_css_crop):
    # RTL: anchor every crop to the RIGHT edge — a Chromium full-page capture
    # is as wide as the scrollable canvas (360 viewport + the recorded money
    # overflow at 200%), and the content's start lives on the right.
    x0 = max(0, img.width - w)
    box = img.crop((x0, y0, img.width, min(y0 + h_css_crop, img.height)))
    scale = CELL_W / w
    return box.resize((CELL_W, int(box.height * scale)), Image.LANCZOS)


def sheet(name, cells, cols=2):
    imgs = [c for _, c in cells]
    cw = max(c.width for c in imgs) + 12
    ch = max(c.height for c in imgs) + 26
    rows = (len(cells) + cols - 1) // cols
    im = Image.new('RGB', (cw * cols, ch * rows), '#222')
    d = ImageDraw.Draw(im)
    for i, (label, c) in enumerate(cells):
        x = (i % cols) * cw + 6
        y = (i // cols) * ch + 2
        d.text((x + 2, y + 2), label, fill='#ffd75e')
        im.paste(c, (x, y + 22))
    im.save(OUT / f'{name}.png')
    print('sheet', name, im.size)


def load(engine, view, w, h, scale):
    # Top sheets use the viewport companion (what the user actually sees —
    # sticky bars in place, canvas = the real viewport); mid sheets use the
    # full-page capture.
    p = SRC / f'{engine}-{view}-{w}x{h}-{scale}-vp.png'
    return Image.open(p), w, h


for view in ('compose', 'catalog'):
    for scale in ('100', '200'):
        cells = []
        mids = []
        for engine in ('chromium', 'webkit'):
            for (w, h) in ((360, 780), (320, 640)):
                img, w, h = load(engine, view, w, h, scale)
                top_h = min(CROP_TOP, h)
                cells.append((f'{engine} {w}x{h} {scale}%', cell(img, w, h, 0, top_h)))
                if view == 'catalog':
                    full = Image.open(SRC / f'{engine}-{view}-{w}x{h}-{scale}.png')
                    y0 = int(full.height * 0.84)
                    mids.append((f'{engine} {w}x{h} {scale}% mid',
                                 cell(full, w, h, y0, CROP_MID_H)))
        sheet(f'{view}-{scale}-top', cells)
        if mids:
            sheet(f'catalog-{scale}-mid', mids)
print('done')
