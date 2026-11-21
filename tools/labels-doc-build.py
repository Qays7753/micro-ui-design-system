#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""توليد docs/LABELS.md من ملفات نصوص العائلات (الجولة الثانية R5.4).
--check: قارن بالموجود (بوابة داخل check-all). الجدول لكل عائلة: المفتاح،
النص الافتراضي (حرفي — R-D15)، المتغيرات {name}، والمدخل الذي يقرأه."""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAMILY_ENTRY = {
    'access-gateway': 'access-gateway', 'account-settings': 'account-settings',
    'carousel': 'carousel', 'data': 'data وpacked-circle',
    'fields': 'fields', 'info-strip': 'info-strip وinfo-strip-peek',
    'messages': 'messages', 'metric-comparison': 'metric-comparison',
    'navigation': 'navigation وaction-sheet', 'order-schedule': 'order-schedule',
    'organization': 'organization', 'product-context': 'product',
    'selection': 'selection وpicker',
}


def build():
    lines = [
        '# نصوص المكتبة الافتراضية — LABELS',
        '',
        'مولَّد آليًا من `components/*/labels.js` بـ`tools/labels-doc-build.py` — لا يُعدَّل يدويًا.',
        'المفاتيح دلالية بموضعها (الجولة الثانية R5): من يقرأ المفتاح يعرف أين يظهر النص.',
        'التخصيص: `init(root, { labels: { key: value } })` طبقة لهذا المثيل فقط،',
        'و`setLabels(partial)` من كل مدخل للسجل العام، و`setLocale(locale)` لتنسيق الأرقام.',
        'النصوص الافتراضية حرفية كما في 0.1.0 (R-D15).',
        '',
    ]
    for fam in sorted(FAMILY_ENTRY):
        src = (ROOT / 'components' / fam / 'labels.js').read_text(encoding='utf-8')
        body = src[src.index('export const defaults'):]
        lines += [f'## {fam}', '', f'المدخل: `@micro/ui/{FAMILY_ENTRY[fam]}`', '',
                  '| المفتاح | النص الافتراضي | المتغيرات |', '|---|---|---|']
        count = 0
        for m in re.finditer(r"'([a-zA-Z][a-zA-Z0-9.]*)': (\"(?:[^\"\\]|\\.)*\"|\[[^\n]*\]|\{[^\n]*\})", body):
            key, value = m.group(1), m.group(2)
            variables = sorted(set(re.findall(r'\{([a-zA-Z][a-zA-Z0-9]*)\}', value)))
            text = value if value[0] in '[{' else value[1:-1]
            if len(text) > 90:
                text = text[:87] + '…'
            lines.append(f'| `{key}` | {text} | {", ".join("{" + v + "}" for v in variables) or "—"} |')
            count += 1
        if not count:
            lines.append('| — | لا مفاتيح حاليًا | — |')
        lines.append('')
    return '\n'.join(lines).rstrip('\n') + '\n'


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--check', action='store_true', help='قارن بالموجود بلا كتابة')
    args = ap.parse_args()
    out = ROOT / 'docs' / 'LABELS.md'
    generated = build()
    if args.check:
        existing = out.read_text(encoding='utf-8') if out.exists() else ''
        if existing != generated:
            print('CHECK FAIL: docs/LABELS.md يختلف عن إعادة التوليد — شغّل بلا --check')
            return 1
        print('CHECK OK: docs/LABELS.md مطابق للمصدر')
        return 0
    out.write_text(generated, encoding='utf-8')
    print(f'BUILD OK: docs/LABELS.md ({len(generated.splitlines())} سطرًا)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
