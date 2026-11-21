# حالة المكتبة — Micro UI

## الإصدار

الحزمة `@micro/ui` إصدار `0.2.0` (Vanilla بدون إطار؛ `private: true` — لا نشر دون قرار المالك): المصدر **ES modules** في `components/` و`shared/` و`assets/`، و`dist/` بناء حتمي غير متتبع (`npm run build` / `prepare` عند التثبيت من git)، مع أنواع TypeScript لكل مدخل و`examples/esm-app` و`examples/vanilla-app` — التفاصيل في [CHANGELOG.md](../CHANGELOG.md) و[GETTING-STARTED.md](GETTING-STARTED.md) و[API.md](API.md) و[LABELS.md](LABELS.md). مسار التحقق الواحد: `npm ci && uv sync && uv run python tools/check-all.py && npm run typecheck` (**26 بوابة**، منها package-install وlabels-override والبصرية مقابل `v0.1.0` من git).

## النضج الحالي

المصدر الوحيد للنضج هو [COMPONENT-CATALOG.json](COMPONENT-CATALOG.json): **14 عائلة / 8 متغيرات / 14 تركيبًا (C01–C14)**.

- العائلات: `stable-ui` ما عدا `order-schedule` و`carousel` (`draft-for-review`).
- المتغيرات: donut/bubbles/main-metric-featured/metric-circles/info-strip-peek (`stable-ui`)، data-readable/metric-readable (`draft-for-review`)، packed-circle (`proposed`).
- التراكيب C01–C14 كلها `draft-for-review` (C14 Manage جديدة، وC09/C12 تغطيان أنماط results/queue)؛ لا ترقية نضج آلية، والاعتماد البصري قرار مالك منفصل.

## الفجوات المعروفة

لا فجوات وظيفية معروفة مفتوحة: فجوات خطة الجاهزية الثلاث (C14 Manage، نتائج بحث C09، قائمة مراجعة C12) سُدّت في المرحلة 8 من [خطة الربط](plans/integration-readiness-2026-11-21/PLAN.md) بفحوص تغطيها (306 حالة product-context). ما دون ذلك مؤجلات قرار (أدناه) لا فجوات سلوك.

## المرحلة 9 — ملغاة (D7)

لا طبقات إطار في هذه الجولة: wrappers إطارات التطبيق (React/Vue) مؤجلة لحين تحديد التطبيق المستهدف؛ القرار D7 نهائي لهذه الخطة.

## المؤجلات

- wrappers إطارات التطبيق (React/Vue) مؤجلة لحين تحديد التطبيق (D7 — المرحلة 9 ملغاة).
- الاعتماد البصري النهائي ومعاينة Samsung Galaxy S25/Chrome الفعلية على المالك.
- قائمة مهام السائق غير مطلوبة (D19)؛ قائمة المراجعة صُممت لقابلية إعادة الاستخدام.
- تركيب سير عمل CI في `.github/workflows/` من `tools/ci/ci.yml` (التوكن الحالي بلا نطاق workflow).
- خيارات `options.labels` لكل نسخة في Carousel/Picker (init بلا معامل خيارات — setLabels على مستوى الصفحة في 0.x).

## ما لم يُختبر

Safari/WebKit، الأجهزة الفعلية (بينها Samsung Galaxy S25/Chrome)، اللمس الحقيقي، قارئات الشاشة، safe areas، native zoom، forced-colors — «غير مختبرة»؛ الفحص الآلي Chromium/Playwright فقط. التفصيل في [TESTING.md](TESTING.md) و[DECISIONS.md](DECISIONS.md).
