# حالة المكتبة — Micro UI

## الإصدار

الحزمة قيد التجهيز باسم `@micro/ui` إصدار `0.1.0` (Vanilla بدون إطار؛ راجع [CHANGELOG.md](../CHANGELOG.md) عند اكتمال التوزيع). المصدر القابل للتعديل في `components/` و`shared/` و`assets/` هو التسليم الأساسي.

## النضج الحالي

المصدر الوحيد للنضج هو [COMPONENT-CATALOG.json](COMPONENT-CATALOG.json): **14 عائلة / 8 متغيرات / 13 تركيبًا (C01–C13)**.

- العائلات: `stable-ui` ما عدا `order-schedule` و`carousel` (`draft-for-review`).
- المتغيرات: donut/bubbles/main-metric-featured/metric-circles/info-strip-peek (`stable-ui`)، data-readable/metric-readable (`draft-for-review`)، packed-circle (`proposed`).
- التراكيب C01–C13 كلها `draft-for-review`؛ لا ترقية نضج آلية، والاعتماد البصري قرار مالك منفصل.

## الفجوات المعروفة

مسجلة في [خطة جاهزية المكونات](plans/component-readiness-2026-11-17/PLAN.md): تركيب Manage (C14)، عرض نتائج بحث Market في C09، وقائمة مراجعة متعددة العناصر في C12 — تُسد في المرحلة 8 من [خطة الربط](plans/integration-readiness-2026-11-21/PLAN.md).

## المؤجلات

- wrappers إطارات التطبيق (React/Vue) مؤجلة لحين تحديد التطبيق (قرار D7).
- الاعتماد البصري النهائي ومعاينة Samsung Galaxy S25/Chrome الفعلية على المالك.
- قائمة مهام السائق غير مطلوبة (D19)؛ قائمة المراجعة صُممت لقابلية إعادة الاستخدام.

## ما لم يُختبر

Safari/WebKit، الأجهزة الفعلية (بينها Samsung Galaxy S25/Chrome)، اللمس الحقيقي، قارئات الشاشة، safe areas، native zoom، forced-colors — «غير مختبرة»؛ الفحص الآلي Chromium/Playwright فقط. التفصيل في [TESTING.md](../docs/TESTING.md) و[DECISIONS.md](../docs/DECISIONS.md).
