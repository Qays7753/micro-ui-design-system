# SearchField — البحث داخل قسم (الملحق §1.1)

- **يُستخدم:** للبحث داخل قسم واحد فوق قائمته.
- **لا يُستخدم:** للبحث العام (عبر Ask)، ولا في قائمة فيها أقل من 6 عناصر.

## التشريح

ارتفاع `size.search` (52) واستدارة كاملة وخلفية `surface` وحد `border.field` بلون `border-field`؛ أيقونة البحث 20 بلون `text-secondary` تبعد `layout.chip-padding` عن البداية ثم `layout.button-icon-gap` ثم الحقل (body ≥16)، وفي النهاية زر المسح — **لا يظهر إلا وفيه نص** (ق2) — بأيقونة `clear` 20 ولمس 48 واسم «امسح البحث»، ويبعد 4 عن حافة النهاية.

- **لا حالة خطأ** (§1.1-4) — الاستعلام الخاطئ «12 نتيجة» لا حقل أحمر.
- التركيز بحد التركيز وهالته كـ`TextField`، والمعطّل بحد ونص `disabled-fg`.
- لا تسمية ظاهرة (استثناء موثق من 23.24(10)) — النص الإرشادي يقوم مقامها و`label` يطابقه.

## الخصائص (23.18)

`label` (اسم الوصول)، `placeholder` («ابحث في <اسم القسم>»)، `value`، `onChange`، `disabled`.

## حالات القائمة (9.0 + §1.1)

`SearchField.states.ts`: default، focused، disabled، withText.

## مثال

```tsx
import { SearchField } from '@micro/ds';

<SearchField
  label="ابحث في الطلبات"
  placeholder="ابحث في الطلبات"
  value={query}
  onChange={setQuery}
/>
```
