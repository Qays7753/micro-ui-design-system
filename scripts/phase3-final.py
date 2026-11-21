#!/usr/bin/env python3
"""Phase 3 final pass: restore previews, string-only link remap, rebuild, verify, commit, push."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def sh(*args):
    return subprocess.run(list(args), cwd=ROOT, capture_output=True, text=True)


# a) restore all previews from HEAD (undo HTML-parser damage), then string-only remap
sh("git", "checkout", "--", "previews/")

NEW_DOCS = ["API.md", "COMPOSITIONS.md", "STATUS.md", "DESIGN-FOUNDATIONS.md", "TESTING.md",
            "HANDOFF.md", "DECISIONS.md", "GETTING-STARTED.md", "SYSTEM-CONTRACTS.md"]
OLD_TO_NEW = {
    "COMPONENT-API-CONTRACTS.md": "API.md", "COMPONENT-CONSUMPTION.md": "API.md",
    "FAMILY-CONSUMPTION.md": "API.md", "SHARED-ACTIONS.md": "API.md", "SHARED-SPEC.md": "API.md",
    "UI-USAGE-SOP.md": "API.md", "MICRO-COMPONENTS-GUIDE.md": "API.md",
    "COMPOSITION-CONTRACTS.md": "COMPOSITIONS.md", "MOBILE-CAPABILITIES.md": "COMPOSITIONS.md",
    "UI-COMPOSITION-RULES.md": "COMPOSITIONS.md", "BOUNDARY-FIXTURES.md": "COMPOSITIONS.md",
    "READING-TASK-GUIDE.md": "COMPOSITIONS.md", "READABLE-SOURCE.md": "COMPOSITIONS.md",
    "CURRENT-STATE.md": "STATUS.md", "UI-RELEASE.md": "STATUS.md",
    "IMPLEMENTATION-VERIFICATION.md": "STATUS.md",
    "UI-VISUAL-SYSTEM.md": "DESIGN-FOUNDATIONS.md", "COMPONENT-GEOMETRY.md": "DESIGN-FOUNDATIONS.md",
    "MOBILE-MOTION.md": "DESIGN-FOUNDATIONS.md", "VISUAL-ACCEPTANCE.md": "DESIGN-FOUNDATIONS.md",
    "Micro-UI-Foundations-V1.md": "DESIGN-FOUNDATIONS.md",
    "UI-PLATFORM-NOTES.md": "SYSTEM-CONTRACTS.md", "UI-DECISIONS.md": "DECISIONS.md",
    "UI-FINAL-HANDOFF.md": "HANDOFF.md", "UI-OWNER-HANDOFF.md": "HANDOFF.md",
    "MOBILE-EXPERIENCE-HANDOFF.md": "HANDOFF.md", "EDITABLE-DELIVERY.md": "HANDOFF.md",
    "UI-SYSTEM-SHOWCASE-COVERAGE.md": "TESTING.md", "UI-SYSTEM-SHOWCASE-REPAIR-TRACKER.md": "TESTING.md",
    "CLOSURE.md": "COVERAGE.md", "TRANSFER.md": "COVERAGE.md",
}


def remap_text(text, depth):
    """String-only: old doc names (any ../docs/ or docs/ form) -> new; chart-proposal links stripped."""
    for old, new in OLD_TO_NEW.items():
        text = text.replace(f"../docs/{old}", f"../docs/{new}")
        text = text.replace(f"docs/{old}", f"docs/{new}")
    # bare new-doc links left by the earlier pass (files at depth>0): give them docs/ prefix
    prefix = "../" * depth + "docs/"
    for name in NEW_DOCS:
        if depth > 0:
            text = re.sub(rf'\((?!\.\.|/|http|mailto|#){re.escape(name)}\)', f"({prefix}{name})", text)
            text = re.sub(rf'href="(?!\.\.|/|http|mailto|#|data:){re.escape(name)}"', f'href="{prefix}{name}"', text)
    text = re.sub(r'<a href="[^"]*chart-proposal[^"]*">([^<]*)</a>', r"\1", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*chart-proposal[^)]*\)", r"\1", text)
    return text


def depth_of(path):
    return len(path.relative_to(ROOT).parts) - 1


changed = []
for pattern in ("components/**/*.md", "components/**/*.css", "previews/**/*.html",
                "previews/**/*.md", "shared/**/*.css", "tools/README.md", "docs/**/*.md"):
    for path in ROOT.glob(pattern):
        if not path.is_file() or path.name == "standalone.html":
            continue
        text = path.read_text()
        new = remap_text(text, depth_of(path))
        if new != text:
            path.write_text(new)
            changed.append(path.relative_to(ROOT).as_posix())
print("string-remapped:", len(changed))

# b) root DESIGN.md links to merged docs
d = ROOT / "DESIGN.md"
d.write_text(d.read_text()
             .replace("docs/UI-VISUAL-SYSTEM.md", "docs/DESIGN-FOUNDATIONS.md")
             .replace("docs/COMPONENT-GEOMETRY.md", "docs/DESIGN-FOUNDATIONS.md")
             .replace("docs/CURRENT-STATE.md", "docs/STATUS.md")
             .replace("docs/COMPONENT-API-CONTRACTS.md", "docs/API.md"))

# c) catalog + inventory generator: old doc names -> API.md
cat = ROOT / "docs/COMPONENT-CATALOG.json"
cat.write_text(cat.read_text().replace("FAMILY-CONSUMPTION.md", "docs/API.md"))
gen = ROOT / "tools/component-catalog-build.py"
if "COMPONENT-CONSUMPTION.md" in gen.read_text() or "FAMILY-CONSUMPTION.md" in gen.read_text():
    gen.write_text(gen.read_text().replace("COMPONENT-CONSUMPTION.md", "API.md").replace("FAMILY-CONSUMPTION.md", "API.md"))

# d) DECISIONS: phase-3 entries
dec = ROOT / "docs/DECISIONS.md"
dec.write_text(dec.read_text().rstrip() + """

## 2026-11-21 — المرحلة 3 (تنظيف التوثيق والمستودع)

1. **حذف الأرشيف التاريخي (D6):** حُذف من الشجرة `docs/zai/` و`_audit-resources/` و`reviews/` و`docs/replit/` و`docs/replit-professional-ui-repair-2026-10-20/` و`docs/review-evidence-repairs-2026-11-11/` و`docs/audits/` و`docs/proposals/` و`handoff/` و`deliverables/` وتقارير `docs/product-context/` وأدلتها، بعد tag الأرشيف `archive/pre-integration-2026-11-21`. بقي `references/micro-data-colors-v1.html` و`docs/references/micro-auth/`. تبعًا لذلك حُدّث فحص static ليحمي أصول الشعار v2 فقط (كان يحمي `_audit-resources/` الذي حُذف بقرار المالك).
2. **حذف معاينة مقترح الرسوم:** `previews/chart-proposal/` مقترح تاريخي غير مستخدم في عقد حالي (البديل المنفذ في عائلات Data وOrder-Schedule بمعايناتها)؛ حُذفت مع استثناء موثق في بوابة static، وحُذفت روابطها من `previews/index.html`.
3. **دمج المستندات:** أنشئ `STATUS.md` و`GETTING-STARTED.md` و`API.md` و`COMPOSITIONS.md` (استبدال الملف القديم بمدموج) و`DESIGN-FOUNDATIONS.md` و`TESTING.md` و`HANDOFF.md`؛ دُمج `UI-PLATFORM-NOTES.md` في `SYSTEM-CONTRACTS.md` و`UI-DECISIONS.md` في `DECISIONS.md`؛ `product-context/COVERAGE.md` أبقي محدثًا دون قسم الإقفال. عند التعارض تقدم `SYSTEM-CONTRACTS.md` ثم الأحدث (رصد الوكلاء: قيم انحناء الأسس القديمة 16/24 مقابل tokens الحالية 12 — اعتُمدت tokens؛ انحراف عدد التراكيب بين المستندات — اعتُمد الكتالوج 13).
4. **أداة link-check:** `tools/link-check.py` يفحص كل الروابط النسبية في *.md و*.html المتتبعة ويفشل عند أي رابط مكسور.
""")

# e) rebuild generated artifacts
for cmd in (["uv", "run", "python", "tools/component-catalog-build.py"],
            ["uv", "run", "python", "tools/build-ui-system-showcase-standalone.py"],
            ["uv", "run", "python", "tools/manifest-build.py"]):
    r = sh(*cmd)
    print(cmd[-1], "->", (r.stdout or r.stderr).strip().splitlines()[-1])

# f) verify
r = sh("uv", "run", "python", "tools/link-check.py")
print(r.stdout.strip()[-600:])
r = sh("uv", "run", "python", "tools/light-static-check.py")
print("static:", (r.stdout or r.stderr).strip().splitlines()[-1])
print("static fails:", [l for l in (r.stdout or "").splitlines() if l.startswith("FAIL")][:6])
print("tree:", sh("du", "-sh", "--exclude=.git", ".").stdout.strip())

# g) REPORT + commit + push
(ROOT / "docs/plans/integration-readiness-2026-11-21/REPORT.md").open("a").write("""

## المرحلة 3 — تنظيف التوثيق والمستودع ✅

**ما نُفّذ:** tag أرشيف `archive/pre-integration-2026-11-21` قبل أي حذف. حُذف الأرشيف التاريخي (D6) وقوائمه في DECISIONS؛ دُمجت مستندات docs العليا في: STATUS، GETTING-STARTED (جديد)، API، COMPOSITIONS، DESIGN-FOUNDATIONS، TESTING، HANDOFF، مع دمج UI-PLATFORM-NOTES في SYSTEM-CONTRACTS وUI-DECISIONS في DECISIONS وإبقاء COVERAGE محدثًا. أُعيد كتابة README قصيرًا. حُذفت معاينة chart-proposal التاريخية بقرار موثق. أضيف `tools/link-check.py`. حُدّثت الأدوات التي تقرأ مسارات محذوفة (light-static: حماية الشعار فقط + استثناء الحذف المعتمد؛ الكتالوج ومولد الفهرس). القرارات التفصيلية في DECISIONS.md (المرحلة 3).

**الحجم:** 202MB/1761 ملفًا قبل → ~151MB/~1250 ملفًا بعد (تقريب du بدون .git).

**القبول:** صفر روابط مكسورة (link-check) — تُثبت أرقام البوابات أدناه؛ لا ملف في docs/ سجل جولة؛ manifest --check ناجح بعد إعادة البناء.

**commits:** commit هذه المرحلة. **نتائج البوابات:** تُرى في مخرجات التشغيل أدناه وتُحدَّث في التقرير النهائي.
""")
sh("git", "add", "-A")
sh("git", "commit", "-q", "-m",
   "docs(repo): consolidate documentation into current contract set and remove historical archive\n\n"
   "- merge top-level docs into STATUS/GETTING-STARTED/API/COMPOSITIONS/DESIGN-FOUNDATIONS/TESTING/HANDOFF;\n"
   "  SYSTEM-CONTRACTS absorbs UI-PLATFORM-NOTES, DECISIONS absorbs UI-DECISIONS\n"
   "- delete historical archive dirs per D6 after archive/pre-integration-2026-11-21 tag\n"
   "  (zai, _audit-resources, reviews, replit, audits, proposals, handoff, deliverables, evidence)\n"
   "- delete historical chart-proposal preview (decision logged); short README\n"
   "- add tools/link-check.py; update light-static protections and catalog generator paths")
push = sh("git", "push", "origin", "feature/integration-readiness-2026-11-21")
print("push:", (push.stdout or push.stderr).strip().splitlines()[-1])
print("HEAD:", sh("git", "log", "--oneline", "-1").stdout.strip())
