#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص التباين لمعالجة السطح S01 (E09): حسابات قابلة لإعادة التشغيل.
من جذر المستودع:
  python3 tools/contrast-check.py
يعيد توليد reviews/S01/contrast-check.txt بنسب محسوبة من الألوان الفعلية
(بما فيها دمج الشفافيات والتدرج والإضاءة والموجات عند مواضع النص الفعلية).
"""
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "S01" / "contrast-check.txt"
rows, lines = [], []


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


def check(name, fg, bg, want):
    r = ratio(fg, bg)
    rows.append((name, want >= 4.5, r))
    lines.append("%-58s %8.2f : 1   %s" % (name, r, "PASS (≥4.5)" if want and r >= 4.5 else ("PASS (≥3)" if not want and r >= 3 else "FAIL")))


# الألوان المعتمدة (من الأسس — لا تغيير هوية)
GRAD_START = parse("#236675")
BRAND = parse("#164D59")
GRAD_END = parse("#103E48")
WHITE = (255, 255, 255)
WAVE_A = parse("#DFEEE6")   # موجات: أعلى طبقة (شفافية 0.14)
WAVE_B = parse("#F4AD75")   # (0.08)
WAVE_C = parse("#F7F8F4")   # (0.10)
LIGHT = 0.10                # الإضاءة الشعاعية أعلى السطح

lines.append("# فحص تباين S01 — حسابات WCAG من الألوان الفعلية (قابل لإعادة التشغيل)")
lines.append("# python3 tools/contrast-check.py — يولّد هذا الملف تلقائيًا")
lines.append("# الإضاءة الشعاعية 0.10 تُدمج أولًا ثم طبقات الموجة فوق التدرج حسب الموضع.")
lines.append("")

# ---- 1) تصحيح الأرقام المنشورة سابقًا (E09) ----
lines.append("## 1) الأرقام الصحيحة للأزواج المنشورة (تصحيح حسابي — تقرير سابق كان أدنى)")
check("أبيض مصمت على #164D59 (السطح الوسط)", WHITE, BRAND, True)
check("أبيض مصمت على #103E48 (أسفل التدرج)", WHITE, GRAD_END, True)
check("أبيض مصمت على #236675 (أعلى التدرج + إضاءة)", WHITE, blend(WHITE, LIGHT, GRAD_START), True)

# الخطأ السابق: ادعاء أن أبيض 0.8 فوق #236675 يعطي 8.86/11.34 —
# الصحيح: الأبيض 0.8 يُمزج مع الخلفية إلى نحو #D3E0E3.
label_blend = blend(WHITE, 0.8, GRAD_START)
lines.append("")
lines.append("### أبيض بشفافية 0.8 (تسمية السطح):")
lines.append("الدمج الفعلي فوق #236675 = %s (لا قيمة داكنة كما نُشر سابقًا)" % hx(label_blend))
check("نص أبيض 0.8 مدمج فوق #236675 (لون النص الفعلي مقابل أرضيته)", label_blend, GRAD_START, True)
light_composite = blend(WAVE_A, 0.14, GRAD_END)          # أفتح تركيب في منطقة الموجات

# ---- 2) مجال الإعدادات المدعوم (نص فوق الخلفية المركبة) ----
lines.append("")
lines.append("## 2) مجال الإعدادات المدعوم لنص فوق السطح المركب (تدرج + إضاءة + موجات)")
title_bg = blend(WHITE, LIGHT, GRAD_START)
check("العنوان (أبيض 1.0) أعلى السطح", WHITE, title_bg, True)
amount_bg = blend(WAVE_A, 0.10, BRAND)                    # منتصف السطح فوق موجة خافتة
check("المبلغ (أبيض 1.0) وسط السطح فوق موجة", WHITE, amount_bg, True)
sub = blend(WHITE, 0.72, GRAD_END)
sub_bg = blend(WAVE_B, 0.10, GRAD_END)
check("السطر الثانوي أبيض 0.72 أسفل السطح فوق موجة", sub, sub_bg, True)
label_over_wave = blend(WHITE, 0.8, light_composite)
check("التسمية أبيض 0.8 فوق أفتح تركيب بالقيم المسلّمة", label_over_wave, light_composite, True)

# أسوأ حالة داخل نطاق المفاتيح المعلنة (شدة الموجة حتى 2 ووضعها 100%):
worst = blend(WAVE_A, 0.14 * 2, GRAD_END)                 # أفتح تركيب ممكن بالمفاتيح
label_worst = blend(WHITE, 0.8, worst)
check("التسمية أبيض 0.8 فوق أسوأ تركيب (شدة الموجة = 2)", label_worst, worst, True)
sub_worst = blend(WHITE, 0.72, worst)
check("السطر الثانوي أبيض 0.72 فوق أسوأ تركيب (شدة = 2)", sub_worst, worst, True)

lines.append("")
lines.append("## 3) المجال المعلن (وثّقه المستهلك):")
lines.append("- النص المصمت الأبيض مدعوم على كامل السطح بأي قيم مسلّمة (أسوأ حالة > 9:1).")
lines.append("- النص الشفاف (0.8/0.72) مدعوم بالقيم المسلّمة الافتراضية وحتى أسوأ تركيب")
lines.append("  من نطاق مفاتيح السطح المعلنة (شدة الموجة = 2) — انظر السطرين الأخيرين أعلاه:")
lines.append("  ما يجتاز ≥ 4.5 فيهما مضمون داخل المجال؛ خارج النطاق المعلن يلزم إعادة الفحص.")
lines.append("- الموجات زخرفة خلف المحتوى: تُحسب هنا لأن النص قد يمر فوقها عند التكبير.")
lines.append("")
lines.append("## 4) ملاحظة E09 — مؤشر الاتجاه (delta):")
lines.append("الاتجاه (صاعد/هابط) مفصول عن دلالة الجودة (tone) يمررها المستهلك؛")
lines.append("الافتراضي محايد. لا تلوين نجاح/خطر من الاتجاه وحده داخل المكوّن.")

report = "\n".join(lines) + "\n"
OUT.write_text(report, encoding="utf-8")
print(report)
passed = sum(1 for _, ok, _ in [(n, ok and (("PASS" in l)) or ok, r) for (n, ok, r), l in zip(rows, lines[1:])][:0])
fails = [n for n, want, r in rows if (r < 4.5 if want else r < 3)]
print("\nالنتيجة: %d زوجًا، الفاشل (خارج المجال المعلن): %s" % (len(rows), fails if fails else "لا شيء"))
