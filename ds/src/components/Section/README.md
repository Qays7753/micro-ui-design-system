# Section

مجموعة أسطح بعنوان (الموجز 9.2، 23.24(16)، قرار مالك 2026-11-25).

## متى يُستخدم

- تجميع سطح واحد أو أكثر تحت عنوان القسم `title-section` (22/30/600) في شاشات النظرة العامة (الموجز 10.2).

## الرأس (23.24(16))

- العنوان `title-section`، ثم العدد `caption-strong` بلون `text-secondary` بعد 8، وفي نهاية السطر «الكل» `label-strong` بلون `brand-text` مع أيقونة `forward`.
- **الثلاثة على خط قاعدة واحد** (`align-items: baseline`).
- «الكل» منطقة لمس 48.
- **قرار المالك:** رابط «الكل» لا يظهر حين يكون القسم فارغًا.

## التباعد

- العنوان ← أول سطح: 12 (`layout.section-title-to-surface`).
- بين قسمين: 32 (`layout.section-to-section`) — إيقاع الشاشة المستهلكة.

## الخصائص (23.18)

| الخاصية | القيم | ملاحظات |
|---|---|---|
| `label` | نص | عنوان القسم |
| `count` | رقم | يُعرض بعد العنوان؛ احذفه لعدم العرض |
| `onSeeAll` | دالة | وجودها + جسم غير فارغ يُظهر «الكل» |
| `seeAllLabel` | نص | تجاوز نص «الكل» (الافتراضي من القاموس) |
| `children` | محتوى | Surface أو أكثر |

## حالات القائمة (9.0)

`Section.states.ts`: default، withCount، withSeeAll، empty.

## مثال

```tsx
import { Section, Surface, t } from '@micro/ds';

<Section label={t('title.needsYou')} count={3} onSeeAll={openAll}>
  <Surface>{/* rows */}</Surface>
</Section>
```
