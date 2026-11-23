# Button

زر الفعل (الموجز 9.3، 23.2، 23.3، 23.24(1)).

## الخصائص (23.18)

| الخاصية | القيم | ملاحظات |
|---|---|---|
| `variant` | `primary` · `secondary` · `text` · `danger` | الخطر أحمر نصي؛ يمتلئ داخل `ConfirmSheet` فقط (S7) |
| `size` | `md` (52) · `sm` (44 داخل منطقة لمس 48) | استدارتان 16 و12، حشوتان 20 و16 |
| `loading` | `true` / `false` | spinner 20 مكان الأيقونة، العرض ثابت، `aria-busy`؛ التسمية بصيغة الفعل الجاري من التطبيق |
| `leading` · `trailing` | عنصر | أيقونة واحدة كحد أقصى في كل جهة؛ الأكثر بلا أيقونة |
| `onPress` · `onLongPress` | دالة | عبر `lib/use-press` — الإلغاء عند تحرك الإصبع أكثر من 8px |
| `disabled` | `true` / `false` | الممتلئان إلى `disabled-bg`/`disabled-fg`، النصيان إلى `disabled-fg` |

التسمية `children` — نص قاموسي من التطبيق دائماً (فعل أمر + مفعوله، ≤ 3 كلمات).

## حالات التفاعل (23.2)

- **مضغوط:** الممتلئان `brand-anchor-pressed`/`brand-selected-pressed` مع `scale(.96)`؛ النصيان `surface-pressed` بلا تصغير. لا hover على اللمس، لا تموّج.
- **تركيز:** حلقة 2px `brand-text` بإزاحة 2، على `:focus-visible` فقط.
- **معطّل:** كما في الجدول أعلاه (معفى من التباين حسب WCAG).

## حالات القائمة (9.0)

`Button.states.ts`: default، primary، secondary، text، danger، pressed، focused، disabled، loading، sm، withIcon.
