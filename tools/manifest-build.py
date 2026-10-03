#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — توليد MANIFEST.json (بصمات sha256 لكل ملفات التسليم).
من جذر المستودع:  python3 tools/manifest-build.py
يشمل الملفات المقصودة بالتسليم فقط: يستثني MANIFEST نفسه، وgit/البيئة
(.git, __pycache__, *.pyc)، وnode_modules، وأدلة العمل المؤقتة.
"""
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
PUBLIC_DIRS = {"assets", "components", "shared", "previews", "docs", "references", "reviews", "prompts", "tools", "handoff"}
PUBLIC_FILES = {"README.md", "AGENTS.md", "DESIGN.md", "pyproject.toml", "uv.lock"}


def included(p: Path) -> bool:
    rel = p.relative_to(ROOT)
    if p.is_symlink() or any(part.startswith(".") for part in rel.parts) or (rel.parts[0] not in PUBLIC_DIRS and str(rel) not in PUBLIC_FILES):
        return False
    parts = set(rel.parts)
    if parts & EXCLUDE_DIRS:
        return False
    if p.name in EXCLUDE_FILES or p.suffix in EXCLUDE_SUFFIXES or p.name.endswith(".DS_Store"):
        return False
    return p.is_file()


def main():
    manifest = {}
    for p in sorted(ROOT.rglob("*")):
        if not included(p):
            continue
        rel = str(p.relative_to(ROOT))
        h = hashlib.sha256(p.read_bytes()).hexdigest()
        manifest[rel] = h
    OUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"MANIFEST: {len(manifest)} مدخلًا")
    # تحقق ذاتي: أعد القراءة وقارن
    verify = {k: hashlib.sha256((ROOT / k).read_bytes()).hexdigest() for k in manifest}
    diff = [k for k in manifest if verify[k] != manifest[k]]
    if diff:
        print("اختلاف بعد التوليد:", diff)
        sys.exit(1)
    print("تحقق ذاتي: صفر اختلافات")


if __name__ == "__main__":
    main()
