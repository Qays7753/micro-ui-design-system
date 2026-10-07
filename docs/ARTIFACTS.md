# أصول الشعار المعتمد — 2026-10-07

- [Micro Logo V1 — المدخل والمصدر وكل المشتقات](../assets/brand/micro-logo/README.md): APPROVED BY OWNER، محفوظ على main. [التطوير المؤجل](../assets/brand/micro-logo/FUTURE-DEVELOPMENT.md).

# مخرجات التكليف الجاري —2026-10-03

حزمة الاستكمال في [handoff/ZAI-START-HERE.md](../handoff/ZAI-START-HERE.md): التكليف، تدقيق main، المراحل الثماني، القرارات، الأصول، المعايير، والتتبع. [البرومبت](../prompts/ZAI-UI-COMPLETION.md). أصول الصور والفيديو المشار إليها موجودة في references ولم تُنسخ مرة أخرى. الملفات القديمة في handoff/archive تاريخية. ZIP المصدر السابق يعاد توليده في نهاية المهمة؛ التوثيق الحالي لا يدعي تنفيذ إصلاحات UI.

## الفهرس السابق

# فهرس المخرجات الحالية


## مدخل الإصدار الحالي

- [UI-RELEASE](UI-RELEASE.md) و[UI-VISUAL-SYSTEM](UI-VISUAL-SYSTEM.md): المرجع النهائي لهذه الدفعة.
- [مرجع الحالات](../previews/system/index.html) و[تقرير التحقق](../reviews/UI-RELEASE/review.md).

- [DESIGN.md](../DESIGN.md): مرجع الهوية والتركيب؛ لا لوحة جديدة.
- [المعرض الموحد](../previews/index.html): العائلات الأساسية والجديدة والأمثلة المستقلة وروابط المصدر.
- [فهرس العائلات](COMPONENT-INVENTORY.md)، [الاختيارات](UI-DECISIONS.md)، [ثلاث تركيبات](../previews/compositions/index.html).
- [أدلة IDENTITY السابقة](../reviews/IDENTITY/review.md): تاريخية وتتبع بصمات مصدرها.
- [الاتجاه المنحني الواسع والخافت](../previews/surfaces/approved-curves.html) و[CSS المستقل](../components/surfaces/curves.css) ضمن لغة الإصدار؛ لا تعميم لدراسات S01 القديمة. الزر 24px والتحميل B حُسما، لا PROPOSED حالي.
- [الحزمة الكاملة على أجزاء وأمر جمعها](../deliverables/README.md)؛ أمر `python3 tools/assemble-components-package.py` ينتج `deliverables/micro-components-editable.zip` متحققًا. MANIFEST يطابق المصادر بعد آخر تعديل.

## أدلة جولة نواة المكتبة المحفوظة

- [مرجع الهوية](../DESIGN.md) — القواعد المعتمدة وروابط مصادرها.
- [القرارات](DESIGN-DECISIONS.md) — المعتمد والمقترح والمشروط بالحاجة.
- [المعرض الموحد](../previews/index.html) — جميع العائلات الحالية من المصدر.
- [أمثلة التركيب](../previews/compositions/index.html) — ثلاثة أمثلة مصغرة لا شاشات منتج.
- [تقرير هذه الجولة](../reviews/DESIGN-CORE/review.md) — الفحوص وحدودها.

## المراجع البصرية السابقة
جولة إصلاح After محفوظة تاريخيًا: `reviews/AFTER-DIRECTION/REPAIR-REPORT.md`، نتائج `reviews/AFTER-DIRECTION/repair/`، وأمثلة قابلة للتعديل في لوحة After، مع عقد `components/data/PACKED-PATTERN.md`. لا تمحى أدلتها ولا تعتبر تلقائيًا فحصًا للإصدار الجديد.

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

## سجل إنتاج الدفعات — تاريخي

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

## دفعة العارض المستقلة — 2026-09-29

| الملف | الحالة | الملاحظة |
|---|---|---|
| `components/carousel/` + `previews/carousel/` | DRAFT FOR REVIEW | العارض: بطاقة نشطة بالمنتصف ومجاورة ظاهرة وأسهم ومؤشر وسحب pointer بعتبات موثقة وترتيب منطقي RTL — فحوص 38/38 من شجرة commit المصدر `2940aa6` (بصمة `277b828c`) |
| `components/data/packed-circle.css` + `packed-circle.js` | PROPOSED (opt-in) | امتداد الدوائر المتداخلة فوق عقد B05 — لا يغيّر سلوك B05 الافتراضي ولا يلمس data.js؛ بانتظار اعتماد المالك |
| `docs/components/CAROUSEL-COMPONENT-BRIEF.md` + `references/motion/card-carousel-reference.md` | DRAFT + REFERENCE | تكليف الدفعة + مرجع الحركة بتصريح صريح أن الصورة/الفيديو المرفقين لم يصلا إلى بيئة التنفيذ |
| `tools/carousel-screenshots.py` + `reviews/CAROUSEL/` | DRAFT TOOL | فحص ولقطات (27 لقطة) — متصفح headless فعلي، وتحقق استنساخ نظيف بخرج مطابق |

## تقارير المراجعة والتسليم

- `reviews/DELIVERY-R1/CHATGPT-REVIEW.md`: تقرير CHANGES REQUESTED مع الإصلاحات وأدلة قبولها.
- `reviews/DELIVERY-R2/CHATGPT-REVIEW.md`: إغلاق جزئي للجولة السابقة ومتطلبات R2 المحددة.
- `reviews/DELIVERY-R3/CHATGPT-REVIEW.md`: مراجعة C1/C2 وإغلاق المتبقيات المحددة.
- ملفات `source-probes` تشخيصات مصدر قابلة لإعادة التشغيل وليست بديلًا عن اختبار هاتف أو قارئ شاشة.

## سجل إنتاج الدفعات — تاريخي

قائمة العمل COMPONENT-INVENTORY.md، القواعد SHARED-SPEC.md، عقد المصدر EDITABLE-DELIVERY.md، التكليفات الموجودة في `prompts/`، وقالب `reviews/REVIEW-TEMPLATE.md`. هذه مواصفات عمل؛ لا تمثل اعتماد مخرجات بصرية لم تُنتج بعد.
## دفعة اتجاه After — 2026-09-29 — تاريخية

| الملف | الحالة | الملاحظة |
|---|---|---|
| `previews/after-direction/` (index/board.css/board.js/README) | DRAFT FOR REVIEW (تركيب PROPOSED) | تركيب مرجعي قابل للتعديل لا شاشة إنتاجية — المكوّنات من مصدرها في components/ بلا تعديل |
| `tools/after-direction-screenshots.py` + `reviews/AFTER-DIRECTION/` | DRAFT TOOL | فحص ولقطات (22 لقطة) — 41/41 من شجرة commit المصدر + إثبات تعديل ثلاثي مع استعادة موثقة بالبصمات |
| `references/visual-direction/after/` + `references/motion/card-carousel-reference.*` | REFERENCE ONLY | حزمة المراجع من `task/after-direction-reference-pack` — فُتحت فعليًا (6 صور + إطارات الفيديو) ولم تُستخدم خلفيات أو بديل مصدر |
