# MovementTypeControl — نوع الحركة

مبدّل داخل/خارج/تحويل (المواصفات §1.5): أول عنصر في نموذج الحركة المالية.
**ليس** للاستخدام خارج نموذج الحركة.

- تشريح المبدّل المقسّم (BRIEF 9.1) بثلاثة أجزاء ثابتة بالترتيب: «داخل»،
  «خارج»، «تحويل» — بلا أيقونات، والكلمات من القاموس (24.3) عبر `t()`،
  فتجري فيها تجاوزات نصوص التطبيق (3ج.1).
- المحدد أبيض بحد 1px بلا ظل وبكلمة أقوى (label-strong)؛ المضغوط
  `surface-pressed` (23.2)، والانتقال `motion.quick` (§1.5-5).
- قارئ الشاشة (§1.5-7): `radiogroup` باسم «نوع الحركة»، وكل جزء `radio`
  بـ`aria-checked`، والأسهم تسير بين الأجزاء الثلاثة.
- بلا قيمة إن لم يمرر التطبيق قيمة؛ والحفظ حينها يعرض الخطأ
  «اختر نوع الحركة» تحت المكوّن عبر `state="error"` (§1.5-4).
- اختيار «تحويل» يعني أن `FundPicker` ينتقل إلى وضع «من ← إلى» (9.4) —
  يوصله التطبيق من `onChange`.

## الاستخدام

```tsx
import { MovementTypeControl, type MovementTypeValue } from '@micro/ds';

const [type, setType] = useState<MovementTypeValue | undefined>();

<MovementTypeControl
  value={type}
  onChange={setType}
  state={triedToSave && !type ? 'error' : 'idle'}
/>
```
