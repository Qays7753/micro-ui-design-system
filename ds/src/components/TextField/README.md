# TextField

حقل النص السطري (الموجز 9.3، 23.18، 23.24(10)).

## الخصائص (23.18)

| الخاصية | القيم | ملاحظات |
|---|---|---|
| `label` | نص | فوق الحقل بنمط `label` (14/20/500)؛ يسمّي الحقل عبر `htmlFor` |
| `caption` | نص | سطر المساعدة تحت الحقل بنمط `caption`؛ عند الخطأ يحمل **نص الحل** |
| `value` · `onChange` | نص | تحكم كامل من التطبيق (11)؛ `onChange` بالإِشارة الموحدة |
| `placeholder` | نص | **للصيغة فقط** («07X XXX XXXX») بلون `text-secondary` — لا يقوم مقام التسمية |
| `state` | `idle` · `error` | الخطأ: حد أحمر + نص الحل + أيقونة النغمة |
| `disabled` | `true` / `false` | خلفية `disabled-bg` ونص `disabled-fg` |

## الشكل (9.3)

- ارتفاع 56، استدارة `r-md` (16)، حد 1px `border-field`، عرض أدنى 160.
- **نص الحقل body 16** — خط الحقول لا ينزل عن 16 (قرار S4).
- **التركيز:** حد 2px `brand-text` + هالة 4px `brand-selected-bg`.
- caret بـ`brand-text`، التحديد بـ`brand-selected-bg`، وملء المتصفح التلقائي يُلغى (23.24(10)).

## حالات القائمة (9.0)

`TextField.states.ts`: default، focused، disabled، error، withCaption، withPlaceholder.
