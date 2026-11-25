# AskButton

زر Ask Micro — الرمز نفسه زرًا (الموجز 9.1، و4.2(1)، و23.24(2)).

## متى تُستخدم

- في نهاية `ContextBar` في كل الشاشات: موضع ثابت أقصى اليسار (RTL)، والجرس بجانبه من الداخل.
- يفتح لوحة Ask (ورقة في التطبيق المضيف). الضغط المطول = تسجيل صوتي مباشر (يراجع المستخدم النص قبل الإرسال — 1.8).

## الشكل

- **الرمز نفسه 28** (`size.ask-symbol`) داخل منطقة لمس 48: بلا حاوية ولا خلفية في السكون.
- **نقطة غير المقروء:** 6px (`size.dot-ask`) بلون `brand-anchor` في **المركز الفارغ للرمز** — الاستخدام الوحيد للنقطة كعنصر علامة (4.2).
- الضغط: دائرة `surface-pressed` بلا تصغير ولا تموّج (23.2)، مع إلغاء الضغط عند حركة >8px.
- الحلقة: دائرية `:focus-visible` فقط.

## الخصائص (23.18)

`selected` (نقطة غير المقروء)، `onPress` (فتح Ask)، `onLongPress` (التسجيل الصوتي).

## حالات القائمة (9.0)

`AskButton.states.ts`: default، pressed، focused، unreadDot، longPressRecording.

## مثال

```tsx
import { AskButton } from '@micro/ds';

<AskButton selected onPress={openAsk} onLongPress={recordVoice} />
```
