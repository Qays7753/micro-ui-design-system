# عارض البطاقات القابل للسحب (Carousel) — دفعة مستقلة

الحالة: **DRAFT FOR REVIEW** — المسودات للمراجعة؛ قرار الاعتماد للمالك.

## الملفات

| الملف | الدور |
|---|---|
| `specification.md` | المواصفة الكاملة: العقد، الحالات، السحب، لوحة المفاتيح، RTL، الحدود |
| `carousel.css` | شكل العارض من توكنات `shared/tokens.css` حصرًا — لا قيم صريحة خارجها |
| `carousel.js` | السلوك: تنقّل منطقي + سحب pointer + مؤشر + لوحة مفاتيح + تقليل حركة. بلا autoplay ولا مكتبات |
| `../../components/data/packed-circle.css` / `.js` | **PROPOSED** امتداد opt-in فوق عقد B05 لدوائر المقارنة المتداخلة — لا يغيّر سلوك B05 الافتراضي |

## التشغيل

```bash
python3 -m http.server 8080   # من جذر المستودع فقط
# اللوحة: http://localhost:8080/previews/carousel/
# مثال مستقل بلا board.*: http://localhost:8080/previews/carousel/example-usage.html
# فحص ولقطات من المصدر: python3 tools/carousel-screenshots.py
```

## الاستهلاك الأدنى في صفحتك

1. حمّل: `assets/fonts/fonts.css` ← `shared/tokens.css` ← `components/carousel/carousel.css` (+ `components/data/packed-circle.css` فقط لدوائر المقارنة).
2. انسخ بنية العقد من `specification.md` §2 (أسماء الأصناف هي العقد) وضع محتوى بطاقتك داخل `.m-carousel__card`.
3. حمّل `carousel.js` ثم `MicroCarousel.init()` (تلقائي عند DOMContentLoaded) — أو استخدم `MicroCarousel.goTo/next/prev/getIndex` وحدث `micro-carousel:change`.

## أين أغيّر؟ (الخلاصة السريعة — التفصيل في المواصفة §10)

| أريد تغيير | المكان |
|---|---|
| اللون | لا ألوان جديدة هنا — كل شيء من `shared/tokens.css` (البطاقة، الحد، التركيز، الألوان الدلالية للمحتوى) |
| المقاس (شريحة المجاورة والفاصل) | `carousel.css` — `--_peek` و`--_gap` على `.m-carousel` (قيم مكوّن موثقة، مقترح) |
| النص | HTML المستهلك: محتوى `.m-carousel__card` و`data-card-label` لكل شريحة و`data-carousel-label` للعارض |
| الأيقونة | أصول `assets/icons/chevron-right.svg` / `chevron-left.svg` تُحمّل في لوحة المعاينة عبر `previews/board.js` — بدّل `<use href="#i-…">` في أزرارك |
| عدد البطاقات | أضف/احذف `li.m-carousel__slide` — كل شيء يتبع (المؤشر، النقاط، التعطيل) |
| القيم المالية | ثابتة من HTML المستهلك — `data-value`/`data-display` في دوائر المقارنة وأرقام `m-stat`؛ **المكوّن لا يحسب شيئًا** |
| اتجاه العرض | `dir` على الصفحة/الحاوية — العارض يتبع الترتيب المنطقي تلقائيًا |
| تداخل دوائر المقارنة | `--packed-overlap` على الرسم الموسوم `m-chart--packed` (امتداد PROPOSED) |
| عتبات السحب | ثوابت أعلى `carousel.js`: `AXIS_LOCK` / `COMMIT_RATIO` / `COMMIT_MIN` |

## قواعد الاستخدام ومتى يُمنع

**يُستخدم**: عرض مجموعة بطاقات ملخصات متساوية الأهمية نسبيًا مع حاجة تنقّل أفقي، ومقارنة غير تتطلب رؤية كل العناصر في وقت واحد.

**يُمنع / يُحذر منه**:
- إذا كانت المقارنة المباشرة بين عناصر مطلوبة دائمًا — لا تخفِ البطاقات المهمة خلف السحب (اعرضها جنبًا إلى جنب).
- لا تجعل الصفحة الرئيسية أو مسارًا كاملًا عارضًا؛ لا Dashboard.
- لا `autoplay` — لا يوجد ولا يُضف لاحقًا دون تكليف.
- المحتوى التفاعلي الكثيف داخل الشرائح يحتاج مراجعة تركيز صريحة (البطاقات المخفية كليًا معطّلة `inert` والمجاورة الظاهرة جزئيًا معاينة غير تفاعلية).

## إثبات قابلية التعديل

فحص E-series في `reviews/CAROUSEL/verification.txt`: تعديل `--_peek` انعكس على التوسّط والشريحة ثم أُعيد؛ تعديل `data-card-label` انعكس على `aria-label`/المؤشر؛ تعديل قيمة دائرة غيّر قطرها بتناسب √ ثم استُعيدت. كل ذلك من المصدر نفسه.
