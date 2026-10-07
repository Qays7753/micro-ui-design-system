#!/usr/bin/env python3
# SUI-A1 / V-audit — حساب تباين WCAG لأزواج توكنات Micro (حساب يدوي/رياضي لا قياس متصفح)
# المصدر: shared/tokens.css عند a5500c9 + أزواج الاستخدام الفعلي في المكوّنات/العينات.
import json

def lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(hexc):
    v = hexc.lstrip('#')
    r, g, b = (int(v[i:i+2], 16) for i in (0, 2, 4))
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

def ratio(fg, bg):
    l1, l2 = lum(fg), lum(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)

T = {
    'text-primary': '#172D32', 'text-secondary': '#50656A', 'text-hint': '#5F7378',
    'text-disabled': '#53676B', 'text-inverse': '#FFFFFF',
    'brand-primary': '#164D59', 'brand-pressed': '#103E48', 'brand-gradient-start': '#236675',
    'brand-accent': '#F4AD76',
    'surface-page': '#F7F8F4', 'surface-base': '#FFFFFF', 'surface-selected': '#DFEEE6',
    'surface-disabled': '#E4EAE8', 'summary-gradient-start': '#B8D9DC',
    'success': '#176647', 'success-surface': '#E5F3EA',
    'danger': '#AD303B', 'danger-surface': '#FBEAEC',
    'warning': '#815400', 'warning-surface': '#FFF1CD',
    'info': '#265E91', 'info-surface': '#E9F1FA',
    'border-divider': '#DCE5E2', 'border-control': '#71868B',
}

# (وصف الزوج، fg, bg, عتبة الحكم: 4.5 نص صغير، 3 نص كبير/أيقونات)
pairs = [
    # ---- نص أساسي/ثانوي/تلميح على أرضيات الصفحة والأسطح (كلها نص صغير 13-16px => 4.5) ----
    ('text-primary / surface-page (نص عام على أرضية الصفحة)', 'text-primary', 'surface-page', 4.5),
    ('text-primary / surface-base (نص داخل سطح أبيض/قائمة)', 'text-primary', 'surface-base', 4.5),
    ('text-secondary / surface-page (ثانوي 13-14px على الصفحة)', 'text-secondary', 'surface-page', 4.5),
    ('text-secondary / surface-base (ثانوي على أبيض: m-row__subtitle/value)', 'text-secondary', 'surface-base', 4.5),
    ('text-secondary / surface-selected (شارة محايدة m-badge على selected)', 'text-secondary', 'surface-selected', 4.5),
    ('text-hint / surface-page (تلميح 13px f03-field-help على الصفحة)', 'text-hint', 'surface-page', 4.5),
    ('text-hint / surface-base (سهم m-row__open / m-identity img placeholder)', 'text-hint', 'surface-base', 3.0),
    ('text-disabled / surface-disabled (نص معطل — معفى WCAG لكن للعلم)', 'text-disabled', 'surface-disabled', 4.5),
    # ---- الروابط/الأزرار ----
    ('text-inverse / brand-primary (نص أبيض على زر أساسي)', 'text-inverse', 'brand-primary', 4.5),
    ('text-inverse / brand-gradient-start (أسوأ حالة أعلى تدرج الزر)', 'text-inverse', 'brand-gradient-start', 4.5),
    ('text-inverse / brand-pressed (الضغط)', 'text-inverse', 'brand-pressed', 4.5),
    ('brand-primary / surface-base (رابط/عنوان بترولي على أبيض)', 'brand-primary', 'surface-base', 4.5),
    ('brand-primary / surface-page (رابط على أرضية الصفحة)', 'brand-primary', 'surface-page', 4.5),
    ('text-primary / brand-accent (شارة مشمشية m-badge--accent)', 'text-primary', 'brand-accent', 4.5),
    # ---- عدّاد وشارات الحالة ----
    ('brand-primary / surface-selected (عدّاد m-counter)', 'brand-primary', 'surface-selected', 4.5),
    ('success / success-surface (m-badge--success)', 'success', 'success-surface', 4.5),
    ('danger / danger-surface (m-badge--error)', 'danger', 'danger-surface', 4.5),
    ('warning / warning-surface (m-badge--warning)', 'warning', 'warning-surface', 4.5),
    ('info / info-surface (m-badge--info / f03-ochip--progress)', 'info', 'info-surface', 4.5),
    # ---- سطح المنحنيات (curves.css — نص داكن على توقفات التدرج الثلاثة) ----
    ('text-primary / summary-gradient-start (أغمق توقف تدرج المنحنيات 0%)', 'text-primary', 'summary-gradient-start', 4.5),
    ('text-primary / surface-selected (توقف منتصف تدرج المنحنيات 52%)', 'text-primary', 'surface-selected', 4.5),
    ('text-primary / surface-page (توقف نهاية تدرج المنحنيات 100%)', 'text-primary', 'surface-page', 4.5),
    # ---- حد تحكم (كائن غير نصي => 3.0) ----
    ('border-control / surface-base (حد الحقل/الزر الثانوي)', 'border-control', 'surface-base', 3.0),
    ('border-divider / surface-base (فاصل داخل قائمة — زخرفي)', 'border-divider', 'surface-base', 3.0),
]

out = []
for desc, fg, bg, thr in pairs:
    r = ratio(T[fg], T[bg])
    out.append({
        'pair': desc, 'fg': T[fg], 'bg': T[bg], 'ratio': round(r, 2),
        'threshold': thr, 'pass': bool(r >= thr),
    })

path = '/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent1/contrast-tokens.json'
with open(path, 'w', encoding='utf-8') as f:
    json.dump({'source': 'shared/tokens.css @ a5500c9 (tree 05f344b)',
               'method': 'WCAG 2.x relative-luminance ratio, computed in Python (no browser)',
               'results': out}, f, ensure_ascii=False, indent=2)
for o in out:
    flag = 'PASS' if o['pass'] else 'FAIL'
    print(f"{flag}  {o['ratio']:6.2f}:1  (>= {o['threshold']})  {o['pair']}")
