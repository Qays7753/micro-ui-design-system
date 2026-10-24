# إصلاح خطأ تشغيل المعاينة — 2026-10-24

## الطلب والسبب المثبت

طلب المالك إصلاح تعطل UI audit preview بعد التسليم `d80c149`.

أمكن إعادة إنتاج الخطأ عند الانتقال من Overview إلى State Lab:

```text
ResizeObserver loop completed with undelivered notifications.
```

هذا ErrorEvent بلا Error/stack، ولذلك عرضته المعاينة بصيغة عامة:
`An uncaught exception occured but the error was not an error object.`
الاعتماد على Playwright pageerror وحده لم يكن كافيًا لكشفه.

أظهر قياس قبل/بعد callbacks أن أربع وحدات تغيّر ارتفاع العنصر الذي تراقبه داخل دورة تسليم ResizeObserver: Data plots وPacked وMetric Circles وCalendar. ظهور المكونات المخفية هو المحفز، لا انهيار خادم Python.

## الإصلاح

- `components/data/data.js`: تجميع إعادة الرسم في requestAnimationFrame واحد لكل رسم، وإعادة فحص العرض قبل الرسم، وإلغاء الإطار عند disconnect.
- `components/data/packed-circle.js`: تأجيل layout خارج callback وتجميعه؛ إلغاء إطار الرندر القديم عند إعادة render والتحقق من بقاء chart/wrap والمراقب الحالي.
- `components/metric-comparison/metric-comparison.js`: تأجيل تعديل التخطيط، إعادة قياس العرض الفعلي، وإلغاء إطار disconnect.
- `components/order-schedule/order-schedule.js`: حفظ آخر عرض مُلاحظ وتأجيل التحديث؛ تجاهل الجذر المخفي وإلغاء الإطار عند destroy.
- `previews/ui-system-showcase/standalone.html`: توليد من المصدر بعد الإصلاح.
- `tools/preview-runtime-check.py`: اختبار نافذة error وunhandledrejection وpageerror والتوقف عن تسليم resize بعد استقرار التخطيط، لا pageerror وحده.
- `REPORT.md`: تمييز هذا الإصلاح اللاحق عن التسليم السابق.
- `INDEPENDENT-REVIEW.md`: تحويل ثلاث نهايات أسطر ذات مسافات طرفية إلى فقرات Markdown، دون تغيير نتائج المراجعة، لتمرير فحص diff من baseline الأصلي.
- `MANIFEST.json`: إعادة توليد بصمات الملفات العامة، بما يشمل التغييرات السابقة التي توقف تسليمها قبل إعادة التوليد.

لا listener في المنتج لكتم الخطأ، ولا preventDefault، ولا try/catch لإخفائه. لم تُغيّر النسب أو الأرقام أو أحداث اختيار اليوم أو brand tokens أو الأصول.

## الفحوص

| الفحص | النتيجة |
|---|---|
| preview-runtime-check | 112/112؛ 16 تركيبة: مصدر/standalone × أربعة عروض × RTL/LTR |
| chart-mobile-check | 59/59 |
| light-calendar-check | 79/79 |
| light-data-check | 165/165 |
| light-static-check | 168/168 بعد إزالة المسافات الطرفية الموروثة من التسليم السابق |

فحص التشغيل يفتح المختبر ويعود منه مرتين، ويبدل اتجاه وعرض الحاوية، ويفتح Picker ويغلقه، ويغيّر viewport ذهابًا وإيابًا. يتحقق من غياب ErrorEvents والاستثناءات والرفض غير المعالج، واستقرار مراقبي القياس، وبقاء قيم المصدر والتاريخ المحدد، وظهور التقويم ورسوم SVG.

التشغيل الأول للاختبار الجديد صنّف صورة fallback المتعمدة ضمن أخطاء التشغيل فأعطى 80/96. هذه صورة `data:text/plain,not-an-image` المحددة في المعرض لاختبار fallback. فُصلت أخطاء الموارد عن ErrorEvent، وأضيف assertion مستقل يقبل **ذلك المورد والعلامة فقط**، دون استثناء موارد أخرى أو أخطاء ResizeObserver. التشغيل النهائي 112/112 بعد إضافة هذا التحقق.

الأوامر:

```bash
python3 tools/preview-runtime-check.py
python3 tools/chart-mobile-check.py --out generated-artifacts/runtime-fix/chart
python3 tools/light-calendar-check.py
python3 tools/light-data-check.py --out generated-artifacts/runtime-fix/data
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/light-static-check.py
git diff --check
```

نتائج التشغيل الجديد في `generated-artifacts/runtime-fix/` المستثنى من Git. نتائج التقويم التفصيلية يكتبها اختباره إلى `/tmp/micro-light-calendar-check.json`.

## الحدود

- Light-only وChromium؛ لم تُشغّل اختبارات Dark أو Safari أو جهاز فعلي.
- هذا إصلاح runtime محدد، لا إعادة قبول لكل التدقيق السابق.
- ملاحظة Info Card الإنجليزية المكبرة ذات حالات الفشل الأربع في المراجعة المستقلة السابقة **لم تُصلح هنا**، ولا تُعد نتائج هذه الدفعة دليلًا على إصلاحها.
- لا merge أو PR أو نشر، والعمل على الفرع نفسه فقط.
