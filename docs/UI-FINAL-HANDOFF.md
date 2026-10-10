# Micro UI — التسليم الحالي

هذا الملف هو موجز التشغيل الحالي للمكتبة بعد تنظيف المستودع. `main` هو المصدر الوحيد، ولا توجد حاجة لقراءة سجلات فروع أو جولات قديمة لفهم المصدر.

## ما يُسلّم

- مصدر المكونات في `components/`.
- التوكنز والقواعد المشتركة في `shared/`.
- الأصول المحلية في `assets/`.
- أمثلة المكونات في `previews/`.
- المعرض الأخير في `previews/ui-system-showcase/`.
- المواصفات والقرارات في `docs/`.
- آخر دليل تحقق في `reviews/UI-SYSTEM-SHOWCASE/`.

## طريقة العمل

اقرأ `AGENTS.md` ثم `DESIGN.md` و`docs/CURRENT-STATE.md`. اختر مكونًا من `docs/COMPONENT-INVENTORY.md`، واقرأ مواصفته قبل تعديل المصدر. لا تعتبر المعرض شاشة منتج ولا تنقل fixtures إلى منطق أعمال.

إذا تغير مصدر المكون:

1. حدّث المواصفة إذا تغير العقد.
2. حدّث المثال القابل للتعديل عند الحاجة.
3. أعد بناء standalone إذا كان التغيير يخص المعرض.
4. شغّل الفحوص المرتبطة وسجل حدودها.
5. راجع RTL والقياسات والنص الطويل والحالات الفارغة.

## الحدود

المكتبة جاهزة للاستهلاك البرمجي ضمن نطاق UI، وليست إعلانًا عن جاهزية تطبيق Micro أو UX أو المصادقة أو الحفظ أو النشر. التحقق الفعلي على Android/iOS وWebKit وقارئات الشاشة يحتاج مسارًا منفصلًا.

## أوامر التسليم

```bash
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
python3 tools/concepts-check.py
python3 tools/data-scale-state-check.py
git diff --check
```
