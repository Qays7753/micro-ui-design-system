# Card Carousel Motion Reference

**Status:** `REFERENCE ONLY` — behavior and composition reference, not a visual template.

## Take from the reference

Use the motion reference to understand the relationship between an active centered card, partial neighboring cards, horizontal drag, explicit navigation controls, and a position indicator. The movement should be restrained, predictable, and useful for showing that more summaries exist.

## Do not copy

Do not copy the video’s colors, dark background, Apple Watch or fitness identity, icons, 3D treatment, autoplay, timing as a literal value, card count, or platform-specific composition.

## Micro translation

The reusable Carousel must use Micro’s tokens, light surfaces, Arabic RTL rules, real editable content, explicit previous/next controls, and a non-autoplay interaction model. Drag is optional and never the only way to access a card. The component must preserve vertical scrolling, support reduced motion, and remain separate from the content placed inside each card.

---

# مرجع حركة العارض — بطاقات تُسحب يمينًا ويسارًا (card-carousel-reference)

الحالة: REFERENCE — وثيقة استخلاص سلوكي، لا قرار بصري معتمد.
المصدر المفترض: فيديو حركة بطاقات (سحب يمينًا/يسارًا) + صورة Dashboard بدوائر متداخلة، أُرفقا مع تكليف الدفعة.

## تصريح توفر المراجع (إلزامي وصريح)

**عند تنفيذ دفعة PR#5 الأصلية لم تصل نسخة من الفيديو ولا من الصورة إلى بيئة التنفيذ** (لا مرفقات في رسالة التكليف ولا ملفات في مجلد الرفع). لم تُفتحا عندئذٍ ولا روجعا فعليًا، وما نُفّذ فيها كان استخلاصًا من **الوصف السلوكي المكتوب داخل التكليف (§4)**.

**في جولة After Direction الحالية وصلت حزمة المراجع الفعلية إلى الفرع** (`references/motion/card-carousel-reference.mp4` و`references/visual-direction/after/after-overlapping-circle-dashboard.jpg` عبر `task/after-direction-reference-pack`)، وفُتحت ورُوجعت فعليًا قبل التنفيذ — وتقرير ذلك مسجل في `reviews/AFTER-DIRECTION/review.md`. أي فرق بين ما استُخلص سابقًا وما يُظهره المرجع الفعلي يُعالج ضمن هذه الجولة ويوثق في التقرير نفسه.

## ما يُؤخذ من الفيديو — سلوك وتركيب فقط (منفذ في components/carousel/)

| السلوك | التنفيذ |
|---|---|
| بطاقة نشطة في المنتصف | توسّط فيزيائي مقاس لا افتراضي (getBoundingClientRect) — عرض البطاقة `100% − 2×(peek+gap)` |
| ظهور جزء من البطاقات المجاورة | `--_peek: 24px` من كل جانب + فاصل — شريحة معاينة لا تفاعل مخفي |
| انتقال أفقي بالسحب | pointer events بلا مكتبات؛ تتبّع حرفي للمؤشر أثناء السحب (بلا انتقال) والتزام عند تجاوز العتبة |
| أسهم تنقل واضحة | زرا أيقونة دائريان 48×48 بأسماء إتاحة — معطل فعليًا عند الطرفين |
| مؤشر موضع البطاقة | نص «البطاقة X من N» حيّ (aria-live) + نقاط انتقال مباشر عند الحاجة |
| حركة هادئة ومحدودة | زمن التحديد 180ms على transform فقط — لا قفزات تخطيط ولا حركة مستمرة ولا تأثيرات زخرفية |
| عدم الاعتماد على السحب وحده | الأزرار + النقاط + لوحة المفاتيح تصل إلى كل بطاقة |
| إمكانية رؤية أن ثمة بطاقات خارج الحالية | شريحة المجاورة ظاهرة دائمًا؛ المؤشر يعطي الموضع والعدد |

## ما لا يُنسخ من الفيديو (حدود صريحة)

الهوية البصرية والخلفية السوداء وألوانه؛ شكل Apple Watch أو النشاط الرياضي؛ أيقونات التفاعل الجانبية؛ تأثيرات 3D/WebGL؛ عدد البطاقات أو النقاط كما ظهر حرفيًا؛ `autoplay` أو التبديل التلقائي؛ أي تركيب خاص بمنصة اجتماعية.

## ما يُؤخذ من صورة الـDashboard (تركيب بصري — منفذ في مثال المقارنة المالية)

فكرة تجميع ملخصات مختلفة في بطاقات؛ الدوائر المتداخلة أداة مقارنة بصرية؛ حجم الدائرة يساعد على تمييز الفرق (المساحة ∝ القيمة — نصف القطر √)؛ الجمع بين الرقم والتسمية والحجم؛ وضع الرسم داخل بطاقة ملخص مستقلة واحدة.

## ما لا يُنسخ من الصورة (حدود صريحة)

الخلفية السوداء؛ الألوان البنفسجية أو البيضاء الحرفية؛ التخطيط الحرفي؛ كثرة البطاقات؛ تصميم Dashboard كامل؛ أي بيانات أو أسماء أو صور من المرجع كأنها بيانات Micro فعلية.

## خلاصة العلاقة

الصورة تشرح **تركيبًا بصريًا** (تجميع بطاقات + دوائر مقارنة)، والفيديو يشرح **سلوك حركة** (سحب أفقي مع أسهم ومؤشر). كلاهما مرجع سلوكي/تركيبي لا هوية Micro النهائية — الألوان والخطوط والأشكال من الأسس المعتمدة (`shared/tokens.css`) حصرًا، وكل قرار بصري جديد في الدفعة موسوم PROPOSED بانتظار اعتماد المالك.
