# فهرس المخرجات الحالية

النسخ الحالية المرتبطة بالاتجاه المعتمد، مع التقرير الوارد ومراجعته. استُبعدت الدراسات القديمة والمعاينات المستبدلة والملفات المؤقتة. لا تمثل الصور مكتبة مكوّنات نهائية.

| الملف | الحالة | الملاحظة |
|---|---|---|
| [docs/foundations/Micro-UI-Foundations-V1.md](../docs/foundations/Micro-UI-Foundations-V1.md) | APPROVED BASELINE | أسس معتمدة؛ النطاق الأحدث في CURRENT-STATE |
| [references/micro-data-colors-v1.html](../references/micro-data-colors-v1.html) | APPROVED PALETTE | ألوان البيانات؛ توزيع الدوائر مثال توضيحي |
| [references/visuals/02-compact-direction.png](../references/visuals/02-compact-direction.png) | APPROVED DIRECTION | مرجع الاتجاه المعدل؛ صورة مفهومية |
| [references/visuals/04-direction-review.png](../references/visuals/04-direction-review.png) | REFERENCE | مراجعة الاتجاه؛ لا إثبات لدقة الخط أو الأيقونات |
| [references/reports/Micro-UI-Component-Needs-AR.docx](../references/reports/Micro-UI-Component-Needs-AR.docx) | REFERENCE | تقرير الأيجنت الوارد مع حدود مراجعته في CURRENT-STATE |

README وAGENTS وCURRENT-STATE وWORKFLOW ملفات تنظيم عمل أضيفت مع هذه الحزمة.

ملاحظات تقرير الاحتياجات: [المراجعة](../reviews/component-needs-review.md).

## تجهيز إنتاج المكوّنات

قائمة العمل COMPONENT-INVENTORY.md، القواعد SHARED-SPEC.md، عقد المصدر EDITABLE-DELIVERY.md، التكليفات الموجودة في `prompts/`، وقالب `reviews/REVIEW-TEMPLATE.md`. هذه مواصفات عمل؛ لا تمثل اعتماد مخرجات بصرية لم تُنتج بعد.

## مخرجات B01

| الملف | الحالة | الملاحظة |
|---|---|---|
| `components/buttons/` + `previews/buttons/` + `shared/tokens.css` (فرع task/b01-buttons، PR #1) | DRAFT FOR RE-REVIEW | دفعة B01: مصدر كامل قابل للتعديل + معاينة + فحوص — أُنجزت جولتا R1 وR2، ودُمجت في main دون اعتماد إنتاجي |
| `reviews/B01/review.md` + `reviews/B01/CHATGPT-REVIEW-R1.md` + `reviews/B01/CHATGPT-REVIEW-R2.md` | REVIEW | نتائج الفحص ومراجعات ChatGPT وتعليمات التصحيح |
| `tools/b01-screenshots.py` + `tools/README.md` | DRAFT TOOL | سكربت اللقطات وفحوص المتصفح — يعاد تشغيله من جذر المستودع |

## حزمة تكليف التوسع — 2026-09-28

- `UI-LIBRARY-EXECUTION-BRIEF.md`: معايير التنفيذ والمصدر والتبعيات.
- `UI-COVERAGE-MATRIX.md`: متطلبات التغطية، وليست نتائج اختبار.
- `../prompts/UI-LIBRARY-EXPANSION-ZAI.md`: رسالة بدء التنفيذ.

الحزمة تحافظ على الأسس؛ الأشكال الناتجة تبقى DRAFT حتى مراجعتها واعتمادها.

## مخرجات التوسعة — 2026-09-28 (PR #2 المدموج في main)

| الملف | الحالة | الملاحظة |
|---|---|---|
| `components/fields/` + `previews/fields/` | DRAFT FOR RE-REVIEW | B02 الحقول: فحوص 27/27 — مدموجة في main بعد R2-06 (تفرد معرف الرسالة بالمستند) |
| `components/selection/` + `previews/selection/` | DRAFT FOR RE-REVIEW | B03 الاختيار: فحوص 25/25 — بعد R2-03 (حالة قراءة موحدة للمنتقي) وR2-06 (ثبات عقود المفتاح) |
| `components/organization/` + `previews/organization/` | DRAFT FOR RE-REVIEW | B04 التنظيم: فحوص 15/15 |
| `components/surfaces/` + `assets/surfaces/` + `shared/motion.css` + `previews/surfaces/` | DRAFT FOR RE-REVIEW | S01 الأسطح والحركة: فحوص 35/35 — بعد R2-01 وR2-04 وC1 + مثال مستقل |
| `components/data/` + `previews/data/` | DRAFT FOR RE-REVIEW | B05 البيانات والتتبّع: فحوص 26/26 — بعد R2-05 وC2 |
| `components/messages/` + `previews/messages/` | DRAFT FOR RE-REVIEW | B06 الرسائل والحالات: فحوص 17/17 |
| `components/navigation/` + `previews/navigation/` | DRAFT FOR RE-REVIEW | B07 التنقّل والطبقات: فحوص 28/28 — بعد R2-02 |
| `previews/index.html` + `previews/board-base.css` + `previews/board.js` | DRAFT | فهرس المعاينات والبنية المشتركة لفرع التوسعة |
| `docs/UI-USAGE-SOP.md` + `docs/UI-COVERAGE-RESULTS.md` | DRAFT | دليل الاستخدام والتركيب + تقرير التغطية لكل معرف |
| `tools/b02..b07/s01-screenshots.py` + `tools/hugeicons-convert.py` | DRAFT TOOL | سكربتات فحص الدفعات ومحوّل الأيقونات من الحزمة المعتمدة |
| `assets/icons/` (+26 أصلًا) | LICENSED ASSETS | نفس الحزمة @hugeicons/core-free-icons@4.3.5 بنفس طريقة التحويل دون تعديل مسارات |

تقرير التغطية لكل معرف: `docs/UI-COVERAGE-RESULTS.md`.

## تقارير المراجعة والتسليم

- `reviews/DELIVERY-R1/CHATGPT-REVIEW.md`: تقرير CHANGES REQUESTED مع الإصلاحات وأدلة قبولها.
- `reviews/DELIVERY-R2/CHATGPT-REVIEW.md`: إغلاق جزئي للجولة السابقة ومتطلبات R2 المحددة.
- `reviews/DELIVERY-R3/CHATGPT-REVIEW.md`: مراجعة C1/C2 وإغلاق المتبقيات المحددة.
- ملفات `source-probes` تشخيصات مصدر قابلة لإعادة التشغيل وليست بديلًا عن اختبار هاتف أو قارئ شاشة.
