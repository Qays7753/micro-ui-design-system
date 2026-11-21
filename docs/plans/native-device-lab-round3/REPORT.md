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

## نقطة الاستكمال

- **الحالية:** T0–T3 منفذة وملتزمة؛ التالي: T4 (السلوك الأصلي في المكوّنات).
- الترتيب المتبقي: T4 (N3–N7) → T5 → T6 (مختبر الهاتف) → T7 → T8 → T9 (ثلاث نسخ نظيفة + وسم v0.3.0).
- لا أعطال معروفة حتى الآن.
