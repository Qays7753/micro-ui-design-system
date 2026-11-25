# ConfirmSheet

ورقة تأكيد الإجراء الهدّام (الموجز 9.3، 23.24، 1284).

## متتى تُستخدم

- قبل أي إجراء هدام (حذف حركة، إلغاء طلب): «لا إجراء هدام بلا ConfirmSheet أو تراجع» (12.x).

## الشكل

- رأس **موسّط** (الموضعان الموسطان الوحيدان مع EmptyState وTabBar وAmountKeypad — 1096): أيقونة `danger` (WarningCircle 24) بلون `status-problem-fg`، ثم العنوان 22/30/600، ثم جملة النتيجة `body` 16/24 بلون `text-secondary`.
- **زرّان بعرض كامل** (23.3: العرض الكامل داخل الورقة): «رجوع» ثانوي، وفعل الهدام **خطر أحمر ممتلئ** — الموضع الوحيد الذي يُسمح فيه بالخطر الممتلئ (9.3).
- `role="alertdialog"` والتركيز الابتدائي على «رجوع» لا على الفعل الهدام (1284).
- كل ما في Sheet من مقبض وسحب وإغلاق (23.11).

## المسموح والممنوع (23.24)

مسموح: أيقونة، وعنوان، وجملة نتيجة، وزرّان. ممنوع: حقول، وقوائم، وأكثر من زرين.

## الخصائص (23.18)

`label` (العنوان)، `caption` (جملة النتيجة)، `value` (نص الفعل الهدام)، `onPress` (الفعل)، `onDismiss` (رجوع).

## حالات القائمة (9.0)

`ConfirmSheet.states.ts`: default، focused، pressed.

## مثال

```tsx
import { ConfirmSheet, t } from '@micro/ds';

<ConfirmSheet
  label={t('confirm.sampleTitle')}
  caption={t('confirm.sampleSentence')}
  value={t('button.deleteMovement')}
  onPress={deleteMovement}
  onDismiss={close}
/>
```
