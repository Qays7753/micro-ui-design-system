# تقرير الوكيل 2 — جولة SAMSUNG-ONEUI-REPAIR-R2 — SUI-R1-02

**العامل:** الوكيل 2 (worktree `miu-r2-a2`، detached عند `be5263c474c066ee3a5136e37866a5ac82c3aa6a`)
**العيب:** SUI-R1-02 (P2) من `reviews/SAMSUNG-ONEUI-REPAIR-R1/CHATGPT-REVIEW-R1.md` — «disconnect ثم init لا يعيد المراقبة في peek وcarousel».
**الحالة:** مُنفَّذ ومُقاس — before 20/36 (16 فشلًا حصريًا في دورة إعادة الإلحاق) → after 36/36، والرجعية كلها خضراء (a4 34/34 · a05 24/24 · carousel 53/53). بلا commit/push (القائد يدمج).

---

## 1) العيب (مُعاد إنتاجه بأرقام قبل أي تعديل)

- `components/info-strip/info-strip-peek.js`: `initStrip` يعود فورًا عند وجود `data-info-peek-ready`، بينما `disconnect(root)` فصل المراقب ومسح `lastWidth` ولم يمس السمة — فبعد `disconnect ثم init` لا يصل التنفيذ إلى `observeViewport` أبدًا، ويبقى الشريط بلا مراقبة عرض.
- `components/carousel/carousel.js`: النمط نفسه — `setup` يعود عند وجود state في WeakMap فلا يُعاد ربط المراقب. إضافة: `init(root)` لا يعالج الجذر-الذات إن كان هو العارض (`element.querySelectorAll` لا يضم العنصر نفسه) بينما `disconnect` يعالجه — تعارض موثق.
- ثالثًا (اكتشاف مقيس): `disconnect` لا يلغي دورة rAF معلقة — نبضة `recenter*` مجدولة قبل الفصل تعمل بعده وتعيد القياس بلا مراقبة (قياس before: peek تحوّل transform من 554 إلى 594 بعد الفصل).

## 2) التصميم المطبَق (كما كلّف، بلا إعادة كتابة المحرك)

1. **peek — `initStrip`**: عند الشجرة الجاهزة (السمة موجودة) لا يعود صامتًا؛ ينفّذ «إعادة الإلحاق»: يجلب الحالة من `stateOf`، وإن وُجدت و`count > 0` يستدعي `observeViewport(strip, st)` (محمية بعلامة الوجود في WeakMap فلا تكرر) ثم `recenterStrip(strip, st)` (تعيد القياس لأن disconnect صفّر `lastWidth`). لا يربط المستمعات/الأزرار/النقاط من جديد — لم تُفصل أصلًا. الشريط الفارغ بلا مراقب أصلًا فيبقى كذلك.
2. **carousel — `setup`**: نفس المبدأ: عند وجود state → `observeViewport(carousel, st)` ثم `recenterCarousel(carousel, st)` ثم return. وأُضيف لـ`init(root)` معالجة الجذر-الذات (`scope.matches('[data-carousel]')` → `setup(scope)`) لتطابق عقد disconnect الموثق.
3. **دورة rAF المعلقة**: في `disconnect` لكلا المكوّنين تُلغى `st.raf` (`cancelAnimationFrame` ثم تصفير) — تنظيف كامل للدورة.
4. سلوك «disconnect ثم بلا init» بقي معزولًا كما هو (رجعية a4 SUI-007/10 وSUI-025/6 خضراء). لا تغيير في السحب/النقاط/لوحة المفاتيح/autoplay.

## 3) الملفات المعدلة (ملكيتي الحصرية)

| الملف | التغيير |
|---|---|
| `components/info-strip/info-strip-peek.js` | مسار إعادة الإلحاق في `initStrip` + إلغاء rAF المعلقة في `disconnect` |
| `components/carousel/carousel.js` | مسار إعادة الإلحاق في `setup` + `init` الجذر-الذات + إلغاء rAF المعلقة في `disconnect` |
| `components/info-strip/specification.md` | عقد «التنظيف وإعادة الإلحاق (SUI-R2-A2)»: ما يفصله disconnect بالضبط (المراقب + rAF معلقة + lastWidth) وما يعيده init (مراقب واحد + قياس فوري) وأن المستمعات/النقاط/الأزرار لا تُعاد — لا ازدواج |
| `components/carousel/specification.md` | العقد نفسه + توثيق إغلاق تعارض الجذر-الذات (init/disconnect) |
| `tools/sui-r2-a2-check.py` | أداة الفحص الجديدة (ملكي) |
| `previews/ux-patterns/mobile-record-sample/standalone.html` | **مُعاد توليده محليًا فقط** بأداة البناء لاختبار الملف الواحد — مقصود داخل worktree؛ القائد يعيد التوليد رسميًا بعد الدمج |

## 4) أداة الفحص `tools/sui-r2-a2-check.py`

`--tag before|after --out reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent2` — خادم 4420-4439 (استُخدم 4420)، Playwright sync مع `evidence/bin/chromium` headless، git_meta، RO_WRAP موسّع (يتتبّع built/observeCalls/disconnected **لكل نسخة** وأهدافها → عدّ «المراقبين النشطين لهدف viewport بعينه» وكشف اليتيم)، حاضنتا عزل (peek: 4 بطاقات، فهرس 2؛ carousel: 3 شرائح، فهرس 1؛ #wrap بعرض متغير و#hv للإخفاء — نمط a4)، ZOOM2_CLEAN بمرورين نظيفين (نسخة a2-check من R1)، وفتح الملف الواحد عبر `file://` مع `add_init_script` لتغليف RO وتحقق `build --check` أولًا.

**الفحوص (36):** لكل مكوّن: خط أساس + 3 دورات disconnect→init→تغيّر عرض الأب دون window-resize (320→360→390→**340** — عمدًا لا 320: العودة للعرض الأصلي تحجب العيب في «قبل» بقيمة transform قديمة صادفة الصواب) + إخفاء/كشف ضمن الدورة الثانية (فهرس محفوظ + صفر أحداث) + مراقب نشط واحد ولا يتيم + 5 فحوص عدم ازدواج مستمعات (next/prev/ArrowLeft/ArrowRight/نقطة-صفحة = خطوة واحدة وحدث واحد) + عدد النقاط/الصفحات = الشرائح + تركيز محفوظ عبر دورة كاملة + توسيط عند 200% بعد دورة + إلغاء نبضة rAF معلقة؛ ثم standalone (بناء مطابق + دورة كاملة + مراقب واحد + صفر أحداث) + صفر أخطاء صفحة.

## 5) الأرقام المفصلية — before (be5263c نظيف المصادر) مقابل after

الحواف = حافة يسرى/يمنى للبطاقة النشطة داخل viewport (متساوية = موسّطة)؛ peek فهرس 2/4 وcarousel فهرس 1/3 عند 320 بدايةً.

| الفحص | before | after |
|---|---|---|
| peek/baseline أول كشف @320 | transform=514، حواف 30/30 (سليم — R1 باقٍ) | نفسه 514، 30/30 |
| peek/cycle1 (init بالجذر-الذات) عرض 360 | transform عالق 514، حواف **−50/110** | transform=594، حواف **30/30** |
| peek/cycle2 عرض 390 | −110/170 | 654، 30/30 |
| peek/cycle3 عرض 340 | −10/70 | 554، 30/30 |
| peek/c2-reveal (إخفاء→disconnect→init→كشف) | −50/110، أحداث 0، فهرس 2 | 594، 30/30، أحداث 0، فهرس 2 |
| peek/observer بعد 3 دورات | built=1، disconnected=1، **activeOnViewport=0** | built=4، observeCalls=4، disconnected=3، **activeOnViewport=1**، يتيم 0 (نهائيًا: built=7/disconnected=6/active=1) |
| peek/raf-cancel (عرض+dispatch resize ثم فصل في مهمة واحدة) | transform 554→**594** (النبضة عملت بعد الفصل) | transform 514→**514** (أُلغيت) |
| peek/zoom200 @320+200% بعد دورة | −10/70 | 594، 30/30 |
| carousel/baseline @320 | transform=224، 36/36 (سليم) | نفسه |
| carousel/cycle1 عرض 360 | transform عالق **224**، حواف **−4/76** — مطابق حرفيًا لأرقام المراجعة | transform=264، 36/36 |
| carousel/cycle2 عرض 390 / cycle3 عرض 340 | −34/106 / 16/56 | 294 ثم 244، 36/36 |
| carousel/observer بعد 3 دورات | activeOnViewport=**0** | built=4، disconnected=3، activeOnViewport=**1**، يتيم 0 |
| carousel/raf-cancel | transform 244→**264** | 224→**224** |
| standalone/cycle (file://، دخول بالمزوّد التجريبي → التقارير، عرض 360) | transform عالق 210، حواف **−42/102** | transform=282، حواف **30/30**، vpW=360، أحداث 0 |
| standalone/observer (شريط التقارير) | activeOnViewport=**0** | activeOnViewport=**1** (بقية RO السبعة للصفحة لا تستهدفه) |
| أحداث change أثناء مزامنات إعادة التوسيط | 0 (لا شيء يحدث أصلًا) | 0 (مزامنة صامتة لنفس الفهرس) |
| عدم ازدواج مستمعات/نقاط (5+1 فحوص لكل مكوّن) | كلها خضراء (تؤكد المراجعة: لا ازدواج — المركزية هي الفاشلة) | كلها خضراء |
| التركيز محفوظ عبر دورة كاملة | أخضر | أخضر |
| صفر أخطاء صفحة | 0 | 0 |
| **الحصيلة** | **20/36 (16 فشلًا كلها في إعادة الإلحاق)** | **36/36** |

الأدلة الكاملة: `evidence/agent2/{before,after}-results.json` + `{before,after}-summary.txt` + `evidence/agent2/screenshots/` (لقطات مفصلية لكل حالة).

## 6) الرجعية (كلها من worktree داخل نطاق منافذي 4420-4439)

| الأداة | الأمر الفعلي | النتيجة |
|---|---|---|
| `tools/sui-repair-a4-check.py` | `--stage after --out …/evidence/agent2/a4-regression --port 4422` (**--stage** لا --tag — الوسيط الفعلي في رأس الأداة) | **34/34** — SUI-007 لـpeek (الكشف الأول/تغيّر العرض/العزل/عدم التكرار/فصل المراقب) وSUI-025 لـcarousel كلها خضراء، وSUI-008/009/017/024 كذلك |
| `tools/a05-peek-check.py` | `--out …/a05-regression --port 4424` | **24/24** |
| `tools/carousel-screenshots.py` | `--out …/carousel-regression --port 4426` | **53/53** |

ملاحظات رجعية: لقطات a4 كُتبت أصلًا في `agent2/screenshots` (سلوك الأداة: تكتب في `out.parent/screenshots`) ثم نُقلت إلى `a4-regression/screenshots` للتنظيم — النصوص والقياسات لم تتغير. سلوك «disconnect ثم بلا init يبقى معزولًا» مثبت أخضر في a4 (SUI-007/10 وSUI-025/6: تغيّر العرض بعد الفصل يترك −110/170 و−34/106 بلا إعادة توسيط — كما هو مقصود). **صفر فشل رجعي بسبب تعديلي.**

## 7) NOT RUN (صراحة كاملة)

- أجهزة فعلية/لمس حقيقي (S25 أو غيره) — لم يُشغّل.
- TalkBack/قارئ شاشة فعلي.
- WebKit/Safari.
- native zoom — التكبير 200% هنا محاكاة نص (ZOOM2_CLEAN بمرورين نظيفين) معلنة، ليست تكبير متصفح/نظام.
- رجوع النظام.
- أدوات جولات/وكلاء آخرين (ux-f03-check، concepts-check، أدوات R1 الأخرى): لم أشغّلها — ليست من تكليفي؛ توقعات المتأثر بتعديلي: F03 الجولة (46/46) لا يتأثر منطقيًا (لا disconnect في مسار F03) لكن التحقق النهائي على القائد بعد الدمج الرسمي.

## 8) ملاحظات للقائد

1. `standalone.html` داخل worktree معدل بإعادة توليد محلية (مطلوب لفحص 8) — **يُتجاهل عند الدمج ويُعاد توليده رسميًا** بعد دمج مصادر المكوّنين (الأداة `build-f03-standalone.py` حتمية: md5 بعد=64d7a1390eda).
2. أمر a4 الفعلي `--stage` لا `--tag` (خطأ تسمية في التكليف — تحققت من رأس الأداة قبل التشغيل كما طُلب).
3. الفحص الأخير للدورات ينتهي عند عرض 340 لا 320 عمدًا (موثق في رأس الأداة): العودة إلى العرض الأصلي في «قبل» تُظهر توسيطًا صادف الصواب بقيمة transform قديمة فتحجب العيب؛ 340 يكشف الفشل الحقيقي.
4. قبل أي فشل متبقٍ: لا شيء — كل فحوص 36/36 والرجعية 111/111 (34+24+53).
