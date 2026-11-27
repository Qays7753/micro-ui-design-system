# Toggle — المفتاح الفوري (الملحق §1.7)

- **يُستخدم:** لإعداد يعمل فورًا («إخفاء المبالغ»، «متوفر»).
- **لا يُستخدم:** داخل نموذج يُحفظ بزر — هناك صف بتحديد (`Checkbox`).

## التشريح

صف `size.row-plain` بحشوته: التسمية `body` وتحتها اختيارياً `caption`، وفي النهاية المفتاح: المسار `size.toggle-track` (52×32) باستدارة كاملة — مُطفأ بحد `border-field`، مُشغَّل بتعبئة `brand-anchor` — والمقبض `size.toggle-thumb` 24 بإزاحة 4، وفي المُشغَّل أيقونة `selected` 14 بلون `brand-anchor` (إشارة غير لونية).

- **الصف كله منطقة الضغط** (ق1)، و`role="switch"` و`aria-checked` يتبدلان (ق2).
- الحركة: المقبض ينزلق `motion.quick` والمسار يتغير لونه `motion.quick`.
- 200%: التسمية تنكسر والمفتاح يبقى في منتصف الصف رأسياً.

## الخصائص (23.18)

`label` (اسم الإعداد لا فعل)، `caption`، `selected`، `onChange`، `disabled`.

## حالات القائمة (9.0 + §1.7)

`Toggle.states.ts`: default، selected، pressed، focused، disabled.

## مثال

```tsx
import { Toggle } from '@micro/ds';

<Toggle label="إخفاء المبالغ" selected={hidden} onChange={setHidden} />
```
