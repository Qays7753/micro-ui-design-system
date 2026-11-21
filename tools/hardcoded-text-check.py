#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""فحص النصوص المثبتة (المرحلة 7) — بويابة ثابتة بلا متصفح.

الأقسام:
1) نصوص عربية داخل سلاسل JS: يفشل الفحص إذا وُجد حرف عربي
   (\\u0600-\\u06FF) داخل سلسلة نصية ('' أو \"\" أو ``) في أي ملف
   .js متتبَّع تحت components/ أو shared/ خارج ملفات */labels.js.
   التعليقات مستثناة (لا تظهر للمستخدم). لا نجتاح للنصوص الإتاحية
   (aria-label) — كل نص يظهر للمستخدم أو لقارئ الشاشة يجب أن يمرّ
   عبر السجل. dist/ وsrc/ مرايا مولّدة بايت-ببايت (يبثها فحص
   package --check) فلا تُفحص هنا.

2) اقتران التحميل في الصفحات: كل صفحة HTML متتبَّعة تحمّل سلوك
   عائلة عبر <script> يجب أن تحمّل labels.js الخاص بها قبل أول
   سكربت للعائلة (وإلا ضاع النص وقت التصيير).

3) تغطية المفاتيح: كل L('key') في JS العائلة يجب أن يكون له مفتاح
   في labels.js المقابل.

4) تغطية .d.ts: كل دالة عامة منشورة على window.Micro* (مفاتيح كائن
   الواجهة أو تعيينات window.MicroX.foo =) يجب أن تظهر داخل
   interface MicroXApi في tools/package/micro-ui.d.ts. الداخلية
   (تبدأ بشرطة سفلية) مستثناة.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DTS = ROOT / 'tools/package/micro-ui.d.ts'
AR = re.compile(r'[\u0600-\u06FF]')
FAMILY_FILES_RE = re.compile(r'^(?:.*/)?components/([a-z-]+)/([a-z0-9-]+)\.js$')

violations = []
strings_checked = 0
files_scanned = 0


def ls_files(*args):
    return [p for p in subprocess.run(['git', 'ls-files', *args], cwd=ROOT,
                                      capture_output=True, text=True).stdout.split('\n') if p]


def scan_js_arabic(rel):
    """يعيد قائمة (سطر، مقتطف) لكل سلسلة نصية تحوي حرفًا عربيًا."""
    global strings_checked
    src = (ROOT / rel).read_text()
    found = []
    i = 0
    n = len(src)
    line = 1
    while i < n:
        c = src[i]
        if c == '\n':
            line += 1
            i += 1
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            j = src.find('\n', i)
            i = n if j == -1 else j
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '*':
            j = src.find('*/', i + 2)
            end = n if j == -1 else j + 2
            line += src.count('\n', i, end)
            i = end
            continue
        if c in '"\'`':
            start_line = line
            j = i + 1
            while j < n:
                if src[j] == '\\':
                    j += 2
                    continue
                if c != '`' and src[j] == '\n':
                    break
                if src[j] == c:
                    break
                if c == '`' and src[j] == '$' and j + 1 < n and src[j + 1] == '{':
                    depth = 1
                    k = j + 2
                    while k < n and depth:
                        if src[k] == '{':
                            depth += 1
                        elif src[k] == '}':
                            depth -= 1
                        k += 1
                    j = k
                    continue
                j += 1
            if j >= n or src[j] != c:
                i = min(j, n)
                continue
            value = src[i + 1:j]
            strings_checked += 1
            if AR.search(value):
                snippet = value.strip()[:60]
                found.append((start_line, snippet))
            line += src.count('\n', i, j + 1)
            i = j + 1
            continue
        i += 1
    return found


# ---- 1) نصوص عربية داخل سلاسل JS ----
family_js = {}
for rel in ls_files('components', 'shared'):
    if not rel.endswith('.js'):
        continue
    if rel.endswith('/labels.js'):
        continue
    files_scanned += 1
    for line_no, snippet in scan_js_arabic(rel):
        violations.append('hardcoded-text: %s:%d سلسلة عربية داخل JS خارج labels: %s' % (rel, line_no, snippet))
    m = FAMILY_FILES_RE.match(rel)
    if m and (ROOT / 'components' / m.group(1) / 'labels.js').exists():
        family_js.setdefault(m.group(1), []).append(rel)

# ---- 2) اقتران التحميل في الصفحات ----
# العلامات: وسم <script src> حقيقي، أو وسم <script data-sc-from> داخل
# standalone.html المولَّد (السكربتات مضمّنة بسمة أصلها). عيّنات التوثيق
# النصية داخل الصفحات (src لا يحلّ إلى ملف موجود بالنسبة للصفحة) لا
# تحمّل شيئًا فتُتجاهل عمدًا.
pages_checked = 0
for rel in ls_files('*.html'):
    text = (ROOT / rel).read_text()
    if '<script' not in text:
        continue
    pages_checked += 1
    labels_pos = {}
    first_js = {}
    base_dir = (ROOT / rel).parent
    for m in re.finditer(r'<script[^>]*\b(src|data-sc-from)="([^"]+)"[^>]*>', text):
        attr, src = m.group(1), m.group(2)
        if attr == 'data-sc-from':
            resolved = ROOT / src
        elif src.startswith(('http://', 'https://', 'data:')):
            continue
        else:
            resolved = (ROOT / src.lstrip('/')) if src.startswith('/') else (base_dir / src)
        try:
            resolved = resolved.resolve()
            resolved.relative_to(ROOT)
        except (ValueError, OSError):
            continue
        if not resolved.is_file():
            continue
        # العائلة من المسار المحلول — يشمل المسارات النسبية القصيرة
        # (src="data.js" داخل components/<family>/) التي كان النمط القديم
        # (مطابقة نص components/... في قيمة src) يغفلها فتفقد labels.js.
        cm = re.search(r'components/([a-z-]+)/([a-z0-9-]+)\.js$', str(resolved))
        dm = re.search(r'dist/js/([a-z0-9-]+)\.js$', src)
        if cm and cm.group(1) in family_js:
            if cm.group(2) == 'labels':
                labels_pos[cm.group(1)] = m.start()
            else:
                first_js.setdefault(cm.group(1), m.start())
        elif dm and dm.group(1).endswith('-labels'):
            fam = dm.group(1)[:-len('-labels')]
            if fam in family_js:
                labels_pos[fam] = m.start()
        elif dm:
            for fam2, files in family_js.items():
                if dm.group(1) in [f.rsplit('/', 1)[-1] for f in files]:
                    first_js.setdefault(fam2, m.start())
    for fam, pos in first_js.items():
        if fam not in labels_pos:
            violations.append('page-pairing: %s يحمل %s.js بلا labels.js للعائلة' % (rel, fam))
        elif labels_pos[fam] > pos:
            violations.append('page-pairing: %s يحمل labels.js للعائلة %s بعد أول سكربت لها' % (rel, fam))

# ---- 3) تغطية المفاتيح ----
keys_checked = 0
for fam, files in family_js.items():
    labels_src = (ROOT / 'components' / fam / 'labels.js').read_text()
    defined = set(re.findall(r'"([a-zA-Z][a-zA-Z0-9]*)":', labels_src))
    for rel in files:
        for key in set(re.findall(r"L\('([a-zA-Z0-9]+)'\)", (ROOT / rel).read_text())):
            keys_checked += 1
            if key not in defined:
                violations.append('labels-keys: %s يستخدم L(\'%s\') غير الموجود في labels.js' % (rel, key))


def strip_comments(src):
    """ينزع التعليقات مع احترام السلاسل النصية (لفحص d.ts على الكود فقط)."""
    out = []
    i = 0
    n = len(src)
    while i < n:
        c = src[i]
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            j = src.find('\n', i)
            i = n if j == -1 else j
        elif c == '/' and i + 1 < n and src[i + 1] == '*':
            j = src.find('*/', i + 2)
            j = n if j == -1 else j + 2
            out.append(' ')
            out.append('\n' * src.count('\n', i, j))
            i = j
        elif c in '"\'`':
            j = i + 1
            while j < n:
                if src[j] == '\\':
                    j += 2
                    continue
                if src[j] == c:
                    break
                j += 1
            out.append(src[i:j + 1])
            i = j + 1
        else:
            out.append(c)
            i += 1
    return ''.join(out)

def top_level_keys(body):
    """مفاتيح المستوى الأعلى فقط لكائن JS حرفي.

    النمط الساذج ((?:^|,)\\s*key:) كان يلتقط المفاتيح المتداخلة —
    خيارات مثل { trigger: …, backdropEl: … } داخل جسم تابع أو بين
    أقواس استدعاء — فتُحسب واجهة عامة وهي ليست كذلك. هنا يُحسب عمق
    الأقواس مع تخطي السلاسل النصية (تُوسم بعمق -1 فلا تُطابق)، ولا
    يقبل المفتاح إلا عند العمق 0 مسبوقًا بفاصل المستوى الأعلى.
    """
    dep = []
    d = 0
    i = 0
    n = len(body)
    while i < n:
        c = body[i]
        if c in '\'"`':
            j = i + 1
            while j < n:
                if body[j] == '\\':
                    j += 2
                    continue
                if body[j] == c:
                    break
                j += 1
            dep.extend([-1] * (min(j + 1, n) - i))
            i = j + 1
            continue
        if c in '([{':
            dep.append(d)
            d += 1
        elif c in ')]}':
            d -= 1
            dep.append(d)
        else:
            dep.append(d)
        i += 1
    keys = []
    for km in re.finditer(r'([A-Za-z_$][A-Za-z0-9_$]*)\s*:', body):
        s = km.start(1)
        if dep[s] != 0:
            continue
        prev = body[:s].rstrip()
        if prev and not prev.endswith(','):
            continue
        keys.append(km.group(1))
    return keys


# ---- 4) تغطية .d.ts ----
dts_text = DTS.read_text() if DTS.exists() else ''
interfaces = dict(re.findall(r'interface (Micro\w+Api) \{(.*?)\n\}', dts_text, re.S))
public_fns = 0
for rel in sorted(set(sum(family_js.values(), []) + ls_files('components', 'shared'))):
    if not rel.endswith('.js') or rel.endswith('/labels.js'):
        continue
    src = strip_comments((ROOT / rel).read_text())
    for m in re.finditer(r'window\.(Micro[A-Za-z]+)\s*=\s*\{', src):
        i = m.end() - 1
        depth = 0
        while i < len(src):
            c = src[i]
            if c in '\'"`':
                j = i + 1
                while j < len(src):
                    if src[j] == '\\':
                        j += 2
                        continue
                    if src[j] == c:
                        break
                    j += 1
                i = j + 1
                continue
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        body = src[m.end():i]
        for name in top_level_keys(body):
            if name.startswith('_'):
                continue
            public_fns += 1
            block = interfaces.get(m.group(1) + 'Api')
            if block is None or not re.search(r'\b%s\b' % re.escape(name), block):
                violations.append('dts-coverage: %s ينشر %s.%s بلا ذكر في micro-ui.d.ts' % (rel, m.group(1), name))
    for m in re.finditer(r'window\.(Micro[A-Za-z]+)\.([A-Za-z_][A-Za-z0-9_]*)\s*=(?![=>])', src):
        name = m.group(2)
        if name.startswith('_'):
            continue
        public_fns += 1
        block = interfaces.get(m.group(1) + 'Api')
        if block is None or not re.search(r'\b%s\b' % re.escape(name), block):
            violations.append('dts-coverage: %s ينشر %s.%s بلا ذكر في micro-ui.d.ts' % (rel, m.group(1), name))

print('hardcoded-text: %d ملف JS مفحوص، %d سلسلة نصية، %d صفحة HTML، %d مفتاح L()، %d دالة عامة مقابل d.ts'
      % (files_scanned, strings_checked, pages_checked, keys_checked, public_fns))
if violations:
    for v in violations:
        print(v)
    print('hardcoded-text: FAIL — %d مخالفة' % len(violations))
    sys.exit(1)
print('hardcoded-text: PASS — صفر نصوص مثبتة، الاقتران والمفاتيح وd.ts مكتملة')
