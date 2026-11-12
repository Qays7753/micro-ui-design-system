# فهرس مكونات Micro UI

<!-- GENERATED: tools/component-catalog-build.py — edit COMPONENT-CATALOG.json -->

مصدر حالة النضج الوحيد: [`COMPONENT-CATALOG.json`](COMPONENT-CATALOG.json).
هذه 14 عائلة؛ متغيرات الرسوم والشريط ليست عائلات إضافية.
الإصدار Light-only. المقارنة الدقيقة bars/rows/table؛ الأشكال الدائرية المتخصصة opt-in صريح.
الحالة وصف للمصدر، لا شهادة منصة أو مصادقة أو حفظ أو جاهزية نقل.

| العائلة | المواصفة والمصدر | المعاينة | النضج | التبعيات العائلية الأساسية |
|---|---|---|---|---|
| Buttons | [`buttons`](../components/buttons/specification.md) | [فتح](../previews/buttons/index.html) | STABLE UI | لا توجد |
| Fields | [`fields`](../components/fields/specification.md) | [فتح](../previews/fields/index.html) | STABLE UI | لا توجد |
| Selection / Picker | [`selection`](../components/selection/specification.md) | [فتح](../previews/selection/index.html) | STABLE UI | لا توجد |
| Organization | [`organization`](../components/organization/specification.md) | [فتح](../previews/organization/index.html) | STABLE UI | لا توجد |
| Data | [`data`](../components/data/specification.md) | [فتح](../previews/data/index.html) | STABLE UI | لا توجد |
| Messages | [`messages`](../components/messages/specification.md) | [فتح](../previews/messages/index.html) | STABLE UI | لا توجد |
| Navigation | [`navigation`](../components/navigation/specification.md) | [فتح](../previews/navigation/index.html) | STABLE UI | لا توجد |
| Surfaces | [`surfaces`](../components/surfaces/specification.md) | [فتح](../previews/surfaces/index.html) | STABLE UI | لا توجد |
| Info strip | [`info-strip`](../components/info-strip/specification.md) | [فتح](../previews/info-strip/index.html) | STABLE UI | لا توجد |
| Metric comparison | [`metric-comparison`](../components/metric-comparison/specification.md) | [فتح](../previews/concepts/index.html) | STABLE UI | لا توجد |
| Account settings | [`account-settings`](../components/account-settings/specification.md) | [فتح](../previews/concepts/index.html) | STABLE UI | navigation, selection, buttons |
| Access gateway | [`access-gateway`](../components/access-gateway/specification.md) | [فتح](../previews/concepts/index.html) | STABLE UI | buttons, fields |
| Order schedule | [`order-schedule`](../components/order-schedule/specification.md) | [فتح](../components/order-schedule/example-usage.html) | DRAFT FOR REVIEW | لا توجد |
| Carousel | [`carousel`](../components/carousel/specification.md) | [فتح](../previews/carousel/index.html) | DRAFT FOR REVIEW | لا توجد |

## اعتماديات خيارات التركيب

الخطوط والتوكنز والأصول المشتركة من دليل الاستهلاك. غياب اعتماد أساسي لا يلغي متطلبات الخيار المستخدم.

| العائلة | الاعتماد | متى يلزم | CSS | JavaScript |
|---|---|---|---|---|
| fields | buttons | مسح البحث أو أزرار خطوة الكمية من B01 | `components/buttons/buttons.css` | لا يلزم لهذا الخيار |
| selection | navigation | عرض Picker داخل طبقة حوارية | `components/navigation/navigation.css` | `components/navigation/navigation.js` |
| selection | buttons | أزرار B01 في مشغّل أو طبقة Picker | `components/buttons/buttons.css` | لا يلزم لهذا الخيار |
| organization | buttons | إجراء B01 داخل الصف | `components/buttons/buttons.css` | لا يلزم لهذا الخيار |
| messages | buttons | زر B01 ضمن الرسالة أو الحالة الفارغة | `components/buttons/buttons.css` | لا يلزم لهذا الخيار |
| navigation | buttons | أزرار B01 في appbar أو الطبقة أو actionbar | `components/buttons/buttons.css` | لا يلزم لهذا الخيار |
| navigation | fields | حقول B02 في لوحة التصفية | `components/fields/fields.css` | `components/fields/fields.js` |
| navigation | selection | اختيارات B03 في لوحة التصفية | `components/selection/selection.css` | `components/selection/selection.js` |
| order-schedule | fields | محرر خارجي من B02 يركبه المستهلك بجوار التقويم | `components/fields/fields.css` | `components/fields/fields.js` |

## التراكيب المشتركة

تراكيب فوق العائلات الحالية؛ C01–C03 وصفات CSS، وC04 مساعد اختياري لسياق الوحدات. [التحميل والملكية](COMPOSITIONS.md).

| التركيب | المصدر | المعاينة | النضج | عائلات الأساس | عائلات اختيارية بحسب الخانات |
|---|---|---|---|---|---|
| C01 · Value with context | [`components/info-strip/value-context.css`](../components/info-strip/value-context.css) | [فتح](../previews/compositions/summary-example.html) | DRAFT FOR REVIEW | info-strip | organization, buttons, messages |
| C02 · Operational row and list | [`components/organization/operational-row.css`](../components/organization/operational-row.css) | [فتح](../previews/compositions/row-example.html) | DRAFT FOR REVIEW | organization | buttons, messages |
| C03 · Controlled form surface | [`components/compositions/form-surface.css`](../components/compositions/form-surface.css) | [فتح](../previews/compositions/form-example.html) | DRAFT FOR REVIEW | fields, buttons | messages, selection, navigation |
| C04 · Structured readings and explicit unit context | [`components/compositions/reading-layout.css`](../components/compositions/reading-layout.css)<br>[`components/compositions/reading-context.js`](../components/compositions/reading-context.js) | [فتح](../previews/readable-source/index.html) | DRAFT FOR REVIEW |  | data, metric-comparison, info-strip, organization |

## المتغيرات

| المتغير | العائلة | النضج | opt-in | المعاينة |
|---|---|---|---|---|
| donut | data | STABLE UI | نعم | [فتح](../components/data/example-usage.html) |
| main-metric-featured | metric-comparison | STABLE UI | نعم | [فتح](../previews/concepts/index.html) |
| bubbles | data | STABLE UI | نعم | [فتح](../components/data/example-usage.html) |
| metric-circles | metric-comparison | STABLE UI | نعم | [فتح](../previews/concepts/index.html) |
| packed-circle | data | PROPOSED | نعم | [فتح](../previews/concepts/index.html) |
| info-strip-peek | info-strip | STABLE UI | نعم | [فتح](../previews/info-strip/comparison.html) |
| data-readable | data | DRAFT FOR REVIEW | نعم | [فتح](../previews/readable-source/index.html) |
| metric-readable | metric-comparison | DRAFT FOR REVIEW | نعم | [فتح](../previews/readable-source/index.html) |

## العقود العامة

- القواعد المعتمدة: [`SYSTEM-CONTRACTS.md`](SYSTEM-CONTRACTS.md).
- التركيب والتنظيف والاستثناءات: [`COMPONENT-CONSUMPTION.md`](COMPONENT-CONSUMPTION.md) و[`FAMILY-CONSUMPTION.md`](FAMILY-CONSUMPTION.md).
- توكنز CSS مصدر التنفيذ؛ لا مسار DTCG موازٍ.
- انطباق حالات initial/loading/empty/error/disabled/success يتبع مسؤولية كل مكوّن، لا قالبًا وهميًا موحدًا.
- `MANIFEST.json` جرد بصمات، وليس مصدر النضج أو رسم التبعيات.
- runtime success/error مختلف عن stable/draft/proposed.
- المعرض: [`Overview / State Lab`](../previews/ui-system-showcase/index.html) و[`Composition Lab`](../previews/compositions/index.html).
- المصدر والنسخة المولدة والمقارنات التاريخية وأدلة الاختبار فئات منفصلة.
