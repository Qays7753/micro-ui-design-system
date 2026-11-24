# Metric

المقياس الكامل على الأبيض — خارج السطح البطل (الموجز 9.3، 23.8).

## متى يُستخدم

- رأس قسم (PageHeader)، داخل Sheet لتفاصيل الكائن، أو أي مقياس رئيسي خارج البطل. مع الرسم (Sparkline) في مجالات التحليل.

## التشريح (نفس ترتيب البطل، بألوان الأبيض)

1. التسمية 14/20 وزن 500 بلون `text-secondary`.
2. مسافة 4.
3. القيمة `display-hero` 40/48/500 بلون `text-primary` tabular بتتبع −0.01em؛ الفلوس بنفس المقاس بلون `text-secondary`؛ الوحدة `body-strong` 16/24 على خط قاعدة الرقم بفجوة 4.
4. مسافة 8.
5. سطر الفرق: سهم + كلمة **بلون الحالة** (تمّ/مشكلة) — مع السهم والكلمة معًا.
6. مسافة 12.
7. رابط المصدر `caption-strong` بلون `text-primary` بخط سفلي.

- **سطر caption واحد كحد أقصى تحت الرقم** (قرار مالك 2026-11-25): رابط المصدر هو هذا السطر.
- **«—» بنمط القيمة نفسه** (قرار مالك 2026-11-25).
- **رقم بلا مقارنة لا يأخذ سطر فرق.**
- **التحميل: هيكل رمادي (160×32)، لا صفر أبدًا.**
- الرقم ينزل درجة واحدة (`number-lg`) إن لم يتسع، بلا تصغير تدريجي.

## الخصائص (23.18)

`label`، `value`، `trailing` (الوحدة)، `direction` (عقدة سطر الفرق)، `debt` (نص المصدر)، `onDismiss`، `loading`.

## حالات القائمة (9.0)

`Metric.states.ts`: default، withCents، missing، loading، noDiff.

## مثال

```tsx
import { Metric, DeltaUpIcon, t } from '@micro/ds';

<Metric
  label={t('nav.finance')}
  value="1,245.750"
  trailing={t('money.unit')}
  direction={<><DeltaUpIcon /><span style={{ color: 'var(--mds-color-status-done-fg)' }}>{t('metric.deltaHigher', { percent: '12%' })}</span></>}
  debt={t('metric.sourceFrom', { counted: t('movement.counted') })}
/>
```
