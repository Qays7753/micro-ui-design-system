# Radio — مجموعة الاختيار الواحد (الملحق §3.2)

- **يُستخدم:** لاختيار واحد من 2 إلى 5 خيارات تحتاج تسميات طويلة (التوافر، والدفع).
- **لا يُستخدم:** لخيارات قصيرة يتسع لها `SegmentedControl`، ولا لأكثر من 5 (منتقى في ورقة).

## التشريح

تسمية المجموعة `label` فوقها بـ8، ثم `Surface` بصفوف `size.row-plain`: الدائرة `size.checkbox` 20 باستدارة كاملة — غير المحدد حد `border.field`، والمحدد حد التركيز بلون `brand-anchor` ونقطة داخلية `size.dot-unread` — ثم 12 ثم التسمية `body`.

- **الصف كله منطقة الضغط**، وinput حقيقي `type="radio"` لكل صف (ق1: خيار واحد كحد أقصى، ق2: 2 إلى 5 خيارات).
- الخطأ: «اختر <التسمية>» تحت السطح.

## الخصائص (23.18)

`label`، `items` (م-خ1)، `value`، `onChange`، `disabled`، `state` (`idle` · `error`).

## حالات القائمة (9.0 + §3.2)

`Radio.states.ts`: default، selected، pressed، focused، disabled، error.

## مثال

```tsx
import { Radio } from '@micro/ds';

<Radio
  label="التوافر"
  items={[
    { value: 'available', label: 'متوفر' },
    { value: 'onRequest', label: 'بالطلب' },
    { value: 'unavailable', label: 'غير متوفر مؤقتاً' },
  ]}
  value={avail}
  onChange={setAvail}
/>
```
