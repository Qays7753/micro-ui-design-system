# Micro UI Design System

مكتبة UI مستقلة قابلة لإعادة الاستخدام والتعديل. هذا المستودع لا يحتوي UX لمنتج Micro، ولا شاشات إنتاجية، ولا منطق أعمال، ولا مصادقة أو حفظًا حقيقيًا.

## نقطة الدخول

اقرأ بالترتيب:

1. [`AGENTS.md`](AGENTS.md) — عقد العمل الحالي.
2. [`DESIGN.md`](DESIGN.md) — الهوية والحدود.
3. [`docs/CURRENT-STATE.md`](docs/CURRENT-STATE.md) — الحالة الحالية وحدود الدليل، دون افتراض الدمج في `main`.
4. [`docs/UI-RELEASE.md`](docs/UI-RELEASE.md) — القواعد النهائية للنطاق الحالي.
5. [`docs/COMPONENT-INVENTORY.md`](docs/COMPONENT-INVENTORY.md) — العائلات ومسارات المصدر.
6. مواصفة العائلة داخل `components/` قبل تعديلها.
7. [`docs/SYSTEM-CONTRACTS.md`](docs/SYSTEM-CONTRACTS.md) — Geometry B والثيم ودورة الحياة والبيانات وملكية المضيف.
8. [`docs/COMPONENT-CATALOG.json`](docs/COMPONENT-CATALOG.json) — مصدر النضج الوحيد؛ 14 عائلة ومتغيرات صريحة.

## مصدر الحقيقة

**الإصدار الحالي Light-only.** لا دعم أو إصلاح أو اختبارات Dark/System-dark في هذه الدفعة. توثيق التنفيذ والأدلة الحالية في [`تقرير الإصلاح`](docs/replit/light-only-complete-ui-repair-2026-10-24/REPORT.md)، لا في نتائج الجولات التاريخية.

- `components/`: CSS وJavaScript وHTML والمواصفات القابلة للتعديل.
- `shared/tokens.css`: التوكنز التنفيذية الوحيدة.
- `shared/motion.css` و`shared/icons.js`: القواعد المشتركة.
- `assets/`: الخطوط والأيقونات والشعار والأصول المعتمدة.
- `previews/`: أمثلة مستقلة للمكونات.
- `previews/ui-system-showcase/`: معرض المكونات الأخير، بمصدر قابل للتعديل وملف standalone مولد.

## المعرض الأخير

للتشغيل من جذر المستودع:

```bash
python3 tools/preview-server.py
```

ثم افتح:

```text
http://localhost:5000/previews/ui-system-showcase/index.html
```

أو افتح مباشرة:

```text
previews/ui-system-showcase/standalone.html
```

الملف الواحد مولد آليًا؛ عدّل `index.html` و`showcase.css` و`showcase.js` ثم أعد البناء، ولا تعدل `standalone.html` يدويًا.

## الفحوص الحالية

```bash
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/component-mobile-check.py
python3 tools/chart-mobile-check.py
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
python3 tools/concepts-check.py
python3 tools/data-scale-state-check.py
```

`component-mobile-check.py` يفحص الحقول والاختيار مباشرة من مصدر المكوّنات،
بمحاكاة لمس Chromium عند 320/360/390/430 وتكبير النص؛ يحفظ الأدلة في مجلد
مؤقت افتراضيًا، أو في المسار المحدد بـ`--out`. لا يستخدم CSS المعرض ولا
يثبت أجهزة أو قارئات شاشة فعلية.

مرجع الأبعاد والهندسة والاستثناءات الحالية:
[`docs/COMPONENT-GEOMETRY.md`](docs/COMPONENT-GEOMETRY.md).

تقارير الإصلاح السابق **التاريخية** في
[`docs/replit/professional-numeric-geometry-ui-polish-2026-10-21/`](docs/replit/professional-numeric-geometry-ui-polish-2026-10-21/).
أدلة `reviews/UI-SYSTEM-SHOWCASE/` و`docs/UI-SYSTEM-SHOWCASE-*.md` تاريخية،
وليست بديلًا عن تشغيل الفحوص على المصدر الحالي.

## العائلات

| العائلة | المصدر | الحالة الحالية |
|---|---|---|
| buttons | `components/buttons/` | STABLE UI |
| fields | `components/fields/` | STABLE UI |
| selection | `components/selection/` | STABLE UI |
| organization | `components/organization/` | STABLE UI |
| data | `components/data/` | STABLE UI |
| messages | `components/messages/` | STABLE UI |
| navigation | `components/navigation/` | STABLE UI |
| surfaces | `components/surfaces/` | STABLE UI |
| info-strip | `components/info-strip/` | STABLE UI مع peek اختياري |
| metric-comparison | `components/metric-comparison/` | STABLE UI |
| account-settings | `components/account-settings/` | STABLE UI دون حفظ فعلي |
| access-gateway | `components/access-gateway/` | STABLE UI دون مصادقة فعلية |
| order-schedule | `components/order-schedule/` | DRAFT FOR REVIEW |
| carousel | `components/carousel/` | DRAFT FOR REVIEW |

`packed-circle` متغير مقترح opt-in تحت Data، وليس عائلة خامسة عشرة. Donut وBubbles وMetric Circles وMain Metric featured متغيرات متخصصة opt-in أيضًا؛ مصدر القائمة والنضج هو الكتالوج.

## حدود مهمة

التحقق الحالي قائم على Chromium/Playwright. لم يُثبت بعد توافق جهاز Android أو iOS فعلي، WebKit/Safari، اللمس الحقيقي، TalkBack/VoiceOver، safe areas أو native zoom. لا تحول نجاح الفحوص المكتبية إلى ادعاء جاهزية إنتاجية.

لا تغيّر الهوية أو التوكنز أو الخطوط أو الأيقونات من دون قرار صريح. حافظ على العربية RTL، الأرقام المقروءة، الحالات الصادقة، وعدم قص البيانات المهمة.

## الحزمة

المصدر القابل للتعديل هو التسليم الأساسي. تعليمات إعادة بناء حزمة النقل موجودة في [`deliverables/README.md`](deliverables/README.md)، ولا تُعامل أي صورة أو build كبديل عن المصدر.

مصدر الرسوم القابل للنقل: [`components/data/`](components/data/)، ومثاله المستقل [`example-usage.html`](components/data/example-usage.html). فحص `chart-mobile-check.py` يستخدم CSS/JS المصدر دون المعرض، ويثبت عرض SVG ونسبه والقراءات الكاملة وهندسة التنقل والاختيار؛ لا اختبار أجهزة فعلية.

## العرض النظيف ومختبر الحالات

المعرض يبدأ بـOverview للمكونات الفعلية دون السجلات؛ افتح رابط **مختبر الحالات** أو `previews/ui-system-showcase/index.html#state-lab` للاختبارات والـfixtures والأحداث. المقارنة الدقيقة تبدأ بـbars/rows/table؛ Bubbles وPacked وMetric Circles خيارات متخصصة صريحة وليست العرض الافتراضي.

فحوص الإصدار: `tools/light-calendar-check.py`، `tools/light-data-check.py`، و`tools/light-release-check.py`، إضافة إلى فحوص المصدر الحتمية والمكونات الحالية المناسبة. لا تشغّل `professional-remediation-check.py` التاريخي ضمن قبول هذا الإصدار لأنه يشمل Dark.
