# تقرير المحاكاة — الوكيل الثالث (zai-3)

> **الخطة:** `docs/plans/design-system-batch2/PLAN-SIM.md` — الجزء أ فقط.
> **الفرع:** `design-system-sim` للمصدر، و`gh-pages` للنسخة المنشورة.
> **الرابط المنشور:** https://qays7753.github.io/micro-ui-design-system/
> **هذا التقرير يتحدث مع كل push، و«نقطة الاستكمال» آخر وحدة مرفوعة.**

## نقطة الاستكمال

**SA0** — البيئة جاهزة وحزمة `ds/sim/` منشأة بإعداد التقنيات كاملًا (البناء والاختبارات خضراء، والفحص البصري للشاشة الأولى ناجح). التفاصيل أدناه.

## ما بُني (سجل الوحدات)

### SA0 — البدء وتجهيز ds/sim
- **البيئة:**
  - `uv sync` (Playwright 1.63.0) وChromium وWebKit جاهزان. WebKit يعمل في الساندبوكس ببيئة EGL البرمجية (طريقة `tools/README.md` «بيئة مقيدة»: تنزيل الحزم بلا sudo ونسخها إلى `~/.cache/ms-playwright/webkit-*/minibrowser-wpe/sys/lib`) — فحص أول إطلاق نجح.
  - pnpm 12.23.0 عبر corepack (`~/.cache/node/corepack/v1/pnpm/12.23.0`).
- **الحزمة `ds/sim/`** (نمط `ds/consumer-test/` بإصدارات الخطة المثبتة حرفيًا):
  - `package.json`: react/react-dom 19.2.8، @types 19.2.14/19.2.3، vite 7.3.7، @vitejs/plugin-react 5.1.4، tailwindcss/@tailwindcss/vite 4.3.3، typescript 5.6.3 (strict)، vite-plugin-pwa 2.0.0 (registerType autoUpdate + workbox)، vite-plugin-singlefile 2.3.4، vitest 5.1.2 + Testing Library، و`pnpm-workspace.yaml` يسمح ببناء esbuild وحده.
  - `vite.config.ts`: بناء PWA على القاعدة `/micro-ui-design-system/` (GitHub Pages)، وmanifest §9.ب (Micro، ar/rtl، standalone، portrait، خلفية وtheme بلون canvas #E8ECEF، والوصف يحمل رقم النسخة §5.9)، وworkbox يخزّن كل شيء (JS/CSS/HTML/woff2/PNG/SVG) مع navigateFallback للعمل بلا شبكة.
  - `vite.singlefile.config.ts` + `tools/build-single.mjs`: بناء ثانٍ لملف واحد (`index-single.html` دخله، والخطوط woff2 تُدمج data-URI كما يفعل المختبر) → `previews/micro-sim/micro-sim.html` يعمل من `file://`.
  - **الربط بالمكتبة:** `@micro/ds` يُستورد من `ds/src/index.ts` بمسار مستعار في البناءين وفي vitest وفي tsconfig (كما يفعل المختبر، فيصل كل تحديث للمكتبة تلقائيًا). مصدر المكتبة خارج الحزمة، فاستوردادات الأقران العارية فيه (react/react-dom/vaul) تُحلّ صراحة إلى node_modules الحزمة (alias في vite، وpaths إلى @types في tsconfig).
  - `vitest.config.ts` + `src/test-setup.ts` (cleanup + matchMedia polyfill لـjsdom).
  - شاشة الإثبات (App.tsx): رأس «مشروع اليوم» + التاريخ الثابت «الجمعة 27/11/2026» + قسم «يحتاجك» بصف حقيقي من المكتبة (سلمى الحوراني، المبلغ عبر `Money`، شارة «جاهز»)، داخل `AmountVisibilityProvider`.
  - شاشة البداية داخل التطبيق (`src/splash/`): تجمّع الوحدات الأربع (هندسة الرمز نفسها بلا تعديل ملفاته) بـmotion.splash على canvas، ثم الظهور؛ مع reduced-motion ثابتة 300ms ثم fade (§9.ب بند 2).
  - **الأيقونات:** الموجودة الجاهزة في `assets/brand/micro-logo/v2/platform-icons/` تُستعمل كما هي (قرار المالك 5) — منسوخة إلى `ds/sim/public/icons/` و`favicon.svg` إلى `public/`، بلا أي تعديل.
  - **شاشات بداية iOS (§9.ب بند 2):** مولّدة في `public/splash/` — 20 مقاسًا (iPhone من SE حتى Pro Max + iPhone Air + iPad) والرمز (favicon.svg) في المنتصف بعرض 96 نقطة CSS على أرضية canvas، وروابط `apple-touch-startup-image` في `index.html` لكل مقاس.
- **البوابات داخل الحزمة:** typecheck ✓، vitest (1/1) ✓، eslint ✓، بناء PWA ✓ (38 مدخلًا مخزّنًا للعمل بلا شبكة)، بناء الملف الواحد ✓ (بلا أي رابط نسبي خارجي).
- **الفحص البصري (Chromium 390×844@3):** شاشة البداية (الرمز مجتمع سليم) والشاشة الجاهزة (العنوان يمين، التاريخ، القسم بعدّه، الصف بعلامة «س»، المبلغ «45 د»، شارة «جاهز») — نجح.

## خطوات تفعيل GitHub Pages (للمالك)

*(تُكتب في SA1)*

## قائمة فحص الهاتف (iPhone وAndroid)

*(تُكتب في SA1)*

## يُركَّب لاحقًا (بمكوّنات المكتبة عند بنائها في `design-system`)

*(يُبنى مع SA7/SA8)*

## يحتاج قرار المالك

1. **عرض الرمز في شاشات بداية iOS (§9.ب بند 2):** النص «بعرض 96» فُسِّر 96 **نقطة CSS** (تُرسم 96×كثافة البكسل في كل صورة، فحجم الرمز البصري واحد على كل الأجهزة). إن أراد المالك 96 بكسلًا فيزيائيًا في الصورة نفسها (الرمز يصغر بصريًا على الشاشات الكثيفة) فالتعديل مولّد آليًا وسريع.

## ملاحظات تشغيل البيئة (لإعادة التشغيل بعد أي انقطاع)

- استنساخ فرع `design-system-sim`، ثم: `uv sync`، و`corepack prepare pnpm@12.23.0 --activate` (أو PATH إلى `~/.cache/node/corepack/v1/pnpm/12.23.0`)، و`pnpm install` داخل `ds/sim/`.
- المتصفحان عبر `uv run python …` من جذر المستودع؛ WebKit في الساندبوكس يحتاج بيئة EGL البرمجية (تُطبقها أدوات المستودع تلقائيًا عند وجود مجلدات التراجع داخل تثبيت WebKit — موجودة).
