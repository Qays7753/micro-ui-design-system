#!/usr/bin/env python3
"""Brand audit of a rendered page (headless Chrome) against brand.json.

usage: brand_audit.py <page.html> --brand brand.json --out <dir> [--query "?static=1"] [--extract]
Writes report.json, report.md, clean.png, clean-390.png, share.png (pixel role map) in <dir>.
--extract prints the page's dominant colours by area (to help derive a missing brand profile).
Needs Google Chrome ($CHROME to override) and Pillow.
"""
import json, os, re, shutil, subprocess, sys, tempfile, html

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = os.environ.get('CHROME') or next((p for p in ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', shutil.which('google-chrome') or '', shutil.which('chromium') or ''] if p and os.path.exists(p)), None)

def chrome(args, prof):
    if not CHROME: sys.exit('Chrome not found (set $CHROME).')
    return subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--allow-file-access-from-files',
                           f'--user-data-dir={prof}', '--virtual-time-budget=5000'] + args, capture_output=True, text=True, timeout=120)

def hex2rgb(h):
    h = h.lstrip('#'); h = ''.join(c * 2 for c in h) if len(h) == 3 else h
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def oklab(c):
    def lin(v):
        v /= 255; return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4
    r, g, b = (lin(x) for x in c)
    l = (.4122214708 * r + .5363325363 * g + .0514459929 * b) ** (1 / 3); m = (.2119034982 * r + .6806995451 * g + .1073969566 * b) ** (1 / 3); s = (.0883024619 * r + .2817188376 * g + .6299787005 * b) ** (1 / 3)
    return (.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s)

def share(png, brand, exclude, out_png):
    from PIL import Image
    C = brand.get('colors', {})
    refs = []
    sys.path.insert(0, HERE)
    try:
        from brand_palette import ramp as _ramp
    except Exception:
        _ramp = None
    for k in ('primary', 'secondary', 'tertiary'):
        if C.get(k):
            refs.append((k, k, hex2rgb(C[k]['hex'])))
            # the role's family: tints and shades of its ramp count toward the role (e.g. a cardamom-50 selected state is tertiary)
            if _ramp and k != 'primary':
                for step, hx in _ramp(C[k]['hex']).items():
                    if 100 <= step <= 900: refs.append((k, f'{k}-{step}', hex2rgb(hx)))
    for x in C.get('extended', []): refs.append(('extended', x.get('name', x['hex']), hex2rgb(x['hex'])))
    for x in C.get('neutrals', []): refs.append((x.get('counts_as', 'primary'), x['hex'], hex2rgb(x['hex'])))
    for k, v in C.get('semantic', {}).items(): refs.append(('semantic', k, hex2rgb(v)))
    R = [(role, name, oklab(c), c) for role, name, c in refs]
    im = Image.open(png).convert('RGB'); W, H = im.size
    small = im.resize((W // 4, H // 4)); sw, sh = small.size
    mask = [[False] * sw for _ in range(sh)]
    for x, y, w, h in exclude:
        for yy in range(max(0, y // 4), min(sh, (y + h) // 4)):
            for xx in range(max(0, x // 4), min(sw, (x + w) // 4)): mask[yy][xx] = True
    cache = {}; counts = {}; total = 0; offc = 0
    roles_col = {'primary': (230, 230, 230), 'secondary': (60, 50, 45), 'tertiary': (31, 107, 85), 'extended': (196, 154, 108), 'semantic': (200, 60, 50), 'off': (255, 0, 200), 'excluded': (255, 255, 255)}
    vis = Image.new('RGB', (sw, sh)); px = small.load(); vp = vis.load()
    for y in range(sh):
        for x in range(sw):
            if mask[y][x]: vp[x, y] = roles_col['excluded']; continue
            c = px[x, y]
            if c not in cache:
                o = oklab(c); best = min(R, key=lambda r: (o[0] - r[2][0]) ** 2 + (o[1] - r[2][1]) ** 2 + (o[2] - r[2][2]) ** 2)
                d = sum((o[i] - best[2][i]) ** 2 for i in range(3)) ** .5
                cache[c] = best[0] if d <= .08 else 'off'
            role = cache[c]; vp[x, y] = roles_col.get(role, (0, 0, 0))
            if role == 'semantic': continue
            total += 1
            if role == 'off': offc += 1; continue
            counts[role] = counts.get(role, 0) + 1
    vis.resize((W // 2, H // 2)).save(out_png)
    brandpx = sum(counts.get(k, 0) for k in ('primary', 'secondary', 'tertiary'))
    pct = {k: round(100 * counts.get(k, 0) / brandpx, 1) if brandpx else 0 for k in ('primary', 'secondary', 'tertiary')}
    return {'role_share': pct, 'extended_pct_of_page': round(100 * counts.get('extended', 0) / max(total, 1), 1), 'off_palette_pct_of_page': round(100 * offc / max(total, 1), 1)}

def extract(png, n=10):
    from PIL import Image
    im = Image.open(png).convert('RGB').resize((360, 225)).quantize(colors=n).convert('RGB')
    cols = sorted(im.getcolors(360 * 225), reverse=True)
    for cnt, c in cols: print(f'#{c[0]:02x}{c[1]:02x}{c[2]:02x}  {100 * cnt / (360 * 225):5.1f}%')

def run(page, brand_path, out, q):
    brand = json.load(open(brand_path)) if brand_path else {}
    out = os.path.abspath(out); work = tempfile.mkdtemp(prefix='brand-'); prof = os.path.join(work, 'prof')
    shutil.copytree(os.path.dirname(os.path.abspath(page)), os.path.join(work, 'site'), dirs_exist_ok=True, ignore=shutil.ignore_patterns('node_modules', '.git', 'before', 'after', '*.png'))
    target = os.path.join(work, 'site', os.path.basename(page))
    s = open(target, encoding='utf-8', errors='ignore').read()
    js = open(os.path.join(HERE, 'brand_audit.js')).read()
    inj = '<script>window.__BRAND=' + json.dumps(brand) + ';addEventListener("load",()=>setTimeout(()=>{' + js + '},1200));</script>'
    inst = os.path.join(work, 'site', '.__brand.html'); open(inst, 'w', encoding='utf-8').write(s.replace('</body>', inj + '</body>') if '</body>' in s else s + inj)
    res = {}
    r = chrome(['--window-size=1440,900', '--dump-dom', 'file://' + inst + q], prof)
    m = re.search(r'<script type="application/json" id="__brand">(.*?)</script>', r.stdout, re.S)
    res['desktop'] = json.loads(html.unescape(m.group(1))) if m else {'error': r.stderr[-300:]}
    wrap = os.path.join(work, 'site', '.__wrap.html')
    open(wrap, 'w').write('<!doctype html><body style="margin:0"><script>addEventListener("message",e=>{if(e.data&&e.data.brand){const s=document.createElement("script");s.type="application/json";s.id="__brand";s.textContent=e.data.brand;document.body.appendChild(s)}})</script>'
                          f'<iframe src="file://{inst}{q}" style="border:0;width:390px;height:844px"></iframe></body>')
    r = chrome(['--window-size=600,844', '--dump-dom', 'file://' + wrap], prof)
    m = re.search(r'<script type="application/json" id="__brand">(.*?)</script>', r.stdout, re.S)
    res['mobile'] = json.loads(html.unescape(m.group(1))) if m else {'error': 'mobile audit did not run'}
    os.makedirs(out, exist_ok=True)
    chrome(['--window-size=1440,900', f'--screenshot={out}/clean.png', 'file://' + target + q], prof)
    w2 = os.path.join(work, 'site', '.__wrap2.html'); open(w2, 'w').write(f'<!doctype html><body style="margin:0"><iframe src="file://{target}{q}" style="border:0;width:390px;height:844px"></iframe></body>')
    chrome(['--window-size=600,844', f'--screenshot={out}/_m.png', 'file://' + w2], prof)
    try:
        from PIL import Image
        Image.open(f'{out}/_m.png').crop((0, 0, 390, 844)).save(f'{out}/clean-390.png'); os.remove(f'{out}/_m.png')
        res['proportion'] = share(f'{out}/clean.png', brand, res['desktop'].get('exclude', []), f'{out}/share.png') if brand else None
    except Exception as e:
        res['proportion'] = {'error': str(e)}
    shutil.rmtree(work, ignore_errors=True)
    json.dump(res, open(f'{out}/report.json', 'w'), indent=1, ensure_ascii=False)
    write_md(res, brand, f'{out}/report.md', page)
    p = res.get('proportion') or {}
    print(f"proportion {p.get('role_share')} off-palette {p.get('off_palette_pct_of_page')}% · findings {len(res['desktop'].get('findings', []))} → {out}/report.md")
    return res

def write_md(res, brand, path, page):
    d = res.get('desktop', {}); p = res.get('proportion') or {}
    tgt = {k: brand.get('colors', {}).get(k, {}).get('share') for k in ('primary', 'secondary', 'tertiary')}
    tol = brand.get('colors', {}).get('tolerance', 10)
    L = [f'# Brand audit (measured): {os.path.basename(page)}', '']
    if p.get('role_share'):
        L += ['## Colour proportion (desktop, semantic and images excluded)', '| Role | Measured | Target | Status |', '|---|---|---|---|']
        for k in ('primary', 'secondary', 'tertiary'):
            m, t = p['role_share'].get(k, 0), tgt.get(k)
            L.append(f'| {k} | {m}% | {t}% | {"✓" if t is not None and abs(m - t) <= tol else "✗"} |')
        L += [f"Off-palette pixels: {p.get('off_palette_pct_of_page')}% of the page · extended colours: {p.get('extended_pct_of_page')}%", '']
    L += ['## Fonts', f"Used (text nodes by first family): {d.get('fontsUsed')}", f"Brand fonts loaded: {d.get('fontsLoaded')}", '',
          '## Icons', f"{d.get('icons')}", '', '## Findings (desktop)', '| # | Pillar | Sev | Where | Finding |', '|---|---|---|---|---|']
    for i, f in enumerate(d.get('findings', []), 1): L.append(f"| {i} | {f['pillar']} | {f['sev']} | `{f['where']}` | {f['msg']} |")
    mf = res.get('mobile', {}).get('findings', [])
    extra = [f for f in mf if f['msg'] not in {x['msg'] for x in d.get('findings', [])}]
    if extra:
        L += ['', '## Extra findings at 390 px', '| Pillar | Sev | Where | Finding |', '|---|---|---|---|'] + [f"| {f['pillar']} | {f['sev']} | `{f['where']}` | {f['msg']} |" for f in extra]
    L += ['', 'share.png: grey = primary, dark = secondary, green = tertiary, tan = extended, red = semantic, magenta = off-palette, white = excluded.']
    open(path, 'w').write('\n'.join(L))

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    if '--extract' in a:
        tmp = tempfile.mkdtemp(); prof = os.path.join(tmp, 'p'); shutil.copy(a[0], tmp + '/x.html')
        chrome(['--window-size=1440,900', f'--screenshot={tmp}/x.png', f'file://{tmp}/x.html'], prof); extract(f'{tmp}/x.png'); sys.exit(0)
    run(a[0], opt('--brand'), opt('--out', 'brand-audit'), opt('--query', ''))
