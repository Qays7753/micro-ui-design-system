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
قائمة العمل COMPONENT-INVENTORY.md، القواعد SHARED-SPEC.md، عقد المصدر EDITABLE-DELIVERY.md، تكليف ../prompts/B01-BUTTONS-ZAI.md، وقالب ../reviews/REVIEW-TEMPLATE.md. هذه مواصفات عمل؛ لا تمثل اعتماد مخرجات بصرية لم تُنتج بعد.

## مخرجات الدفعات

| الملف | الحالة | الملاحظة |
|---|---|---|
| `components/buttons/` + `previews/buttons/` + `shared/tokens.css` (فرع task/b01-buttons، PR #1) | DRAFT FOR RE-REVIEW | دفعة B01 (الأزرار): مصدر كامل قابل للتعديل + معاينة + فحوص — بعد جولتَي تصحيح R1 وR2؛ بانتظار مراجعة ChatGPT واعتماد قيس |
| `reviews/B01/review.md` + `reviews/B01/CHATGPT-REVIEW-R1.md` + `reviews/B01/CHATGPT-REVIEW-R2.md` | REVIEW | نتائج الفحص ومراجعتا ChatGPT وتعليمات التصحيح |
| `tools/b01-screenshots.py` + `tools/README.md` | DRAFT TOOL | سكربت اللقطات وفحوص المتصفح — يعاد تشغيله من جذر المستودع |

## حزمة تكليف التوسع — 2026-09-28

- UI-LIBRARY-EXECUTION-BRIEF.md: معايير التنفيذ والمصدر والتبعيات.
- UI-COVERAGE-MATRIX.md: متطلبات التغطية، وليست نتائج اختبار.
- ../prompts/UI-LIBRARY-EXPANSION-ZAI.md: رسالة بدء التنفيذ.

الحزمة تحافظ على الأسس؛ الأشكال الناتجة تبقى DRAFT حتى مراجعتها.

## مخرجات التوسعة — 2026-09-28 (فرع task/ui-library-expansion — PR #2 تابع لـ#1)

| الملف | الحالة | الملاحظة |
|---|---|---|
| `components/fields/` + `previews/fields/` | DRAFT FOR RE-REVIEW | B02 الحقول: فحوص 27/27 — بعد R2-06 (تفرد معرف الرسالة بالمستند) |
| `components/selection/` + `previews/selection/` | DRAFT FOR RE-REVIEW | B03 الاختيار: فحوص 25/25 — بعد R2-03 (حالة قراءة موحدة للمنتقي) وR2-06 (ثبات عقود المفتاح) |
| `components/organization/` + `previews/organization/` | DRAFT FOR RE-REVIEW | B04 التنظيم: فحوص 15/15 |
| `components/surfaces/` + `assets/surfaces/` + `shared/motion.css` + `previews/surfaces/` | DRAFT FOR RE-REVIEW | S01 الأسطح والحركة: فحوص 21/21 — بعد R2-01 (سطور نسبية ولفّ رقم طويل) وR2-04 (عينات بكسل) + مثال مستقل |
| `components/data/` + `previews/data/` | DRAFT FOR RE-REVIEW | B05 البيانات والتتبّع: فحوص 25/25 — بعد R2-05 (تحليل رقم كامل وتمييز مفقود/صفر/مقام غير صالح) |
| `components/messages/` + `previews/messages/` | DRAFT FOR RE-REVIEW | B06 الرسائل والحالات: فحوص 17/17 |
| `components/navigation/` + `previews/navigation/` | DRAFT FOR RE-REVIEW | B07 التنقّل والطبقات: فحوص 28/28 — بعد R2-02 (دورة حياة الطبقة الآمنة) |
| `previews/index.html` + `previews/board-base.css` + `previews/board.js` | DRAFT | فهرس المعاينات والبنية المشتركة لفرع التوسعة |
| `docs/UI-USAGE-SOP.md` + `docs/UI-COVERAGE-RESULTS.md` | DRAFT | دليل الاستخدام والتركيب + تقرير التغطية لكل معرف |
| `tools/b02..b07/s01-screenshots.py` + `tools/hugeicons-convert.py` | DRAFT TOOL | سكربتات فحص الدفعات ومحوّل الأيقونات من الحزمة المعتمدة |
| `assets/icons/` (+26 أصلًا) | LICENSED ASSETS | نفس الحزمة @hugeicons/core-free-icons@4.3.5 بنفس طريقة التحويل دون تعديل مسارات |

تقرير التغطية لكل معرف: docs/UI-COVERAGE-RESULTS.md.
