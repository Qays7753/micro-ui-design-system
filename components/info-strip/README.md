# Micro · البطاقة العددية وشريط المعلومات

مكوّن HTML/CSS مستقل وبلا تبعيات تشغيلية. كل النتائج أرقام نصية يوفرها المستهلك؛ JavaScript لا يملأ قيمًا افتراضية ولا يحسب مؤشرات.

## فتح المعاينة

من جذر المستودع:

```sh
python3 -m http.server 8080
```

ثم افتح `/previews/info-strip/`. المثال المستقل في `components/info-strip/example-usage.html` يعمل أيضًا عبر الخادم نفسه على `/components/info-strip/example-usage.html`.

## الملفات المطلوبة

- `info-strip.css` و`info-strip.js`
- `../../shared/tokens.css`
- `../../assets/fonts/fonts.css`
- أيقونتا `chevron-left.svg` و`chevron-right.svg` من `assets/icons/`

## API مختصر

بطاقة منفردة: `.m-info-card` و`.m-info-card__label` ومقطع `.m-info-card__reading`؛ عند تعدد القراءات اجمعها في `.m-info-card__values` ويمكن عزل كل قراءة في `.m-info-card__item` مع `.m-info-card__item-label` اختياري. لكل قراءة رقم `.m-info-card__number` ووحدة اختيارية `.m-info-card__unit`. حالة الغياب: `.m-info-card--unavailable` أو `.m-info-card__reading--unavailable` مع محتوى ظاهر يوضح عدم التوفر.

الشريط: `[data-info-strip]` ويحتوي `[data-info-strip-viewport]`, `[data-info-strip-track]` وشرائح `.m-info-strip__slide`. أضف أزرارًا بـ`data-info-strip-prev` و`data-info-strip-next`؛ وللاختيار المباشر أضف حاوية `[data-info-strip-pages]`. الموضع/الإعلان عبر `[data-info-strip-position]` و`[data-info-strip-status]`. أضف رسالة يوفّرها المستهلك بـ`data-info-strip-empty` لتظهر عند غياب الشرائح. استدعِ `MicroInfoStrip.init(root)` بعد إضافة شريط ديناميكي. يُهيّأ تلقائيًا عند تحميل الصفحة.

## أين أعدّل؟

| المطلوب | المصدر |
|---|---|
| النص والقيمة والوحدة والحالة | HTML الذي يكتبه المستهلك |
| لون أو انحناء أو مسافة أو حجم | توكنات `shared/tokens.css` المستخدمة داخل `info-strip.css`؛ لا تعدّل اللون داخل المعاينة |
| سلوك الأسهم/اللمس/المؤشر | `info-strip.js` |
| أصول السهم | مسارات SVG داخل HTML |
| طريقة العرض التجريبية | `previews/info-strip/` فقط |

لا تستخدم `overflow:hidden` على البطاقة نفسها ولا تصغّر الرقم لإخفاء قيمة طويلة. سطح الشريط يقص الشرائح المجاورة بصريًا فقط؛ الشريحة غير المعروضة `inert` و`aria-hidden`.