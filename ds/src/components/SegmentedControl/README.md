# SegmentedControl

مبدّل حصري من 2 إلى 4 أجزاء (الموجز 9.1، 23.20، 23.18).

## متى يُستخدم

- التبديل بين عرضين لنفس البيانات داخل شاشة واحدة (اليوم / الأجندة — الموجز 10.2).
- الأدوار ذات عنصرين: يظهر أعلى الشاشة بدلاً من `TabBar` (الموجز 9.1).
- `MovementTypeControl` داخل / خارج / تحويل (الموجز 9.6).

## متى لا يُستخدم

- خيارات تصفية متعددة غير حصرية → `FilterChips`.
- التنقل بين أقسام التطبيق (3–5 أقسام دائمة) → `TabBar`.
- الإجراءات → `Button`.

## الخصائص (23.18)

| الخاصية | القيم | ملاحظات |
|---|---|---|
| `leading` | 2–4 | `{ value, label, leading?, disabled? }` — الترتيب يحدده التطبيق |
| `value` | نص | قيمة الجزء المحدد؛ التحكم كامل من التطبيق (البند 11) |
| `onChange` | دالة | تُبلِّغ بقيمة الجزء الجديد |
| `disabled` | منطقي | يعطّل الأجزاء كلها؛ يمكن تعطيل جزء واحد من عناصر `leading` |
| `label` | نص | اسم المجموعة لقارئ الشاشة (23.17) |

## الشكل (9.1)

- ارتفاع 48: مسار بلون `track`، استدارة كاملة، حشوة 4.
- المحدد: أبيض، حد 1px `surface-edge`، **بلا ظل**، تسميته `label-strong`؛ غير المحدد `label`.
- الجزء ≥ 72، والأجزاء متساوية العرض حين يملأ الحاوية (23.20). **4 أجزاء كحد أقصى**.
- الضغط: خلفية `surface-pressed` بلا تصغير ولا تموّج (23.2)، والحلقة 2px `brand-text` بإزاحة 2.
- التحديد ليس باللون وحده: التسمية غامقة والحالة معلنة بـ`aria-pressed` (23.2).

## حالات القائمة (9.0)

`SegmentedControl.states.ts`: default، selected، pressed، focused، disabled، threeSegments، fourSegments، withIcon.

## مثال

```tsx
import { SegmentedControl, t } from '@micro/ds';

<SegmentedControl
  label={t('title.today')}
  leading={[
    { value: 'today', label: t('nav.today') },
    { value: 'agenda', label: t('nav.agenda') },
  ]}
  value="today"
  onChange={(value) => setView(value)}
/>
```
