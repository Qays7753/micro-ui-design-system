#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص التباين لمعالجة السطح S01 (E09 + R2-04): حسابات قابلة لإعادة التشغيل.
من جذر المستودع:
  python3 tools/contrast-check.py             → يولّد reviews/S01/contrast-check.txt
                                                 ورمز الخروج 1 إذا فشل أي زوج داخل المجال المضمون
  python3 tools/contrast-check.py --selftest  → اختبار تحكم (R2-04): زوج معروف أدنى من العتبة
                                                 يجب أن يفشل في الصف والملخص ومنطق رمز الخروج

ما المصحح في R2-04 (كانت الأداة تعلن نجاحًا رغم فشلها):
1. عتبة رقمية مخزنة لكل زوج (4.5 نص عادي / 3 نص كبير). السابق كان يخزن
   `want >= 4.5` أي (True >= 4.5) = False فسقطت كل الصفوف إلى عتبة 3،
   وأعلن الملخص «الفاشل: لا شيء» مع وجود FAIL في الصفوف وخرج بصفر.
2. رمز الخروج يعكس فشل أزواج المجال المضمون فقط (المعلومة خارج المجال لا تُخفيه ولا تُحسب نجاحًا).
3. تركيب الخلفية من الأصول الفعلية: شفافيات طبقات الموجة تُقرأ من ملف SVG
   نفسه (ومن أقصى stop-opacity في تدرجات v2) — لا مضاعفة تقديرية.
   «شدة الموجة» مفتاح CSS على الطبقة كلها (opacity) وأي قيمة > 1 تُقحم
   إلى 1 وفق مواصفات CSS — فالأسوأ الفعلي هو الشفافيات كما هي في الأصل.
4. لون النص يُقارن بالخلفية نفسها التي فوقها: الشفاف يُدمج مع خلفيته
   المحلية ثم يُقاس مقابلها (السابق كان يدمج النص فوق خلفية ويقارنه بأخرى).
5. المجال المضمون يطابق CSS المسلّم: إضاءة 0.10، منطقة الموجات أسفل 42%
   من السطح (المفتاح الافتراضي)، شدة الموجة 1. أزواج النص الشفاف داخل
   منطقة الموجات تُقاس بصدق وتُعرض خارج المجال المضمون — لا تُعلن نجاحًا
   لم تثبته. الإضاءة 0.25 (أقصى مقبض) وv2 وdepth كلها معلومة خارج الضمان.
"""
import math
import sys
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "S01" / "contrast-check.txt"
rows = []   # (name, threshold, ratio, in_domain)
lines = []

SELFTEST = "--selftest" in sys.argv


def hx(c):
    return "#%02X%02X%02X" % c


def parse(c):
    c = c.strip().lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def lin(v):
    v /= 255.0
    return v / 12.92 if v <= 0.04045 else math.pow((v + 0.055) / 1.055, 2.4)


def lum(c):
    r, g, b = (lin(x) for x in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    l1, l2 = sorted((lum(a), lum(b)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)


def blend(fg, alpha, bg):
    return tuple(round(alpha * f + (1 - alpha) * b) for f, b in zip(fg, bg))


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def check(name, fg, bg, threshold, in_domain=True):
    """عتبة رقمية لكل زوج — الرقم مخزن ويُستعمل في الصف والملخص والخروج."""
    r = ratio(fg, bg)
    rows.append((name, float(threshold), r, in_domain))
    ok = r >= threshold
    tag = "PASS" if ok else "FAIL"
    scope = "" if in_domain else "  [خارج المجال المضمون — معلومة]"
    lines.append("%-62s %7.2f : 1   %s (عتبة %.1f)%s" % (name, r, tag, threshold, scope))
    return ok


# ---- الألوان المعتمدة (من الأسس — لا تغيير هوية) ----
GRAD_START = parse("#236675")
BRAND = parse("#164D59")
GRAD_END = parse("#103E48")
WHITE = (255, 255, 255)
LIGHT = 0.10          # الإضاءة الشعاعية الافتراضية أعلى السطح
LIGHT_MAX_KEY = 0.25  # أقصى قيمة لمقبض الإضاءة (معلومة خارج الضمان)
WAVE_HEIGHT = 0.42    # ارتفاع منطقة الموجة الافتراضي من السطح

SVG_NS = "{http://www.w3.org/2000/svg}"


def svg_layers(path):
    """طبقات الموجة من الأصل الفعلي (R2-04: قراءة لا تقدير):
    [(لون, شفافية فعالة)] — للتدرجات يُقرأ أقصى stop-opacity في الطبقة
    (أفتح ما تبلغه = أسوأ حالة للنص الفاتح فوقها)."""
    root = ET.parse(path).getroot()
    grads = {}
    for g in root.iter(SVG_NS + "linearGradient"):
        stops = [(float(s.get("offset", 0) or 0), s.get("stop-color"),
                  float(s.get("stop-opacity", 1) or 1)) for s in g.findall(SVG_NS + "stop")]
        grads[g.get("id")] = stops
    layers = []
    for p in root.iter(SVG_NS + "path"):
        fill = p.get("fill", "")
        if fill.startswith("url(#"):
            worst = max(grads[fill[5:-1]], key=lambda t: t[2])
            layers.append((parse(worst[1]), worst[2]))
        else:
            layers.append((parse(fill), float(p.get("fill-opacity", 1) or 1)))
    return layers


def composite(base, layers, light=0.0):
    """تركيب الطبقات بالترتيب الفعلي للرسم: الإضاءة الشعاعية فوق التدرج،
    ثم طبقات الموجة بترتيب المسارات (اللاحقة فوق السابقة)."""
    c = blend(WHITE, light, base) if light > 0 else base
    for color, alpha in layers:
        c = blend(color, alpha, c)
    return c


def grad_at(h):
    """لون التدرج العمودي عند نسبة ارتفاع h من السطح (0→1):
    #236675 (0%) → #164D59 (55%) → #103E48 (100%)."""
    if h <= 0.55:
        return lerp(GRAD_START, BRAND, h / 0.55)
    return lerp(BRAND, GRAD_END, (h - 0.55) / 0.45)


SOFT = svg_layers(ROOT / "assets" / "surfaces" / "waves-soft.svg")
V2 = svg_layers(ROOT / "assets" / "surfaces" / "waves-soft-v2.svg")
DEPTH = svg_layers(ROOT / "assets" / "surfaces" / "waves-depth.svg")

# أسوأ تركيب داخل منطقة الموجات: أفتح قاعدة داخلها (أعلى حدود المنطقة، 58%)
# والطبقات الثلاث كاملة فوقها — بلا إضاءة (تتلاشى قبل 54% من الارتفاع).
WAVE_TOP = 1 - WAVE_HEIGHT
BASE_WAVE_TOP = grad_at(WAVE_TOP)
WORST_IN_WAVES = composite(BASE_WAVE_TOP, SOFT)
WORST_IN_WAVES_V2 = composite(BASE_WAVE_TOP, V2)
WORST_IN_WAVES_DEPTH = composite(BASE_WAVE_TOP, DEPTH)
BASE_TOP = blend(WHITE, LIGHT, GRAD_START)  # أعلى السطح: التدرج + الإضاءة القصوى

if not SELFTEST:
    lines.append("# فحص تباين S01 — حسابات WCAG من الألوان والأصول الفعلية (قابل لإعادة التشغيل)")
    lines.append("# python3 tools/contrast-check.py — يولّد هذا الملف تلقائيًا (R2-04)")
    lines.append("# عتبة رقمية لكل زوج؛ رمز الخروج 1 عند فشل أي زوج داخل المجال المضمون.")
    lines.append("# شفافيات الموجة تُقرأ من أصول SVG نفسها؛ شدة الموجة مفتاح CSS على الطبقة")
    lines.append("# كلها وتُقحم إلى 1 فوق ذلك — لا مضاعفة مسارات (خطأ التقرير السابق).")
    lines.append("")
    lines.append("## 1) الأزواج المنشورة — أرقام مصححة (E09)")
    check("أبيض مصمت على #164D59 (وسط التدرج)", WHITE, BRAND, 4.5)
    check("أبيض مصمت على #103E48 (أسفل التدرج)", WHITE, GRAD_END, 4.5)
    check("أبيض مصمت على #236675 + إضاءة 0.10 (أعلى السطح)", WHITE, BASE_TOP, 4.5)
    label_blend = blend(WHITE, 0.8, GRAD_START)
    lines.append("")
    lines.append("### أبيض بشفافية 0.8 (تسمية السطح):")
    lines.append("الدمج الفعلي فوق #236675 = %s (لا قيمة داكنة كما نُشر سابقًا)." % hx(label_blend))
    lines.append("النسبة تتغير بموضع النص (الإضاءة الشعاعية تخفضها) — لذا النص الشفاف")
    lines.append("لا يدخل ضمانًا شاملًا؛ يُثبت بعينات المواضع الفعلية في سجل الفحص (S01-B2c).")
    check("مرجع: نص أبيض 0.8 مدمج فوق #236675 (بلا إضاءة)", label_blend, GRAD_START, 4.5, in_domain=False)

    lines.append("")
    lines.append("## 2) المجال المضمون (القيم المسلّمة الافتراضية — يدخل رمز الخروج)")
    lines.append("# الإضاءة 0.10 · منطقة الموجات أسفل 42% · شدة الموجة 1 (شفافيات الأصل)")
    lines.append("# الضمان للأبيض المصمت (الوحيد الثابت عبر المواضع) — النص الشفاف في القسم 3.")
    check("أبيض مصمت أعلى السطح (فوق منطقة الموجات، مع الإضاءة)", WHITE, BASE_TOP, 4.5)
    check("أبيض مصمت — أسوأ تركيب داخل منطقة الموجات (قاعدة %s + الطبقات كاملة)" % hx(BASE_WAVE_TOP),
          WHITE, WORST_IN_WAVES, 4.5)
    check("أبيض مصمت أسفل السطح (قاعدة #103E48 + الطبقات كاملة)",
          WHITE, composite(GRAD_END, SOFT), 4.5)

    lines.append("")
    lines.append("## 3) معلومة صادقة خارج المجال المضمون (لا يدخل رمز الخروج)")
    lines.append("# النص الشفاف نسبته تابعة للموضع (الإضاءة والموجات تخفضها) — لا يُعلن")
    lines.append("# نجاح شامل له؛ قياسات المواضع الفعلية في سجل الفحص وقرار المعالجة للمالك.")
    check("أبيض 0.8 (التسمية) فوق أعلى السطح مع الإضاءة 0.10",
          blend(WHITE, 0.8, BASE_TOP), BASE_TOP, 4.5, in_domain=False)
    check("أبيض 0.8 فوق أسوأ تركيب داخل منطقة الموجات",
          blend(WHITE, 0.8, WORST_IN_WAVES), WORST_IN_WAVES, 4.5, in_domain=False)
    check("أبيض 0.72 (السطر الثانوي) فوق أسوأ تركيب داخل منطقة الموجات",
          blend(WHITE, 0.72, WORST_IN_WAVES), WORST_IN_WAVES, 4.5, in_domain=False)
    check("أبيض مصمت أعلى السطح بأقصى مقبض إضاءة (0.25)",
          WHITE, blend(WHITE, LIGHT_MAX_KEY, GRAD_START), 4.5, in_domain=False)

    lines.append("")
    lines.append("## 4) مقارنة تنقيح الموجة v2 (E12 — مقترح بانتظار المالك — خارج الضمان)")
    check("v2: أبيض مصمت — أسوأ تركيب داخل منطقة موجاتها",
          WHITE, WORST_IN_WAVES_V2, 4.5, in_domain=False)
    check("v2: أبيض 0.8 فوق أسوأ تركيب داخل منطقة موجاتها",
          blend(WHITE, 0.8, WORST_IN_WAVES_V2), WORST_IN_WAVES_V2, 4.5, in_domain=False)
    check("v2: أبيض 0.72 فوق أسوأ تركيب داخل منطقة موجاتها",
          blend(WHITE, 0.72, WORST_IN_WAVES_V2), WORST_IN_WAVES_V2, 4.5, in_domain=False)
    check("depth: أبيض مصمت — أسوأ تركيب داخل منطقة موجاته (للسطح البارز فقط)",
          WHITE, WORST_IN_WAVES_DEPTH, 4.5, in_domain=False)

    lines.append("")
    lines.append("## 5) المجال المعلن (يوثّقه المستهلك كما هو هنا — لا زيادة):")
    lines.append("- يدخل ضمان النجاح: النص الأبيض المصمت في أي موضع على السطح الافتراضي")
    lines.append("  (أسوأ حالته داخل منطقة الموجات — القسم 2). كل صف PASS أعلاه بعتبته الرقمية.")
    lines.append("- خارج الضمان (معلوم بصدق): النص الشفاف 0.8/0.72 (نسبته تابعة للموضع —")
    lines.append("  تقاس عينات فعلية في سجل الفحص ولا يُعلن نجاح شامل لها)، الإضاءة فوق 0.10،")
    lines.append("  وv2 وdepth (مقترحات) — تُعاد الحسابات عند أي تعديل. لا تغيير ألوان هوية")
    lines.append("  لمعالجة خطأ حساب وحده؛ قرار النص الشفاف للمالك.")
    lines.append("- عينات بكسل من مواضع النص الفعلية في اللقطة: reviews/S01/verification.txt")
    lines.append("  (S01-B2b/B2c) — قياس مستقل عن هذه الحسابات التحليلية.")
    lines.append("")
    lines.append("## 6) ملاحظة E09 — مؤشر الاتجاه (delta):")
    lines.append("الاتجاه (صاعد/هابط) مفصول عن دلالة الجودة (tone) يمررها المستهلك؛")
    lines.append("الافتراضي محايد. لا تلوين نجاح/خطر من الاتجاه وحده داخل المكوّن.")

    report = "\n".join(lines) + "\n"
    OUT.write_text(report, encoding="utf-8")
    print(report)

    fails_domain = [(n, th, r) for (n, th, r, d) in rows if d and r < th]
    info_fails = [(n, th, r) for (n, th, r, d) in rows if not d and r < th]
    print("النتيجة: %d زوجًا — فاشل داخل المجال المضمون: %s" %
          (len(rows), fails_domain if fails_domain else "لا شيء"))
    print("أزواج معلومة خارج المجال دون عتبتها (موثقة أعلاه لا مضمونة): %d" % len(info_fails))
    sys.exit(1 if fails_domain else 0)

# ---- وضع اختبار التحكم (R2-04): العتاد يكشف الفشل فعلًا ----
check("تحكم: مشمشي #F4AD76 على أبيض (معروف < 4.5)", parse("#F4AD75"), WHITE, 4.5)
check("تحكم: أبيض على #236675 (معروف ≥ 4.5)", WHITE, GRAD_START, 4.5)
fails = [(n, th, r) for (n, th, r, d) in rows if r < th]
row_fail_marked = "FAIL" in lines[0]
row_pass_marked = "PASS" in lines[1]
exit_code_would_be = 1 if fails else 0
ok = (len(fails) == 1 and row_fail_marked and row_pass_marked and exit_code_would_be == 1)
print("صف التحكم الأول: %s | الثاني: %s" % (lines[0].split()[-3], lines[1].split()[-3]))
print("الملخص: فاشل=%d | رمز الخروج المتوقع: %d" % (len(fails), exit_code_would_be))
print("SELFTEST: %s" % ("PASS — الصف والملخص ورمز الخروج تعكس الفشل" if ok else "FAIL"))
sys.exit(0 if ok else 1)
