# تقرير التنفيذ — تجهيز مكتبة Micro UI للربط بالتطبيق

الفرع: `feature/integration-readiness-2026-11-21` — لا دمج إلى `main` ولا PR طوال المهمة.
الخطة: [PLAN.md](PLAN.md). المرجع البصري: `docs/references/micro-auth/`.

## المرحلة 0 — بيئة الفحص ✅

**ما نُفّذ:**

1. استنساخ كامل (غير shallow) وجلب كل الفروع، والعمل على فرع العمل الموجود (D1).
2. أُزيل الاعتماد على الـcommit الثابت `161bb71` من الفحوص الأربعة:
   - `tools/baselines/identity.json` جديد: 163 تصريح توكن محمي، SHA-256 لكتلة Dark القديمة الخاملة، بصمات SHA-256 لـ121 ملف شعار v2، وقيم Accent/Petrol الرسمية. استُخرج مرة واحدة عبر `tools/extract-identity-baselines.py` (محفوظ للتكرار والتدقيق).
   - فروق موثقة داخل identity.json بين commit الهوية والحالة المقبولة: تصحيحا R-06 المدقّقان (`--micro-data-c`/`--micro-data-e`)، والتوكن المحذوف تاريخيًا `--micro-metric-hero-separator` (عرفه metric-comparison محليًا باسم مختلف).
   - `light-static-check.py`: المقارنات مقابل `origin/main` افتراضيًا أو `--base <ref>`؛ فحص جديد يحمي كل قيم التوكنز الأساس ضد identity.json؛ حماية «لا حذف مصدر» صارت مقصورة على مسارات المصدر (`components/`, `shared/`, `assets/`, `previews/`) لأن تنظيف docs في المرحلة 3 معتمد.
   - `light-release-check.py`: بصمات الشعار وقيمة Petrol وكتلة Dark من identity.json بدل `git show` التاريخي.
   - `light-evidence-capture.py`: الـbase الافتراضي `origin/main` مع `--base`.
   - `product-context-check.py`: إعادة تشغيل Fields التاريخية للقراءة فقط من `tools/baselines/fields-baseline.js` بدل `git show 280b33b`.
3. الفحوص التي كانت تكتب داخل المستودع تكتب افتراضيًا في مجلد مؤقت (`light-static-check`, `light-release-check`, `light-evidence-capture`).
4. `.gitignore`: أُضيف `.venv/`، `node_modules/`، `/dist/` (و`generated-artifacts/` موجود سابقًا).
5. `README.md`: قسم تشغيل الفحوص عبر `uv sync` ثم `uv run python tools/...`.

**الملفات الأساسية:** `tools/baselines/identity.json`، `tools/baselines/fields-baseline.js`، `tools/extract-identity-baselines.py`، `tools/light-static-check.py`، `tools/light-release-check.py`، `tools/light-evidence-capture.py`، `tools/product-context-check.py`، `.gitignore`، `README.md`.

**commits:** `cf921d7` (فك الاعتماد) + `96c5129` (إعادة توليد MANIFEST بعد تغيّر بصمات الأدوات، ومعالجة فحص النسب على shallow).

**قبول shallow:** اختُبرت نسخة `git clone --depth 1` + جلب فرع العمل: static 199/199، manifest/catalog/standalone --check، product-context 250/250، audit 67/67، و`git status` نظيف بعد التشغيل. فحص النسب (merge-base) غير قابل للتحقق في shallow (لا تاريخ مشترك بين grafts) — يبقى صارمًا في النسخ الكاملة وCI ويُوثَّق تخطيه في shallow بعبارة صريحة في نتيجة الفحص.

**نتائج البوابات:** static 198/198 · audit 67/67 · product-context 250/250 · light-release 35/35 · mobile-experience 49/49 · catalog/manifest/standalone `--check` ناجحة. `git status` نظيف بعد التشغيل.

**الافتراضات (قواعد القسم 3.3):**

- انخفض عدد حالات static من 432 (قاعدة 161bb71) إلى 198 (قاعدة `origin/main`): فحوص «الملفات المتغيرة» لكل ملف صارت على ملفات هذا الفرع فقط. ليس حذف حماية: حماية القيم المنقولة إلى identity.json (فحص توكنز أضيق نطاقًا وأدق)، وحالة `origin/main` نفسها مقبولة كأساس. النتيجة المرجعية على main كانت 429/429 بمنطق القاعدة القديم.
- حماية «لا حذف» اقتُصرت على مسارات المصدر الأربعة تحسبًا لحذف التوثيق المعتمد في المرحلة 3.
- `fields-baseline.js` لقطة بايت-ببايت للملف التاريخي مع ترويسة توضيح؛ الاستثناء الوحيد عن «لا نسخ كود» لأنه أصل فحص قراءة فقط، وليس مصدر مكتبة.

**المؤجلات:** لا شيء في هذه المرحلة.

**ما لم يُختبر:** لا تغيير على المتصفحات/الأجهزة عن السابق (Chromium فقط، D20).

## المرحلة 1 — دمج الفروع وشاشات الدخول ✅

**ما نُفّذ:**

1. **D3:** نُقلت خطة جاهزية المكونات إلى `docs/plans/component-readiness-2026-11-17/PLAN.md` (من فرع المراجعة، آخر نسخة self-contained).
2. **D2:** cherry-pick بالترتيب `6ec5fac` → `692b188` → `2462307`. تعارض MANIFEST حُل بإعادة التوليد؛ تعديلات الفرع على `AGENTS.md`/`DESIGN.md` أُسقطت كاملة (حتى ما دُمج تلقائيًا)، وأضيفت فقرة «حدود بوابة الدخول» إلى `DESIGN.md`.
3. نُقلت `docs/superpowers/plans/*` إلى `docs/plans/access-gateway-2026-11-18/` وحُذف `docs/superpowers/` وحُدّث الرابط الوحيد في `CURRENT-STATE.md`. لا نص superpowers حيًّا في الشجرة.
4. **مطابقة الشاشات الأربع مع المرجع** (`docs/references/micro-auth/` — tokens/svg/previews): الشاشات من D2 مطابقة بنيويًا (الأشكال، التسلسل، المحتوى). حُسمت التعارضات المعتمدة:
   - زر «ابدأ الآن» صار بتروليًا أساسيًا `m-btn--primary` (المرجع تراكوتا — مسجل في DECISIONS).
   - أهداف اللمس 48px، حالة الضغط وخطوط السلالم وأنصاف الأقطار من توكنز المستودع فقط؛ صفر قيم لونية/حجمية مكتوبة في `auth-screens.css`.
   - موضع Google `data-google-provider-slot` بإطار منقّط دون مضيف؛ روابط الشروط/الخصوصية غائبة افتراضيًا.
5. **حالات الشاشة 2:** `data-auth-state="loading|error-network|error-cancelled|error-auth"` على جذر الشاشة تعرض منطقة الحالة `[data-access-status]` (role=status، aria-live=polite) بنص يكتبه المضيف؛ حالات الخطأ بلون الخطر؛ نبض التحميل يُلغى مع `prefers-reduced-motion`؛ لا منطق محلي ولا انتقال لأي ترحيب. المثال `?state=…` محاكاة مضيف موثقة.
6. **C13** في الكتالوج: تركيب `access-gateway-screens` بحالة `draft-for-review`؛ أعيد بناء الفهرس وpayload المعرض وstandalone وMANIFEST.
7. **فحص login** وُسّع بـ28 حالة تغطي الحالات الأربع (نص ظاهر، aria-live، بقاء شاشة الدخول، لون الخطر، لا overflow عند 360 و320).

**الملفات الأساسية:** `components/access-gateway/auth-screens.css`، `google-sign-in-usage.html`، `new-user-welcome-usage.html`، `returning-user-welcome-usage.html`، `specification.md`، `docs/COMPONENT-CATALOG.json`، `tools/mobile-experience-check.py`، `docs/DECISIONS.md`، `docs/plans/access-gateway-2026-11-18/`.

**commits:** `210f2c1` (D3) + `ffabbb7`/`7e30892`/`5aa47d1` (D2 cherry-picks) + commit هذه التسوية.

**نتائج البوابات:** static 225/225 · audit 67/67 · product-context 250/250 · light-release 35/35 · mobile-experience 126/126 (منها login 88) · catalog 14 عائلة/8 متغيرات/13 تركيبًا · standalone/manifest --check ناجحة.

**القبول:** فحص login ناجح بكل حالاته ✓؛ الكتالوج 14/8/13 ✓؛ لا نص superpowers ولا رابط مكسور ✓.

**الافتراضات:** مسجلة في `docs/DECISIONS.md` (البند 1 من المرحلة 1) — أبرزها فروق المقاسات الموثقة عن المرجع.

**المؤجلات:** لا شيء.

**ما لم يُختبر:** معاينة PNG المرجعية بصريًا داخل بيئة التنفيذ (لا تدعم قراءة الصور)؛ اعتمدت المطابقة على مصادر المرجع النصية (tokens JSON وSVG) وعلى فحوص D2 الأصلية. الاعتماد البصري النهائي على المالك.

## المرحلة 2 — عقد عمل واحد ✅

**ما نُفّذ:**

1. أُعيد كتابة `AGENTS.md` (46 سطرًا) بالأقسام المطلوبة: النطاق، مصادر الحقيقة، ثوابت الهوية والنطاق (11 بندًا من القسم 1 في الخطة)، حالات الاعتماد، **تفويض واحد نافذ** (خطة الربط على فرع العمل)، البوابات (`tools/check-all.py`)، وما لا يُختبر آليًا.
2. حُذفت كل التفويضات التاريخية، والإشارة إلى فرع `feature/ui-system-component-audit-repair-2026-11-11` غير الموجود، وجملة «لا تنشئ فرعًا خارج main» المتعارضة مع تفويض فرع العمل.
3. أُعيد كتابة `DESIGN.md` (41 سطرًا): الهوية والحدود وقواعد التركيب والمصادر والتحقق فقط، بلا سجل جولات؛ مع إبقاء فقرة حدود بوابة الدخول من المرحلة 1.
4. أُنشئ `tools/check-all.py` (9 بوابات) ليكون مسار البوابات المذكور في AGENTS موجودًا فعليًا؛ يتوسع في المرحلة 4.

**القبول:** لا تعارض بين جملتين في AGENTS.md ✓؛ كل مسار مذكور فيه موجود في الشجرة ✓ (روابط DESIGN تشير لملفات حالية، وتُحدَّث في المرحلة 3 عند إنشاء المدموج).

**commits:** commit هذه المرحلة.

**نتائج البوابات:** check-all: 9/9 (static 227/227، audit 67/67، product-context 250/250، light-release 35/35، mobile-experience 126/126، standalone/catalog/manifest --check، git diff --check).

**الافتراضات:** لا شيء جديد. **المؤجلات:** لا شيء.


## المرحلة 3 — تنظيف التوثيق والمستودع ✅

**ما نُفّذ:** tag أرشيف `archive/pre-integration-2026-11-21` قبل أي حذف. حُذف الأرشيف التاريخي (D6) وقوائمه في DECISIONS؛ دُمجت مستندات docs العليا في: STATUS، GETTING-STARTED (جديد)، API، COMPOSITIONS، DESIGN-FOUNDATIONS، TESTING، HANDOFF، مع دمج UI-PLATFORM-NOTES في SYSTEM-CONTRACTS وUI-DECISIONS في DECISIONS وإبقاء COVERAGE محدثًا. أُعيد كتابة README قصيرًا. حُذفت معاينة chart-proposal التاريخية بقرار موثق. أضيف `tools/link-check.py`. حُدّثت الأدوات التي تقرأ مسارات محذوفة (light-static: حماية الشعار فقط + استثناء الحذف المعتمد؛ الكتالوج ومولد الفهرس). القرارات التفصيلية في DECISIONS.md (المرحلة 3).

**الحجم:** 202MB/1761 ملفًا قبل → ~151MB/~1250 ملفًا بعد (تقريب du بدون .git).

**القبول:** صفر روابط مكسورة (link-check) — تُثبت أرقام البوابات أدناه؛ لا ملف في docs/ سجل جولة؛ manifest --check ناجح بعد إعادة البناء.

**commits:** commit هذه المرحلة. **نتائج البوابات:** تُرى في مخرجات التشغيل أدناه وتُحدَّث في التقرير النهائي.


## المرحلة 5 — الحزمة والتوزيع ✅

**ما نُفّذ:** حزمة `@micro/ui` 0.1.0 خاصة (`private: true` — لا نشر، D9) بلا حقل `type` و`engines.node >= 20` وesbuild أداة بناء وحيدة (devDependencies) وخرائط تصدير `css/js/fonts/micro-ui.d.ts` وfiles: dist/src/README/CHANGELOG. `tools/build-package.mjs`: مزامنة مرايا `src/` (باستثناء `*.md` — روابط توثيق نسبية للمستودع) وتوليد `dist/` حتميًا (265 ملفًا): CSS منسوخ بايت-ببايت (D15) + `micro-ui.css` (fonts+tokens+motion)، JS عبر esbuild (IIFE/es2019/بلا تصغير)، خطوط وشعار v2 وأيقونات و`dist/assets/{icons,surfaces}` لحل المسارات النسبية، و`dist/MANIFEST.json` ببصمات sha256. `tools/package/micro-ui.d.ts` (15 global بأسماء التوابع الحقيقية). بوابة `package` داخل check-all (سريعة وقصيرة). `examples/vanilla-app/` (فهرس + شاشة مركّبة Buttons/Fields/Data + شاشات الدخول الأربع تستهلك `src/` مباشرة مع تعليق مرجع Micro-Auth لكل شاشة). اكتمل GETTING-STARTED (dist/src/examples/بناء/خاصية الحزمة) وCHANGELOG 0.1.0. أُزيل `/dist/` من .gitignore (dist مُتابَ)، ووسّع manifest-build وpreview-server لأشجار الحزمة. القرارات في DECISIONS.md (المرحلة 5، 11 بندًا).

**القبول:** package --check ناجح (المرايا وdist بايت-ببايت مطابقة لإعادة بناء حتمية)؛ كل مخرجات dist/js تمر node --check وتعمل في Chromium (فحص وظيفي خارج الشجرة: globals ورسم Data وsetLoading وترطيب الأيقونات والخطوط)؛ صفحات examples السبع صفر أخطاء console وموارد؛ catalog 14/8/13.

**commits:** commit هذه المرحلة (بناء الحزمة ثم أمثلة وتوثيق).

**نتائج البوابات (check-all كامل 20/20):** standalone OK، catalog 14/8/13 OK، manifest 1017 مدخلًا OK، package OK، static 330/330، link-check 147 ملفًا/0 مكسور، audit 67/67، product-context 250/250، light-release 35/35، mobile-experience 126/126، light-calendar 164/164، light-data 185/185، component-consumption 37/37، integration-boundaries 77/77، clone-lifecycle 31/31، numeric-geometry 51/51، ui-system-showcase 126/126، preview-runtime 112/112، visual-regression OK، git diff --check OK.

**الافتراضات:** مرآة src/ بلا *.md (موثق DECISIONS)؛ تخطيط dist بنسبي مع dist/assets لحل url() الحرفية (موثق)؛ LICENSE غائب فلا حقل license؛ examples خارج لقطات D12 (أداة الالتقاط تغطي previews/components فقط — فُحصت خارج الشجرة بدلها).

**المؤجلات:** توسيع d.ts للغلوبالات الثانوية (MicroPacked/MicroInfoPeek/MicroReadings/MicroIcons/MicroActionSheet) مع عقود المرحلة 6؛ تركيب CI (tools/ci/ci.yml) بيد المالك.
