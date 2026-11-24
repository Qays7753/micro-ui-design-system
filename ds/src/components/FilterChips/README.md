# FilterChips

صفّ رقائق تصفية قابل للتمرير أفقيًا (الموجز 9.1، 23.16، 23.2).

## متى يُستخدم

- تصفية قائمة بالفئات داخل قسم أو شاشة (حركات المالية، فئات السوق — الموجز 10.2).
- التحديد **متعدد وغير حصري** (تُجمع الفلاتر).

## متى لا يُستخدم

- التبديل الحصري بين عرضين → `SegmentedControl`.
- الإجراءات → `Button`.

## الخصائص (23.18)

| الخاصية | القيم | ملاحظات |
|---|---|---|
| `leading` | قائمة رقائق | `{ value, label, disabled? }` — الترتيب يحدده التطبيق |
| `value` | مصفوفة قيم | القيم المحددة؛ التحكم كامل من التطبيق (البند 11) — تحديد متعدد |
| `onChange` | دالة | تُبلِّغ بالمصفوفة الجديدة بعد التبديل |
| `disabled` | منطقي | يعطّل الصف كله؛ يمكن تعطيل رقاقة واحدة من `leading` |
| `label` | نص | اسم المجموعة لقارئ الشاشة (23.17) |

## الشكل (9.1)

- الرقاقة 40 داخل صف لمس 48، استدارة كاملة، حشوة أفقية 16، وبينها 8. التسمية `label`، والمحددة `label-strong`.
- غير المحددة: بيضاء بحد 1px `surface-edge`. المحددة: `brand-selected-bg` بنص `brand-anchor` و✓ 16 (`SelectedIcon`).
- العرض الأقصى للرقاقة 200 مع قص «…» (23.20).
- **التمرير الأفقي (23.16):** بلا أسهم وبلا تلاشٍ متدرج (التدرجات ممنوعة)، وشريط التمرير مخفي، والإطلالة ≥ 24px من الرقاقة التالية، وحشوة نهاية القائمة 16.
- الضغط: خلفية `surface-pressed` والمحددة `brand-selected-pressed` (23.2)، الحلقة 2px `brand-text` بإزاحة 2.
- **قرار المالك 23.1/4:** التسمية متمركزة في مركز الرقاقة (≤ 0.5px).

## حالات القائمة (9.0)

`FilterChips.states.ts`: default، selected، pressed، focused، disabled، manyChips.

## مثال

```tsx
import { FilterChips, t } from '@micro/ds';

<FilterChips
  label={t('title.today')}
  leading={[
    { value: 'in', label: t('movement.in') },
    { value: 'out', label: t('movement.out') },
    { value: 'transfer', label: t('movement.transfer') },
  ]}
  value={selected}
  onChange={setSelected}
/>
```
