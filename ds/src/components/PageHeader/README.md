# PageHeader

رأس الصفحة (الموجز 9.1، و23.16، و23.20).

## متى تُستخدم

- أعلى كل شاشة تحت شريط السياق مباشرة. الرئيسية: العنوان الكبير بلا رجوع ولا انكماش (مبدّل المشروع يشغل بداية الشريط). الفرعية: زر الرجوع + العنوان، وينكمش عند التمرير إلى `label-strong` بجانب زر الرجوع.

## الشكل

- العنوان `title-screen` 28/36 سطران كحد أقصى، على `canvas`، والمحتوى يتبع هوامش الشاشة (23.20).
- زر الرجوع هو `IconButton` الحقيقي (23.2) بأيقونة 23.23 `back` (تُعكس في RTL).
- عند التمرير في الفرعية (إشارة المضيف `scrolled`): ينكمش العنوان إلى `label-strong` 14/20 ملاصقًا لزر الرجوع، والحد السفلي يبقى للشريط (23.16).
- نهاية الرأس: مقياس بطل أو مفتاح فترة أو زر إنشاء (9.1: إجراء الإنشاء زر في PageHeader — لا زر عائم).

## الخصائص (23.18)

`label` (العنوان)، `leading` (زر الرجوع IconButton في الفرعية)، `caption` (إشارة التمرير للانكماش)، `trailing` (المقياس أو زر الإنشاء).
- **الملحق 1.7 ت1:** الرأس يقبل `IconButton` (48، بلون `text-secondary`) في نهاية سطره — زر إخفاء المبالغ في «مشروع اليوم» (حل تعارض 23.22 مع 10.2(1): لا `HeroSurface` في تلك الشاشة فينتقل الزر إلى سطر الرأس).

## حالات القائمة (9.0)

`PageHeader.states.ts`: default، mainScreen، subScreenBack، collapsedOnScroll، withTrailing.

## مثال

```tsx
import { PageHeader, IconButton, BackIcon, t } from '@micro/ds';

<PageHeader
  label={t('title.movements')}
  leading={<IconButton label={t('button.back')} onPress={goBack}><BackIcon /></IconButton>}
  caption={isScrolled}
/>
```
