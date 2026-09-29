#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص التباين لمعالجة السطح S01 (E09 + R2-04 + C1): حسابات قابلة لإعادة التشغيل.
من جذر المستودع:
  python3 tools/contrast-check.py             → يولّد reviews/S01/contrast-check.txt
                                                 ورمز الخروج 1 إذا فشل أي زوج داخل المجال المضمون
  python3 tools/contrast-check.py --selftest  → اختبار تحكم (R2-04/C1): أزواج معروفة النتيجة
                                                 يجب أن تُصنَّف فشلًا/نجاحًا كما هو متوقع

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

ما المصحح في C1 (قراءة النصوص المستخدمة فعلًا لا إخراجها من ضمان النجاح):
5. كل أدوار النص المعلوماتي في المكوّن أبيض مصمت افتراضيًا (surfaces.css C1) —
   قيم الشفافية 0.8/0.72 أُزيلت من CSS لأنها كانت تسقط دون عتبة 4.5 في
   مواضع فعلية. أدوار السطح الأربعة (title/amount/label/sub) تدخل المجال
   المضمون صفًا لكل دور، وكذلك أدوار مرشح v2 المستخدمة فعليًا في المعاينة.
   أي درجة أخف تبقى مسموحة فقط في تركيب موثق لدى المستهلك يجتاز عتبة النص
   المنطبقة — لا صنف في المكوّن يشحنها (خارج API الجاهز بوضوح).
6. تمييز مسارَي القياس صراحة:
   - «الحد المحافظ المحسوب» (هذه الأداة): أسوأ تركيب تحليلي من الأصول
     الفعلية — يُستخدم للضمان الشامل بأي موضع.
   - «القياس الموضعي الفعلي» (سجل S01): من لقطات بكسل حقيقية للمتصفح،
     والخلفية من الإحداثيات نفسها بعد إخفاء رسم النص دون تغيير layout
     ثم مقارنة اللون المرسوم (أو الممزوج من قيمه الفعلية) بها — الطريقة
     السابقة كانت تختار «الخلفية» بأفتح بكسل دون 85% من أقصى إضاءة،
     ويمكن أن تكون من حواف الحروف الملساء (رقم 2.09 السابق لم يكن قياسًا
     موضعيًا دقيقًا ولم يُعتمد). الرقمان مختلفا الغرض ولا يُستبدل أحدهما بالآخر.
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

# C1: عتبة موحدة 4.5 لكل الأدوار — المحافظة: title (22px/600) وamount (36px)
# نص كبير وعتبته المنطبقة 3:1، لكن البوابة تُغلقهما بعتبة النص العادي 4.5
# نفسها كي لا يُقرأ الإدخال في الجدول كإضعاف للعتبة. الرابط الفعلي للبوابة
# هو label (14px/500) وsub (13px/400) — نص عادي 4.5 حتمًا.
THRESH = 4.5

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
    lines.append("# python3 tools/contrast-check.py — يولّد هذا الملف تلقائيًا (R2-04 + C1)")
    lines.append("# عتبة رقمية لكل زوج؛ رمز الخروج 1 عند فشل أي زوج داخل المجال المضمون.")
    lines.append("# أدوار النص الأربعة في المكوّن أبيض مصمت (C1) — كل دور صف داخل البوابة.")
    lines.append("# مسارا القياس مميزان: الحد المحافظ المحسوب هنا، والقياس الموضعي الفعلي")
    lines.append("# في سجل S01 (خلفية من الإحداثيات نفسها بعد إخفاء رسم النص).")
    lines.append("")
    lines.append("## 1) الأزواج المنشورة — أرقام مصححة (E09)")
    check("أبيض مصمت على #164D59 (وسط التدرج)", WHITE, BRAND, THRESH)
    check("أبيض مصمت على #103E48 (أسفل التدرج)", WHITE, GRAD_END, THRESH)
    check("أبيض مصمت على #236675 + إضاءة 0.10 (أعلى السطح)", WHITE, BASE_TOP, THRESH)
    old_label_blend = blend(WHITE, 0.8, GRAD_START)
    lines.append("")
    lines.append("### قيم الشفافية السابقة (0.8/0.72) — أُزيلت من المكوّن في C1 — مرجع موسوم فقط:")
    lines.append("الدمج الفعلي لأبيض 0.8 فوق #236675 = %s. هذه القيم كانت افتراضية في" % hx(old_label_blend))
    lines.append("المكوّن وتُستخدم في أمثلته، وكانت تُعرض دون عتبتها ثم تُستثنى من المجال")
    lines.append("الذي يقرر نجاح التسليم — الإفصاح وحده لم يغلق مطلب القراءة، فأزيلت من")
    lines.append("المكوّن (surfaces.css C1) وتبقى هنا مرجعًا موسومًا لا جزءًا من المكوّن الجاهز.")
    check("مرجع: نص أبيض 0.8 مدمج فوق #236675 (بلا إضاءة)", old_label_blend, GRAD_START, THRESH, in_domain=False)

    lines.append("")
    lines.append("## 2) المجال المضمون (القيم المسلّمة الافتراضية — يدخل رمز الخروج)")
    lines.append("# الإضاءة 0.10 · منطقة الموجات أسفل 42% · شدة الموجة 1 (شفافيات الأصل)")
    lines.append("# C1: الأدوار الأربعة أبيض مصمت — صف لكل دور فوق أسوأ تركيب، وصف")
    lines.append("# لأدوار مرشح v2 المستخدمة فعليًا في المعاينة (تُغلق البوابة أيضًا).")
    lines.append("# عتبة 4.5 لكل الأدوار (المحافظة — انظر ملاحظة THRESH في المصدر).")
    check("أبيض مصمت أعلى السطح (فوق منطقة الموجات، مع الإضاءة)", WHITE, BASE_TOP, THRESH)
    check("أبيض مصمت — أسوأ تركيب داخل منطقة الموجات (قاعدة %s + الطبقات كاملة)" % hx(BASE_WAVE_TOP),
          WHITE, WORST_IN_WAVES, THRESH)
    check("أبيض مصمت أسفل السطح (قاعدة #103E48 + الطبقات كاملة)",
          WHITE, composite(GRAD_END, SOFT), THRESH)
    check("دور title (العنوان) — أبيض مصمت فوق أسوأ تركيب داخل منطقة الموجات",
          WHITE, WORST_IN_WAVES, THRESH)
    check("دور amount (الرقم) — أبيض مصمت فوق أسوأ تركيب داخل منطقة الموجات",
          WHITE, WORST_IN_WAVES, THRESH)
    check("دور label (التسمية — كانت 0.8) — أبيض مصمت فوق أسوأ تركيب داخل منطقة الموجات",
          WHITE, WORST_IN_WAVES, THRESH)
    check("دور sub (السطر الثانوي — كان 0.72) — أبيض مصمت فوق أسوأ تركيب داخل منطقة الموجات",
          WHITE, WORST_IN_WAVES, THRESH)
    check("v2 — دور title فوق أسوأ تركيب داخل منطقة موجاتها",
          WHITE, WORST_IN_WAVES_V2, THRESH)
    check("v2 — دور amount فوق أسوأ تركيب داخل منطقة موجاتها",
          WHITE, WORST_IN_WAVES_V2, THRESH)
    check("v2 — دور label فوق أسوأ تركيب داخل منطقة موجاتها",
          WHITE, WORST_IN_WAVES_V2, THRESH)
    check("v2 — دور sub فوق أسوأ تركيب داخل منطقة موجاتها",
          WHITE, WORST_IN_WAVES_V2, THRESH)

    lines.append("")
    lines.append("## 3) معلومة صادقة خارج المجال المضمون (لا يدخل رمز الخروج)")
    lines.append("# القيم السابقة المزالة (C1) تبقى مرجعًا موسومًا — لا تُحسب ضمن المكوّن")
    lines.append("# الجاهز ولا تُشحن بصنف افتراضي؛ depth مقارنة للسطح البارز فقط.")
    check("مرجع (مزالة C1): أبيض 0.8 فوق أعلى السطح مع الإضاءة 0.10",
          blend(WHITE, 0.8, BASE_TOP), BASE_TOP, THRESH, in_domain=False)
    check("مرجع (مزالة C1): أبيض 0.8 فوق أسوأ تركيب داخل منطقة الموجات",
          blend(WHITE, 0.8, WORST_IN_WAVES), WORST_IN_WAVES, THRESH, in_domain=False)
    check("مرجع (مزالة C1): أبيض 0.72 فوق أسوأ تركيب داخل منطقة الموجات",
          blend(WHITE, 0.72, WORST_IN_WAVES), WORST_IN_WAVES, THRESH, in_domain=False)
    check("أبيض مصمت أعلى السطح بأقصى مقبض إضاءة (0.25)",
          WHITE, blend(WHITE, LIGHT_MAX_KEY, GRAD_START), THRESH, in_domain=False)
    check("depth: أبيض مصمت — أسوأ تركيب داخل منطقة موجاته (للسطح البارز فقط)",
          WHITE, WORST_IN_WAVES_DEPTH, THRESH, in_domain=False)

    lines.append("")
    lines.append("## 4) مسارا القياس — تمييز صريح (C1):")
    lines.append("- **الحد المحافظ المحسوب** (الأقسام 1–3): أسوأ تركيب تحليلي مركّب من")
    lines.append("  الأصول الفعلية (شفافيات SVG مقروءة لا مقدّرة) — يضمن النجاح بأي موضع.")
    lines.append("- **القياس الموضعي الفعلي** (سجل S01 — B2b/B2c/B2d): من لقطات بكسل")
    lines.append("  حقيقية لمتصفح headless (Playwright + Chromium — تشغيل متصفح فعلي لا محاكاة")
    lines.append("  DOM): الخلفية من الإحداثيات نفسها بعد إخفاء رسم النص دون تغيير layout،")
    lines.append("  ثم مقارنة اللون المرسوم (أو الممزوج من لون النص/شفافيته الفعليين) بها.")
    lines.append("  الطريقة السابقة كانت تختار «الخلفية» بأفتح بكسل دون 85% من أقصى إضاءة")
    lines.append("  فتلتقط حواف الحروف الملساء — رقم 2.09 السابق لم يكن قياسًا موضعيًا دقيقًا")
    lines.append("  ولم يُعتمد حكمًا. الرقمان مختلفا الغرض: المحافظ للضمان، والموضعي لإثبات المواضع.")
    lines.append("")
    lines.append("## 5) المجال المعلن (يوثّقه المستهلك كما هو هنا — لا زيادة):")
    lines.append("- يدخل ضمان النجاح (C1): أدوار النص الأربعة title/amount/label/sub")
    lines.append("  أبيض مصمت في أي موضع على السطح الافتراضي، وكذلك أدوار مرشح v2")
    lines.append("  المستخدمة فعليًا في المعاينة — كل دور صف بعتبته الرقمية في القسم 2.")
    lines.append("- تمييز المستويات بالحجم والوزن وإيقاع السطر لا بالشفافية (C1).")
    lines.append("- أي درجة أخف من الأبيض المصمت: مسموحة فقط في تركيب موثق لدى")
    lines.append("  المستهلك يجتاز عتبة النص المنطبقة — لا صنف في المكوّن يشحنها،")
    lines.append("  والقيم السابقة 0.8/0.72 مزالة ومرجعها موسوم في القسم 3.")
    lines.append("- خارج الضمان (معلوم بصدق): الإضاءة فوق 0.10 وdepth (مقارنة للسطح")
    lines.append("  البارز فقط) — تُعاد الحسابات عند أي تعديل. لا تغيير ألوان هوية.")
    lines.append("- عينات بكسل من مواضع النص الفعلية في اللقطة: reviews/S01/verification.txt")
    lines.append("  (B2b/B2c/B2d) — قياس موضعي مستقل عن هذه الحسابات التحليلية.")
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
    print("أزواج معلومة/مراجع خارج المجال دون عتبتها (موثقة أعلاه لا مضمونة): %d" % len(info_fails))
    sys.exit(1 if fails_domain else 0)

# ---- وضع اختبار التحكم (R2-04 + C1): العتاد يكشف الفشل فعلًا ----
# تحكم 1: زوج معروف الفشل داخل نطاق عام — يجب أن يُوسم FAIL ويُحتسب.
check("تحكم 1: مشمشي #F4AD76 على أبيض (معروف < 4.5)", parse("#F4AD75"), WHITE, THRESH)
# تحكم 2 (C1): القيمة السابقة المزالة (أبيض 0.72) فوق أسوأ تركيب داخل منطقة
# الموجات — إن كانت افتراضية داخل البوابة لفشلت: هذا مبرر الإزالة ودليل أن
# الكاشف يعلن فشلًا فعليًا لحالة فاشلة داخل النطاق.
sub_old = blend(WHITE, 0.72, WORST_IN_WAVES)
check("تحكم 2 (C1): أبيض 0.72 (القيمة السابقة المزالة) فوق أسوأ تركيب — يجب أن يفشل",
      sub_old, WORST_IN_WAVES, THRESH)
# تحكم 3 (C1): الدور الافتراضي الحالي (أبيض مصمت) فوق أسوأ تركيب — ينجح.
check("تحكم 3 (C1): أبيض مصمت (الدور الافتراضي) فوق أسوأ تركيب — يجب أن ينجح",
      WHITE, WORST_IN_WAVES, THRESH)

fails = [(n, th, r) for (n, th, r, d) in rows if r < th]
passes = [(n, th, r) for (n, th, r, d) in rows if r >= th]
c1, c2, c3 = rows[0], rows[1], rows[2]
ok = (len(fails) == 2 and len(passes) == 1
      and c1[2] < THRESH and c2[2] < THRESH and c3[2] >= THRESH
      and "FAIL" in lines[0] and "FAIL" in lines[1] and "PASS" in lines[2])
print("التحكم 1 (مشمعي/أبيض): %.2f — %s | التحكم 2 (أبيض 0.72 المزالة): %.2f — %s | التحكم 3 (أبيض مصمت): %.2f — %s"
      % (c1[2], "FAIL" if c1[2] < THRESH else "PASS",
         c2[2], "FAIL" if c2[2] < THRESH else "PASS",
         c3[2], "PASS" if c3[2] >= THRESH else "FAIL"))
print("الملخص: فاشل=%d ناجح=%d | رمز الخروج المتوقع لو كانت داخل البوابة: 1" % (len(fails), len(passes)))
print("SELFTEST: %s" % ("PASS — الكاشف يعلن فشلًا فعليًا للحالتين المعروفتين ونجاح الثالثة"
                       if ok else "FAIL"))
sys.exit(0 if ok else 1)
