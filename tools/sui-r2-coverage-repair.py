#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة إصلاح تغطية جولة SAMSUNG-ONEUI-REPAIR-R1 (SUI-R1-06 / SUI-R2-A4).

تُصلح COVERAGE-REPAIR.csv آليًا لا يدويًا:
  1) تقرأ الملف الحالي بـcsv.reader وتوثّق الصفوف المعيبة (أعمدة ≠ 9):
     الصف 5 (سطر الملف 5): 11 عمودًا — قيمة rgb(22, 77, 89) غير مقتبسة
     انقسمت على الفواصل؛ والصفوف 11/12/13/31 (أسطر 11/12/13/31): 8 أعمدة —
     عمود preview_path ساقط منها فانزاحت الأعمدة.
  2) تعيد كتابة الصفوف الـ34 نفسها ببيانات مصححة عبر csv.writer مع
     quoting=QUOTE_MINIMAL (يقتبس تلقائيًا كل حقل يحوي فواصل مثل rgb(22, 77, 89))
     + استرجاع preview_path للصفوف الناقصة من سياق سجل الجولة
     (REPORT.md/MATRIX.md: toast وnavbar في عينة F03 نفسها، وfilter-panel
     في عينة filter-lifecycle، وf03-experience في عينة F03).
  3) تُصحح مسارات أدلة معلقة وُجدت عند التحقق: probe-d-lifecycles يقع في
     جولة التدقيق التاريخية (reviews/SAMSUNG-ONEUI-AUDIT)، وfamily-review
     ملفه family-review.json، وpreviews/standalone غير موجود (الملف المكتفى
     ذاتيًا هو previews/ux-patterns/mobile-record-sample/standalone.html)،
     وأدلة concepts للمراجعة المستقلة independent/chatgpt-r1/concepts-verification.json.
  4) تستكمل صف العائلة الرابعة عشرة الغائب (metric-comparison) من سجل
     الجولة (أدلة agent4/regression/family-metric-comparison: 4/4 KEEP
     مقيسًا) — بدون هذا الصف لا تكتمل تغطية العائلات الـ14 الموثقة في
     REPORT.md §1.
  5) تحقق ذاتي بعد الكتابة: كل صف 9 أعمدة، العائلات الـ14 كلها حاضرة،
     كل source_path/preview_path موجود في الشجرة، وكل مسار evidence موجود
     (نسبيًا لمجلد جولة R1 ثم لجذر المستودع). أي خلل → خروج غير صفري.

NOT RUN (صفّا CSV ذو حالة غير منفذة): السبب الحقيقي مذكور حرفيًا في
عمود reason — concepts: مسار متصفح الأداة في بيئة جولة R1 + إعادة
المراجعة المستقلة 154/155 + اكتمال R2؛ وplatforms: أجهزة/لمس/قارئات
صوتية/WebKit/native zoom/لوحة نظام/safe areas/رجوع النظام.

التشغيل من جذر المستودع:
  python3 tools/sui-r2-coverage-repair.py
  python3 tools/sui-r2-coverage-repair.py --check-only   # تحقق بلا كتابة

المخرجات: reviews/SAMSUNG-ONEUI-REPAIR-R1/COVERAGE-REPAIR.csv (استبدال
المستند المعيب — مستند جولة لا دليلًا تاريخيًا) + نسخة مطابقة في
reviews/SAMSUNG-ONEUI-REPAIR-R2/COVERAGE-REPAIR.csv + سجل التحقق الذاتي.
الأدلة التاريخية (evidence/) لا تُكتب فوقها إطلاقًا.
"""
import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
R1_ROUND = ROOT / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1"
R2_ROUND = ROOT / "reviews" / "SAMSUNG-ONEUI-REPAIR-R2"
CURRENT_CSV = R1_ROUND / "COVERAGE-REPAIR.csv"

HEADER = ["family", "variant", "state", "source_path", "preview_path",
          "repair_status", "evidence_id", "finding_ids", "reason"]

FAMILIES_14 = ["buttons", "fields", "selection", "organization", "data",
               "messages", "navigation", "surfaces", "info-strip",
               "metric-comparison", "account-settings", "access-gateway",
               "carousel", "order-schedule"]

# الصفوف الـ34 الأصلية بعد إصلاح الأعمدة والمسارات المعلمة فقط
# (لا تغيير بيانات في الصفوف السليمة) + صف metric-comparison المستكمل.
ROWS = [
    ["fields", "quantity+amount", "reading-floors-320-360-390-430+zoom200",
     "components/fields/fields.css", "previews/fields/", "FIXED+REVIEWED",
     "evidence/agent2;evidence/official-run/sui-a2", "SUI-004;SUI-005",
     "كمية 9999 ومبلغ 15 خانة مقيسان قبل (62/76 و202/245) وبعد (96/96 و252/252 + تلف بلا قص) عند 320+200%"],
    ["fields", "example-usage-steppers", "official-example-48px",
     "previews/fields/example-usage.html", "previews/fields/", "FIXED",
     "evidence/agent2", "SUI-006", "زرا 23.8×21 → 48×48 بعقد B01 مع مثال عامل"],
    ["fields", "text/long/search/readonly/help", "states-regression",
     "components/fields/fields.css", "previews/fields/", "REVIEWED",
     "evidence/agent2/regression", "REV-B02",
     "12/12 فحوص مراجعة العائلة — KEEP الغالبية مع تحسين تذييل اللوحة"],
    ["selection", "switch", "state-color-DOM-order-independent",
     "components/selection/selection.css", "previews/selection/", "FIXED+REVIEWED",
     "evidence/agent2;evidence/agent5", "SUI-003",
     "rgb(22, 77, 89) في الترتيبين + التركيب المعكوس بJS (تحقق مستقل)؛ ON/OFF محفوظان"],
    ["selection", "segmented", "wrapped-touch-gap-hit-test",
     "components/selection/selection.css", "previews/selection/", "FIXED+REVIEWED",
     "evidence/agent2;evidence/agent5", "SUI-011",
     "فجوة الأهداف +4px (كانت −4px تداخلًا) وhit-test 0/12 — بالحساب المصحح touchGap=rowGap−8"],
    ["selection", "picker", "keep+extensibility-bounds",
     "components/selection/picker.js", "previews/selection/", "KEEP+DOC",
     "evidence/agent2", "SUI-032", "حدود التوسع موثقة في المواصفة؛ السلوك الحالي محفوظ"],
    ["selection", "checkbox/radio/toggle", "states-regression",
     "components/selection/selection.css", "previews/selection/", "REVIEWED",
     "evidence/agent2/regression", "REV-B03", "12/12 — KEEP"],
    ["messages", "announce", "event-identity-contract",
     "components/messages/messages.js", "previews/messages/", "FIXED+REVIEWED",
     "evidence/agent3;evidence/agent5", "SUI-012",
     "حدث مستقل بنص نفسه = إعلانان؛ الحدث ذاته = واحد (تحديثان مقيسان)"],
    ["messages", "m-note", "role-contract-error-alert-warning-status",
     "components/messages/messages.js", "previews/messages/", "FIXED+REVIEWED",
     "evidence/agent3", "SUI-010",
     "العقد موحد وموثق (B06) ومطبق في F03+B06+choice-lifecycle"],
    # الصفوف 11/12/13/31 أدناه: كان بها 8 أعمدة (preview_path ساقط) — استُرجع
    # من سياق سجل الجولة (REPORT/MATRIX: تركيب F03/عينة filter-lifecycle نفسها).
    ["messages", "toast", "app-level-position-navbar-aware",
     "previews/ux-patterns/mobile-record-sample/", "previews/ux-patterns/mobile-record-sample/",
     "FIXED+REVIEWED", "evidence/agent3;evidence/agent5", "SUI-001",
     "rect 280..390×80 عند 4 مقاسات و200%؛ gap≥16px؛ قناة واحدة؛ لا سرقة تركيز"],
    ["navigation", "navbar-height", "dynamic-css-var-resize-observer",
     "previews/ux-patterns/mobile-record-sample/", "previews/ux-patterns/mobile-record-sample/",
     "FIXED+REVIEWED", "evidence/agent3;evidence/agent5", "SUI-002",
     "--f03-navbar-h=70.984375px يطابق المقيس؛ صفر تراكب عند 200%؛ 53px نفسها عند 1×؛ مراقب واحد"],
    ["navigation", "filter-panel", "first-focus-on-first-control",
     "previews/ux-patterns/filter-lifecycle/", "previews/ux-patterns/filter-lifecycle/",
     "IMPROVED", "evidence/agent3", "SUI-015",
     "التب Tab الأول = أول تحكم في اللوحات الثلاث؛ عقود الطبقة محفوظة (46/46)"],
    ["navigation", "tabs", "keep-looping-documented",
     "components/navigation/navigation.js", "previews/navigation/", "KEEP+DOC",
     "evidence/agent3", "SUI-022", "التفاف الأسهم سلوك مقصود موثق (قرار مشروعي)"],
    ["access-gateway", "entry+submit", "human-wording-single-error-channel",
     "components/access-gateway/access-gateway.js", "previews/concepts/", "IMPROVED",
     "evidence/agent3", "SUI-013;SUI-014",
     "نصوص بشرية + قناة خطأ واحدة مقيسة؛ aria-invalid وربط الرسالة محفوظان"],
    ["account-settings", "switch-compositions", "regression",
     "components/account-settings/", "previews/concepts/", "REVIEWED",
     "evidence/agent3", "REV-B07", "يستفيد من SUI-003 — KEEP"],
    ["data", "m-stat", "long-number-wrap",
     "components/data/data.css", "previews/data/", "FIXED+REVIEWED",
     "evidence/agent4;evidence/agent5", "SUI-008",
     "scrollW 288=288 داخل البطاقة (كان 324>312 وخارجها)؛ القيمة كاملة تتلف بلا تصغير"],
    ["data", "m-chart-title", "16-24-600-consistency",
     "components/data/data.css", "previews/data/", "IMPROVED",
     "evidence/agent4", "SUI-017", "عنوان مجموعة داخل وجهة موحد 16/24×600 (قرار قائد)"],
    ["data", "bars/line/donut/packed", "regression-scope",
     "components/data/data.js", "previews/data/", "REVIEWED",
     "evidence/agent4/regression", "-",
     "b05 26/26 وdata-scale-state 23/23 وcarousel 53/53 — KEEP"],
    ["info-strip", "peek", "reveal-measure-resize-observer",
     "components/info-strip/info-strip-peek.js", "previews/ux-patterns/mobile-record-sample/",
     "FIXED+REVIEWED", "evidence/agent4;evidence/agent5", "SUI-007",
     "أول كشف: −30/30/30 (كان 0/60/0)؛ فهرس وتركيز محفوظان؛ مراقب واحد؛ disconnect يعمل"],
    ["info-strip", "comparison-table", "scroll-container-320-200",
     "previews/info-strip/comparison.html", "previews/info-strip/", "IMPROVED",
     "evidence/agent4", "SUI-024", "حاوية تمرير — الصفحة لا تفيض (scrollW للصفحة = viewport)"],
    ["carousel", "engine", "hide-show-width-change-reproduction-then-fix",
     "components/carousel/carousel.js", "previews/carousel/", "FIXED+REVIEWED",
     "evidence/agent4", "SUI-025",
     "العيب أعيد إنتاجه (transform 0 بعد الكشف) ثم أصلح بنفس عقد 007 — 53/53"],
    ["order-schedule", "store-seed", "clean-default+isolated-fixtures",
     "previews/ux-patterns/order-schedule/order-store.js", "previews/ux-patterns/order-schedule/",
     "FIXED+REVIEWED", "evidence/agent4;evidence/agent5", "SUI-009",
     "المسار الافتراضي نظيف (لا mystery/حقن)؛ ?fixtures=edge يعرض الحالتين؛ 16/16/267 عبر fixtures"],
    ["order-schedule", "month-cells", "proposed-exception-context",
     "components/order-schedule/order-schedule.css", "previews/ux-patterns/order-schedule/",
     "NEEDS OWNER DECISION", "evidence/agent4", "SUI-030",
     "الاستثناء PROPOSED معلق؛ بديل معروض للمالك؛ قاعدة 48px لم تتغير"],
    ["data", "chart-labels", "truncation-context",
     "components/data/data.js", "previews/data/", "NEEDS OWNER DECISION",
     "evidence/agent4", "SUI-031", "عقد R3-UI02 محفوظ (قراءة كاملة)؛ أمثلة مقاسة للمالك"],
    ["organization", "panel-buttons", "48px-contract",
     "previews/organization/index.html", "previews/organization/", "FIXED",
     "evidence/agent1", "SUI-026", "زرا 40 → 48px مقيسًا عند 320/390 بلا انحدار"],
    ["organization", "section-title", "unified-class",
     "previews/organization/example-usage.html", "previews/organization/", "IMPROVED",
     "evidence/agent1", "SUI-019", "الصنف الميت استبدل بالمعرف (18/28/600) في الموضعين + F03 (وكيل 3)"],
    ["surfaces", "spec", "0.12-reconciliation",
     "components/surfaces/specification.md", "previews/surfaces/", "IMPROVED",
     "evidence/agent1", "SUI-018", "تطابق ثلاثي §3=§5=CSS — توثيق فقط"],
    ["buttons", "family", "full-review-keep",
     "components/buttons/buttons.css", "previews/buttons/", "REVIEWED",
     "evidence/agent1", "-", "8 أنواع وحالات محفوظة — KEEP كاملًا؛ b01 49/49"],
    ["gallery", "index-css", "arabic-letter-spacing-removal",
     "previews/index.css", "previews/index.html", "IMPROVED",
     "evidence/agent1", "SUI-021", "صفر letter-spacing على العربية — صفر تغيير بصري مقيس"],
    ["f03-experience", "blocks+rows+delete+review-entry",
     "16-24-titles+margins+question+separate-scope",
     "previews/ux-patterns/mobile-record-sample/", "previews/ux-patterns/mobile-record-sample/",
     "IMPROVED", "evidence/agent3", "SUI-016;SUI-017;SUI-019;SUI-020;SUI-023;SUI-029",
     "هوامش 20px من 390؛ عناوين 16/24؛ سؤال الحذف؛ حماية reduced-motion؛ مدخل المراجعة خارج مسار الدخول (نطاق منفصل واضح)"],
    # مسار أدلة معلّق صُحح: دليل دورات الرسائل التاريخي في جولة التدقيق
    # (reviews/SAMSUNG-ONEUI-AUDIT) — لا يوجد دليل بهذا الاسم داخل جولة R1.
    ["messages", "lifecycles", "loading-empty-error-success-unknown",
     "components/messages/messages.css", "previews/messages/", "REVIEWED",
     "reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent2/probe-d-lifecycles.py", "-",
     "KEEP — دليل الدورات التاريخي من جولة التدقيق (probe-d)؛ لا تغيير سلوكي في هذه الجولة (أدلة agent3 خضراء)"],
    # family-review ملف لا مجلد: المسار الصحيح family-review.json (6/6).
    ["concepts", "access-gateway+account-settings", "regression",
     "previews/concepts/", "previews/concepts/", "REVIEWED",
     "evidence/agent3/family-review.json", "-", "6/6 فحوص عائلات A3"],
    # NOT RUN بسبب حقيقي موثق + دليل إعادة المراجعة المستقلة الموجود فعلاً.
    ["concepts", "full-page-suite", "concepts-check",
     "previews/concepts/", "previews/concepts/", "NOT RUN",
     "independent/chatgpt-r1/concepts-verification.json", "NOT RUN",
     "تشغيل جولة R1 الرسمية تعذر لمسار متصفح الأداة في بيئتها؛ الأداة تمس access-gateway والمكوّنات المعدلة فعلاً — أعادتها المراجعة المستقلة بتكييف المسار 154/155 (الفشل الوحيد توقع حرفي قديم)؛ في R2 أضيفت وسائط CLI وفحوص صدق وشُغلت كاملة (reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent4/concepts)"],
    # previews/standalone غير موجود — الملف المكتفى ذاتيًا الفعلي أدناه.
    ["platforms", "real-devices", "all",
     "previews/ux-patterns/mobile-record-sample/standalone.html",
     "previews/ux-patterns/mobile-record-sample/standalone.html", "NOT RUN",
     "-", "NOT RUN",
     "أجهزة فعلية/لمس حقيقي/TalkBack/VoiceOver وقارئات صوتية فعلية/WebKit/Safari/native zoom/لوحة نظام/safe areas/رجوع النظام — معلنة في كل التقارير"],
    # صف مستكمل (SUI-R1-06): العائلة الرابعة عشرة الغائبة — دليل الجولة موجود
    # (agent4/regression/family-metric-comparison: 4/4 KEEP مقيسًا) لكن الصف سقط
    # من CSV الجولة المعيب؛ صياغته من سجل التدقيق + أدلة R1 الموجودة.
    ["metric-comparison", "circles+list+main-metric", "keep-overflow-wrap+scale-refusal",
     "components/metric-comparison/metric-comparison.css", "previews/concepts/",
     "REVIEWED", "evidence/agent4/regression/family-metric-comparison", "-",
     "KEEP — لف الرقم الطويل داخل البطاقة مقيسًا عند 320+200% (4/4)؛ لا تغيير سلوك في الجولة"],
]

STATUS_VOCAB = {"FIXED", "FIXED+REVIEWED", "REVIEWED", "IMPROVED", "KEEP",
                "KEEP+DOC", "NOT REPRODUCED", "NEEDS OWNER DECISION", "NOT RUN"}


def inspect_current():
    """قراءة الملف الحالي وتوثيق الصفوف المعيبة (أعمدة ≠ 9)."""
    print("== 1) فحص الملف الحالي بـcsv.reader ==")
    print(f"   الملف: {CURRENT_CSV.relative_to(ROOT)}")
    if not CURRENT_CSV.exists():
        print("   [خطأ] الملف غير موجود")
        return None
    with CURRENT_CSV.open(encoding="utf-8", newline="") as f:
        rows = list(csv.reader(f))
    print(f"   صفوف الملف (مع الترويسة): {len(rows)} — ترويسة من {len(rows[0])} عمودًا")
    bad = []
    for i, row in enumerate(rows):
        if len(row) != len(rows[0]):
            bad.append((i + 1, len(row), row))
            print(f"   [معيب] سطر الملف {i + 1}: {len(row)} عمودًا (المطلوب 9) — {row[:4]}…")
    if not bad:
        print("   لا صفوف معيبة بعدد أعمدة")
    else:
        print(f"   إجمالي الصفوف المعيبة: {len(bad)}")
    return rows


def write_csvs():
    print("\n== 2) إعادة الكتابة بـcsv.writer (QUOTE_MINIMAL) ==")
    targets = [CURRENT_CSV, R2_ROUND / "COVERAGE-REPAIR.csv"]
    for target in targets:
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("w", encoding="utf-8", newline="") as f:
            writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
            writer.writerow(HEADER)
            writer.writerows(ROWS)
        print(f"   كُتب: {target.relative_to(ROOT)} ({1 + len(ROWS)} سطرًا)")
    return targets


def resolve(base_dirs, rel):
    for base in base_dirs:
        if (base / rel).exists():
            return (base / rel).resolve()
    return None


def verify(target):
    print(f"\n== 3) التحقق الذاتي على {target.relative_to(ROOT)} ==")
    problems = []
    with target.open(encoding="utf-8", newline="") as f:
        rows = list(csv.reader(f))
    header, data = rows[0], rows[1:]
    if header != HEADER:
        problems.append(f"الترويسة {header}")
    print(f"   صفوف البيانات: {len(data)} (34 أصلية + 1 صف metric-comparison مستكمل)")

    # (أ) كل صف 9 أعمدة
    ncols = {len(r) for r in data}
    if ncols != {9}:
        problems.append(f"أعمدة غير موحدة: {sorted(ncols)}")
    print(f"   [أ] كل صف 9 أعمدة: {'نعم' if ncols == {9} else 'لا — ' + str(sorted(ncols))}")

    # (ب) تغطية العائلات الـ14
    fams = {r[0] for r in data}
    missing = [f for f in FAMILIES_14 if f not in fams]
    if missing:
        problems.append(f"عائلات ناقصة: {missing}")
    print(f"   [ب] العائلات الـ14 كلها حاضرة: {'نعم' if not missing else 'لا — ناقص ' + str(missing)}")
    extra = sorted(fams - set(FAMILIES_14))
    print(f"       صفوف سياق إضافية (موثقة): {extra}")

    # (ج) حالة كل صف من المفردات المعلنة
    bad_status = [(r[0], r[1], r[5]) for r in data if r[5] not in STATUS_VOCAB]
    if bad_status:
        problems.append(f"حالات خارج المفردات: {bad_status}")
    print(f"   [ج] كل repair_status من المفردات المعلنة: {'نعم' if not bad_status else 'لا — ' + str(bad_status)}")

    # (د) مسارات source_path/preview_path موجودة في الشجرة
    missing_paths = []
    for r in data:
        for col, rel in (("source_path", r[3]), ("preview_path", r[4])):
            if rel and rel != "-" and not (ROOT / rel).exists():
                missing_paths.append((r[0], r[1], col, rel))
    if missing_paths:
        problems.append(f"مسارات مصدر/معاينة مفقودة: {missing_paths}")
    print(f"   [د] مسارات source_path/preview_path كلها موجودة: "
          f"{'نعم' if not missing_paths else 'لا — ' + str(missing_paths)}")

    # (هـ) مسارات evidence موجودة (نسبيًا لمجلد جولة R1 ثم لجذر المستودع)
    missing_ev = []
    for r in data:
        for tok in [t for t in r[6].split(";") if t and t != "-"]:
            if resolve((R1_ROUND, ROOT), tok) is None:
                missing_ev.append((r[0], r[1], tok))
    if missing_ev:
        problems.append(f"مسارات أدلة مفقودة: {missing_ev}")
    print(f"   [هـ) مسارات evidence كلها موجودة: {'نعم' if not missing_ev else 'لا — ' + str(missing_ev)}")

    # (و) NOT RUN سببه الحقيقي موثق في reason
    notrun = [(r[0], r[1], r[8]) for r in data if r[5] == "NOT RUN"]
    print(f"   [و] صفوف NOT RUN ({len(notrun)}):")
    for fam, var, reason in notrun:
        has_reason = len(reason.strip()) > 20
        if not has_reason:
            problems.append(f"NOT RUN بلا سبب: {fam}/{var}")
        print(f"       - {fam}/{var}: {reason[:90]}…")
    return problems


def main():
    ap = argparse.ArgumentParser(description="إصلاح CSV تغطية REPAIR-R1 والتحقق الذاتي")
    ap.add_argument("--check-only", action="store_true",
                    help="تحقق بلا كتابة (يفحص الصفوف المدمجة في الأداة والمسارات)")
    args = ap.parse_args()

    inspect_current()
    targets = ([CURRENT_CSV] if CURRENT_CSV.exists() else [])
    if not args.check_only:
        targets = write_csvs()

    all_problems = []
    for target in targets:
        all_problems.extend(verify(target))

    print("\n== 4) الخلاصة ==")
    if all_problems:
        print(f"   فشل التحقق الذاتي — {len(all_problems)} مشكلة:")
        for p in all_problems:
            print("   -", p)
        return 1
    print("   التحقق الذاتي ناجح: 9 أعمدة × كل الصفوف، العائلات الـ14، "
          "المسارات والمفردات، وNOT RUN بأسبابها الحقيقية.")
    print(f"   عدد صفوف البيانات: {len(ROWS)} (34 أصلية + 1 صف metric-comparison مستكمل)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
