# فهرس مكونات Micro UI

<!-- GENERATED: tools/component-catalog-build.py — edit COMPONENT-CATALOG.json -->

مصدر حالة النضج الوحيد: [`COMPONENT-CATALOG.json`](COMPONENT-CATALOG.json).
هذه 14 عائلة؛ packed-circle متغير مقترح تحت Data وليس العائلة الخامسة عشرة.
الحالة وصف للمصدر، لا شهادة منصة أو مصادقة أو حفظ أو جاهزية نقل.

| العائلة | المواصفة والمصدر | المعاينة | النضج | التبعيات العائلية |
|---|---|---|---|---|
| Buttons | [`buttons`](../components/buttons/specification.md) | [فتح](../previews/buttons/index.html) | STABLE UI | لا توجد |
| Fields | [`fields`](../components/fields/specification.md) | [فتح](../previews/fields/index.html) | STABLE UI | لا توجد |
| Selection / Picker | [`selection`](../components/selection/specification.md) | [فتح](../previews/selection/index.html) | STABLE UI | navigation |
| Organization | [`organization`](../components/organization/specification.md) | [فتح](../previews/organization/index.html) | STABLE UI | لا توجد |
| Data | [`data`](../components/data/specification.md) | [فتح](../previews/data/index.html) | STABLE UI | لا توجد |
| Messages | [`messages`](../components/messages/specification.md) | [فتح](../previews/messages/index.html) | STABLE UI | لا توجد |
| Navigation | [`navigation`](../components/navigation/specification.md) | [فتح](../previews/navigation/index.html) | STABLE UI | لا توجد |
| Surfaces | [`surfaces`](../components/surfaces/specification.md) | [فتح](../previews/surfaces/index.html) | STABLE UI | لا توجد |
| Info strip | [`info-strip`](../components/info-strip/specification.md) | [فتح](../previews/info-strip/index.html) | STABLE UI | لا توجد |
| Metric comparison | [`metric-comparison`](../components/metric-comparison/specification.md) | [فتح](../previews/concepts/index.html) | STABLE UI | لا توجد |
| Account settings | [`account-settings`](../components/account-settings/specification.md) | [فتح](../previews/concepts/index.html) | STABLE UI | navigation, selection |
| Access gateway | [`access-gateway`](../components/access-gateway/specification.md) | [فتح](../previews/concepts/index.html) | STABLE UI | buttons, fields |
| Order schedule | [`order-schedule`](../components/order-schedule/specification.md) | [فتح](../components/order-schedule/example-usage.html) | DRAFT FOR REVIEW | fields |
| Carousel | [`carousel`](../components/carousel/specification.md) | [فتح](../previews/carousel/index.html) | DRAFT FOR REVIEW | لا توجد |

## المتغيرات

| المتغير | العائلة | النضج | opt-in | المعاينة |
|---|---|---|---|---|
| packed-circle | data | PROPOSED | نعم | [فتح](../previews/concepts/index.html) |
| info-strip-peek | info-strip | STABLE UI | نعم | [فتح](../previews/info-strip/comparison.html) |

## العقود العامة

- القواعد المعتمدة: [`SYSTEM-CONTRACTS.md`](SYSTEM-CONTRACTS.md).
- توكنز CSS مصدر التنفيذ؛ لا مسار DTCG موازٍ.
- انطباق حالات initial/loading/empty/error/disabled/success يتبع مسؤولية كل مكوّن، لا قالبًا وهميًا موحدًا.
- `MANIFEST.json` جرد بصمات، وليس مصدر النضج أو رسم التبعيات.
- runtime success/error مختلف عن stable/draft/proposed.
- المعرض: [`Overview / State Lab`](../previews/ui-system-showcase/index.html) و[`Composition Lab`](../previews/compositions/index.html).
- المصدر والنسخة المولدة والمقارنات التاريخية وأدلة الاختبار فئات منفصلة.
