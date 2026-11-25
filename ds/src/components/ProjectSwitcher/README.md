# ProjectSwitcher

مبدّل المشروع (الموجز 9.1، و23.20).

## متى تُستخدم

- بداية `ContextBar` في الشاشات الرئيسية (مكان زر الرجوع في الفرعية).

## الشكل

- زر: علامة كيان 32 + اسم المشروع `body-strong` سطر واحد + الدور `micro` بلون `text-secondary` + سهم `expand` (CaretDown Bold 16).
- **من له مشروع ودور واحد لا يرى السهم** (9.1) — عبر خاصية `locked`.
- الاسم يُقص بـ«…» ولا يدفع الأزرار (23.20: أدنى 120، وأقصى عرض الشريط − 3×48 − 16).
- يفتح ورقة بالمشاريع والأدوار (الحالي مع ✓) وآخرها صف «إخفاء المبالغ» (23.22) — الورقة على التطبيق المضيف؛ هذا زر التشغيل.

## الخصائص (23.18)

`label` (اسم المشروع)، `caption` (الدور)، `locked` (مشروع ودور واحد: بلا سهم)، `onPress`.

## حالات القائمة (9.0)

`ProjectSwitcher.states.ts`: default، pressed، focused، withCaret، singleRoleNoCaret.

## مثال

```tsx
import { ProjectSwitcher, t } from '@micro/ds';

<ProjectSwitcher label="ورشة الياسمين" caption={t('role.owner')} onPress={openProjects} />
```
