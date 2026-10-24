#!/usr/bin/env python3
"""Static AI-slop scan for HTML / CSS / JSX / TSX / Vue / Svelte / Markdown.

usage: slop_scan.py <file-or-folder> [...] [--json out.json] [--min P1]
Prints `ID  SEV  file:line  message`. Exit 2 if any P0/P1, else 0.
IDs match references/catalogue.md. Ignore a line with `slop-ignore: ID` in a comment.
"""
import json, os, re, sys
from html.parser import HTMLParser

EXT = {'.html', '.htm', '.css', '.scss', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.md', '.mdx'}
SKIP_DIRS = {'node_modules', '.git', 'dist', 'build-cache', '.next', 'vendor', 'fixtures'}
SEV_ORDER = {'P0': 0, 'P1': 1, 'P2': 2}

# ---------- copy rules (applied to visible text only) ----------
DASH = re.compile(r'(—|–|(?<=\s)-(?=\s))')
EMOJI = re.compile('[\U0001F300-\U0001FAFF\U00002600-\U00002712\U00002718-\U000027BF\U0001F000-\U0001F2FF⭐⭕‼⁉™ℹ↔-↙⌚⌛⏩-⏳]')
AI_VOCAB = re.compile(r"\b(delve|delving|tapestry|seamless(ly)?|elevate[sd]?|unlock(s|ing)?|empower(s|ing)?|supercharg\w*|revolutioni[sz]\w*|effortless(ly)?|next-gen|cutting-edge|robust|leverag\w*|harness(es|ing)?|streamlin\w*|game[- ]changer|landscape|realm|testament|pivotal|vibrant|nestled|meticulous(ly)?|in today's fast-paced)\b", re.I)
NOT_BUT = re.compile(r"\b(not (just|only) [^.,;]{1,40}(,| but)|it'?s not [^.,;]{1,30}, it'?s)\b", re.I)
GENERIC_HERO = re.compile(r"(build the future|all-in-one (platform|solution)|work smarter,? not harder|everything you need to|the future of \w+|take \w+ to the next level)", re.I)
CHATBOT = re.compile(r"(certainly!|great question|i hope this helps|let'?s dive in|here'?s what you need to know)", re.I)
VAGUE_CTA = re.compile(r"^\s*(get started|learn more|submit|click here|read more)\s*[→>]?\s*$", re.I)
PLACEHOLDER = re.compile(r"\b(john doe|jane doe|jane smith|lorem ipsum|acme( inc| corp)?)\b", re.I)
FAKE_PROOF = re.compile(r"(\b\d{1,3}(,\d{3})*\+\s*(happy |satisfied )?(customers|users|teams|companies)|\b99\.9+%|trusted by (thousands|millions|\d))", re.I)
SUPERLATIVE = re.compile(r"\b(world[- ]class|best[- ]in[- ]class|industry[- ]leading|#1 \w+|loved by (thousands|millions))\b", re.I)
WELCOME = re.compile(r"\bwelcome back\b", re.I)
WORD_DASH = re.compile(r"^[A-Z][A-Z ]{2,}\s[—–-]\s")
MIDDOT_CHAIN = re.compile(r"(\S[^·]*·){3,}")
NUM_WORDS = re.compile(r"^\s*(one|two|three|four|five|six|seven|eight|nine|ten)\b(?!-)", re.I)
SEQ_MARK = re.compile(r"^\s*0[1-9]\s*[./]?\s*$")

# ---------- css / code rules ----------
CSS_RULES = [
    ('O1', 'P0', re.compile(r'border-(left|top|inline-start)\s*:\s*[2-8]px\s+solid', re.I), 'accent stripe border on one side'),
    ('O1', 'P0', re.compile(r'\b(border-l-[2-8]|border-t-[2-8])\b'), 'Tailwind accent stripe class'),
    ('V5', 'P0', re.compile(r'(-webkit-)?background-clip\s*:\s*text|\bbg-clip-text\b', re.I), 'gradient text'),
    ('K1', 'P0', re.compile(r'#(6366f1|4f46e5|8b5cf6|7c3aed|a855f7|9333ea|818cf8|a78bfa|c084fc)\b|\bfrom-(indigo|violet|purple)-\d{3}\b|\bto-(indigo|violet|purple|fuchsia)-\d{3}\b', re.I), 'purple/indigo default'),
    ('V4', 'P1', re.compile(r'backdrop-filter\s*:\s*blur|\bbackdrop-blur(-\w+)?\b', re.I), 'glass effect (check it is an overlay)'),
    ('V3', 'P1', re.compile(r'box-shadow\s*:[^;]*rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0?\.1\s*\)|\bshadow-(md|lg|xl)\b', re.I), 'default grey card shadow'),
    ('V6', 'P1', re.compile(r'box-shadow\s*:[^;]*(?<!0\s)\b0\s+0\s+\d{2,}px\s+(rgba?\((?!\s*0\s*,\s*0\s*,\s*0)|#(?!000))', re.I), 'coloured glow shadow'),
    ('T3', 'P1', re.compile(r'text-transform\s*:\s*uppercase[^}]*letter-spacing\s*:\s*0?\.(0[5-9]|[1-9])|letter-spacing\s*:\s*0?\.(0[5-9]|[1-9])\w*[^}]*text-transform\s*:\s*uppercase|\buppercase\b[^"\']*\btracking-(wide|wider|widest)\b', re.I), 'uppercase tracked label'),
    ('T1', 'P2', re.compile(r"font-family\s*:\s*['\"]?(Inter|Geist|Space Grotesk|Instrument Serif|Fraunces|DM Sans|Poppins|Plus Jakarta Sans)\b|family=(Inter|Space\+Grotesk|Instrument\+Serif|Fraunces|DM\+Sans|Poppins|Plus\+Jakarta)", re.I), 'default "safe" font (fine if it is the brand font)'),
    ('K5', 'P1', re.compile(r'#(f4f1ea|f5f0e8|faf7f2|d97757|c96442|cc785c)\b', re.I), 'cream/terracotta default'),
    ('M3', 'P1', None, 'animations without prefers-reduced-motion'),
    ('M4', 'P2', re.compile(r'transition[^;]*\blinear\b', re.I), 'linear easing on a transition'),
    ('B4', 'P2', re.compile(r'\.card[^{]*:hover\s*\{[^}]*(translate|scale)', re.I), 'hover lift on every card'),
    ('D2', 'P1', re.compile(r'\b(curveMonotoneX|curveCardinal|curveBasis|type\s*=\s*["\']monotone["\']|tension\s*:\s*0?\.[3-9])', re.I), 'smoothed data line'),
    ('V9', 'P2', re.compile(r'(traffic[- ]?lights?|window-dots)', re.I), 'fake window chrome'),
]

class TextGrab(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0; self.out = []; self.tag_stack = []
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'svg', 'code', 'pre'): self.skip += 1
        self.tag_stack.append(tag)
        a = dict(attrs)
        for k in ('alt', 'title', 'aria-label', 'placeholder'):
            if a.get(k): self.out.append((self.getpos()[0], a[k], tag, k))
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'svg', 'code', 'pre') and self.skip: self.skip -= 1
        if self.tag_stack: self.tag_stack.pop()
    def handle_data(self, data):
        if not self.skip and data.strip():
            self.out.append((self.getpos()[0], data, self.tag_stack[-1] if self.tag_stack else '', 'text'))

def js_strings(src):
    """Visible-looking text inside JS/JSX: JSX text nodes and template/quoted strings with spaces."""
    for m in re.finditer(r'>([^<>{}]{1,})<', src):
        yield src.count('\n', 0, m.start()) + 1, m.group(1), 'jsx'
    for m in re.finditer(r'(["\'`])((?:(?!\1).){1,120}?)\1', src):
        s = m.group(2)
        if re.search(r'[\u2014\u2013]', s) or ' ' in s and len(s) >= 3 and not re.search(r'[{};=<>]|https?:|\.(png|svg|webp|css|js)\b|^[\w-]+(\s[\w-]+)*$', s.strip()) or re.search(r'[—–]', s):
            yield src.count('\n', 0, m.start()) + 1, s, 'str'

def check_text(line, text, ctx, findings, path, ignored):
    t = ' '.join(text.split())
    if not t: return
    def add(i, sev, msg):
        if i not in ignored.get(line, set()):
            findings.append({'id': i, 'sev': sev, 'file': path, 'line': line, 'msg': msg, 'text': t[:90]})
    if DASH.search(t) and not re.fullmatch(r'[—–-]', t.strip()) or t.strip() in ('—', '–'):
        add('O3', 'P0', 'dash in visible text (rewrite: full stop, comma, colon, "to")')
    if EMOJI.search(t): add('I1', 'P0', 'emoji in UI text')
    if re.match(r'^\s*[\u25cf\u2022\u26ab\u26aa\u25cb]\s*\w', t): add('O6', 'P0', 'dot character leading a label/chip')
    m = AI_VOCAB.search(t)
    if m: add('C4', 'P1', f'AI vocabulary "{m.group(0)}"')
    if NOT_BUT.search(t): add('C2', 'P1', '"not just X, but Y" construction')
    if GENERIC_HERO.search(t): add('C5', 'P1', 'generic hero line')
    if CHATBOT.search(t): add('C11', 'P1', 'chatbot residue')
    if VAGUE_CTA.match(t): add('C9', 'P1', f'vague CTA "{t}"')
    if PLACEHOLDER.search(t): add('C14', 'P1', 'placeholder name/text')
    if FAKE_PROOF.search(t): add('C15', 'P0', 'unverifiable round stat / proof')
    if SUPERLATIVE.search(t): add('C16', 'P1', 'unsourced superlative')
    if WELCOME.search(t): add('D5', 'P1', '"Welcome back" greeting')
    if WORD_DASH.search(t): add('C12', 'P1', '"WORD, fragment" label')
    if '!' in t and ctx not in ('css',) and not re.search(r'!=|!\w', t): add('C6', 'P2', 'exclamation mark in UI text')
    if re.search(r'\w\s*(→|-&gt;)\s*$', t): add('C7', 'P2', 'arrow appended to link/button')
    if MIDDOT_CHAIN.search(t): add('C8', 'P2', 'meta chained with 3+ middle dots')
    if NUM_WORDS.match(t) and len(t) < 40: add('C10', 'P2', 'number written as a word')
    if SEQ_MARK.match(t): add('L3', 'P1', '01/02/03 marker (keep only for real sequences)')
    words = t.split()
    if ctx in ('button', 'a', 'h1', 'h2', 'h3', 'h4', 'th', 'label', 'summary') and 2 <= len(words) <= 6 and all(w[:1].isupper() for w in words if w[:1].isalpha()) and sum(1 for w in words if w[:1].isalpha()) >= 3 and not t.isupper():
        add('T6', 'P2', 'Title Case label')

def scan_file(path):
    try: src = open(path, encoding='utf-8', errors='ignore').read()
    except Exception: return []
    ignored = {}
    for i, ln in enumerate(src.split('\n'), 1):
        m = re.search(r'slop-ignore:\s*([\w, ]+)', ln)
        if m: ignored[i] = {x.strip() for x in m.group(1).split(',')}; ignored[i + 1] = ignored[i]
    f = []
    ext = os.path.splitext(path)[1].lower()
    # css/code rules on raw source
    for i, ln in enumerate(src.split('\n'), 1):
        for rid, sev, rx, msg in CSS_RULES:
            if rx is not None and rx.search(ln) and rid not in ignored.get(i, set()):
                f.append({'id': rid, 'sev': sev, 'file': path, 'line': i, 'msg': msg, 'text': ln.strip()[:90]})
    # ::before / ::after stripe heuristic
    for m in re.finditer(r'([^{}]+::?(before|after))\s*\{([^}]*)\}', src):
        body = m.group(3)
        thin_w = re.search(r'(?<![-\w])width\s*:\s*[2-6]px', body); thin_h = re.search(r'(?<![-\w])height\s*:\s*[2-6]px', body)
        spans_v = re.search(r'(top\s*:[^;]+;[^}]*bottom\s*:)|(bottom\s*:[^;]+;[^}]*top\s*:)|height\s*:\s*(100%|[5-9]\d%)', body)
        spans_h = re.search(r'(left\s*:[^;]+;[^}]*right\s*:)|(right\s*:[^;]+;[^}]*left\s*:)|width\s*:\s*(100%|[5-9]\d%)', body)
        if re.search(r'position\s*:\s*absolute', body) and re.search(r'background(-color)?\s*:', body) and ((thin_w and spans_v) or (thin_h and spans_h)):
            ln = src.count('\n', 0, m.start()) + 1
            f.append({'id': 'O1', 'sev': 'P0', 'file': path, 'line': ln, 'msg': 'accent stripe drawn with a pseudo-element', 'text': m.group(1).strip()[:90]})
    # O6 dot inside chips/pills/badges/status labels
    for m in re.finditer(r'([^{}]*?(chip|pill|badge|tag|status|stt|label|state)[^{}]*?::?before)\s*\{([^}]*)\}', src, re.I):
        body = m.group(3)
        if re.search(r'border-radius\s*:\s*(50%|999px|\d{2,}px)', body) and re.search(r'(?<![-\w])width\s*:\s*([3-9]|1[0-2])px', body) and not re.search(r'legend', m.group(1), re.I):
            ln = src.count('\n', 0, m.start()) + 1
            f.append({'id': 'O6', 'sev': 'P0', 'file': path, 'line': ln, 'msg': 'dot drawn inside a chip/status label', 'text': m.group(1).strip()[-90:]})
    for m in re.finditer(r'<span[^>]*class="[^"]*\b(dot|status-dot|badge-dot|pill-dot)\b[^"]*"', src):
        if not re.search(r'legend', src[max(0, m.start() - 200):m.start()], re.I):
            f.append({'id': 'O6', 'sev': 'P0', 'file': path, 'line': src.count('\n', 0, m.start()) + 1, 'msg': 'dot element inside a chip/status label', 'text': m.group(0)[:90]})
    if re.search(r'@keyframes|animation\s*:', src) and 'prefers-reduced-motion' not in src and ext in ('.html', '.htm', '.css', '.scss', '.vue', '.svelte'):
        f.append({'id': 'M3', 'sev': 'P1', 'file': path, 'line': 1, 'msg': 'animations without prefers-reduced-motion', 'text': ''})
    # visible text
    if ext in ('.html', '.htm', '.vue', '.svelte'):
        p = TextGrab()
        try: p.feed(src)
        except Exception: pass
        for line, text, tag, kind in p.out: check_text(line, text, tag if kind == 'text' else kind, f, path, ignored)
        for m in re.finditer(r'<script[^>]*>(.*?)</script>', src, re.S):
            base = src.count('\n', 0, m.start())
            for line, text, kind in js_strings(m.group(1)): check_text(base + line, text, kind, f, path, ignored)
    elif ext in ('.jsx', '.tsx', '.js', '.ts'):
        for line, text, kind in js_strings(src): check_text(line, text, kind, f, path, ignored)
    elif ext in ('.md', '.mdx'):
        for i, ln in enumerate(src.split('\n'), 1):
            if not ln.startswith(('```', '    ', '|---')): check_text(i, ln, 'text', f, path, ignored)
    elif ext in ('.css', '.scss'):
        for m in re.finditer(r'content\s*:\s*["\']([^"\']+)["\']', src):
            check_text(src.count('\n', 0, m.start()) + 1, m.group(1), 'css', f, path, ignored)
    return f

def walk(target):
    if os.path.isfile(target): yield target; return
    for root, dirs, files in os.walk(target):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith('.')]
        for fn in files:
            if os.path.splitext(fn)[1].lower() in EXT and 'slop-example' not in fn: yield os.path.join(root, fn)

def main():
    args = sys.argv[1:]
    out = None; mn = 'P2'
    if '--json' in args: i = args.index('--json'); out = args[i + 1]; del args[i:i + 2]
    if '--min' in args: i = args.index('--min'); mn = args[i + 1]; del args[i:i + 2]
    if not args: print(__doc__); sys.exit(1)
    found = []
    for t in args:
        for p in walk(t): found += scan_file(p)
    found = [x for x in found if SEV_ORDER[x['sev']] <= SEV_ORDER[mn]]
    # de-duplicate same id+line
    seen = set(); uniq = []
    for x in sorted(found, key=lambda x: (SEV_ORDER[x['sev']], x['file'], x['line'], x['id'])):
        k = (x['id'], x['file'], x['line'])
        if k not in seen: seen.add(k); uniq.append(x)
    for x in uniq:
        rp = os.path.relpath(x['file']); rp = x['file'] if rp.startswith('../..') else rp
        print(f"{x['id']:<4} {x['sev']}  {rp}:{x['line']}  {x['msg']}" + (f"  | {x['text']}" if x['text'] else ''))
    c = {s: sum(1 for x in uniq if x['sev'] == s) for s in ('P0', 'P1', 'P2')}
    print(f"\n{c['P0']} P0 · {c['P1']} P1 · {c['P2']} P2")
    if out: json.dump({'counts': c, 'findings': uniq}, open(out, 'w'), indent=1, ensure_ascii=False)
    sys.exit(2 if c['P0'] or c['P1'] else 0)

if __name__ == '__main__':
    main()
