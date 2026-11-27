# TextArea — الحقل متعدد الأسطر (الملحق §1.2)

- **يُستخدم:** لنص حر متعدد الأسطر (ملاحظة، ووصف، وسبب رفض، وحقل Ask).
- **لا يُستخدم:** لقيمة من سطر واحد (`TextField`).

## التشريح

كـ`TextField`: التسمية فوقه بـ8، والحد والحقل، والمساعدة تحته بـ4. الفروق (§1.2-2): ارتفاعه الأدنى `size.field` ويتمدد مع النص حتى `size.textarea-max-lines` أسطر من `body` (6) ثم يتمرر داخلياً (ق2)، والحشوة الرأسية 16 فيتسق السطر الأول مع `TextField`، والتمدد فوري بلا حركة (§1.2-5).

- الخطأ: حد `status-problem-fg` + أيقونة `field-error` + نص الحل (§1.2-4)، مربوط بـ`aria-describedby` (§1.2-7).
- 200%: الحد الأقصى يبقى 6 أسطر.

## الخصائص (23.18)

`label`، `caption`، `placeholder`، `value`، `onChange`، `disabled`، `state`، `optional`.

> `enterkeyhint` قيمة مثبتة «enter» وفق §1.2-8 (الإرسال في Ask بزر مستقل)، وليست خاصية (23.18).

## حالات القائمة (9.0 + §1.2)

`TextArea.states.ts`: default، focused، error، disabled، grown.

## مثال

```tsx
import { TextArea } from '@micro/ds';

<TextArea
  label="ملاحظة"
  optional
  value={note}
  onChange={setNote}
  placeholder="اختياري"
/>
```
