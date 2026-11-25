# ContextBar

شريط السياق العلوي (الموجز 9.1، و23.16، و23.20).

## متى تُستخدم

- أعلى كل شاشة. البداية: مبدّل المشروع (الرئيسية) أو زر الرجوع (الفرعية). النهاية [مؤكد]: NotificationsButton ثم AskButton — Ask آخر عنصر في الزاوية، وموضعه ثابت في كل الشاشات.

## الشكل

- ارتفاع 56 (`size.context-bar`) بلون `canvas`.
- حد سفلي 1px `surface-edge` **يظهر فقط حين يمر المحتوى تحته** (إشارة المضيف عبر `caption`، 23.16).
- الحافة الآمنة العليا عبر `env(safe-area-inset-top)` (27.3).
- الطبقة `layer.bars` (23.15).
- المحتوى يتبع هامش التابلت 24 على الشاشات الواسعة (23.20).

## الخصائص (23.18)

`leading` (البداية)، `trailing` (الجرس ثم Ask في النهاية)، `caption` (إشارة «مرَّ محتوى» للحد السفلي)، `label` (اسم الشريط).

## حالات القائمة (9.0)

`ContextBar.states.ts`: default، mainScreenSwitcher، subScreenBack، scrolledHairline، notScrolled.

## مثال

```tsx
import { ContextBar, AskButton, NotificationsButton, ProjectSwitcher, t } from '@micro/ds';

<ContextBar
  label={t('sr.switchProject')}
  leading={<ProjectSwitcher label="ورشة الياسمين" caption={t('role.owner')} onPress={open} />}
  trailing={<><NotificationsButton value={3} onPress={openN} /><AskButton onPress={openAsk} /></>}
  caption={scrolled}
/>
```
