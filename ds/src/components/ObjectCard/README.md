# ObjectCard

بطاقة الكائن — الحجم البطاقي من نموذج الكائن الموحد (الموجز 4.1، 23.24).

## متى تُستخدم

- كائن واحد بارز يحتاج مساحة أوسع من الصف: بطاقة «يحتاجك»، بطاقة طلب في قائمة أفقية (عرض 280)، نتيجة تنقّل من Ask.

## التشريح (4.1: علامة نوع ← عنوان ← قيمة أساسية ← حالة ← خطوة تالية)

- `EntityMark` بمقاس 64، والشارة (إن وجدت) بجانبها.
- العنوان `title-card` 18/26 **سطران كحد أقصى** يُقص بـ«…» (قاعدة الأسطر 1435).
- السطر الثاني `caption` 13/20 بلون `text-secondary`.
- القيمة `amount-row` 16/24 وزن 600 بأرقام متساوية العرض، لا تُقص.
- **زر ثانوي مضغوط واحد** للخطوة التالية.
- الاستدارة 24، حشوة سطح 16 (20 تابلت)، الضغط `scale(.98)` + خلفية `surface-pressed`.

## المسموح والممنوع (23.24)

| مسموح |
|---|
| `EntityMark`، عنوان، قيمة، `StatusBadge`، سطر ثانٍ، زر ثانوي مضغوط واحد |

ممنوع: بطاقة داخلها، زر أساسي، أكثر من زر.

## الخصائص (23.18)

`leading` (محتوى العلامة)، `tone` (توثيقها)، `label` (العنوان)، `caption` (السطر الثاني)، `value` (القيمة: **المبلغ المالي عقدة `Money` بمقاس md** بإشارته ووحدته — الدفعة الثانية 1.2 — والأعداد غير المالية نص)، `state` (عقدة StatusBadge)، `children` (زر الخطوة التالية)، `onPress`، `disabled`.

## حالات القائمة (9.0)

`ObjectCard.states.ts`: default، withBadge، withButton، pressed، focused، disabled.

## مثال

```tsx
import { Money, ObjectCard, Button, StatusBadge, t } from '@micro/ds';

<ObjectCard
  label="طلب 1175 — سلمى الحوراني"
  caption={t('row.sampleCaption')}
  value={<Money value="1,245.750" />}
  state={<StatusBadge tone="waiting" />}
  onPress={openOrder}
>
  <Button variant="secondary" size="sm">{t('button.recordPayment')}</Button>
</ObjectCard>
```
