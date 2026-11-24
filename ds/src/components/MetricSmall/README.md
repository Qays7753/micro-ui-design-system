# MetricSmall

المقياس الصغير — نفس تشريح Metric بقيمة `number-lg` 28/36 (الموجز 9.3).

## متى يُستخدم

- داخل FundCard (رصيد الصندوق)، DebtSummary المزدوج («لك»/«عليك»)، وAskComputedResult.

## الشكل

نفس تشريح Metric (التسمية 14/20/500 ← 4 ← القيمة ← الوحدة على خط القاعدة ← 8 ← سطر الفرق بلون الحالة ← 12 ← رابط المصدر) مع:
- القيمة `number-lg` 28/36/500.
- **«—» بنمط القيمة نفسه** و**سطر caption واحد كحد أقصى** (قرارا مالك 2026-11-25).
- هيكل التحميل بارتفاع سطر المتن (23.10: بمقاس المحتوى الحقيقي).

## الخصائص (23.18)

نفس خصائص Metric.

## حالات القائمة (9.0)

`MetricSmall.states.ts`: default، withCents، missing، loading، noDiff.

## مثال

```tsx
import { MetricSmall, t } from '@micro/ds';

<MetricSmall label={t('nav.finance')} value="4,820" trailing={t('money.unit')} />
```
