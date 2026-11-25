# NotificationsButton

زر الإشعارات — الجرس (الموجز 9.1، و23.23، و23.24(2)).

## متى تُستخدم

- في نهاية `ContextBar`، بجانب `AskButton` من الداخل (قبل الأقصى يسارًا).

## الشكل

- جرس Bell Regular 24 داخل منطقة لمس 48، لون `text-secondary`.
- **نقطة غير المقروء:** 8px بلون `brand-anchor` حولها حلقة 2px بلون خلفية الشريط، في الزاوية البعيدة عن مركز الأيقونة (23.24(2)).
- الضغط دائرة `surface-pressed` (23.2)؛ الحلقة `:focus-visible` فقط.
- العدد في اسم قارئ الشاشة: «الإشعارات، 3 غير مقروءة» (23.17) — لا رقم مرئي.

## الخصائص (23.18)

`value` (عدد غير المقروء)، `label` (اسم بديل لقارئ الشاشة)، `onPress`.

## حالات القائمة (9.0)

`NotificationsButton.states.ts`: default، pressed، focused، unreadDot.

## مثال

```tsx
import { NotificationsButton } from '@micro/ds';

<NotificationsButton value={3} onPress={openNotifications} />
```
