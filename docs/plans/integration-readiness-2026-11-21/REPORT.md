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


## المرحلة 4 — تصنيف الأدوات وبوابات الجودة وCI ✅

**ما نُفّذ:** صُنّفت الأدوات الستون في `tools/README.md`: 15 بوابة حالية، 7 أدوات بناء، وحُذف 38 سكربتًا تاريخيًا مع خريطة تغطية موثقة لكل محذوف (أي بوابة تغطي سلوكه الآن). رُقّيت البوابات الناجحة للسلوك الحالي إلى check-all (light-calendar، light-data، component-consumption، integration-boundaries، clone-lifecycle، numeric-geometry، ui-system-showcase، preview-runtime). أُعيد كتابة `tools/check-all.py` مشغّلًا وحيدًا للبوابات (ملخص لكل بوابة، `--quick`/`--skip-visual`، تشغيل خادم المعاينة تلقائيًا). أُضيفت `tools/visual-regression-check.py` (D12: فرق بكسلات ≤0.1%، الصفحات الجديدة/المحذوفة تُبلَّغ ولا تفشل، خط الأساس `pre-phase4` خارج المستودع). أُضيف `pillow` لفروق البكسلات. سير عمل CI جاهز في `tools/ci/ci.yml` مع تعليمات تركيب من سطر واحد: التوكن المستخدم للرفع بلا نطاق `workflow` فيرفض GitHub دفع ملفات `.github/workflows/` — قرار مسجل (3.3) ويُركّبه المالك.

**القبول:** check-all كامل 19/19 ناجحة (بعد إصلاح روابط أدوات محذوفة في 3 مستندات وإعادة توليد MANIFEST): static 198/198، link-check 129/0، audit 67/67، product-context 250/250، light-release 35/35، mobile-experience 126/126، light-calendar 164/164، light-data 185/185، component-consumption 37/37، integration-boundaries 77/77، clone-lifecycle 31/31، numeric-geometry 51/51، ui-system-showcase 126/126، preview-runtime 112/112، visual-regression OK.

**commits:** `b0df085`.

**الافتراضات:** خط الأساس البصري خارج الشجرة (لا يُنشر)؛ CI في `tools/ci/` حتى يملك المالك توكنًا بنطاق workflow.

**المؤجلات:** تركيب ملف CI في `.github/workflows/` بيد المالك.


## المرحلة 5 — الحزمة والتوزيع ✅

**ما نُفّذ:** حزمة `@micro/ui` 0.1.0 خاصة (`private: true` — لا نشر، D9) بلا حقل `type` و`engines.node >= 20` وesbuild أداة بناء وحيدة (devDependencies) وخرائط تصدير `css/js/fonts/micro-ui.d.ts` وfiles: dist/src/README/CHANGELOG. `tools/build-package.mjs`: مزامنة مرايا `src/` (باستثناء `*.md` — روابط توثيق نسبية للمستودع) وتوليد `dist/` حتميًا (265 ملفًا): CSS منسوخ بايت-ببايت (D15) + `micro-ui.css` (fonts+tokens+motion)، JS عبر esbuild (IIFE/es2019/بلا تصغير)، خطوط وشعار v2 وأيقونات و`dist/assets/{icons,surfaces}` لحل المسارات النسبية، و`dist/MANIFEST.json` ببصمات sha256. `tools/package/micro-ui.d.ts` (15 global بأسماء التوابع الحقيقية). بوابة `package` داخل check-all (سريعة وقصيرة). `examples/vanilla-app/` (فهرس + شاشة مركّبة Buttons/Fields/Data + شاشات الدخول الأربع تستهلك `src/` مباشرة مع تعليق مرجع Micro-Auth لكل شاشة). اكتمل GETTING-STARTED (dist/src/examples/بناء/خاصية الحزمة) وCHANGELOG 0.1.0. أُزيل `/dist/` من .gitignore (dist مُتابَ)، ووسّع manifest-build وpreview-server لأشجار الحزمة. القرارات في DECISIONS.md (المرحلة 5، 11 بندًا).

**القبول:** package --check ناجح (المرايا وdist بايت-ببايت مطابقة لإعادة بناء حتمية)؛ كل مخرجات dist/js تمر node --check وتعمل في Chromium (فحص وظيفي خارج الشجرة: globals ورسم Data وsetLoading وترطيب الأيقونات والخطوط)؛ صفحات examples السبع صفر أخطاء console وموارد؛ catalog 14/8/13.

**commits:** commit هذه المرحلة (بناء الحزمة ثم أمثلة وتوثيق).

**نتائج البوابات (check-all كامل 20/20):** standalone OK، catalog 14/8/13 OK، manifest 1017 مدخلًا OK، package OK، static 330/330، link-check 147 ملفًا/0 مكسور، audit 67/67، product-context 250/250، light-release 35/35، mobile-experience 126/126، light-calendar 164/164، light-data 185/185، component-consumption 37/37، integration-boundaries 77/77، clone-lifecycle 31/31، numeric-geometry 51/51، ui-system-showcase 126/126، preview-runtime 112/112، visual-regression OK، git diff --check OK.

**الافتراضات:** مرآة src/ بلا *.md (موثق DECISIONS)؛ تخطيط dist بنسبي مع dist/assets لحل url() الحرفية (موثق)؛ LICENSE غائب فلا حقل license؛ examples خارج لقطات D12 (أداة الالتقاط تغطي previews/components فقط — فُحصت خارج الشجرة بدلها).

**المؤجلات:** توسيع d.ts للغلوبالات الثانوية (MicroPacked/MicroInfoPeek/MicroReadings/MicroIcons/MicroActionSheet) مع عقود المرحلة 6؛ تركيب CI (tools/ci/ci.yml) بيد المالك.


## المرحلة 6 — توحيد العقد البرمجي ✅

**ما نُفّذ:** مسح كامل لعقود العائلات الأربع عشرة (جدول init/update-equivalent/disconnect/destroy في `docs/API.md`). توحيد سلوك محافظ: `MicroButtons.init(root)` اكتشاف موثق (markup-driven)، وأضيفت أسماء `update` رقيقة تفوّض للتنفيذ القائم بلا إزالة للأسماء التاريخية (Fields→sync، Picker→setOptions، Data→render، InfoStrip→rescan، Peek→goTo، MetricComparison→render، AccessGateway→init بالم-handlers، OrderSchedule→setData على مستوى الوحدة، Carousel→goTo، Readings/Packed→sync). العائلات بلا مفهوم بيانات (Buttons/Selection/Organization/Messages/Navigation/AccountSettings) موّث «لا ينطبق» صراحة في API.md وd.ts — لم يُخترع سلوك. `tools/api-lifecycle-check.py` جديد (فيكسَر حقيقي من example-usage لكل عائلة، 360×780 RTL Light reduced-motion): init مرتين → حدث واحد، update → بلا تكرار مستمعات، disconnect/destroy → صفر أحداث وصفر أخطاء صفحة/كونسول؛ داخل check-all. حُدّث API.md بعقد موحد وd.ts بكل الأسماء (ومنه الغلوبالات الثانوية المؤجلة من المرحلة 5) و10 مواصفات وعائلات وسطر لكل واحد.

**القبول:** api-lifecycle 55/55؛ check-all كامل 21/21 (بعد إعادة توليد standalone وMANIFEST) — من ضمنها visual-regression OK (تغييرات JS لم تغيّر التصيير).

**commits:** `edca290` (العقد) + `9a4cf60` (البوابة) + `5ae783d` (تجديد MANIFEST بعد standalone).

**الافتراضات:** الأسماء التاريخية تبقى معتمدة خلال 0.x (لا إزالة)؛ الأسماء الداخلية `_` مستثناة من d.ts.

**المؤجلات:** `MicroConfig.autoInit` و`options.labels` (نُفّذا في المرحلة 7)؛ فحص اكتمال d.ts (نُفّذ في المرحلة 7).


## المرحلة 7 — النصوص ✅

**ما نُفّذ:** سجل نصوص لكل عائلة: 13 ملف `components/<family>/labels.js` (بالمفاتيح camelCase والقيم العربية الحرفية السابقة) تُنشئ `window.MicroLabels['<family>']` وتُحمَّل قبل سلوك العائلة؛ ~518 نصًا إلى 426 مفتاحًا. `MicroX.setLabels(partial)` لكل عائلة (دمج جزئي يسري على التصييرات اللاحقة)، `options.labels` حيث يوجد كائن خيارات (AccessGateway عبر handlers)، و`MicroLabels.setLocale/locale` (الافتراضي `ar-u-nu-latn`) مع `formatNumber` يمرر `String(n)` كما هو في المسار الافتراضي — لا Intl في المسار الافتراضي حفاظًا على تطابق البايت (D12)، وصيغ الجمع «لا طلبات/طلب واحد/طلبان/…» عبر `Intl.PluralRules('ar')` بمطابقة الحرفية القائمة. `MicroConfig.autoInit=false` (متبقي المرحلة 6) حراسة مركزية قبل كل تهيئة تلقائية IIFE. بوابة `tools/hardcoded-text-check.py` (ساكنة، في check-all سريعًا وكاملًا): نصوص عربية في سلاسل JS خارج labels (تعليقات مستثناة)، اقتران التحميل في الصفحات (بما فيها المسارات النسبية القصيرة بعد التعميم)، تغطية مفاتيح L()، وتغطية d.ts لكل دالة عامة (استخراج واعٍ بعمق الأقواس للمستوى الأعلى فقط). امتد api-lifecycle بثلاث حالات setLabels حقيقية (order-schedule/data/carousel: نص بديل يظهر بعد update والاستعادة تعيد الأصل — حالة data حتمية عبر رسم أعمدة بنطاق معلن غير صالح يعرض نص الرفض k9). الحزمة تبث `dist/js/<family>-labels.js` وesbuild يضمّن السجل.

**تسويات الجلسة:** فجوة المسارات النسبية — صفحات `*-usage.html` داخل `components/<family>/` تحمّل السلوك بمسار شقيق قصير فلم يلتقطها فحص الاقتران الأصلي (المطابقة النصية `components/...` في قيمة src): عُمّم الفحص على المسار المحلول، وقُرنت 14 صفحة (7 في components + مرايا src)، ورُقّعت فيكسَرات خمس بوابات مضمنة (light-calendar، light-release، light-data، component-consumption، clone-lifecycle) لتحمّل labels قبل السلوك — وهي سبب فشل 8 بوابات في أول تشغيل كامل (استُصل كليًا). استُبدل نمط مفاتيح d.ts الساذج بمسح واعٍ بالعمق (كان يعدّ خيارًا متداخلًا مثل backdropEl واجهة عامة زائفة). نُظّفت المسافات الزائدة في نهايات الأسطر بالملفات المعدلة.

**القبول:** check-all كامل 22/22: static 410/410، link-check 147/0، hardcoded-text PASS (26 ملفًا، 4477 سلسلة، 65 صفحة، 426 مفتاحًا، 103 دوال عامة)، api-lifecycle 58/58، visual-regression OK (الصياغة الافتراضية مطابقة بايت-ببايت)، وكل البوابات الأخرى خضراء.

**الافتراضات والمؤجلات (DECISIONS المرحلة 7):** Carousel/Picker بلا `options.labels` لكل نسخة (init بلا معامل خيارات — setLabels على مستوى الصفحة في 0.x)؛ `data-micro-manual` لكل عنصر أُلغي (MicroConfig.autoInit يغطي الحالة)؛ أرقام لاتينية افتراضيًا (مطلوب الخطة) والمسار الافتراضي بلا Intl.
