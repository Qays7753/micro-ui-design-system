"""Export the completed audit as one detailed Markdown document."""
from pathlib import Path
import collections
import json
import re

SOURCE = Path(__file__).resolve().parent
ROOT = SOURCE.parents[2]
OUTPUT = ROOT / "generated-artifacts/pixilated-audit/PIXILATED-UX-UI-AUDIT-DETAILED.md"

LABELS = {
    "id": "المعرّف",
    "title_ar": "العنوان",
    "recommendationAr": "التوصية المختصرة",
    "originalIDs": "معرّفات الاكتشاف الأصلية",
    "sourceReport": "التقرير المصدر",
    "discoverers": "المهارات ومسارات الاكتشاف",
    "category": "التصنيف",
    "severity": "الأولوية بعد المراجعة",
    "status": "درجة الإثبات",
    "rawMetadata": "التصنيف الأصلي قبل التوفيق",
    "fileLineSelector": "الملف والأسطر والمحدد",
    "evidence": "الدليل والقياس وإعادة الإنتاج",
    "screenshots": "مسارات الصور الداعمة",
    "exactProblem": "المشكلة المحددة",
    "rootCause": "السبب الجذري",
    "impact": "الأثر",
    "currentSafePatch": "الترقيع المحدود المقترح بعد الموافقة",
    "futureState": "التصور المستقبلي",
    "recommendedApproach": "المعالجة المفضلة",
    "patchVsStructural": "ترقيع أم تغيير بنيوي",
    "risks": "المخاطر",
    "acceptance": "اختبارات القبول اللاحقة",
    "ownerDecision": "قرار المالك",
    "required": "هل القرار مطلوب؟",
    "question": "السؤال",
    "options": "الخيارات",
    "option": "الخيار",
    "effect": "الأثر",
    "effects": "الآثار",
    "recommendation": "التوصية",
    "blocking": "ما الذي يحجبه القرار؟",
    "path": "المسار",
    "file": "الملف",
    "lines": "الأسطر",
    "selector": "المحدد",
    "skill": "المهارة",
    "skillFile": "ملف المهارة",
    "loaded": "LOADED — تم التحميل",
    "applied": "APPLIED — تم التطبيق",
    "individualReport": "تقرير المهارة المنفصل",
    "primaryReport": "تقرير المسار",
    "referencesRead": "المراجع التي قُرئت",
    "scriptsAndMethods": "السكريبتات والمناهج المستخدمة وحدود التنفيذ",
    "familiesAndFilesInspected": "العائلات والملفات المفحوصة",
    "sourceFindingIDs": "معرّفات النتائج الأصلية",
    "findingCount": "عدد النتائج المنسوبة للمهارة",
    "limitations": "الحدود",
    "states": "الحالات",
    "trigger": "المحفّز",
    "recommendedTreatment": "المعالجة المقترحة",
    "priority": "أولوية التصميم",
    "defaultStatus": "حالة الإثبات الافتراضية",
    "overrides": "التخصيص حسب العائلة",
    "runtimeEvidence": "أدلة التشغيل",
    "description": "الوصف",
    "familyOrder": "ترتيب العائلات",
    "importantInterpretation": "تفسير المصفوفة",
    "reason": "السبب",
    "disposition": "قرار المراجعة",
}


def load(name):
    return json.loads((SOURCE / name).read_text(encoding="utf-8"))


def label(key):
    return LABELS.get(key, key)


def scalar(value):
    if isinstance(value, bool):
        return "نعم" if value else "لا"
    if value is None:
        return "غير محدد"
    return str(value)


def render(value, depth=0):
    """Preserve all original values, with readable nested Markdown labels."""
    pad = "  " * depth
    if isinstance(value, dict):
        if not value:
            return pad + "- لا توجد تفاصيل إضافية.\n"
        parts = []
        for key, item in value.items():
            if isinstance(item, (dict, list)):
                parts.append(pad + f"- **{label(key)}:**\n" + render(item, depth + 1))
            else:
                text = scalar(item).replace("\n", "\n" + pad + "  ")
                parts.append(pad + f"- **{label(key)}:** {text}\n")
        return "".join(parts)
    if isinstance(value, list):
        if not value:
            return pad + "- لا توجد عناصر مسجلة.\n"
        parts = []
        for item in value:
            if isinstance(item, (dict, list)):
                parts.append(pad + "- سجل:\n" + render(item, depth + 1))
            else:
                text = scalar(item).replace("\n", "\n" + pad + "  ")
                parts.append(pad + "- " + text + "\n")
        return "".join(parts)
    return pad + scalar(value) + "\n"


def section_fields(obj, skip=()):
    return "\n".join(
        f"### {label(key)}\n\n{render(value)}"
        for key, value in obj.items()
        if key not in skip
    )


def shifted_markdown(text, offset=1):
    out, fenced = [], False
    for line in text.splitlines():
        if line.startswith("```") or line.startswith("~~~"):
            fenced = not fenced
        match = re.match(r"^(#{1,6}) (.*)$", line)
        if match and not fenced:
            line = "#" * min(len(match[1]) + offset, 6) + " " + match[2]
        out.append(line)
    return "\n".join(out)


def cell(value):
    return scalar(value).replace("|", "\\|").replace("\n", "<br>")


def main():
    register = load("FINAL-REGISTER.json")
    ledger = load("APPLICATION-LEDGER.json")
    coverage = load("edge-state-coverage.json")
    inventory = load("system-inventory.json")
    integrity = load("INTEGRITY-FINAL.json")
    browser = json.loads((ROOT / "generated-artifacts/pixilated-audit/edge/edge-results.json").read_text())
    findings = register["findings"]
    skill_files = sorted((SOURCE / "skill-reports").glob("*.md"))
    expected_skills = sorted(path.parent.name for path in SOURCE.parent.glob("*/SKILL.md"))
    assert len(findings) == 22
    assert len(expected_skills) == 11
    assert sorted(s["skill"] for s in ledger["skills"]) == expected_skills
    assert sorted(p.stem for p in skill_files) == expected_skills
    assert all(s["loaded"] and s["applied"] for s in ledger["skills"])

    parts = ["""# تقرير Pixilated التفصيلي لتدقيق UI/UX والتصور المستقبلي

**نوع الملف:** تقرير Markdown موحّد قابل للتنزيل والقراءة دون تشغيل التطبيق.

**لقطة التدقيق:** 24 أكتوبر 2026.

**المرجع:** المستودع المحلي لنظام التصميم فقط، مع الحزمة الرسمية الموجودة في:

`_audit-resources/pixilated-ux-ui-skills-kit/`

**حالة العمل:** تدقيق وتوصيات فقط. لم تُطبق الإصلاحات، ولا تُعد هذه الوثيقة موافقة تنفيذ.

> هذه نسخة تفصيلية من التقرير المنجز، وليست إعادة تدقيق بتاريخ إنشاء ملف Markdown. نتائج التشغيل وبصمات السلامة تخص لقطة التدقيق المذكورة. يجمع الملف النتائج والقرارات والمصفوفات والتقارير المنفصلة، بدل الاكتفاء بملخص أو روابط إلى ملفات أخرى.
>
> الأقسام التنفيذية والتصور المستقبلي وعناوين النتائج بالعربية. تُحفظ صياغة الأدلة والحقول التقنية الأصلية في مواضعها وملحقاتها دون ترجمة تخمينية تغير معناها. أسماء الملفات وCSS selectors وAPIs تبقى كما هي.
>
> صور المتصفح ملفات مستقلة داخل مساحة المشروع؛ يحتوي Markdown على مساراتها وقياساتها ووصف الدليل، ولا يضم ملفات الصور الثنائية. نسخة HTML السابقة تضم الصور المختارة. لا تُعد مسارات المشروع روابط تنزيل عامة.

## فهرس المحتويات

1. الخلاصة والحكم المستقل.
2. سياق المستودع وحدود المهمة ومنهج الإثبات.
3. التصور المستقبلي لكل عائلة، وقرارات المالك، وخطة التنفيذ.
4. السجل الموحد الكامل للنتائج الـ22.
5. الملاحظات المرفوضة وغير القابلة للإثبات والتوفيق بين المسارات.
6. مصفوفة المسارات والعروض الافتراضية.
7. مصفوفة الحالات والعائلات، وتفاصيل كل حالة.
8. سجل تطبيق المهارات الإحدى عشرة بمراجعه وملفاته وحدوده.
9. التقارير المنفصلة للمهارات الإحدى عشرة.
10. الجرد التفصيلي للمتغيرات والمحددات والحالات والملفات.
11. فهرس الأدلة والمخرجات.
12. سلامة الملفات وحدود الكتابة وبوابة الموافقة.

---

## 01. الخلاصة والحكم المستقل
"""]
    parts.append(shifted_markdown((SOURCE / "FINAL-RECONCILIATION.md").read_text()))
    parts.append("\n## 02. السياق والمنهج وحدود الإثبات\n")
    parts.append(f"**رأس المصدر المراجع:** `{register['sourceHead']}`\n")
    parts.append("""- نظام تصميم مستقل قيد البناء؛ البيانات fixtures ولا يوجد مستهلك حالي يلزم الحفاظ على توافقه.
- Micro سياق نقل مستقبلي فقط. لم يُفتح أو يُستنسخ أو يُبحث عن أي تطبيق أو مستودع Micro خارجي.
- قراءة المصدر ليست اختبارًا تشغيليًا؛ وفتح صفحة افتراضية لا يعني تنفيذ كل متغير وحالة.
- قد تثبت بنية حالية مثل flat tokens دون أن تكون عطلًا بصريًا. تُفصل فرص التطوير عن العيوب التشغيلية.
- الأولوية النهائية تعتمد الأثر؛ P0 في ماسح house rules لا يعني تلقائيًا حادثة حرجة.
- كل اختبارات القبول المذكورة ضمن الحلول هي خطة تحقق لاحقة، إلا إذا وُصفت صراحة كاختبارات نُفذت.
- لا توجد ادعاءات بشهادة WCAG أو قارئ شاشة مسموع أو أجهزة فعلية أو قابلية استخدام مثبتة ببحث بشري.
""")
    parts.append("### سياسة الشدة وملخص السجل\n\n" + render(register["severityPolicy"]) + "\n" + render(register["summary"]))
    parts.append("### حدود التغطية المسجلة\n\n" + render(register["coverageAndLimits"]))
    parts.append("\n## 03. التصور المستقبلي لكل عائلة والقرارات وخطة التنفيذ\n")
    parts.append(shifted_markdown((SOURCE / "FUTURE-STATE.md").read_text()))

    parts.append("\n## 04. السجل الموحد الكامل للنتائج\n")
    parts.append("**العدد المعتمد:** 22 نتيجة فريدة: 19 مؤكدة و3 مرجّحة. التكرار بين المهارات لا يزيد العدد.\n")
    parts.append("| المعرّف | النتيجة | التصنيف | الأولوية | الإثبات |\n|---|---|---|---|---|")
    for finding in findings:
        parts.append("| " + " | ".join(cell(finding[k]) for k in ("id", "title_ar", "category", "severity", "status")) + " |")
    for finding in findings:
        parts.append(f"\n### النتيجة {finding['id']}: {finding['title_ar']}\n")
        for key, item in finding.items():
            if key in ("id", "title_ar"):
                continue
            parts.append(f"#### {label(key)}\n\n{render(item)}")
        parts.append("\n---\n")

    parts.append("\n## 05. الاستبعادات والتوفيق بين المسارات\n")
    parts.append("هذه ليست نتائج إضافية داخل العدد22. تتضمن اشتباه التقويم الذي نقضه التشغيل، وحدود المستهلك المستقبلي ونسب الألوان الدلالية التي لا يثبت منها عيب حالي.\n")
    parts.append(render(register["notProvenOrRejected"]))
    parts.append("### قرارات التوفيق كاملة\n\n" + render(register["crossSourceReconciliation"]))
    parts.append("### حدود بدء التنفيذ\n\n" + render(register["implementationBoundary"]))

    parts.append("\n## 06. مصفوفة المسارات والعروض الافتراضية\n")
    parts.append("""36 مسارًا عند320/360/390/430 =144 حالة افتراضية. عدم وجود overflow أو أخطاء موارد في هذه الحالات لا يثبت سلامة جميع التفاعلات.

الحالات288 تساوي144 حالة افتراضية و144 حالة إجهاد إضافية: reduced-motion وforced-colors ومحاكاة font-size200% عند320، وشاشة أفقية844×390. لم تُضرب أوضاع الإجهاد بجميع العروض الأربعة.
""")
    parts.append("| المسار | 320px | 360px | 390px | 430px |\n|---|---|---|---|---|")
    for route in browser["routes"]:
        states = []
        for width in (320, 360, 390, 430):
            rows = [c for c in browser["cases"] if c["route"] == route and c["width"] == width and c["mode"] == "default"]
            assert len(rows) == 1
            c = rows[0]
            ok = c["metrics"]["docWidth"] <= width and not c["pageErrors"] and not c["resourceErrors"]
            states.append("مُشاهد؛ لا overflow/أخطاء" if ok else "تحتاج مراجعة")
        parts.append("| `" + route + "` | " + " | ".join(states) + " |")
    parts.append("\n### أدلة التشغيل والاختبارات المركزة\n\n" + render(coverage["runtimeEvidence"]))

    parts.append("\n## 07. مصفوفة الحالات والعائلات وتفاصيل المعالجة\n")
    parts.append("""**مفتاح القراءة:**

- `OBSERVED`: شوهد specimen افتراضي، وليس اعتماد جميع المتغيرات.
- `EXERCISED`: نُفذت حالة ديناميكيًا؛ قد تكون ناجحة أو أعادت إنتاج عيب.
- `SOURCE`: فُحص المصدر فقط، ولا ادعاء تشغيل.
- `N/A`: الحالة ليست مما تملكه هذه العائلة في عقدها الحالي.
- `UNPROVEN`: إثبات السلوك يحتاج سياقًا/خدمة/مستهلكًا غير موجود، وليس عيبًا مخترعًا.

الجدول واسع؛ كل صف له وصف تفصيلي بعده، بما في ذلك المحفّز والعلاج والأولوية والدليل.
""")
    families = coverage["matrixEncoding"]["familyOrder"]
    abbreviations = {"DEFAULT OBSERVED": "OBSERVED", "DYNAMICALLY EXERCISED": "EXERCISED", "INSPECTED SOURCE": "SOURCE", "NOT APPLICABLE": "N/A", "NOT PROVABLE": "UNPROVEN"}
    parts.append("| الحالة | " + " | ".join(families) + " |")
    parts.append("|---|" + "---|" * len(families))
    for row in coverage["stateRows"]:
        values = []
        for family in families:
            state = row["defaultStatus"]
            for override, members in row["overrides"].items():
                if family in members:
                    state = override
            values.append(abbreviations.get(state, state))
        parts.append("| " + cell(" / ".join(row["states"])) + " | " + " | ".join(values) + " |")
    for i, row in enumerate(coverage["stateRows"], 1):
        parts.append(f"\n### الحالة {i:02d}: {' / '.join(row['states'])}\n\n" + render(row))
    parts.append("\n### أدلة كل عائلة وحدودها\n\n" + render(coverage["families"]))
    parts.append("\n### حدود المصفوفة\n\n" + render(coverage["limitations"]))

    parts.append("\n## 08. APPLICATION-LEDGER: سجل التطبيق التفصيلي للمهارات\n")
    parts.append("**بوابة الاكتمال:**11 ملف SKILL.md في الحزمة،11 تقريرًا منفصلًا،11 مهارة LOADED وAPPLIED. لا يُقبل التحميل وحده دليلًا على التطبيق.\n")
    parts.append("العد المنسوب لكل مهارة قد يشارك نتيجة مع مهارة أخرى؛ لا تجمع هذه الأعداد للحصول على العدد الفريد.\n")
    for skill in ledger["skills"]:
        parts.append(f"\n### المهارة: {skill['skill']}\n\n" + render(skill))
    parts.append("\n### ملخص العد وحدود جميع المسارات\n\n" + render(ledger["uniqueFindingCounts"]) + "\n" + render(ledger["globalLimits"]))

    parts.append("\n## 09. التقارير المنفصلة الكاملة للمهارات الإحدى عشرة\n")
    parts.append("تُدرج التقارير هنا كاملة كي لا يعتمد الملف على فتح11 ملفًا آخر. عند اختلاف تصنيف أولي مع قرار المراجعة، يكون السجل الموحد وقسم الاستبعادات هما المرجع النهائي. المقترحات ليست إصلاحات منفذة.\n")
    for file in skill_files:
        parts.append(f"\n### تقرير المهارة: {file.stem}\n\n")
        parts.append(shifted_markdown(file.read_text(), 3))
        parts.append("\n---\n")

    parts.append("\n## 10. الجرد التفصيلي للمستودع\n")
    parts.append(f"**الملفات المتتبعة في لقطة التدقيق:**{inventory['trackedFileCount']}. **عائلات المكونات:**{inventory['componentFamilyCount']}.\n")
    parts.append("492 ملفًا تشمل438 ملفًا أصليًا و54 موردًا للحزمة، بما فيها ZIP. الجرد المعجمي للمتغيرات والمحددات لا يثبت تشغيل كل متغير.\n")
    parts.append("### توزيع الملفات حسب مساحة المستودع\n\n")
    parts.append(render(inventory["trackedFilesByTopLevelArea"]))
    parts.append("\n### تفاصيل العائلات والمتغيرات والمحددات والحالات المرصودة من المصدر\n\n")
    parts.append(render(inventory["componentFamilies"]))
    parts.append("\n### القائمة الكاملة للملفات المتتبعة في اللقطة\n\n```text\n")
    parts.append("\n".join(inventory["trackedFiles"]))
    parts.append("\n```\n\n### حدود الجرد\n\n" + render(inventory["limitations"]))

    parts.append("\n## 11. فهرس الأدلة والمخرجات\n")
    parts.append("""جذر التقارير:

`_audit-resources/pixilated-ux-ui-skills-kit/audit-current/`

جذر الصور والقياسات:

`generated-artifacts/pixilated-audit/`

مصادر هذا الملف:

- `FINAL-REGISTER.json`:السجل النهائي،الشدات،المخاطر،الاختبارات والقرارات.
- `FINAL-RECONCILIATION.md`:الحكم المستقل والتوفيق والاستبعادات.
- `FUTURE-STATE.md`:تصور كل عائلة،قرارات D01–D17 وخطة المراحل.
- `APPLICATION-LEDGER.json`:التطبيق والمراجع والملفات والحدود لكل مهارة.
- `edge-state-coverage.json`:مصفوفة31 مجموعة حالة×14 عائلة.
- `system-inventory.json`:جرد الملفات والعائلات والمتغيرات والمحددات.
- `skill-reports/*.md`:التقارير المنفصلة11/11.
- `INTEGRITY-FINAL.json`:سلامة الملفات والحزمة عند إغلاق التدقيق.
- `edge/edge-results.json`:القياسات الخام لحالات المتصفح288.

### الصور المرتبطة بالنتائج
""")
    all_images = []
    for finding in findings:
        parts.append(f"#### {finding['id']}: {finding['title_ar']}\n\n" + render(finding.get("screenshots", [])))
        all_images.extend(finding.get("screenshots", []))
    parts.append("""
### كيف تقرأ الدليل

- الصورة تثبت الشكل المرئي فقط،ولا تثبت التركيز أو عدد الأحداث؛ لذلك تُقرأ مع JSON/نتيجة التشغيل.
- فرق الـ24px في peek ليس overflow للمستند؛ هو اختيار معاينة مقصوصة داخل إطار المكون.
- نسب حجب الدوائر تخص مساحة ظاهرية مخفية بسبب التداخل،وليست ادعاء أن حساب مساحة القرص الأصلية خاطئ.
- رفض Error الاصطناعي يثبت المسار المحلي،ولا يثبت حادثة تسريب إنتاجي.
- لا تحول1px الخاص بـscreen-reader-only أو input مخفي داخل label إلى عيب لمس دون حساب هدف الـlabel.
- لا تقرأ تباين نص أبيض فوق gradient على أنه أبيض فوق خلفية الصفحة؛ تم استبعاد هذا الإنذار الكاذب.
""")

    parts.append("\n## 12. سلامة الملفات وحدود الكتابة والموافقة\n")
    parts.append(render(integrity))
    parts.append("""
### ما لم يحدث

- لا تعديل في مكون أو CSS أو JS أو توكنات أو مواصفة أو showcase أو حزمة تسليم للمنتج.
- لا تغيير في محتوى المهارات الأصلية.
- لا commit أو push أو إنشاء فرع أو fetch ولا اتصال بمستودع GitHub أثناء التدقيق.
- لا نشر ولا تنفيذ لإصلاحات التقرير.
- إنشاء نسخة Markdown لا يغير الحكم أو يضيف نتائج اختبار جديدة.

### بوابة الموافقة

التقرير يفصل ترقيعات السلوك/النص المحدودة عن تغيير API والهوية والـcarousel والدوائر وسياسات النظام. اعتماد قرار لا يعني اعتماد جميع القرارات الأخرى. يبدأ التنفيذ فقط بعد موافقة صريحة على نطاقه.

**نهاية التقرير التفصيلي.**
""")
    text = "\n\n".join(parts).replace("\r\n", "\n")
    assert len(re.findall(r"^### النتيجة ", text, re.M)) == 22
    assert len(re.findall(r"^### المهارة: ", text, re.M)) == 11
    assert len(re.findall(r"^### تقرير المهارة: ", text, re.M)) == 11
    assert len(re.findall(r"^### الحالة \d+: ", text, re.M)) == len(coverage["stateRows"])
    assert sum(line.startswith("```") for line in text.splitlines()) % 2 == 0
    for finding in findings:
        assert finding["title_ar"] in text and finding["recommendationAr"] in text
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(text + "\n", encoding="utf-8")
    stats = {
        "file": str(OUTPUT.relative_to(ROOT)),
        "bytes": OUTPUT.stat().st_size,
        "lines": len(text.splitlines()),
        "findings": len(findings),
        "statuses": dict(collections.Counter(f["status"] for f in findings)),
        "skills": len(skill_files),
        "families": len(families),
        "stateGroups": len(coverage["stateRows"]),
        "defaultRoutes": len(browser["routes"]),
        "defaultCases": len([c for c in browser["cases"] if c["mode"] == "default"]),
    }
    print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
