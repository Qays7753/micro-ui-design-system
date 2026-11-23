# AmountVisibilityToggle — مفتاح إخفاء المبالغ

زر الأيقونة الذي يخفي كل المبالغ ويظهرها (الموجز 23.22 [مؤكد]، 9.3). أيقونته من المولّدة: `AmountsShownIcon` (عين، المبالغ ظاهرة) و`AmountsHiddenIcon` (عين مشطوبة، مخفية) بوزن Regular ومقاس 24.

## متى يُستخدم

- في نهاية سطر التسمية داخل `HeroSurface` (في «اليوم» و«المالية»).
- في صف «إخفاء المبالغ» داخل ورقة `ProjectSwitcher`، ليُغيَّر من أي شاشة.

## متى لا يُستخدم

- لا يحمل حالة بنفسه: لا يخزّن شيئاً ولا يقرر (المكتبة تعرض فقط — الموجز 11). إن لم يمرّر التطبيق `onChange` فهو عرض فقط.
- لا يحتاج نصاً بجانبه داخل الشاشة؛ اسمه لقارئ الشاشة كافٍ.

## الخصائص (الأسماء الموحدة 23.18)

| الخاصية | القيم | ملاحظة |
|---|---|---|
| `onChange` | `(visible: boolean) => void` | يُنادى بالحالة المطلوبة بعد الضغط؛ التطبيق يطبّقها على `AmountVisibilityProvider` ويحفظها (23.22: المسؤولية للتطبيق) |
| `disabled` | boolean | أيقونة `disabled-fg` (23.2) |
| `density` | `regular` (48) · `large` (56) | large = وضع السائق |
| `className` · `id` · `style` · `ref` | — | تمرير خصائص HTML على `button` |

الحالة تُقرأ من سياق `AmountVisibilityProvider` — لا توجد خاصية إخفاء إطلاقاً (23.18).

## الحالات (9.0) — انظر `AmountVisibilityToggle.states.ts`

عادي، مضغوط (دائرة 48 بخلفية `surface-pressed`)، مركّز (حلقة `brand-text`)، معطّل، مبالغ ظاهرة، مبالغ مخفية. المختبر لا يعرض نسخة معطّلة دائمة (المعطّل لا يُظهر ردّ ضغط بالتعريف — 23.24(15))؛ فحص المعطّل يتم على الزر نفسه بتغيير الخاصية الأصلية.

## مثال

```tsx
import { AmountVisibilityProvider, AmountVisibilityToggle } from '@micro/ds';

const [hidden, setHidden] = useState(false);

<AmountVisibilityProvider hidden={hidden}>
  <AmountVisibilityToggle onChange={(visible) => setHidden(!visible)} />
  <Money value="12450.125" />
</AmountVisibilityProvider>
```

التبديل يغيّر كل `Money` في الصفحة بتلاشٍ سريع (`quick`)، والقيمة الحقيقية تغيب عن الصفحة كلها ما دامت مخفية.
