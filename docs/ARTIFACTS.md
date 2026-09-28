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

## حزمة تكليف التوسع — 2026-09-28

- UI-LIBRARY-EXECUTION-BRIEF.md: معايير التنفيذ والمصدر والتبعيات.
- UI-COVERAGE-MATRIX.md: متطلبات التغطية، وليست نتائج اختبار.
- ../prompts/UI-LIBRARY-EXPANSION-ZAI.md: رسالة بدء التنفيذ.

الحزمة تحافظ على الأسس؛ الأشكال الناتجة تبقى DRAFT حتى مراجعتها.


## مراجعة DELIVERY-R1 — 2026-09-28

- `reviews/DELIVERY-R1/CHATGPT-REVIEW.md`: تقرير CHANGES REQUESTED للرأسين `30d0070` و`cd14cc9`، مع الإصلاحات وأدلة قبولها.
- `reviews/DELIVERY-R1/source-probes.cjs`: تشخيص قابل للتشغيل على نسخة التسليم، باستخدام DOM محاكى؛ ليس فحص متصفح.
- `reviews/DELIVERY-R1/source-probes.txt`: نتائج التشخيص من `cd14cc9`، وليست إعلان نجاح.


## إعادة مراجعة DELIVERY-R2 — 2026-09-28

- `reviews/DELIVERY-R2/CHATGPT-REVIEW.md`: نتيجة مراجعة `71ffff1` و`4fa61e1`، إغلاق جزئي للجولة السابقة و7 متبقيات محددة مع الترشيحات البصرية.
- `reviews/DELIVERY-R2/source-probes.cjs` و`source-probes.txt`: تشخيصات مصدر قابلة لإعادة التشغيل وأدلة التحقق؛ ليست فحص متصفح.


## DELIVERY-R3 — إغلاق معظم المتبقيات

- `reviews/DELIVERY-R3/CHATGPT-REVIEW.md`: مراجعة `03dfd58`؛ خمسة بنود مغلقة وتصحيحان محددان C1/C2.
- `reviews/DELIVERY-R3/source-probes.cjs` و`source-probes.txt`: إعادة تشخيص المصدر، مع إثبات المقام الصفري/السالب. ليست فحوص متصفح.
