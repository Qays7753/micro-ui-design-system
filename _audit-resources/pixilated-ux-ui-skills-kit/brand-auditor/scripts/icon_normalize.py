#!/usr/bin/env python3
"""Normalise inline SVG icons in an HTML file to the brand icon spec (brand.json → icons).

usage: icon_normalize.py <page.html> --brand brand.json --out <fixed.html> [--dry]
Sets stroke-width / stroke-linecap / stroke-linejoin / fill="none" / stroke="currentColor" on icon
SVGs and their shapes, removes hard-coded colours, snaps width/height to the allowed sizes.
Skips: SVGs with data-brand-mark or data-brand-chart, inside .logo/.brand/.mark, role="img" with
more than 12 shapes, and SVGs wider than 48. Keeps fills on small dots (circle r ≤ 2).
Also normalises icons in JS template strings ('<svg ...>' inside <script>).
"""
import json, re, sys

def main():
    a = sys.argv[1:]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    src = open(a[0], encoding='utf-8').read(); spec = json.load(open(opt('--brand'))).get('icons', {})
    sw, cap, join = spec.get('stroke', 2), spec.get('linecap', 'round'), spec.get('linejoin', 'round')
    sizes = spec.get('sizes', [16, 20, 24]); outline = spec.get('style', 'outline') == 'outline'
    changed = 0; skipped = 0

    def fix_svg(m):
        nonlocal changed, skipped
        svg = m.group(0)
        head = svg[:svg.find('>') + 1]
        ctx = src[max(0, m.start() - 160):m.start()]
        shapes = len(re.findall(r'<(path|circle|rect|line|polyline|polygon|ellipse)\b', svg))
        w = re.search(r'\bwidth="(\d+)', head)
        vb = re.search(r'viewBox="[\d.\s-]+?\s([\d.]+)\s([\d.]+)"', head)
        if vb and float(vb.group(1)) > 48:   # big drawing space = illustration, not an icon
            skipped += 1; return svg
        if not w and shapes > 6:             # unsized and detailed: treat as illustration
            skipped += 1; return svg
        if re.search(r'data-brand-(mark|chart)', head) or re.search(r'class="[^"]*\b(logo|brand|mark)\b', ctx[-120:]) or shapes > 12 or (w and int(w.group(1)) > 48) or 'stroke=' not in svg and 'fill="currentColor"' in svg and shapes > 3:
            skipped += 1; return svg
        new = svg
        def set_attr(tag, k, v):
            if re.search(rf'\b{k}="[^"]*"', tag): return re.sub(rf'\b{k}="[^"]*"', f'{k}="{v}"', tag)
            return tag.replace('<svg', f'<svg {k}="{v}"', 1)
        h2 = head
        for k, v in (('stroke-width', sw), ('stroke-linecap', cap), ('stroke-linejoin', join), ('stroke', 'currentColor')):
            h2 = set_attr(h2, k, v)
        if outline: h2 = set_attr(h2, 'fill', 'none')
        if w:
            nearest = min(sizes, key=lambda s: abs(s - int(w.group(1))))
            h2 = re.sub(r'\bwidth="\d+"', f'width="{nearest}"', h2); h2 = re.sub(r'\bheight="\d+"', f'height="{nearest}"', h2)
        new = h2 + svg[len(head):]
        # shapes: strip hard colours and per-shape stroke widths; keep small dot fills
        def fix_shape(sm):
            t = sm.group(0)
            t = re.sub(r'\s(stroke-width|stroke-linecap|stroke-linejoin)="[^"]*"', '', t)
            t = re.sub(r'\sstroke="(#[0-9a-fA-F]{3,8}|rgb[^"]*)"', '', t)
            small_dot = t.startswith('<circle') and re.search(r'\br="(0?\.\d+|[01](\.\d+)?|2(\.0+)?)"', t)
            if small_dot:
                t = re.sub(r'\sfill="[^"]*"', '', t).replace('<circle', '<circle fill="currentColor"', 1)
            elif outline:
                t = re.sub(r'\sfill="(#[0-9a-fA-F]{3,8}|rgb[^"]*|currentColor)"', '', t)
            return t
        new = re.sub(r'<(path|circle|rect|line|polyline|polygon|ellipse)\b[^>]*>', fix_shape, new)
        if new != svg: changed += 1
        return new

    out = re.sub(r'<svg\b[^>]*>.*?</svg>', fix_svg, src, flags=re.S)
    if '--dry' in a: print(f'{changed} icons would change, {skipped} skipped'); return
    open(opt('--out', a[0]), 'w', encoding='utf-8').write(out)
    print(f'normalised {changed} icons, skipped {skipped} (marks, charts, illustrations) → {opt("--out", a[0])}')

if __name__ == '__main__':
    if len(sys.argv) < 3: print(__doc__); sys.exit(1)
    main()
