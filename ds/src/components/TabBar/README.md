# TabBar

شريط التبويبات السفلي (الموجز 9.1، و23.16، و23.20، و27.3).

## متى تُستخدم

- أسفل الشاشات الرئيسية لذوي الأدوار الكاملة: من 2 إلى 5 عناصر. للأدوار ذات العنصرين: `SegmentedControl` أعلى الشاشة بدلاً منه.

## الشكل

- ارتفاع 64 (`size.tab-bar`) + الحافة الآمنة، عناصر متساوية العرض (كحد أقصى 120 للعنصر).
- خلفية بيضاء و**حد علوي 1px `surface-edge` ثابت دائمًا** (23.16 — بخلاف ContextBar/ActionBar).
- أيقونة 24: غير النشط Regular بلون `text-secondary`؛ النشط **Fill بلون `brand-logo`** وتسميته `text-primary`، **بلا خلفية خلف النشط**.
- التسمية `micro` سطر واحد — **«مشروع اليوم» تتسع بلا قص مع 5 عناصر على 360**.
- الترتيب يمرّره التطبيق (المكوّن لا يفرض مكان أي تبويب).
- النشط يحمل `aria-current="page"` (23.17).

## الخصائص (23.18)

الأبناء عناصر `TabBarTab` (`label` + `selected` + `leading` + `onPress`)؛ `value` (المؤشر النشط)، `onChange`.

## حالات القائمة (9.0)

`TabBar.states.ts`: default، activeFill، pressed، focused، fiveTabs، twoTabs.

## مثال

```tsx
import { TabBar, NavTodayIcon, NavFinanceIcon, t } from '@micro/ds';

<TabBar value={0} onChange={setTab}>
  <TabBarTab label={t('nav.todayLong')} leading={<NavTodayIcon weight="fill" />} onPress={() => {}} />
  <TabBarTab label={t('nav.finance')} leading={<NavFinanceIcon />} onPress={() => {}} />
</TabBar>
```

النشط Fill: مرّر `weight="fill"` للأيقونة النشطة من التطبيق، أو دع المكوّن يلوّنها — الرسم Fill مسؤولية المضيف لأن الأيقونات عناصر.
