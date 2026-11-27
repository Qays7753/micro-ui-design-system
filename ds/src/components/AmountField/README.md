# AmountField — حقل المبلغ (الملحق §1.3)

- **يُستخدم:** لكل إدخال مبلغ.
- **لا يُستخدم:** للكميات (`QuantityStepper`)، ولا لعرض مبلغ (`Money`).

## التشريح

التسمية فوقه بـ8، والحاوية ارتفاع `size.amount-field` (72) بـ`r-md` وحد `border.field`، حشوة أفقية `layout.chip-padding`؛ الرقم `amount-input` 32/40/500 بأرقام متساوية العرض داخل عزل LTR يبدأ من البداية، والوحدة «د» ثابتة في النهاية `body-strong` بلون `text-secondary` — لا تُحذف ولا تُكتب في التسمية (ق5).

## الإدخال (§1.3-5)

- يبدأ **فارغاً** بلا نص إرشادي (ق2، القاعدة 15).
- `inputmode="decimal"` و`enterkeyhint="next"` ولا `type="number"`.
- التطبيع أثناء الكتابة (`lib/normalize-amount`): الأرقام الهندية → 0-9، و«٫» و«,» → «.»، ولا إشارة سالبة، ولا أكثر من 3 خانات عشرية (الرابعة تُرفض، ق4).
- **لا فواصل آلاف أثناء التركيز**؛ عند فقد التركيز يعرض بصيغة Money بلا الوحدة («1,280.500» — ثلاث خانات حين توجد، الملحق §1.4) ويعود رقماً خاماً عند التركيز.
- إن لم يتسع الرقم: ينزل إلى `number-lg` **دفعة واحدة** ثم يتمرر داخل الحقل ولا يُقص (ADDENDUM 2.1، ق6).

## الخصائص (23.18)

`label`، `caption`، `value`، `onChange`، `disabled`، `state` (`idle` · `error`)، `draft`.

## حالات القائمة (9.0 + §1.3)

`AmountField.states.ts`: default، focused، error، disabled، long. **المخفية لا تنطبق** — رقم المستخدم ظاهر أثناء الكتابة (23.22).

## مثال

```tsx
import { AmountField } from '@micro/ds';

<AmountField label="المبلغ" value={amount} onChange={setAmount} />
```
