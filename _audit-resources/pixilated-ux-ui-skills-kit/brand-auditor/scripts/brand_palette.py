#!/usr/bin/env python3
"""Build brand ramps and chart palettes from brand.json.

usage: brand_palette.py --brand brand.json --out <dir> [--series 6]
Writes palette.css (role ramps 50-950, text-safe steps, chart tokens), palette.json, palette.html
(swatches, categorical/sequential/diverging scales, colour-blind simulation, contrast table).
No dependencies.
"""
import json, math, os, sys

def hex2rgb(h):
    h = h.lstrip('#'); h = ''.join(c * 2 for c in h) if len(h) == 3 else h
    return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
def rgb2hex(c): return '#' + ''.join(f'{max(0, min(255, round(x * 255))):02x}' for x in c)
def lin(v): return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4
def gam(v): return 12.92 * v if v <= .0031308 else 1.055 * v ** (1 / 2.4) - .055
def to_oklab(c):
    r, g, b = (lin(x) for x in c)
    l = (.4122214708 * r + .5363325363 * g + .0514459929 * b) ** (1 / 3); m = (.2119034982 * r + .6806995451 * g + .1073969566 * b) ** (1 / 3); s = (.0883024619 * r + .2817188376 * g + .6299787005 * b) ** (1 / 3)
    return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s]
def from_oklab(L, a, b):
    l = (L + .3963377774 * a + .2158037573 * b) ** 3; m = (L - .1055613458 * a - .0638541728 * b) ** 3; s = (L - .0894841775 * a - 1.291485548 * b) ** 3
    return [gam(4.0767416621 * l - 3.3077115913 * m + .2309699292 * s), gam(-1.2684380046 * l + 2.6097574011 * m - .3413193965 * s), gam(-.0041960863 * l - .7034186147 * m + 1.707614701 * s)]
def to_lch(c):
    L, a, b = to_oklab(c); return [L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360]
def from_lch(L, C, H):
    # reduce chroma until in gamut
    for _ in range(40):
        rgb = from_oklab(L, C * math.cos(math.radians(H)), C * math.sin(math.radians(H)))
        if all(-.001 <= x <= 1.001 for x in rgb): return [min(1, max(0, x)) for x in rgb]
        C *= .93
    return [min(1, max(0, x)) for x in rgb]
def lum(c): return .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2])
def contrast(a, b): x, y = lum(a), lum(b); return (max(x, y) + .05) / (min(x, y) + .05)
def dE(a, b): x, y = to_oklab(a), to_oklab(b); return math.dist(x, y)
# Machado et al. 2009 severity 1.0 (applied in linear RGB)
CVD = {'deuteranopia': [[.367322, .860646, -.227968], [.280085, .672501, .047413], [-.011820, .042940, .968881]],
       'protanopia': [[.152286, 1.052583, -.204868], [.114503, .786281, .099216], [-.003882, -.048116, 1.051998]]}
def simulate(c, kind):
    v = [lin(x) for x in c]; M = CVD[kind]
    return [gam(max(0, min(1, sum(M[i][j] * v[j] for j in range(3))))) for i in range(3)]

STEPS = {50: .97, 100: .93, 200: .87, 300: .78, 400: .68, 500: .58, 600: .50, 700: .42, 800: .34, 900: .26, 950: .20}
def ramp(hexc):
    L, C, H = to_lch(hex2rgb(hexc)); out = {}
    for k, l in STEPS.items():
        cscale = 1 - abs(l - .55) * .9 if l > .2 else .5
        out[k] = rgb2hex(from_lch(l, max(.01, C * max(.25, cscale)), H))
    return out

def main():
    a = sys.argv[1:]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    brand = json.load(open(opt('--brand'))); out = opt('--out', 'palette'); n = int(opt('--series', 6)); os.makedirs(out, exist_ok=True)
    C = brand['colors']; roles = {k: C[k]['hex'] for k in ('primary', 'secondary', 'tertiary') if k in C}
    for x in C.get('extended', []): roles[x.get('name', 'extended').lower().replace(' ', '-')] = x['hex']
    ramps = {k: ramp(v) for k, v in roles.items()}
    white, ink = [1, 1, 1], hex2rgb(C['secondary']['hex']) if 'secondary' in C else [0, 0, 0]
    text_safe = {}
    for k, r in ramps.items():
        base = roles[k]
        if contrast(hex2rgb(base), white) >= 4.5: text_safe[k] = base; continue
        for step in (500, 600, 700, 800, 900):
            if contrast(hex2rgb(r[step]), white) >= 4.5: text_safe[k] = r[step]; break
    # categorical: start with tertiary + extended, then equal-L/C hues
    seeds = [roles['tertiary']] + [x['hex'] for x in C.get('extended', [])] if 'tertiary' in roles else [x['hex'] for x in C.get('extended', [])]
    Lt, Ct, Ht = to_lch(hex2rgb(seeds[0])) if seeds else (.6, .1, 160)
    Lc, Cc = min(max(Lt, .55), .68), min(max(Ct, .09), .14)
    cat = []; hues = [Ht + i * (360 / max(n, 1)) for i in range(n)]
    sem_hexes = [hex2rgb(v) for v in C.get('semantic', {}).values()]
    for i, h in enumerate(hues):
        # alternate lightness so neighbours stay apart for colour-blind readers (hue alone isn't enough)
        Li = Lc + (0, -.16, .12, -.08, .18, -.22)[i % 6]
        col = from_lch(Li, Cc, h % 360)
        if any(dE(col, s) < .08 for s in sem_hexes): col = from_lch(Lc, Cc, (h + 18) % 360)
        cat.append(rgb2hex(col))
    if seeds: cat[0] = seeds[0]
    seq = [ramps.get('tertiary', ramps[list(ramps)[0]])[k] for k in (100, 200, 300, 400, 500, 600, 700, 800)]
    div = [ramps.get('tertiary', {}).get(700, '#1f6b55'), ramps.get('tertiary', {}).get(400, '#7fbfa6'), '#eeeeea'] + [ramp(C.get('extended', [{'hex': '#c49a6c'}])[0]['hex'])[k] for k in (400, 700)]
    # cvd check
    warn = []
    for kind in CVD:
        sim = [simulate(hex2rgb(c), kind) for c in cat]
        for i in range(len(sim)):
            for j in range(i + 1, len(sim)):
                if dE(sim[i], sim[j]) < .1: warn.append(f'{kind}: series {i + 1} and {j + 1} look alike (ΔE {dE(sim[i], sim[j]):.2f})')
    ctab = [(k, v, round(contrast(hex2rgb(v), white), 2), round(contrast(hex2rgb(v), ink), 2)) for k, v in roles.items()]
    res = {'roles': roles, 'ramps': ramps, 'text_safe': text_safe, 'chart': {'categorical': cat, 'sequential': seq, 'diverging': div, 'highlight': [roles.get('tertiary'), '#c9c6bf'], 'semantic_up_down': [C.get('semantic', {}).get('success'), C.get('semantic', {}).get('error')]}, 'cvd_warnings': warn, 'contrast': ctab}
    json.dump(res, open(f'{out}/palette.json', 'w'), indent=1)
    css = [':root{']
    for k, r in ramps.items(): css += [f'  --{k}-{s}:{v};' for s, v in r.items()]
    css += [f'  --{k}:{v};' for k, v in roles.items()] + [f'  --{k}-text:{v};' for k, v in text_safe.items()]
    css += [f'  --chart-{i + 1}:{c};' for i, c in enumerate(cat)] + [f'  --chart-seq-{i + 1}:{c};' for i, c in enumerate(seq)] + [f'  --chart-div-{i + 1}:{c};' for i, c in enumerate(div)]
    css += [f"  --chart-highlight:{roles.get('tertiary')};", '  --chart-muted:#c9c6bf;']
    for k, v in C.get('semantic', {}).items(): css.append(f'  --semantic-{k}:{v};')
    css.append('}'); open(f'{out}/palette.css', 'w').write('\n'.join(css))
    sw = lambda c, lab='': f'<div class="sw" style="background:{c}"><span>{lab or c}</span></div>'
    body = [f'<h1>{brand.get("name", "Brand")} palette</h1>']
    for k, r in ramps.items(): body.append(f'<h2>{k} <small>{roles[k]} · text-safe {text_safe.get(k, "n/a")}</small></h2><div class="row">' + ''.join(sw(v, str(s)) for s, v in r.items()) + '</div>')
    body.append('<h2>Chart: categorical</h2><div class="row">' + ''.join(sw(c) for c in cat) + '</div>')
    for kind in CVD: body.append(f'<h3>{kind}</h3><div class="row">' + ''.join(sw(rgb2hex(simulate(hex2rgb(c), kind))) for c in cat) + '</div>')
    body.append('<h2>Chart: sequential</h2><div class="row">' + ''.join(sw(c) for c in seq) + '</div>')
    body.append('<h2>Chart: diverging</h2><div class="row">' + ''.join(sw(c) for c in div) + '</div>')
    body.append('<h2>Semantic (always wins)</h2><div class="row">' + ''.join(sw(v, k) for k, v in C.get('semantic', {}).items()) + '</div>')
    body.append('<h2>Contrast</h2><table><tr><th>role</th><th>hex</th><th>on white</th><th>on secondary</th></tr>' + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in ctab) + '</table>')
    if warn: body.append('<h2>Colour-blind warnings</h2><ul>' + ''.join(f'<li>{w}</li>' for w in warn) + '</ul>')
    open(f'{out}/palette.html', 'w').write('<!doctype html><meta charset="utf-8"><title>Palette</title><style>body{font:14px system-ui;margin:32px;color:#222}.row{display:flex;gap:6px;margin:8px 0 20px;flex-wrap:wrap}.sw{width:88px;height:64px;border-radius:10px;display:flex;align-items:flex-end;padding:6px;box-shadow:inset 0 0 0 1px rgb(0 0 0 / .06)}.sw span{font:11px ui-monospace;background:#fffc;padding:1px 4px;border-radius:4px}td,th{padding:4px 10px;text-align:left}</style>' + ''.join(body))
    print(f'wrote {out}/palette.css, palette.json, palette.html · {len(warn)} colour-blind warnings')

if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    main()
