# Checkbox — مربع الاختيار (الملحق §3.1)

- **يُستخدم:** لبنود مستقلة يمكن اختيار أكثر من واحد منها (بنود التحقق في ورقة القرار).
- **لا يُستخدم:** لإعداد يعمل فورًا (`Toggle`)، ولا لاختيار واحد من قصيرة (`Radio`).

## التشريح

صف بارتفاع `size.row-plain` وحشوته الأفقية `layout.row-padding-inline`: البداية المربع `size.checkbox` 20 باستدارة `r-xs` — غير المؤشَّر حد `border.field` بلون `border-field` على `surface`، والمؤشَّر تعبئة `brand-anchor` وأيقونة `selected` 14 بلون `on-anchor` — ثم 12 ثم التسمية `body` وتحتها اختيارياً `caption`.

- **الصف كله منطقة الضغط** (ق1)، وinput حقيقي `type="checkbox"` يسمّيه التسمية (ق2).
- الخطأ (إلزامي غير مؤشَّر عند الإرسال): حد المربع `status-problem-fg` وتحت الصف «أشّر على هذا البند.».
- الحركة: التعبئة `motion.quick` والعلامة `motion.check-draw`.

## الخصائص (23.18)

`label` (التسمية)، `caption` (اختياري)، `selected` (مؤشَّر)، `onChange` (الحالة التالية)، `disabled`، `state` (`idle` · `error`).

## حالات القائمة (9.0 + §3.1)

`Checkbox.states.ts`: default، selected، pressed، focused، disabled، error.

## مثال

```tsx
import { Checkbox } from '@micro/ds';

<Checkbox
  label="التصنيف"
  selected={ok}
  onChange={setOk}
/>
```
