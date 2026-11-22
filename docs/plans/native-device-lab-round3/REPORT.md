# تقرير الجولة الثالثة: السلوك الأصلي ومختبر الهاتف — @micro/ui 0.3.0

الخطة: `docs/plans/native-device-lab-round3/PLAN.md` — الفرع `feature/integration-readiness-2026-11-21` — نقطة البداية `1cf2013` (سلفه الوسم `v0.2.0` عند `db7ce1b`).

## جدول المتابعة

| # | البند | المرحلة | الحالة |
|---|---|---|---|
| G1 | بوابة `lint` غير مسجلة داخل `tools/check-all.py` | T1 | قيد التنفيذ |
| G2 | البوابة البصرية غير مستقرة (readable-acceptance يختلف 0.30% أحيانًا) | T1 | غير مبدوء |
| N1 | لا عقد مكتوب للسلوك الأصلي | T2 | غير مبدوء |
| N2 | لا هيكل شاشة (عائلة `screen`) | T3 | غير مبدوء |
| N3 | لوحة المفاتيح: صفر `visualViewport` و`enterkeyhint` | T4 | غير مبدوء |
| N4 | زر الرجوع لا يغلق الطبقة المفتوحة | T4 | غير مبدوء |
| N5 | السحب: لا سحب لإغلاق الأوراق، صفر `scroll-snap` | T4 | غير مبدوء |
| N6 | تكبير الخط: أحجام بالبكسل ولا اختبار إعادة تدفق | T4 | غير مبدوء |
| N7 | لا اهتزاز (haptics) | T4 | غير مبدوء |
| N8 | لا تحقق من اكتمال أنماط الشاشات المعيارية | T5 | غير مبدوء |
| N9 | لا مختبر هاتف | T6 | غير مبدوء |
| N10 | لا قائمة فحص مكتوبة للمالك على هاتفه | T7 | غير مبدوء |

## أرقام الأساس عند `v0.2.0` (مراجعة المالك على نسخة نظيفة، مذكورة في الخطة قسم 4)

25 بوابة ناجحة، typecheck وlint نظيفان: static 275، link-check 140 ملفًا، labels-override 43، audit 67، product-context 301، light-release 35، mobile-experience 126، light-calendar 164، light-data 185، component-consumption 39، integration-boundaries 77، clone-lifecycle 31، api-lifecycle 193، numeric-geometry 51، ui-system-showcase 126، preview-runtime 119، catalog 14/8/14. (تشغيل تأكيدي محلي عند بدء T0 يجري؛ تُحدَّث الأرقام أدناه عند اكتماله.)

## T1 — إصلاح البوابتين (G1، G2) — منفذة

- **G1:** أُضيفت بوابة `lint` إلى `tools/check-all.py` (قسم البوابات الثابتة — تعمل حتى في `--quick`، تفشل عند أي خطأ ESLint) وحدّثت قائمة البوابات في docstring الأداة و`docs/TESTING.md` و`tools/README.md` (صف البوابة) و`AGENTS.md` (العدد 26). خطوة lint في `tools/ci/ci.yml` موجودة منذ الجولة الثانية.
- **G2:** التقاط حتمي في `tools/visual-baseline-capture.py`: حقن `*{animation:none!important;transition:none!important;caret-color:transparent!important}` عند الالتقاط فقط + انتظار `document.fonts.ready` (كما كان) + `document.activeElement.blur()` + إطارا requestAnimationFrame بعد الاستقرار. خيار `--only` جديد لفحوص الحتمية بصفحة واحدة (البوابة نفسها تلتقط الكل دائمًا). **لا رفع سماحية ولا إضافة صفحة للسماحية.**
- **المرجع الافتراضي** للبوابة البصرية صار `v0.2.0` (N-D13) مع بقاء `--baseline-ref` قابلًا للتغيير؛ وأصلحت الأداة لتكتمل بنية الحزمة داخل worktree المرجع (v0.2.0 لا يتتبع dist/) بربط `node_modules` بالروابط الصلبة بدل فشل ERR_MODULE_NOT_FOUND.
- **أدلة:** 10 التقطات متتالية لـ`previews/readable-acceptance/index.html` على نفس الشجرة = بايتات متطابقة (sha256 `bab95a1e1d1b9f9557e45eb3733e02b23167490568a240ea4cf661777807cf10`). البصري مقابل v0.2.0: تشغيل أول 63/63 ناجحة 0 فشل 0 مسموح. **التشغيل الثلاثي المتتالي يجري من worktree معزول عند commit هذه المرحلة مباشرة (الشجرة تتغير الآن بعمل T3) — تُوثَّق نتيجته الثلاثية في تحديث التقرير التالي.**

## T2 — عقد السلوك الأصلي (N1) — منفذ

`docs/NATIVE-BEHAVIOR.md` بالأقسام الـ11 المطلوبة (ضغط/تمرير/لوحة مفاتيح/رجوع/سحب/تكبير خط/اهتزاز/safe areas/حركة/تركيز وقارئات/حدود الويب الصريحة)، لكل سلوك: الأصل، ملكية المكتبة والمضيف، Android وiOS، حدود المتصفح، والفحص الآلي واليدوي. رابط من `docs/SYSTEM-CONTRACTS.md` (قسم «المضيف وWeb مقابل Native») إلى العقد. تنفيذ T3/T4 يشير إلى أقسامه.

## T0 — تجهيز

- الفرع متزامن مع الأصل عند `1cf2013`، و`v0.2.0` سلف لـ`HEAD` (`git merge-base --is-ancestor` ✓).
- أنشئ هذا التقرير بالجدول وأرقام الأساس.
- «التفويض الحالي» وقسم «مختبر الهاتف — قاعدة دائمة» (N-D4) موجودان في `AGENTS.md` منذ `1cf2013` — تحقّق ✓ (لا تعديل مطلوب).

## T3 — عائلة screen (N2) — منفذة

- **الملفات:** `components/screen/` (screen.css، screen.js، specification.md، README.md، example-usage.html — بلا labels.js عمدًا) + `previews/screen/index.html` + `tools/screen-check.py`.
- **التسجيل:** مدخل `@micro/ui/screen` (Global `MicroScreen`) في البناء وpackage.json exports وtypes (screen.d.ts + iife.d.ts)؛ الكتالوج **15/8/14** (draft-for-review) والجرد مولّد؛ API.md (بطاقة العائلة 15) وGETTING-STARTED محدثان؛ standalone المعرض مولّد بأداته.
- **البنية:** grid بصفوف (top/content/actions/nav) داخل 100dvh (بديل 100vh)، تمرير `__content` فقط بـ`overscroll-behavior: contain`، أشرطة لا تغطي بنيويًا + قياس ResizeObserver لمتغيري `--m-screen-actions-h`/`--m-screen-nav-h` يغذي scroll-padding، حواف آمنة عبر متغيرات `--m-screen-safe-*` (من env()، قابلة للمحاكاة)، ملكية الحافة السفلية وفق W1.3، لوحة المفاتيح عبر visualViewport (keyboard-follow/keyboard-hide وحالة data-keyboard).
- **أدلة:** `tools/screen-check.py` عند 360 و320: **19 PASS / 0 FAIL** (تمرير داخلي فقط، لا overflow، آخر عنصر مكشوف، لوحة مفاتيح بمحاكي visualViewport وهمي، حواف آمنة بمحاكاة، update/destroy/init)؛ api-lifecycle **197/0** (+4 فحوص screen)؛ package --check **22 مدخلًا**؛ static **287/287**.
- **السماحية:** صفحة المعرض في allowlist (قسم screen الجديد — فرض بوابة الكتالوج، موثق في DECISIONS). صفحات screen الثلاث جديدة بلا مرجع فلا تقارن.

## T4 — السلوك الأصلي في المكوّنات (N3–N7) — منفذة

1. **لوحة المفاتيح (N3):** `enterkeyhint` افتراضي في fields (next/done من ترتيب النموذج، search لحقل البحث، دون كتابة فوق قيمة المستهلك) وEnter مع next ينقل التركيز للحقل التالي (النص الطويل يحتفظ بسطره)؛ حقل محادثة المنتج يعلن `send` صراحة (خيار `enterKeyHint` في حقول التركيب) وحقل البحث في C09 يأخذ `search` من نوعه. البنية عبر `visualViewport` في عائلة screen (T3).
2. **زر الرجوع (N4):** `shared/back.js` بـ`bindBackToLayers() → {openCount, destroy}` — أحداث موحدة `micro-layer:open/close` بتفاصيل `{layer, opener, close}` تطلقها navigation لكل طبقاتها (modal/لوحة تصفية/action-sheet/ورقة منتقٍ داخل طبقة). معالجة دقيقة لحالة السجل: استهلاك الحالة اليتيمة بعد الإغلاق بالطرق الأخرى بلا تفسيرها ضغطة رجوع (حارس `silent`)، وحفظ التركيز عبر popstate (استعادة متصفح التركيز لعنصر لحظة pushState كانت تضيع).
3. **السحب (N5):** Carousel وPeek عبر `scroll-snap` أصلي (حذف منطق المؤشر كاملًا؛ الأزرار والنقاط ولوحة المفاتيح وحدث change كما هي — حدث واحد لكل تغيّر فهرس بحارس programmatic). الورقة السفلية: مقبض سحب ظاهر (عنصر أصلي جديد — سماحية موثقة N-D13) بعتبة 30% أو سرعة ≥0.6px/ms، إغلاق بمسار requestClose نفسه (سبب `drag-dismiss`)، وارتداد دونها. لا سحب للحوار المركزي.
4. **تكبير الخط (N6):** 12 توكن حجم خط في tokens.css صارت rem بقيم مكافئة تمامًا عند جذر 16px (13px→0.8125rem … 36px→2.25rem) + الـ12px الوحيد المباشر في data.css؛ فحص الهوية صار يقبل مكافئ rem (N-D6: مقارنة بالقيمة المحسوبة لا النص الحرفي). بوابة `text-scale-check` جديدة: **11 PASS / 0 FAIL** (لا overflow ولا قص عند 100/150/200% + أهداف لمس ≥48px) على صفحات screen والمعرض — تضاف شاشات المختبر في T6. أصلح مخطوطات العرض (أزرار appbar 48px حقيقية + صورة المعرض الرمزية 48px).
5. **الاهتزاز (N7):** `shared/haptics.js` بـ`setHaptics/pulse/isHapticsEnabled` — معطل افتراضيًا، حالة مشتركة عبر `globalThis` (مدخلات IIFE تحزم نسخًا)، نبضات 10-15ms لأنواع محددة، لا شيء مع تقليل الحركة. مستدعى من: إغلاق الورقة بالسحب (navigation) + تأكيد الفعل الحساس (product) + إعلان الخطأ بنبرة `tone:"error"` (messages).
6. **استجابة الضغط والتمرير (T4.6):** أكملت `-webkit-tap-highlight-color: transparent` + `touch-action: manipulation` للأزرار التفاعلية غير المغطاة (زر مسح الحقل، خيارات المنتقي، عناصر الشريط السفلي والتبويبات)؛ overscroll-behavior و قفل تمرير الخلفية خلف الطبقات موجودان من الجولات السابقة.

**الأدلة:** component-consumption **50 PASS / 0 FAIL** (+11: enterkeyhint ×2، back ×5 بينها المتداخلة والاستهلاك الصامت وdestroy، haptics ×4 بينها سحب فوق/تحت العتبة)؛ api-lifecycle **197/0**؛ numeric-geometry **51/51**؛ clone-lifecycle **31/0**؛ light-release **35/0**؛ mobile-experience **126/0**؛ integration-boundaries **77/0**؛ audit **68/0**؛ text-scale **11/0**؛ lint صفر؛ package **24 مدخلًا** (back/haptics بنوعيهما)؛ typecheck نظيف. البصري مقابل v0.2.0: 60 ناجحة + 3 مسموحة موثقة (المقبض وتنعيم scroll-snap الفرعي — بالتحليل البكسلي).

**السماحيات الجديدة (بالأدلة):** selection/example-usage (المقبض 24px — الورقة تنمو لأعلى والمحتوى لا يتحرك) + carousel/index وexample-usage (تنعيم ±1/255 عند سكون التمرير — 3 إزاحات فعلية فقط من 28 بكسلًا متغيرًا). تفاصيلها في DECISIONS.

## T5 — أنماط الشاشات المعيارية (N8) — منفذة

`docs/SCREEN-PATTERNS.md`: جدول الأنماط الـ15 غير المرتبطة بـMicro، لكل نمط التغطية والعائلات/التراكيب والناقص. النتيجة: 14 نمطًا مغطى بعائلات وتراكيب قائمة، ونمط واحد كان ناقصًا كتركيب مسجل (حالة خطأ مع إعادة محاولة) فبُني **C15 error-retry** (draft-for-review): `components/compositions/error-retry.css` + مثال `previews/compositions/error-retry-example.html` + مواصفة في COMPOSITIONS.md + تسجيل في الكتالوج (**15/8/15**). حالة التحميل مغطاة بالأجزاء (B01 is-loading + تعطيل + إعلان) وبلا skeleton عمدًا (حركة تزيينية مستمرة تتعارض مع عقد الحركة — موثق). لا أنماط خاصة بـMicro (مؤجلة لتعريف الرحلات — الخطة).

**الأدلة:** الكتالوج 15 عائلة/8 متغيرات/15 تركيبًا (بوابة catalog)؛ text-scale **16/0** (شملت مثال C15)؛ مثال C15 يعمل بلا أخطاء (بوابة preview-runtime في التشغيل الكامل).

## T6 — مختبر الهاتف (N9) — منفذ

- **البنية:** `previews/device-lab/` — index.html (١٧ شاشة داخل إطار هاتف 360×780 على الكمبيوتر وبملء الشاشة على الهاتف ≤480px) + device-lab.css (كروم المختبر فقط) + device-lab.js (تنقّل hash + رجوع للفهرس + أدوات المختبر في ورقة من المكوّنات + سيناريوهات حقيقية: تحميل ثانيتين، تحقق نموذج فارغ، منتقٍ بعشرين صنفًا، تبديل شريط سفلي حقيقي، تقويم بطلبين، أنواع المنتج السبعة).
- **الشاشات:** فهرس مجموعات + شاشة لكل عائلة (screen, buttons, fields, selection, surfaces, data, metric, info-strip, carousel, organization, calendar, navigation, messages, account, gateway) + شاشة المنتج بأنواعها السبعة + حالة الخطأ C15 — تغطية كاملة للكتالوج (بوابة device-lab-check تقرأ الكتالوج وتقارن بعلامات data-lab-covers).
- **العرض:** viewport-fit=cover وtheme-color؛ على الهاتف بلا إطار؛ على الكمبيوتر إطار محايد بنوتش بسيط؛ `standalone.html` مولّد آليًا (`tools/build-device-lab-standalone.py` + `--check`) بكل CSS والخطوط base64 والسكربتات مضمّنة — يعمل من file:// بلا أي طلب شبكة.
- **البوابة:** `tools/device-lab-check.py` (مسجلة في check-all مع بوابة standalone المختبر): التغطية من الكتالوج؛ لكل شاشة صفر أخطاء ولا overflow ولا قص وأهداف ≥48 ولا تداخل تفاعلي وآخر عنصر مكشوف؛ تفاعل لكل شاشة؛ 320px وLTR؛ الرجوع (شاشة→فهرس، طبقة→تغلق أولًا)؛ أدوات 200%؛ standalone من file:// بصفر طلبات. (+ صفحة المختبر في بوابة text-scale.)
- **التوثيق:** `previews/device-lab/README.md` (فتح على الهاتف بطريقتين + إضافة شاشة) + رابط المختبر أعلى README.md الرئيسي. قاعدة N-D4 الدائمة موجودة في AGENTS.md منذ بداية الجولة.

## T7 — قائمة فحص الهاتف للمالك (N10) — منفذة

`docs/DEVICE-CHECKLIST.md`: التحضير (نقل الملف/الخادم المحلي)، جدول لكل شاشة من شاشات المختبر السبعة عشرة (خطوات قصيرة + المتوقع + أعمدة ✓/✗/ملاحظة)، أقسام عامة (حجم خط النظام، أفقي، لوحة مفاتيح، رجوع، اهتزاز، قارئ صوتي، أدوات المختبر)، وقسم إرسال الملاحظات. جدول الشاشات مشتق من شاشات المختبر نفسها.

## T8 — توثيق وإصدار 0.3.0 — منفذة

CHANGELOG قسم 0.3.0 كامل (Added/Changed/Fixed كما في الخطة)، package.json بالإصدار 0.3.0، ci.yml يذكر البوابات الجديدة (30 بوابة)، TESTING.md وREADME.md (رابط المختبر) وAGENTS.md (مصادر الحقيقة والعدد) محدثة، STATUS/SCREEN-PATTERNS/NATIVE-BEHAVIOR/DEVICE-CHECKLIST مرتبطة.

## T9 — التحقق النهائي — جزئي (انظر نقطة الاستكمال)

الوسم v0.3.0 وجدول G/N الختامي والتشغيل الثلاثي على نسخ نظيفة **لم يكتمل بعد** — هو أول بند في الجلسة التالية.

## T9 — التحقق النهائي

### 9.1 إصلاح بقايا بوابة المختبر — منفذ

**device-lab-check: 44 PASS / 0 FAIL.** الإصلاحات (موثقة في DECISIONS):
- **أهداف لمس 48px فعلية** كشفتها البوابة: أزرار المقاطع `.m-seg__item` وأزرار محدّد عرض التقويم `.m-ocal__viewseg-btn` كانت 40px — صارت `min-block-size: var(--micro-touch-min)`.
- ربط أزرار أدوات المختبر (الاتجاه/حجم الخط/الاهتزاز كانت بلا نقر — فحص 200% يعمل الآن).
- عقد الغلاف في المسبار: هدف لمس المدخل النصي هو `.m-field__control` وأفراد الغلاف الواحد منطقة لمس واحدة لا تُعدّ تداخلًا؛ الإدخال المخفي بصريًا (نمط m-choice) يُقاس بليبله.
- تبديل أنواع المنتج: destroy + replaceChildren قبل mount؛ تصحيح ترميز الخطوات للتركيب الرسمي.
- بوابة package-install: اسم الحزمة يُشتق من package.json (كان مثبتًا 0.2.0 — كسر عند 0.3.0).
- البوابة تكتب تقريرها دائمًا (أي خلل داخلي فحص فاشل لا انهيار).

### 9.2 check-all كاملة محليًا — ناجحة

**30 بوابة: 30 ok / 0 failed** بعد إعادة توليد standalone المعرض (أثر CSS الـ48px). البوابة البصرية ضمنها: **63 مقارنة — 53 ناجحة + 10 مسموحة موثقة + 0 فاشلة**، و5 صفحات جديدة بلا مرجع (شاشات screen والمختبر وC15).

### 9.3 التطابق البصري مقابل v0.2.0 — موثق بالكامل

10 سماحيات، كل واحدة بسبب ورقم قرار في `tools/baselines/visual-allowlist.json`:

| الصفحة | النسبة | السبب |
|---|---|---|
| previews/selection/example-usage.html | 5.40% | مقبض سحب الورقة (N-D9/N-D13) |
| previews/carousel/index.html + example-usage.html | 0.13%/0.12% | تنعيم فرعي لscroll-snap (N-D9) |
| previews/info-strip/comparison.html | 0.55% | تنعيم فرعي لPeek (N-D9) |
| previews/ui-system-showcase/index.html + standalone.html | 26.70% (سقف 35) | قسم عائلة screen (فرض الكتالوج — allowSize) |
| previews/mobile-capabilities/calendar-summary.html (9.63%) + calendar-tasks.html (13.73%) | ≤15% | أزرار محدّد التقويم 48px (T9.1) |
| previews/selection/index.html + components/order-schedule/example-usage.html | ≤25% | أزرار المقاطع/المحدّد 48px (T9.1) |

صفحات جديدة بلا مرجع (لا تقارن): components/screen/example-usage.html، previews/screen/index.html، previews/compositions/error-retry-example.html، previews/device-lab/index.html، previews/device-lab/standalone.html.

### 9.4 المختبر من file:// — ناجح

ضمن device-lab-check: standalone.html من `file://` — جاهز (`__labReady`)، صفر أخطاء صفحة/كونسول، **صفر طلبات شبكة** (كل الطلبات file:// أو data:)، وكل الشاشات السبع عشرة مضمّنة.

### 9.5 ثلاث نسخ نظيفة متتالية — ناجحة بالكامل

السكربت: `scripts` خارج المستودع؛ ثلاث نسخ متتالية من الفرع المدفوع (استنساخ كامل — غير ضحل لاحتياج بوابة البصري للوسم v0.2.0)، لكل نسخة: clone ثم `npm ci` ثم `uv sync` ثم `check-all` كاملة ثم `npm run typecheck` ثم `npm run lint` ثم `git status --porcelain`:

| النسخة | الالتزام | check-all | typecheck | lint | git status |
|---|---|---|---|---|---|
| 1 | d2ec23b | 30 بوابة، 30 ok، 0 failed | OK | OK | نظيف |
| 2 | 487fc85 | 30 بوابة، 30 ok، 0 failed | OK | OK | نظيف |
| 3 | 487fc85 | 30 بوابة، 30 ok، 0 failed | OK | OK | نظيف |

(النسخة 1 استُنسخت قبل دفع التزام التوثيق 487fc85؛ الفرق بينهما ملف التقرير والمانيفست فقط — والنسختان 2 و3 غطّتا الحالة الأحدث.)

### جدول الجولة الختامي — G1–G2 وN1–N10

| # | البند | الحالة | الدليل |
|---|---|---|---|
| G1 | بوابة lint داخل check-all | ✅ مكتمل | `("lint", ["npm","run","lint"])` في tools/check-all.py — العدد 30 بوابة (AGENTS/TESTING/README محدثة) |
| G2 | حتمية البوابة البصرية | ✅ مكتمل | 10/10 لقطات متطابقة لreadable-acceptance (sha256 bab95a1e…) + 3× متتالية × 63/63 مقابل v0.2.0 من worktree نظيف عند 79455d1؛ لا رفع سماحية لأجلها |
| N1 | عقد السلوك الأصلي | ✅ مكتمل | docs/NATIVE-BEHAVIOR.md بأقسامه الـ11 + رابط من SYSTEM-CONTRACTS |
| N2 | هيكل شاشة الهاتف | ✅ مكتمل | عائلة screen (draft-for-review): grid/100dvh/تمرير داخلي/visualViewport/حواف آمنة قابلة للمحاكاة + screen-check 19/0 + توكنز N-D5 في DECISIONS |
| N3 | لوحة المفاتيح | ✅ مكتمل | enterkeyhint افتراضي في fields (+send للمحادثة) وEnter ينقل للتالي + visualViewport في screen — فحوص screen-check وcomponent-consumption |
| N4 | زر الرجوع | ✅ مكتمل | shared/back.js (bindBackToLayers) + أحداث micro-layer:open/close من كل طبقات navigation + 5 فحوص في consumption (متداخلة/استهلاك صامت/destroy) |
| N5 | السحب | ✅ مكتمل | scroll-snap أصيل في Carousel وPeek + مقبض سحب الأوراق بعتبة مسافة/سرعة عبر requestClose — فحوص consumption والبوابات البصرية الموثقة |
| N6 | تكبير الخط | ✅ مكتمل | توكنز rem مكافئة (12 توكنًا + 12px data) + فحص هوية rem-aware + بوابة text-scale 16/0 عند 100/150/200% |
| N7 | الاهتزاز | ✅ مكتمل | shared/haptics.js معطل افتراضيًا (حالة مشتركة globalThis) في product/messages/navigation + فحوص التفعيل والتقليل |
| N8 | أنماط الشاشات | ✅ مكتمل | SCREEN-PATTERNS.md (الأنماط الـ15) + C15 error-retry + الكتالوج 15/8/15 |
| N9 | مختبر الهاتف | ✅ مكتمل | 17 شاشة تغطي الكتالوج كاملًا + standalone.html حتمي يعمل من file:// بصفر طلبات + أدوات + device-lab-check 44/0 + README وقاعدة N-D4 الدائمة |
| N10 | قائمة فحص المالك | ✅ مكتمل | docs/DEVICE-CHECKLIST.md (جدول الشاشات + أقسام عامة + إرسال الملاحظات) |

### 9.6 الوسم

وُضع الوسم `v0.3.0` على آخر التزام بعد نجاح النسخ الثلاث ودُفع مع الفرع (لا merge ولا PR — التزامًا بالقواعد).

### القسم الختامي — ما يبقى على المالك

الجولة مكتملة: كل بند من G1–G2 وN1–N10 منفذ بأدلته (الجدول أعلاه)، والبوابات الثلاثون خضراء على ثلاث نسخ نظيفة متتالية. المطلوب من المالك:

1. **تجربة مختبر الهاتف على هاتفه الحقيقي** وفق `docs/DEVICE-CHECKLIST.md` (نقل `previews/device-lab/standalone.html` وفتحه في Chrome؛ أدوات الاتجاه/تكبير الخط/الاهتزاج من الزر العائم) وإرسال الملاحظات بالصيغة المطلوبة في القائمة.
2. **مراجعة قرارات الجولة الثالثة في `docs/DECISIONS.md`** — خاصة: سماحيات البوابة البصرية العشر الموثقة (المقبض، تنعيم scroll-snap، قسم screen في المعرض، أهداف 48px)، وسياسة allowSize/السقف لكل صفحة، وعقد الغلاف كهدف لمس، وبلا skeleton عمدًا.
3. **حسم نضج ما دخله الجولة** (كل جديد `draft-for-review`): عائلة screen، وC15 error-retry، وback.js/haptics.js، وسلوكيات scroll-snap والسحب وenterkeyhint.
4. **حدود معروفة** (موثقة في NATIVE-BEHAVIOR قسم 11): لا اهتزاز على iOS، إيماءة الحافة في Safari غير المثبت، لا Dynamic Type من iOS، وفحص القارئ الصوتي يحتاج جهازًا حقيقيًا.
5. عند البدء بالربط: تعريف رحلات المستخدم الخاصة بالمنتج (مؤجلة بالخطة) ثم ترقية النضج بناء على ملاحظات المختبر.

## نقطة الاستكمال

- **الجولة الثالثة مكتملة** — T0 حتى T9 بأكملها، والوسم v0.3.0 مدفوع على الفرع. لا شيء قيد التنفيذ.
- لا أعطال معروفة. آخر التزام: وسم v0.3.0.
