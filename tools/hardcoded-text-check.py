#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""فحص النصوص المثبتة (المرحلة 7 / الجولة الثانية R2) — بوابة ثابتة بلا متصفح.

الأقسام:
1) نصوص عربية داخل سلاسل JS: يفشل الفحص إذا وُجد حرف عربي
   (\\u0600-\\u06FF) داخل سلسلة نصية ('' أو \"\" أو ``) في أي ملف
   .js متتبَّع تحت components/ أو shared/ خارج ملفات */labels.js.
   التعليقات مستثناة (لا تظهر للمستخدم). لا نجتاح للنصوص الإتاحية
   (aria-label) — كل نص يظهر للمستخدم أو لقارئ الشاشة يجب أن يمرّ
   عبر السجل.

2) استيراد labels في المصدر (R2.3.8): كل عائلة لها labels.js يجب أن
   يستوردها ملف سلوكها (import ... from './labels.js') — النصوص صارت
   تُضمَّن في الحزم المبنية فلا تُحمَّل ملفات labels منفصلة في أي صفحة
   (يفحص أيضًا صفر وسوم <script src=…labels.js> في الصفحات المتتبعة).

3) تغطية المفاتيح: كل L('key') في JS العائلة يجب أن يكون له مفتاح
   في labels.js المقابل.

4) تغطية الأنواع (الجولة الثانية R3): المصدر لم يعد ينشر window.Micro*
   (الغلوبالات تُنشئها مداخل IIFE المولدة — R-D3، والفحص القديم عليها
   صفر بطبيعته فحُذف)، فالفحص هنا يتحقق من صادرات كل مدخل ESM مبني
   مقابل الأنواع في tools/package/types/ (بديل micro-ui.d.ts القديم:
   ملف لكل مدخل + iife.d.ts للغلوبالات).
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TYPES_DIR = ROOT / 'tools/package/types'
ESM_DIR = ROOT / 'dist/esm'
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

# ---- 2) استيراد labels في المصدر (R2.3.8) ----
# كل عائلة لها labels.js: ملف سلوكها يستوردها (product-context: النواة)؛
# ولا تُحمَّل ملفات labels منفصلة في أي صفحة متتبعة (النصوص مضمنة في dist).
imports_checked = 0
for fam, files in sorted(family_js.items()):
    importers = [rel for rel in files
                 if re.search(r"from '\./labels\.js'", (ROOT / rel).read_text())]
    imports_checked += 1
    if fam == 'product-context':
        # النواة تسجّل نصوص العائلة؛ الـrenderers تقرأ عبر getLabel المشترك.
        core = ROOT / 'components/product-context/product-core.js'
        if "from './labels.js'" not in core.read_text():
            violations.append('labels-import: components/product-context/product-core.js لا يستورد ./labels.js')
    elif not importers:
        violations.append('labels-import: عائلة %s لا يستورد أي ملف سلوك لها ./labels.js' % fam)
    # كل ملف سلوك في العائلة يقرأ نصوصه عبر getLabel المستورد من shared
    for rel in files:
        if 'getLabel(' in (ROOT / rel).read_text() and 'shared/labels.js' not in (ROOT / rel).read_text():
            violations.append('labels-import: %s يستخدم getLabel بلا استيراد shared/labels.js' % rel)
for rel in ls_files('*.html'):
    text = (ROOT / rel).read_text()
    if re.search(r'<script[^>]*src="[^"]*/labels\.js"', text):
        violations.append('labels-import: %s يحمّل labels.js منفصلًا — النصوص مضمنة في dist/iife' % rel)

# ---- 3) تغطية المفاتيح (R5: مفاتيح دلالية) ----
keys_checked = 0
for fam, files in family_js.items():
    labels_src = (ROOT / 'components' / fam / 'labels.js').read_text()
    defined = set(re.findall(r"'([a-zA-Z][a-zA-Z0-9.]*)':", labels_src))
    legacy = {k for k in defined if re.fullmatch(r'k\d+', k)}
    if legacy:
        violations.append('labels-keys: عائلة %s ما زالت تملك مفاتيح kNNN: %s' % (fam, sorted(legacy)))
    used = set()
    for rel in files:
        for key in set(re.findall(r"L\('([a-zA-Z][a-zA-Z0-9.]*)'", (ROOT / rel).read_text())):
            used.add(key)
            keys_checked += 1
            if key not in defined:
                violations.append('labels-keys: %s يستخدم L(\'%s\') غير الموجود في labels.js' % (rel, key))
    unused = {k for k in defined if k not in used}
    if unused:
        violations.append('labels-keys: عائلة %s مفاتيح معرفة غير مستخدمة: %s' % (fam, sorted(unused)))


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

# ---- 4) تغطية الأنواع (الجولة الثانية R3) ----
# بعد R2 لا ينشر المصدر window.Micro* (الغلوبالات تُنشئها مداخل IIFE
# المولدة — R-D3)، فالفحص القديم على غلوبالات المصدر كان صفرًا بطبيعته
# وحُذف. هنا يُفحص كل مدخل ESM مبني: كل اسم مصدَّر في dist/esm/<entry>.js
# يجب أن يظهر في tools/package/types/<entry>.d.ts.
esm_exports_checked = 0
if TYPES_DIR.is_dir() and ESM_DIR.is_dir():
    for types_file in sorted(TYPES_DIR.glob('*.d.ts')):
        # stem على "buttons.d.ts" يعيد "buttons.d" (يزيل اللاحقة الأخيرة
        # فقط) — القص الصريح هو الصحيح؛ هذا الخلل كان كامنًا لأن القسم
        # لم يُفعَّل قبل توفر الأنواع في R3.
        entry = types_file.name[:-len('.d.ts')]
        esm_file = ESM_DIR / (entry + '.js')
        if not esm_file.is_file():
            continue
        esm_src = strip_comments(esm_file.read_text())
        exported = set()
        for m in re.finditer(r'export\s*\{([^}]+)\}', esm_src):
            for part in m.group(1).split(','):
                part = part.strip()
                if not part:
                    continue
                # "name" أو "name as alias" — المسمى العام هو alias إن وجد
                names = part.split(' as ')
                exported.add(names[-1].strip())
        types_src = types_file.read_text()
        for name in sorted(exported):
            if name in ('default',):
                continue
            esm_exports_checked += 1
            if not re.search(r'\b%s\b' % re.escape(name), strip_comments(types_src)):
                violations.append('types-coverage: dist/esm/%s.js يصدّر %s بلا ذكر في types/%s.d.ts' % (entry, name, entry))

print('hardcoded-text: %d ملف JS مفحوص، %d سلسلة نصية، %d عائلة (استيراد labels)، %d مفتاح L()، %d صادر ESM مقابل الأنواع'
      % (files_scanned, strings_checked, imports_checked, keys_checked, esm_exports_checked))
if violations:
    for v in violations:
        print(v)
    print('hardcoded-text: FAIL — %d مخالفة' % len(violations))
    sys.exit(1)
print('hardcoded-text: PASS — صفر نصوص مثبتة، الاستيراد والمفاتيح والأنواع مكتملة')
