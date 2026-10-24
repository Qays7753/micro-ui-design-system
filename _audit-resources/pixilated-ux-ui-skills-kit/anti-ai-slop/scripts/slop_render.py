#!/usr/bin/env python3
"""Rendered AI-slop audit in headless Chrome (computed styles + annotated screenshots).

usage:
  slop_render.py <file.html | URL> --out <dir> [--query "?static=1"] [--width 1440] [--height 900]
  slop_render.py --compare <before-dir> <after-dir> [--out compare.png]

Writes in <dir>: report.json, report.md, clean.png, annotated.png, clean-390.png, annotated-390.png.
Needs Google Chrome (macOS path below or $CHROME). Pillow is optional (used for --compare).
"""
import json, os, re, shutil, subprocess, sys, tempfile, html

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = os.environ.get('CHROME') or next((p for p in [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    shutil.which('google-chrome') or '', shutil.which('chromium') or '', shutil.which('chromium-browser') or ''] if p and os.path.exists(p)), None)
PROFILE = tempfile.mkdtemp(prefix='slop-chrome-')

def chrome(args):
    if not CHROME: sys.exit('Chrome not found. Set $CHROME or install Google Chrome.')
    base = [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
            '--allow-file-access-from-files', f'--user-data-dir={PROFILE}', '--virtual-time-budget=5000']
    return subprocess.run(base + args, capture_output=True, text=True, timeout=120)

def instrument(src_path, annotate):
    """Copy the page next to itself with audit.js injected (keeps relative assets working)."""
    s = open(src_path, encoding='utf-8', errors='ignore').read()
    js = open(os.path.join(HERE, 'audit.js')).read()
    inj = (f'<script>window.__SLOP_ANNOTATE={str(annotate).lower()};addEventListener("load",()=>setTimeout(()=>{{{js};'
           'if(parent!==window){const t=document.getElementById("__slop");parent.postMessage({slop:t&&t.textContent},"*")}},1200));</script>')
    s = s.replace('</body>', inj + '</body>') if '</body>' in s else s + inj
    d = os.path.dirname(os.path.abspath(src_path))
    out = os.path.join(d, f'.__slop_{"ann" if annotate else "raw"}_{os.getpid()}.html')
    open(out, 'w', encoding='utf-8').write(s)
    return out

def wrap_390(page_url, d, collect=False, height=844):
    w = os.path.join(d, f'.__slop_wrap_{os.getpid()}_{int(collect)}.html')
    js = ('<script>addEventListener("message",e=>{if(e.data&&e.data.slop){const s=document.createElement("script");'
          's.type="application/json";s.id="__slop";s.textContent=e.data.slop;document.body.appendChild(s)}})</script>') if collect else ''
    open(w, 'w').write(f'<!doctype html><body style="margin:0">{js}<iframe src="{html.escape(page_url)}" style="border:0;width:390px;height:{height}px;display:block"></iframe></body>')
    return w

def run(target, out, query='', W=1440, H=900):
    if re.match(r'https?://', target):
        sys.exit('URL mode: save the page locally first (curl -L URL > page.html) so audit.js can be injected.')
    final_out = os.path.abspath(out)
    # macOS privacy (TCC) blocks headless Chrome from reading/writing ~/Desktop, ~/Documents, ~/Downloads.
    # Work on a copy of the page's folder in a temp dir and copy the results back.
    work = tempfile.mkdtemp(prefix='slop-')
    src_dir = os.path.dirname(os.path.abspath(target))
    shutil.copytree(src_dir, os.path.join(work, 'site'), dirs_exist_ok=True, ignore=shutil.ignore_patterns('node_modules', '.git', 'before', 'after', 'grade', '*.png'))
    target = os.path.join(work, 'site', os.path.basename(target))
    out = os.path.join(work, 'out'); os.makedirs(out, exist_ok=True)
    raw = instrument(target, False); ann = instrument(target, True)
    try:
        q = query or ''
        # 1) report via dump-dom (desktop)
        res = {}
        for label, vw in (('desktop', W), ('mobile', 390)):
            if vw == 390:
                # true 390 px: the page runs inside a 390 px iframe and posts its report to the wrapper
                wrap = wrap_390('file://' + raw + q, os.path.dirname(raw), collect=True)
                r = chrome([f'--window-size=600,{H}', '--dump-dom', 'file://' + wrap]); os.remove(wrap)
            else:
                r = chrome([f'--window-size={vw},{H}', '--dump-dom', 'file://' + raw + q])
            m = re.search(r'<script type="application/json" id="__slop">(.*?)</script>', r.stdout, re.S)
            res[label] = json.loads(html.unescape(m.group(1))) if m else {'error': 'audit did not run', 'stderr': r.stderr[-400:]}
        # 2) screenshots
        chrome([f'--window-size={W},{H}', f'--screenshot={os.path.join(out, "clean.png")}', 'file://' + os.path.abspath(target) + q])
        chrome([f'--window-size={W},{H}', f'--screenshot={os.path.join(out, "annotated.png")}', 'file://' + ann + q])
        fullH = min(int(res.get('desktop', {}).get('docHeight', H) or H), 9000)
        if fullH > H:
            chrome([f'--window-size={W},{fullH}', f'--screenshot={os.path.join(out, "full.png")}', 'file://' + os.path.abspath(target) + q])
            chrome([f'--window-size={W},{fullH}', f'--screenshot={os.path.join(out, "annotated-full.png")}', 'file://' + ann + q])
        for name, page in (('clean-390.png', 'file://' + os.path.abspath(target) + q), ('annotated-390.png', 'file://' + ann + q)):
            wrap = wrap_390(page, os.path.dirname(ann)); tmp = os.path.join(out, '_full.png')
            chrome(['--window-size=600,844', f'--screenshot={tmp}', 'file://' + wrap]); os.remove(wrap)
            try:
                from PIL import Image
                Image.open(tmp).crop((0, 0, 390, 844)).save(os.path.join(out, name)); os.remove(tmp)
            except Exception:
                os.replace(tmp, os.path.join(out, name))
    finally:
        for p in (raw, ann):
            if os.path.exists(p): os.remove(p)
    json.dump(res, open(os.path.join(out, 'report.json'), 'w'), indent=1, ensure_ascii=False)
    write_md(res, os.path.join(out, 'report.md'), target)
    os.makedirs(final_out, exist_ok=True)
    for fn in os.listdir(out): shutil.copy2(os.path.join(out, fn), os.path.join(final_out, fn))
    shutil.rmtree(work, ignore_errors=True)
    d = res.get('desktop', {}).get('counts', {})
    print(f"desktop: {d.get('P0', '?')} P0 · {d.get('P1', '?')} P1 · {d.get('P2', '?')} P2  →  {final_out}/report.md")
    return res

def write_md(res, path, target):
    L = [f'# Rendered slop audit: {os.path.basename(target)}', '']
    for label in ('desktop', 'mobile'):
        r = res.get(label, {})
        if 'counts' not in r: L += [f'## {label}: audit failed', '```', str(r)[:400], '```']; continue
        c = r['counts']; verdict = 'HEAVY' if c['P0'] or c['P1'] >= 5 else ('MILD' if c['P1'] else 'CLEAN')
        L += [f"## {label} ({r['viewport'][0]} px): {c['P0']} P0 · {c['P1']} P1 · {c['P2']} P2 · {verdict}", '',
              '| # | ID | Sev | Where | What |', '|---|---|---|---|---|']
        for i, f in enumerate(r['findings'], 1):
            L.append(f"| {i} | {f['id']} | {f['sev']} | `{f['where']}` | {f['msg'].replace('|', '/')} |")
        L.append('')
    L.append('Numbers match the labels on annotated.png. Scripts produce false positives (expect 5 to 10%); drop them in your report with the reason.')
    open(path, 'w').write('\n'.join(L))

def compare(a, b, out):
    from PIL import Image, ImageDraw
    ia, ib = Image.open(os.path.join(a, 'clean.png')), Image.open(os.path.join(b, 'clean.png'))
    W = ia.width + ib.width + 40; Hh = max(ia.height, ib.height) + 60
    c = Image.new('RGB', (W, Hh), 'white'); c.paste(ia, (0, 60)); c.paste(ib, (ia.width + 40, 60))
    d = ImageDraw.Draw(c)
    ca = json.load(open(os.path.join(a, 'report.json')))['desktop']['counts']; cb = json.load(open(os.path.join(b, 'report.json')))['desktop']['counts']
    d.text((10, 20), f"BEFORE  {ca['P0']} P0 / {ca['P1']} P1 / {ca['P2']} P2", fill=(180, 35, 24))
    d.text((ia.width + 50, 20), f"AFTER  {cb['P0']} P0 / {cb['P1']} P1 / {cb['P2']} P2", fill=(31, 107, 85))
    c.save(out); print('wrote', out)

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    if a[0] == '--compare':
        out = a[a.index('--out') + 1] if '--out' in a else os.path.join(a[2], 'compare.png')
        compare(a[1], a[2], out); sys.exit(0)
    def opt(k, d=None):
        return a[a.index(k) + 1] if k in a else d
    run(a[0], opt('--out', 'slop-audit'), opt('--query', ''), int(opt('--width', 1440)), int(opt('--height', 900)))
