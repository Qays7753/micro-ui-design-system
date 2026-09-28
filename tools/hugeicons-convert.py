#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تحويل أيقونات HugeIcons من حزمة @hugeicons/core-free-icons (dist/esm/*.js)
إلى ملفات SVG مستقلة — بنفس المسارات والسمات دون تعديل (الطريقة الموثقة في assets/SOURCES.md).
الاستخدام: python3 hugeicons-convert.py <مجلد الحزمة> <مجلد الإخراج> Icon1 Icon2 ...
مثال: python3 hugeicons-convert.py /tmp/hugeicons/package/dist/esm assets/icons XClose01Icon ChevronLeftIcon
اسم الملف الناتج: kebab-case من اسم الأيقونة (XClose01Icon → xclose01.svg ...)
"""
import re, sys
from pathlib import Path

src_dir = Path(sys.argv[1])
out_dir = Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)

def kebab(name):
    name = name.replace("Icon", "")
    return re.sub(r"(?<=[a-z0-9])([A-Z])", r"-\1", name).lower()

for icon in sys.argv[3:]:
    p = src_dir / f"{icon}.js"
    text = p.read_text(encoding="utf-8")
    elements = re.findall(r'\[\s*"(\w+)"\s*,\s*\{(.*?)\}\s*\]', text, re.S)
    inner = []
    for tag, attrs_raw in elements:
        attrs = []
        for key, val in re.findall(r'(\w+)\s*:\s*"([^"]*)"', attrs_raw):
            key_out = re.sub(r"(?<=[a-z])([A-Z])", r"-\1", key).lower()
            attrs.append(f'{key_out}="{val}"')
        inner.append(f'  <{tag} {" ".join(attrs)} />')
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"\n'
           '     stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n'
           + "\n".join(inner) + "\n</svg>\n")
    out = out_dir / f"{kebab(icon)}.svg"
    out.write_text(svg, encoding="utf-8")
    print(f"{icon} -> {out.name} ({len(elements)} elements)")
