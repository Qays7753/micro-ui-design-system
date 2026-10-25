#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — توليد MANIFEST.json (بصمات sha256 لكل ملفات التسليم).
من جذر المستودع:  python3 tools/manifest-build.py [--check]
يشمل الملفات المقصودة بالتسليم فقط: يستثني MANIFEST نفسه، وgit/البيئة
(.git, __pycache__, *.pyc)، وnode_modules، وأدلة العمل المؤقتة.

--check (2026-10-25): وضع قراءة فقط للمواصفات — يقارن الملف الحالي
بإعادة التوليد في الذاكرة بلا كتابة؛ فشل = الملف قديم (خروج 1 وقائمة
الفروق)، نجاح = مطابق (خروج 0). أدوات الفحص تستخدم هذا الوضع فلا
تعدل شجرة العمل أبدًا (كان الفحص الموثق يكتب الملف دائمًا فيثبت
نجاحه الزائف بنفسه).
"""
import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "MANIFEST.json"

EXCLUDE_DIRS = {
    ".git", "__pycache__", "node_modules", ".venv", "venv",
    ".pythonlibs", ".cache", ".agents", ".local", "attached_assets", "deliverables",
}
EXCLUDE_FILES = {"MANIFEST.json"}
EXCLUDE_SUFFIXES = {".pyc", ".pyo", ".DS_Store"}
# 2026-10-25: مسارات مخرجات الفحص المعاد توليدها المستثناة في .gitignore
# («ليست أدلة مصدر») لا تُبصَّم — كانت تُدرج فيُشير MANIFEST المرفوع إلى
# محتوى غير موجود في نسخة نظيفة فيفشل --check هناك بمدخلات محذوفة.
EXCLUDE_PATHS = {
    "reviews/CONCEPTS",
    "reviews/UI-COMPLETION",
    "reviews/UI-SYSTEM-SHOWCASE/generated-concepts",
    "reviews/UI-SYSTEM-SHOWCASE/generated-data-scale",
    "reviews/UI-SYSTEM-SHOWCASE/ui-release",
}
PUBLIC_DIRS = {"assets", "components", "shared", "previews", "docs", "references", "reviews", "prompts", "tools", "handoff"}
PUBLIC_FILES = {"README.md", "AGENTS.md", "DESIGN.md", "pyproject.toml", "uv.lock"}


def included(p: Path) -> bool:
    rel = p.relative_to(ROOT)
    if p.is_symlink() or any(part.startswith(".") for part in rel.parts) or (rel.parts[0] not in PUBLIC_DIRS and str(rel) not in PUBLIC_FILES):
        return False
    rel_str = str(rel)
    if any(rel_str == ex or rel_str.startswith(ex + "/") for ex in EXCLUDE_PATHS):
        return False
    parts = set(rel.parts)
    if parts & EXCLUDE_DIRS:
        return False
    if p.name in EXCLUDE_FILES or p.suffix in EXCLUDE_SUFFIXES or p.name.endswith(".DS_Store"):
        return False
    return p.is_file()


def build_manifest() -> dict:
    manifest = {}
    for p in sorted(ROOT.rglob("*")):
        if not included(p):
            continue
        rel = str(p.relative_to(ROOT))
        h = hashlib.sha256(p.read_bytes()).hexdigest()
        manifest[rel] = h
    return manifest


def check_only() -> int:
    """قارن MANIFEST.json الموجود بإعادة التوليد في الذاكرة — بلا كتابة."""
    if not OUT.exists():
        print("CHECK FAIL: MANIFEST.json غير موجود — ولّده أولًا بلا --check")
        return 1
    expected = build_manifest()
    try:
        current = json.loads(OUT.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"CHECK FAIL: MANIFEST.json غير قابل للتحليل: {exc}")
        return 1
    stale = sorted(set(expected) - set(current))
    removed = sorted(set(current) - set(expected))
    changed = sorted(k for k in set(expected) & set(current) if expected[k] != current[k])
    if stale or removed or changed:
        print(f"CHECK FAIL: {len(stale)} ملفًا جديدًا بلا بصمة، {len(removed)} مدخلًا محذوفًا، {len(changed)} بصمة متغيرة")
        for k in stale[:10]:
            print("  +", k)
        for k in removed[:10]:
            print("  -", k)
        for k in changed[:10]:
            print("  ~", k)
        return 1
    print(f"CHECK OK: MANIFEST.json مطابق للمصدر ({len(expected)} مدخلًا، قراءة فقط)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="توليد/فحص MANIFEST.json")
    parser.add_argument("--check", action="store_true",
                        help="قارن الموجود بإعادة التوليد في الذاكرة بلا كتابة (خروج 1 إن كان قديمًا)")
    args = parser.parse_args()
    if args.check:
        return check_only()
    manifest = build_manifest()
    OUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"MANIFEST: {len(manifest)} مدخلًا")
    # تحقق ذاتي: أعد القراءة وقارن
    verify = {k: hashlib.sha256((ROOT / k).read_bytes()).hexdigest() for k in manifest}
    diff = [k for k in manifest if verify[k] != manifest[k]]
    if diff:
        print("اختلاف بعد التوليد:", diff)
        return 1
    print("تحقق ذاتي: صفر اختلافات")
    return 0


if __name__ == "__main__":
    sys.exit(main())
