"""Build the audit-only, offline HTML deliverable; never changes product files."""
from pathlib import Path
import base64
import collections
import html
import json
import re
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUT = ROOT / "generated-artifacts/pixilated-audit/AUDIT-REPORT.html"
esc = lambda v: html.escape(str(v), quote=True)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def inline(text):
    text = esc(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    return text


def markdown(text):
    """Small escaped renderer for report prose, lists, headings and tables."""
    lines = text.splitlines()
    result, i = [], 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line.startswith("```"):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code.append(lines[i])
                i += 1
            result.append("<pre>" + esc("\n".join(code)) + "</pre>")
            i += 1
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)", line)
        if heading:
            level = min(len(heading[1]) + 1, 6)
            result.append(f"<h{level}>{inline(heading[2])}</h{level}>")
        elif line.startswith("|") and i + 1 < len(lines) and re.match(
            r"^\|[\s:|-]+\|$", lines[i + 1].strip()
        ):
            cells = lambda s: s.strip().strip("|").split("|")
            headers = cells(line)
            result.append('<div class="table-scroll"><table><thead><tr>')
            result.extend("<th>" + inline(c.strip()) + "</th>" for c in headers)
            result.append("</tr></thead><tbody>")
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                result.append("<tr>" + "".join(
                    "<td>" + inline(c.strip()) + "</td>" for c in cells(lines[i])
                ) + "</tr>")
                i += 1
            result.append("</tbody></table></div>")
            continue
        elif re.match(r"^[-*]\s+", line) or re.match(r"^\d+\.\s+", line):
            items = []
            while i < len(lines) and (
                re.match(r"^[-*]\s+", lines[i].strip())
                or re.match(r"^\d+\.\s+", lines[i].strip())
            ):
                items.append(re.sub(r"^(?:[-*]|\d+\.)\s+", "", lines[i].strip()))
                i += 1
            result.append("<ul>" + "".join("<li>" + inline(x) + "</li>" for x in items) + "</ul>")
            continue
        else:
            result.append("<p>" + inline(line) + "</p>")
        i += 1
    return "\n".join(result)


LABELS = {
    "id": "المعرّف", "title_ar": "العنوان", "titleAr": "العنوان",
    "title": "العنوان", "skills": "المهارات", "skill": "المهارة",
    "category": "التصنيف", "severity": "الأولوية", "status": "درجة الإثبات",
    "source": "موضع المصدر", "sources": "المصادر", "evidence": "الدليل",
    "problem": "المشكلة", "rootCause": "السبب الجذري", "root_cause": "السبب الجذري",
    "impact": "الأثر", "current_patch": "الترقيع الحالي المقترح", "currentPatch": "الترقيع المقترح",
    "future_state": "التصور المستقبلي", "futureState": "التصور المستقبلي",
    "recommendation": "التوصية", "change_type": "نوع التغيير", "changeType": "نوع التغيير",
    "patch_vs_structural": "ترقيع أم تغيير بنيوي", "risks": "المخاطر", "risk": "المخاطر",
    "acceptance_tests": "اختبارات القبول اللاحقة", "acceptanceTests": "اختبارات القبول اللاحقة",
    "owner_decision": "قرار المالك", "ownerDecision": "قرار المالك",
    "owner_decision_required": "هل يحتاج قرارًا؟", "ownerDecisionRequired": "هل يحتاج قرارًا؟",
    "owner_question": "سؤال المالك", "ownerQuestion": "سؤال المالك",
    "sourceReport": "التقرير الأصلي", "originalIDs": "المعرّفات الأصلية",
    "file": "الملف", "path": "المسار", "lines": "الأسطر", "selector": "المحدد",
    "options": "الخيارات", "effects": "الآثار", "blocks_fix": "هل يحجب الإصلاح؟",
    "recommendationAr": "التوصية المختصرة", "discoverers": "مسارات الاكتشاف",
    "rawMetadata": "التصنيف الأصلي قبل المراجعة", "fileLineSelector": "الملف والأسطر والمحدد",
    "exactProblem": "المشكلة المحددة", "currentSafePatch": "الترقيع الآمن المقترح بعد الموافقة",
    "recommendedApproach": "المعالجة المفضلة", "patchVsStructural": "ترقيع أم تغيير بنيوي",
    "acceptance": "اختبارات القبول اللاحقة", "screenshots": "صور الدليل",
}


def value(v, depth=0):
    if isinstance(v, dict):
        return "<dl>" + "".join(
            "<dt>" + esc(LABELS.get(k, k)) + "</dt><dd>" + value(x, depth + 1) + "</dd>"
            for k, x in v.items()
        ) + "</dl>"
    if isinstance(v, list):
        return "<ul>" + "".join("<li>" + value(x, depth + 1) + "</li>" for x in v) + "</ul>"
    if isinstance(v, bool):
        return "نعم" if v else "لا"
    if v is None:
        return "غير محدد"
    return '<span class="content-value">' + inline(str(v)) + "</span>"


def find_items(data):
    if isinstance(data, list):
        return data
    for key in ("findings", "register", "actionableFindings", "actionable_findings"):
        if key in data:
            return data[key]
    raise ValueError("Cannot locate unified findings")


def finding_title(f):
    return f.get("title_ar") or f.get("titleAr") or f.get("title") or f.get("problem", "")[:150]


def font_css():
    css = []
    for family, stem in (
        ("AuditLatin", "IBMPlexSans-Latin"),
        ("AuditArabic", "IBMPlexSansArabic-Arabic"),
    ):
        for weight in (400, 600):
            data = base64.b64encode((ROOT / f"assets/fonts/{stem}-{weight}.woff2").read_bytes()).decode()
            css.append(f"@font-face{{font-family:{family};font-weight:{weight};src:url(data:font/woff2;base64,{data}) format('woff2');font-display:swap;}}")
    return "\n".join(css)


def screenshot(path, caption):
    file = ROOT / path
    if not file.is_file():
        return f'<p class="warning">صورة غير موجودة: {esc(path)}</p>'
    mime = "image/jpeg" if file.suffix in (".jpg", ".jpeg") else "image/png"
    data = base64.b64encode(file.read_bytes()).decode()
    return f'<figure><img loading="lazy" src="data:{mime};base64,{data}" alt="{esc(caption)}"><figcaption>{esc(caption)}<br><code>{esc(path)}</code></figcaption></figure>'


def main():
    register = read_json(HERE / "FINAL-REGISTER.json")
    findings = find_items(register)
    inventory = read_json(HERE / "system-inventory.json")
    coverage = read_json(HERE / "edge-state-coverage.json")
    ledger = read_json(HERE / "APPLICATION-LEDGER.json")
    edge = read_json(ROOT / "generated-artifacts/pixilated-audit/edge/edge-results.json")
    skill_reports = sorted((HERE / "skill-reports").glob("*.md"))
    expected = sorted(p.parent.name for p in HERE.parent.glob("*/SKILL.md"))
    assert sorted(p.stem for p in skill_reports) == expected, "Missing or extra individual skill report"
    assert len(expected) == 11, "Kit inventory gate failed"
    assert sorted(s["skill"] for s in ledger["skills"]) == expected
    assert all(s["loaded"] and s["applied"] for s in ledger["skills"]), "Loaded-only skill cannot pass"
    css = font_css() + """
*{box-sizing:border-box}h1,h2,h3,h4,h5,h6,strong,th{font-weight:600}html{scroll-behavior:smooth}body{margin:0;background:#f7f8f4;color:#172d32;font-family:AuditLatin,AuditArabic,sans-serif;line-height:1.85;font-size:16px;overflow-wrap:anywhere}
header{background:#164d59;color:#fff;padding:44px max(22px,calc((100vw - 1080px)/2))}
header h1{margin:8px 0 14px;font-size:clamp(28px,5vw,44px);line-height:1.4;max-width:900px}
header p{max-width:860px;opacity:.9}.eyebrow{font-size:13px;letter-spacing:.04em}
main{max-width:1130px;margin:auto;padding:24px}nav{display:flex;gap:10px 22px;flex-wrap:wrap;padding:8px 0 22px;border-bottom:1px solid #d6dfdc}
a{color:#164d59;text-underline-offset:4px}section{margin:42px 0}h2{font-size:27px;line-height:1.5;margin:34px 0 14px}h3{font-size:22px;margin:28px 0 10px}h4{font-size:18px;margin:20px 0 8px}h5,h6{font-size:17px;margin:18px 0 8px}
p{margin:10px 0}ul{padding-inline-start:25px}li{margin:8px 0}strong{font-weight:600}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:25px 0}.stat{padding:18px 0;border-block:1px solid #c6d7d1}.stat b{display:block;font-size:29px;font-weight:600}.stat span{font-size:14px;color:#50656a}
.notice{padding:18px 22px;background:#dfeee6;border-radius:12px}.warning{color:#815400}.small{font-size:13px;color:#50656a}
.table-scroll{max-width:100%;overflow:auto;margin:20px 0}table{border-collapse:collapse;width:100%;text-align:start;font-size:14px}th,td{padding:12px 14px;vertical-align:top;border-bottom:1px solid #d6dfdc}th{background:#e9eee9;font-weight:600;white-space:nowrap}td:first-child{font-weight:600}
.matrix{font-size:11px;min-width:1500px}.matrix th,.matrix td{padding:8px}.route-table code{font-size:11px}
code,pre{font-family:ui-monospace,monospace;direction:ltr;unicode-bidi:isolate;font-size:.84em}code{overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#eef2ed;padding:14px;border-radius:8px;text-align:left;max-width:100%}
details{margin:12px 0;background:#fff;border:1px solid #d6dfdc;border-radius:10px;padding:14px 18px}summary{cursor:pointer;font-weight:600;line-height:1.8}summary:focus-visible,a:focus-visible{outline:3px solid #d97757;outline-offset:4px}
details[open]>summary{margin-bottom:20px}.finding{scroll-margin-top:20px}dl{margin:0}dt{font-size:13px;font-weight:600;color:#50656a;margin-top:18px}dd{margin:4px 0 0;overflow-wrap:anywhere}dd dl{border-inline-start:2px solid #dfeee6;padding-inline-start:16px}.content-value{white-space:pre-wrap;overflow-wrap:anywhere}
.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;align-items:start}figure{margin:0;padding:16px;background:white;border-radius:12px}figure img{display:block;max-width:100%;max-height:660px;height:auto;width:auto;margin:auto;border:1px solid #eef2ed}figcaption{font-size:13px;color:#50656a;padding-top:14px}
.appendix{direction:ltr;text-align:left}.appendix h2,.appendix h3{font-size:20px}.appendix p,.appendix li{overflow-wrap:anywhere}
footer{padding:28px 0;border-top:1px solid #d6dfdc;color:#50656a}
@media(max-width:650px){main{padding:18px}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.gallery{grid-template-columns:1fr}details{padding:12px}th,td{padding:9px}header{padding:30px 20px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
@media print{body{background:white;font-size:11px}main{max-width:none;padding:0}nav{display:none}header{padding:20px}details{break-inside:avoid}figure{break-inside:avoid}summary{color:#164d59}.table-scroll{overflow:visible}.matrix{min-width:0;font-size:6px}a{color:inherit}}
"""
    parts = [f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pixilated · UI/UX Audit & Future State</title><style>{css}</style></head><body>']
    parts.append("""<header><div class="eyebrow">PIXILATED · UI DESIGN SYSTEM · READ-ONLY AUDIT</div><h1>تدقيق فعلي، وتصوّر مستقبلي قابل للتنفيذ</h1><p>مراجعة المصدر والمعاينات والتفاعلات باستخدام المهارات الإحدى عشرة، مع فصل الدليل عن الفرضية. هذا تقرير مراجعة، وليس تنفيذًا للإصلاحات أو اعتمادًا إنتاجيًا.</p><p>24 أكتوبر 2026 · المستودع الحالي فقط · لا مشاريع Micro خارجية · لا commit أو push</p></header><main>
<nav><a href="#summary">الخلاصة</a><a href="#future">التصور المستقبلي والقرارات</a><a href="#register">سجل النتائج</a><a href="#coverage">مصفوفة التغطية</a><a href="#evidence">الأدلة البصرية</a><a href="#ledger">سجل تطبيق المهارات</a><a href="#annex">التقارير المستقلة</a><a href="#integrity">سلامة الملفات</a></nav>""")
    parts.append('<section id="summary"><h2>الخلاصة التنفيذية</h2>')
    parts.append(f'<div class="stats"><div class="stat"><b>11 / 11</b><span>تقارير مهارات مستقلة عن مجرد التحميل</span></div><div class="stat"><b>14</b><span>عائلة مكونات في الجرد</span></div><div class="stat"><b>36 × 4</b><span>مسارًا وعرضًا في الفحص الافتراضي</span></div><div class="stat"><b>{len(findings)}</b><span>نتيجة فريدة في السجل الموحّد</span></div></div>')
    parts.append("""<div class="notice"><strong>الحكم:</strong> أساس خفيف يعمل جيدًا في المسارات المختبرة، لكنه ليس موافقة نهائية على جميع العقود والاختيارات البصرية. المطلوب تطوير انتقائي لا إعادة كتابة شاملة. لم تُطبق أي توصية؛ قرارات المالك تسبق الإصلاح.</div>
<ul><li>عيب تشغيل مثبت: تغيّر حالة picker يخفي الخيار المركّز ويسقط التركيز إلى body؛ أربع إعادات للعيب نفسه، لا أربعة عيوب.</li><li>عيب محتوى مثبت بمثال محلي: callback يمكن أن يعرض Error.message التقني نفسه للمستخدم. لا ادعاء بوجود حادثة أو مستخدم إنتاجي.</li><li>تحسينات بصرية أساسية: peek ضيق يقطع الحروف؛ دوائر متداخلة تحجب المقادير؛ وطبقات معاينة كثيفة تشوش مراجعة الأمثلة.</li><li>التقويم المتكيف اجتاز55/55؛ standalone متطابق مع المصدر. لا نعيد عرض شك سابق كعيب حالي بعد أن نقضه الاختبار.</li><li>الحفاظ على أهداف48px والخط المحلي والهوية الحالية أولى من تصغير المكونات لمعالجة كثافة لوحات العرض.</li></ul>
<p>كل حالة في السجل لها درجة إثبات، وموضع، وأثر، وحل مستقبلي، ومخاطر واختبارات قبول لاحقة. الاختبارات المقترحة ليست نتائج اختبارات منفّذة.</p>""")
    parts.append(markdown((HERE / "FINAL-RECONCILIATION.md").read_text()))
    parts.append("</section>")
    parts.append('<section id="future"><h2>التصور المستقبلي لكل عائلة والقرارات</h2>')
    parts.append(markdown((HERE / "FUTURE-STATE.md").read_text()))
    parts.append("</section>")
    parts.append('<section id="register"><h2>السجل الموحّد منزوع التكرار</h2><p>تعكس الأولوية أثرًا مهنيًا فعليًا؛ P0 الخام في ماسح house rules ليس تلقائيًا عطل منتج حرجًا. افتح كل نتيجة للاطلاع على الحقول كاملة.</p><div class="table-scroll"><table><thead><tr><th>ID</th><th>النتيجة</th><th>الأولوية</th><th>الإثبات</th></tr></thead><tbody>')
    for f in findings:
        fid = f.get("id", f.get("finding_id", "?"))
        parts.append(f'<tr><td><a href="#{esc(fid)}">{esc(fid)}</a></td><td>{inline(finding_title(f))}</td><td>{esc(f.get("severity",""))}</td><td>{esc(f.get("status",""))}</td></tr>')
    parts.append("</tbody></table></div>")
    for f in findings:
        fid = f.get("id", f.get("finding_id", "?"))
        parts.append(f'<details class="finding" id="{esc(fid)}"><summary>{esc(fid)} · {inline(finding_title(f))}</summary>{value(f)}</details>')
    parts.append('<details><summary>بيانات السجل والقرارات الأصلية كاملة</summary><pre>' + esc(json.dumps(register, ensure_ascii=False, indent=2)) + "</pre></details></section>")
    parts.append('<section id="coverage"><h2>ما جرى اختباره، وما لم يثبت</h2><p>OBSERVED: رُسم مثال حالي. EXERCISED: نُفذت حالة، ولا تعني أنها نجحت. INSPECTED SOURCE: قراءة فقط. NOT PROVABLE: لا يمكن إثبات سلوك مستهلك غير موجود. NOT APPLICABLE: ليس من عقد هذه العائلة. لم نساوِ فحص المسار الافتراضي بفحص جميع تركيبات الحالات.</p>')
    parts.append('<h3>مسارات افتراضية × العروض الأربعة</h3><div class="table-scroll"><table class="route-table"><thead><tr><th>المسار</th><th>320</th><th>360</th><th>390</th><th>430</th></tr></thead><tbody>')
    for route in edge["routes"]:
        parts.append("<tr><td><code>" + esc(route) + "</code></td>")
        for width in (320, 360, 390, 430):
            cases = [c for c in edge["cases"] if c["route"] == route and c["width"] == width and c["mode"] == "default"]
            assert len(cases) == 1
            c = cases[0]
            ok = c["metrics"]["docWidth"] <= width and not c["pageErrors"] and not c["resourceErrors"]
            parts.append("<td>" + ("مُشاهد؛لا overflow/أخطاء" if ok else "راجع الدليل") + "</td>")
        parts.append("</tr>")
    parts.append("</tbody></table></div><h3>حالات × جميع العائلات</h3><p>الجدول التالي واسع عمدًا؛ يمكن تمريره أفقيًا. تفاصيل العرض والمحفّز والعلاج والدليل مرفقة تحته. لا يمتد وصف حالة واحدة تلقائيًا إلى جميع المتغيرات.</p>")
    family_order = coverage["matrixEncoding"]["familyOrder"]
    abbreviations = {"DEFAULT OBSERVED":"OBSERVED","DYNAMICALLY EXERCISED":"EXERCISED","INSPECTED SOURCE":"SOURCE","NOT APPLICABLE":"N/A","NOT PROVABLE":"UNPROVEN"}
    parts.append('<div class="table-scroll"><table class="matrix"><thead><tr><th>مجموعة الحالة</th>' + "".join("<th>" + esc(f) + "</th>" for f in family_order) + "</tr></thead><tbody>")
    for row in coverage["stateRows"]:
        parts.append("<tr><td>" + esc(" / ".join(row["states"])) + "</td>")
        for family in family_order:
            status = row["defaultStatus"]
            for override, members in row["overrides"].items():
                if family in members:
                    status = override
            parts.append("<td>" + esc(abbreviations.get(status, status)) + "</td>")
        parts.append("</tr>")
    parts.append("</tbody></table></div>")
    parts.append("<details><summary>المصفوفة كاملة: محفّز،معالجة،حدود،وأدلة التشغيل</summary>" + value(coverage) + "</details>")
    parts.append('<h3>حدود لا يجوز تجاوزها في الاستنتاج</h3><p>Chromium152 على Linux،مع RTL،ومحاكاة reduced-motion وforced-colors وشاشة أفقية. تكبير النص هنا مضاعفة font-size داخل DOM،وليس native zoom أو Dynamic Type. لا اختبار قارئ شاشة مسموع أو أجهزة هاتف فعلية أو Safari/WebKit،ولا بحث مستخدمين أو تحليلات أو تكامل مستهلك خارجي.</p></section>')
    parts.append('<section id="evidence"><h2>أدلة بصرية من الوضع الحالي، لا mockups مستقبلية</h2><p>صور مختارة فُتحت وفُحصت ضمن المراجعة. جميع صور المسارات الافتراضية144 والقياسات محفوظة محليًا في generated-artifacts/pixilated-audit؛ لا تحتوي هذه النسخة الخفيفة على كل صورة مكررة.</p><div class="gallery">')
    images = [
        ("generated-artifacts/pixilated-audit/visual-carousel-430.jpg", "Carousel عند430: شق جانبي يقطع الحروف؛ التحكم والتنقل يعملان."),
        ("generated-artifacts/pixilated-audit/visual-metric-circles-overlap-320.png", "المقارنة بالدوائر عند320: أجزاء من المقادير محجوبة بالتداخل."),
        ("generated-artifacts/pixilated-audit/interaction-360-picker-error-layer.png", "حالة خطأ picker المرئية؛ دليل سقوط التركيز في JSON لا في الصورة وحدها."),
        ("generated-artifacts/pixilated-audit/LANG-003-synthetic-error-status-crop.png", "رسالة Error تقني اصطناعي معروضة حرفيًا في callback محلي."),
        ("generated-artifacts/pixilated-audit/visual-field-password-320.png", "حقول الوصول عند320: لا نوصي بإعادة كتابتها؛ الكشف والتركيز اجتازا المسارات المختبرة."),
        ("generated-artifacts/pixilated-audit/visual-field-stepper-320.png", "الكمية عند320: الأهداف48،والتحسين المستقبلي لعلاقة القيمة بالوحدة."),
        ("generated-artifacts/pixilated-audit/visual-chart-bubbles-320.png", "دوائر منفصلة مع قراءات خارج العلامات: خيار area اختياري،لا بديل دقيق دائم للأشرطة."),
        ("generated-artifacts/pixilated-audit/visual-chart-line-gap-390.png", "رسم خطي مع قراءة غائبة: الحفاظ على الفجوة والجدول،لا اختراع اتصال."),
        ("generated-artifacts/pixilated-audit/slop/composition-tile.png", "صف ساكن مع سهم تنقل زخرفي وإجراء مستقل: إشارات متعارضة."),
        ("generated-artifacts/pixilated-audit/edge/previews--messages--font200-footer.png", "مشكلة footer في محاكاة font-size200%،وليست إثبات native-zoom failure."),
    ]
    parts.extend(screenshot(p, c) for p, c in images)
    parts.append("</div></section>")
    parts.append('<section id="ledger"><h2>APPLICATION-LEDGER · تحميل وتطبيق</h2>')
    parts.append(markdown((HERE / "APPLICATION-LEDGER.md").read_text()))
    parts.append("<h3>التطبيق التفصيلي: المراجع والسكريبتات والملفات والحدود</h3>")
    for skill in ledger["skills"]:
        parts.append("<details><summary>" + esc(skill["skill"]) + " · LOADED / APPLIED</summary>" + value(skill) + "</details>")
    parts.append("</section>")
    parts.append('<section id="annex"><h2>أحد عشر تقرير مهارة منفصلًا</h2><p>تقارير المسارات المتخصصة ثم مراجعة نهائية مستقلة. بعض الوكلاء طبقوا أكثر من عدسة؛ لا ندّعي أن هناك11 باحثًا أو11 دراسة مستخدمين.</p>')
    for p in skill_reports:
        parts.append(f'<details><summary>{esc(p.stem)}</summary><div class="appendix">{markdown(p.read_text())}</div></details>')
    parts.append('<details><summary>الجرد الكامل للملفات المتتبعة</summary><p>492 ملفًا:438 ملفًا أصليًا و54 موردًا للحزمة بما فيها ZIP. الجرد ليس ادعاء مشاهدة بشرية لكل بايت.</p><pre>' + esc("\n".join(inventory["trackedFiles"])) + "</pre></details>")
    parts.append("</section>")
    parts.append('<section id="integrity"><h2>سلامة المصدر والحزمة وحدود الكتابة</h2>')
    integrity_file = HERE / "INTEGRITY-FINAL.json"
    assert integrity_file.is_file(), "Final integrity evidence required"
    integrity = read_json(integrity_file)
    assert integrity["trackedDiffClean"] and integrity["kitOriginalFileMismatches"] == []
    parts.append(value(integrity))
    parts.append('<p>لم تتغير ملفات المنتج أو محتويات الحزمة الأصلية. المخرجات المعروضة تقارير وأدلة تدقيق معزولة. لا إصلاح مكون ولا حذف ملف منتج ولا commit أو push أو نشر. الخطوة التالية قرار المالك وفق جدول القرارات،وليست تنفيذًا تلقائيًا.</p></section><footer>Pixilated UX/UI Audit · نسخة HTML مستقلة،الخطوط والصور مضمنة،ولا موارد شبكية لازمة لقراءتها.</footer></main></body></html>')
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(json.dumps({"report":str(OUT.relative_to(ROOT)),"bytes":OUT.stat().st_size,"findings":len(findings),"skills":len(skill_reports)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
