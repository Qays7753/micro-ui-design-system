#!/usr/bin/env python3
"""Extract every visible UI string (HTML text, alt/title/aria-label/placeholder, JS template text)
with an id and location, for the voice audit and the UX Writer hand-off.

usage: extract_copy.py <page.html> --out strings.json   (also writes strings.md next to it)
"""
import json, re, sys
from html.parser import HTMLParser

class G(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.skip = 0; s.stack = []; s.out = []
    def handle_starttag(s, t, attrs):
        if t in ('script', 'style', 'svg'): s.skip += 1
        s.stack.append(t); a = dict(attrs)
        for k in ('alt', 'title', 'aria-label', 'placeholder'):
            if a.get(k) and not s.skip: s.out.append({'line': s.getpos()[0], 'tag': t, 'kind': k, 'text': a[k]})
    def handle_endtag(s, t):
        if t in ('script', 'style', 'svg') and s.skip: s.skip -= 1
        if s.stack: s.stack.pop()
    def handle_data(s, d):
        if not s.skip and d.strip(): s.out.append({'line': s.getpos()[0], 'tag': s.stack[-1] if s.stack else '', 'kind': 'text', 'text': ' '.join(d.split())})

def main():
    a = sys.argv[1:]; out = a[a.index('--out') + 1] if '--out' in a else 'strings.json'
    src = open(a[0], encoding='utf-8').read(); g = G(); g.feed(src); rows = g.out
    for m in re.finditer(r'<script[^>]*>(.*?)</script>', src, re.S):
        base = src.count('\n', 0, m.start())
        for t in re.finditer(r'>([^<>{}$`]{2,})<', m.group(1)):
            txt = ' '.join(t.group(1).split())
            if re.search(r'[A-Za-z؀-ۿ]{2,}', txt): rows.append({'line': base + m.group(1).count('\n', 0, t.start()) + 1, 'tag': 'js', 'kind': 'template', 'text': txt})
        for t in re.finditer(r"(?<![\w.])'([^'\n]{3,90})'|\"([^\"\n]{3,90})\"", m.group(1)):
            txt = t.group(1) or t.group(2)
            if ' ' in txt and re.search(r'[A-Za-z]{3,}', txt) and not re.search(r'[{};=<>()]|^\.|#|\bvar\(|px\b|\.html|https?:', txt):
                rows.append({'line': base + m.group(1).count('\n', 0, t.start()) + 1, 'tag': 'js', 'kind': 'string', 'text': txt})
    seen = set(); uniq = []
    for r in rows:
        if r['text'] in seen or len(r['text']) < 2: continue
        seen.add(r['text']); r['id'] = f's{len(uniq) + 1}'; uniq.append(r)
    json.dump(uniq, open(out, 'w'), indent=1, ensure_ascii=False)
    md = out.rsplit('.', 1)[0] + '.md'
    open(md, 'w').write('| id | line | where | text |\n|---|---|---|---|\n' + '\n'.join(f"| {r['id']} | {r['line']} | {r['tag']}/{r['kind']} | {r['text'].replace('|', '/')} |" for r in uniq))
    print(f'{len(uniq)} strings → {out}, {md}')

if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    main()
