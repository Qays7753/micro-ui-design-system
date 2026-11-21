# خطة الجولة الثانية: إكمال جاهزية الربط — @micro/ui 0.2.0

## 0. الدور وطريقة العمل

أنت تعمل على المستودع `Qays7753/micro-ui-design-system`، فرع `feature/integration-readiness-2026-11-21`. الجولة الأولى (`docs/plans/integration-readiness-2026-11-21/PLAN.md`) انتهت عند الوسم `v0.1.0` (`dc0e902`). مراجعة المالك لتلك الجولة وجدت بنودًا **لم تُنفذ أو نُفذت جزئيًا**، وهذه الخطة تغلقها كلها.

المطلوب: تنفيذ هذه الخطة **كاملة من المرحلة R0 حتى R9 دون توقف ودون أي سؤال للمالك**. كل القرارات معتمدة مسبقًا في القسم 2. ما لا يغطيه نص الخطة يُحسم بقواعد القسم 3 ويُسجَّل، ثم تتابع.

- اقرأ قبل البدء: `AGENTS.md`، هذه الخطة كاملة، `docs/DECISIONS.md`، `docs/API.md`، `docs/SYSTEM-CONTRACTS.md`، `components/product-context/specification.md`، `tools/build-package.mjs`، `tools/check-all.py`، `tools/visual-regression-check.py`، `tools/package/micro-ui.d.ts`.
- ثوابت `AGENTS.md` (قسم «ثوابت لا تُكسر») نافذة بالكامل، ولا يتجاوزها شيء في هذه الخطة.
- بعد كل مرحلة: شغّل البوابات (القسم 4)، commit بالإنجليزية بصيغة `type(scope): summary`، `git push` إلى نفس الفرع، وحدّث التقرير (القسم 5). لا تنتظر ردًا.
- **ممنوع إعلان مرحلة «مكتملة» إذا بقي أي بند من بنود قبولها غير محقق.** إن تعذر بند، اكتب في التقرير «غير مكتمل» صراحةً مع السبب، وسجّله في `docs/DECISIONS.md` كمؤجل. التقرير النهائي يجب أن يطابق الواقع حرفيًا؛ سيُراجع بندًا بندًا.

## 1. نتائج المراجعة التي تغلقها هذه الخطة

| # | المشكلة الموجودة في `v0.1.0` | المرحلة |
|---|---|---|
| F1 | لا ES modules: كل `dist/js/*.js` بصيغة IIFE بلا أي `export`. لا `dist/esm` ولا أنواع لكل عائلة. التطبيق لا يستطيع `import`. | R2، R3 |
| F2 | `init` لا يعيد instance له `destroy()` إلا في Order Schedule وMicroProduct؛ الباقي aliases (`update: init`، `update: sync`، `update: rescan`، `update: render`). | R4 |
| F3 | كل مفاتيح النصوص بلا معنى (`k110`، `k112`… أكثر من 450 مفتاحًا في 13 ملف `labels.js`). Carousel وPicker لا يقبلان `options.labels`. | R5 |
| F4 | C08 ما زال يعرض فعل `save-local` وحالة `local-saved` لـManage (`components/product-context/operation.js`، و`specification.md` الأسطر 8 و47 و49 و74)، خلافًا لقرار Online-only (D15 في خطة الجولة الأولى). | R6 |
| F5 | ثلاث نسخ متتبعة من الكود: `components/` و`src/` (مرآة كاملة 4.3MB) و`dist/` (3.2MB). | R2 |
| F6 | بوابة `visual-regression` مربوطة بمسار ثابت على جهاز المنفّذ `/home/z/my-project/visual-baseline`، فتفشل في أي مكان آخر. | R1 |
| F7 | `previews/concepts/index.html`: روابط الـfooter («تقرير الفحص»، «تعليمات حزمة المصدر القابل للتعديل») تحولت إلى نص عادي بلا رابط. | R1 |
| F8 | CI غير مفعّل؛ الملف في `tools/ci/ci.yml` لأن التوكن بلا نطاق `workflow`. | R7 |
| F9 | فحوص تكتب داخل المستودع (`generated-artifacts/` في `tools/ui-system-showcase-check.py` و`tools/preview-runtime-check.py`)، وقوائم مجلدات قديمة (`reviews`، `prompts`، `handoff`) في `tools/manifest-build.py` و`tools/preview-server.py`. | R1 |
| F10 | ملفات `components/product-context/*.js` مكتوبة بأسطر مضغوطة غير مقروءة. | R2 |

## 2. القرارات المعتمدة من المالك

| # | القرار |
|---|---|
| R-D1 | فرع العمل الوحيد: `feature/integration-readiness-2026-11-21`. لا فرع جديد. |
| R-D2 | **المصدر الوحيد للسلوك: ES modules** داخل `components/<family>/*.js` و`shared/icons.js`. لا `window`، ولا تهيئة تلقائية، ولا أثر جانبي عند الاستيراد (no top-level DOM access). |
| R-D3 | ملفات IIFE (التي تضع `window.Micro*` وتهيئ تلقائيًا) **تُولَّد فقط** إلى `dist/iife/` من مدخلات بناء صغيرة. لا تُكتب يدويًا. |
| R-D4 | `src/` يُحذف نهائيًا. `dist/` يُحذف من git ويُضاف إلى `.gitignore`. الحزمة تُبنى بـscript `prepare` عند التثبيت من git. |
| R-D5 | `previews/` والمعرض و`standalone.html` والأمثلة تستهلك `dist/iife/` (أو `dist/esm/`) المبني. `tools/preview-server.py` و`check-all` يبنيان الحزمة تلقائيًا قبل التقديم/الفحص إن كانت قديمة أو غير موجودة. `standalone.html` يبقى متتبعًا ومولدًا (يُضمَّن فيه JS المبني). |
| R-D6 | العقد الموحد لكل عائلة لها JS: `init(root, options?) → instance` (انظر R4). لا استثناءات. |
| R-D7 | مفاتيح النصوص تُعاد تسميتها بأسماء دلالية. **لا aliases** للمفاتيح القديمة `kNNN` (لا مستهلك خارجي للإصدار 0.1.0). |
| R-D8 | الإصدار الناتج `0.2.0`، والوسم `v0.2.0` على آخر commit. يُوثَّق كل تغيير كاسر في `CHANGELOG.md`. |
| R-D9 | أدوات التطوير المسموحة (devDependencies فقط): `esbuild` و`typescript` (للفحص بـ`tsc --noEmit` فقط، لا تحويل كود). صفر اعتماديات تشغيل. |
| R-D10 | `window.Micro*` تبقى في نسخة IIFE. الأسماء القديمة (`disconnect`، `sync`، `rescan`، `render` حيث كانت عامة) تبقى في IIFE فقط كـaliases deprecated حتى `1.0`، وتُذكر في `CHANGELOG.md`. لا تُصدَّر من ESM. |
| R-D11 | C08: يُحذف فعل `save-local` وحالة `local-saved` من C08 كليًا (Online-only). أي `phase: 'local-saved'` يمرره المستهلك يُعامل `uncertain`. قيمة `connection: 'local'` تبقى قيمة اتصال وتمنع الإرسال كما هي. |
| R-D12 | مرجع البوابة البصرية: **يُولَّد آليًا من git ref** (الافتراضي الوسم `v0.1.0`) داخل worktree مؤقت. لا صور مرجعية في المستودع، ولا مسارات مطلقة. |
| R-D13 | التطابق البصري مقابل `v0.1.0`: ≤ 0.1% بكسلات مختلفة لكل صفحة. الاستثناءات المسموحة فقط: `previews/concepts/index.html` (إصلاح F7)، وصفحات `previews/product-context/*` ومعرض/`standalone` **في مواضع C08 فقط** (إزالة save-local). كل استثناء يُسجَّل في `tools/baselines/visual-allowlist.json` بالسبب، ولا يُضاف غيرها. |
| R-D14 | ملف CI: المنفّذ يحدّث `tools/ci/ci.yml` فقط. نقله إلى `.github/workflows/` يتم من المالك أو مساعده بعد الجولة. |
| R-D15 | لا تغيير في الشكل أو النصوص الظاهرة أو السلوك المرئي إلا ما تنص عليه R-D11 وF7. إعادة الهيكلة صامتة بصريًا. |

## 3. قواعد عدم التوقف

1. **فحص فشل:** أصلح السبب وأعد التشغيل. ممنوع تخطي فحص أو إضعافه أو حذف حالة منه لتمريره. حذف حالة مسموح فقط إذا حُذف موضوعها (مثل `save-local`)، مع ذكرها في التقرير.
2. **تعارض مع ثوابت `AGENTS.md`:** لا تنفذ البند، سجّله في `docs/DECISIONS.md` تحت «مؤجل — يحتاج قرار المالك»، وتابع.
3. **غموض:** اختر الحل الأبسط المتوافق مع العقود الحالية، وسجّله في `docs/DECISIONS.md` (التاريخ، البند، الافتراض، السبب).
4. **فشل push أو شبكة:** أعد المحاولة حتى 4 مرات بفواصل 2، 4، 8، 16 ثانية. إن استمر، تابع محليًا بـcommit لكل مرحلة وأعد الرفع لاحقًا.
5. **رفض دفع ملف بسبب الصلاحيات** (مثل `.github/workflows`): لا تحاول التحايل؛ طبّق R-D14.
6. **إعادة تدوير البيئة:** إن تغيرت صلاحيات الملفات أو إصدار المتصفح محليًا، أصلحها ولا تعمل commit لتغييرات الصلاحيات (`git config core.fileMode false` مقبول محليًا).
7. التوقف الوحيد المسموح: بعد إنهاء R9.

## 4. البوابات

بعد كل مرحلة:

```bash
uv sync
npm ci
uv run python tools/check-all.py
git diff --check
```

- خط الأساس عند `v0.1.0` (من تشغيل المراجعة المستقل): static 416، link-check 147 ملفًا/0 مكسور، audit 67، product-context 306، light-release 35، mobile-experience 126، light-calendar 164، light-data 185، component-consumption 37، integration-boundaries 77، clone-lifecycle 31، api-lifecycle 58، numeric-geometry 51، ui-system-showcase 126، preview-runtime 112، catalog 14/8/14.
- **لا يُقبل انخفاض أي عدد** إلا بحذف حالة موضوعها محذوف، مع ذكرها بالاسم في التقرير. الزيادة متوقعة بسبب الفحوص الجديدة.
- كل البوابات يجب أن تعمل على **نسخة نظيفة جديدة** (`git clone` ثم `uv sync && npm ci && uv run python tools/check-all.py`) دون أي ملف أو مسار خارج المستودع.

## 5. التقرير

ملف واحد: `docs/plans/integration-readiness-round2-2026-11-22/REPORT.md`. بعد كل مرحلة: ما نُفذ، الملفات الأساسية، hash الـcommit، أرقام البوابات، الافتراضات، المؤجلات، وجدول بنود القبول لكل مرحلة بعمود «محقق / غير محقق» مع الدليل (أمر الفحص ونتيجته). لا لقطات أو مخرجات ثقيلة داخل المستودع.

---

## R0 — تجهيز

1. `git fetch --unshallow` إن لزم، `git fetch --tags`، ثم `git checkout feature/integration-readiness-2026-11-21 && git pull --ff-only`.
2. تأكد أن `HEAD` يحتوي `v0.1.0` (`git merge-base --is-ancestor v0.1.0 HEAD`).
3. أنشئ `docs/plans/integration-readiness-round2-2026-11-22/REPORT.md` بجدول F1–F10 وعمود الحالة.
4. شغّل `check-all` وسجّل أرقام الأساس (البوابة البصرية ستفشل بسبب F6؛ هذا متوقع ويُصلح في R1).

**القبول:** التقرير موجود بأرقام الأساس، والفرع متزامن مع البعيد.

## R1 — بوابات قابلة للتشغيل في أي مكان (F6، F7، F9)

1. **`tools/visual-regression-check.py`:**
   - أزل `BASELINE_ROOT` والمسار `/home/z/...` من الكود والتوثيق (`tools/check-all.py` السطر 17، `docs/TESTING.md`).
   - أضف `--baseline-ref <git-ref>` (الافتراضي `v0.1.0`). السلوك: `git worktree add` مؤقت عند الـref ← تشغيل خادم معاينة من الـworktree على منفذ حر ← التقاط اللقطات بنفس `tools/visual-baseline-capture.py` **الحالي** (لا نسخة الـref) ← مقارنة بالالتقاط الحالي ← حذف الـworktree دائمًا (حتى عند الفشل).
   - إن احتاجت نسخة الـref بناءً (لا تحتاج عند `v0.1.0` لأن `dist/` متتبع فيها)، اجعل الأداة تشغّل `node tools/build-package.mjs` داخل الـworktree عند وجود `package.json` وغياب `dist/`.
   - أبقِ `--baseline <dir>` اختياريًا لمرجع جاهز.
   - `tools/visual-baseline-capture.py` يقبل `--root <dir>` (جذر الشجرة المراد تصويرها) و`--base-url` صريحًا، كي يُستخدم السكربت الحالي نفسه لتصوير الـworktree.
   - `tools/baselines/visual-allowlist.json`: قائمة صفحات مسموح اختلافها مع `reason` و`decision` (رقم القرار في DECISIONS). الصفحة المدرجة تُبلَّغ «اختلاف مسموح» ولا تُفشل البوابة، **لكن** فرق المقاس أو فرق > 15% يُفشلها دائمًا. ابدأ بالقائمة فارغة؛ تضاف المداخل في R1 (concepts) وR6 (C08) فقط.
2. **F7:** في `previews/concepts/index.html` أعد الروابط الثلاث كروابط حقيقية لملفات موجودة: «دليل التعديل» ← `../../docs/API.md`، «تقرير الفحص» ← `../../docs/TESTING.md`، «تعليمات حزمة المصدر القابل للتعديل» ← `../../docs/GETTING-STARTED.md`. أضف الصفحة إلى allowlist بالسبب. أضف حالة صريحة في `tools/preview-runtime-check.py` تتأكد أن footer صفحة concepts يحتوي 4 روابط `<a href>` تشير إلى ملفات موجودة.
3. **F9:**
   - `tools/ui-system-showcase-check.py` و`tools/preview-runtime-check.py` وأي أداة أخرى تكتب في `ROOT / "generated-artifacts"`: الافتراضي يصبح مجلدًا مؤقتًا (`tempfile.mkdtemp`) أو `--out`. ابحث بـ`grep -rn "generated-artifacts" tools` حتى صفر نتائج خارج التوثيق.
   - `tools/manifest-build.py` و`tools/preview-server.py`: احذف من `PUBLIC_DIRS` المجلدات غير الموجودة (`reviews`، `prompts`، `handoff`). أضف فحصًا في `manifest-build --check` يفشل إذا ذُكر في `PUBLIC_DIRS` مجلد غير موجود.
4. `check-all`: شغّل `visual-regression` بالافتراضي الجديد (`--baseline-ref v0.1.0`)، وأبقِ `--skip-visual` خيارًا يدويًا فقط **لا يستخدمه CI**.

**القبول:**
- على نسخة نظيفة: `uv run python tools/visual-regression-check.py --out $(mktemp -d)` يعمل دون أي ملف خارجي، ويقارن ≥ 57 صفحة، وينجح.
- `grep -rn "/home/z" .` (باستثناء `.git`) = صفر نتائج.
- `grep -rn "generated-artifacts" tools/*.py` = صفر نتائج.
- footer صفحة concepts فيه روابط عاملة، و`git status` نظيف بعد `check-all`.

## R2 — مصدر واحد بصيغة ES modules وبناء جديد (F1 جزئيًا، F5، F10)

### R2.1 تحويل المصدر

حوّل كل ملفات السلوك التالية (27 ملفًا) إلى ES modules، **في مكانها** (نفس المسار والاسم):

```
shared/icons.js
components/access-gateway/access-gateway.js
components/account-settings/account-settings.js
components/buttons/buttons.js
components/carousel/carousel.js
components/compositions/reading-context.js
components/data/data.js
components/data/packed-circle.js
components/fields/fields.js
components/info-strip/info-strip.js
components/info-strip/info-strip-peek.js
components/messages/messages.js
components/metric-comparison/metric-comparison.js
components/navigation/navigation.js
components/navigation/action-sheet.js
components/order-schedule/order-schedule.js
components/organization/organization.js
components/selection/selection.js
components/selection/picker.js
components/product-context/product-core.js
components/product-context/context.js
components/product-context/operation.js
components/product-context/market.js
components/product-context/delivery.js
components/product-context/assistant.js
components/product-context/review.js
components/product-context/manage.js
```

وملفات `components/*/labels.js` الثلاثة عشر (تُعالج مفاتيحها في R5، لكن صيغتها تتحول هنا).

قواعد التحويل:
1. أزل غلاف `(function(){ ... })()` و`'use strict'` (الوحدات strict تلقائيًا).
2. صدّر API العامة بـnamed exports، مثل: `export function init(root, options) {…}`، `export function destroy(root) {…}`، و`export function setLabels(partial) {…}`، وأي دوال عامة موثقة حاليًا في `docs/API.md` (مثل `setLoading` في Buttons، `goTo/next/prev/getIndex` في Carousel وPeek، `setOptions` في Picker، `mount/replace/resolve` في MicroProduct). لا `export default`.
3. **لا وصول إلى `window` أو `document` في المستوى الأعلى للوحدة.** أي تهيئة كسولة تتم داخل الدوال.
4. **أزل التهيئة التلقائية** (`DOMContentLoaded`/`readyState`) وكتل `MicroConfig.autoInit` من المصدر؛ تنتقل إلى مدخلات IIFE (R2.2).
5. الاعتماديات بين الملفات بـ`import` نسبي صريح: مثل `product-context/*.js` تستورد من `./product-core.js`؛ أي ملف يستخدم الأيقونات يستورد من `../../shared/icons.js`؛ كل عائلة تستورد نصوصها من `./labels.js`.
6. سجل النصوص المشترك `window.MicroLabels` يُستبدل بوحدة `shared/labels.js` تصدّر `registerLabels(family, defaults)`، `getLabel(family, key, vars?)`، `setLabels(family, partial)`، `setLocale(locale)`، و`formatNumber`/`plural` المستخدمة حاليًا. السلوك الحالي (أرقام لاتينية `ar-u-nu-latn` افتراضيًا، صيغ الجمع) يبقى حرفيًا.
7. **F10:** ملفات `components/product-context/*.js` تُعاد كتابتها بتنسيق مقروء (سطر لكل تعليمة، مسافات بادئة متسقة، أسماء دوال ومتغيرات واضحة بدل `n`، `c`، `L`، `m` حيث يمكن دون تغيير السلوك). الرأس التوثيقي العربي لكل ملف يبقى.
8. لا تغيير في أي سلوك أو DOM ناتج أو نص ظاهر أو ترتيب أحداث. التحويل صامت.

### R2.2 البناء (`tools/build-package.mjs`)

أعد كتابة البناء ليُنتج من المصدر مباشرة (بلا `src/`):

```
dist/
  esm/<family>.js            ← esbuild format=esm, bundle=true لكل نقطة دخول عائلة (انظر الجدول)، target es2019، بلا تصغير
  esm/shared/labels.js        ← (أو مضمّن في bundles؛ اختر واحدًا ووثّقه — التوصية: bundle لكل عائلة مع splitting=true لمشاركة shared/*)
  iife/<family>.js           ← من مدخل مولّد: import * as api from 'components/<family>/…'; window.MicroX = {...api, aliases}; auto-init مع احترام MicroConfig.autoInit و data-micro-manual
  iife/micro-ui.js           ← كل العائلات في ملف واحد
  css/<family>.css           ← نسخ بايت-ببايت كما الآن (لا معالجة CSS)
  css/micro-ui.css           ← fonts + tokens + motion
  css/styles.css             ← micro-ui.css + كل CSS العائلات بالترتيب الموثق في docs/GETTING-STARTED.md
  types/<family>.d.ts        ← من R3
  assets/ fonts/ icons/ brand/ ← كما الآن لحل url() النسبية
  MANIFEST.json
```

نقاط الدخول (اسم العائلة في الحزمة ← المصدر ← اسم IIFE):

| مدخل الحزمة | المصدر | Global في IIFE |
|---|---|---|
| `buttons` | `components/buttons/buttons.js` | `MicroButtons` |
| `fields` | `components/fields/fields.js` | `MicroFields` |
| `selection` | `components/selection/selection.js` | `MicroSelection` |
| `picker` | `components/selection/picker.js` | `MicroPicker` |
| `organization` | `components/organization/organization.js` | `MicroOrganization` |
| `data` | `components/data/data.js` | `MicroData` |
| `packed-circle` | `components/data/packed-circle.js` | `MicroPacked` |
| `messages` | `components/messages/messages.js` | `MicroMessages` |
| `navigation` | `components/navigation/navigation.js` | `MicroNavigation` |
| `action-sheet` | `components/navigation/action-sheet.js` | `MicroActionSheet` |
| `info-strip` | `components/info-strip/info-strip.js` | `MicroInfoStrip` |
| `info-strip-peek` | `components/info-strip/info-strip-peek.js` | `MicroInfoPeek` |
| `metric-comparison` | `components/metric-comparison/metric-comparison.js` | `MicroMetricComparison` |
| `account-settings` | `components/account-settings/account-settings.js` | `MicroAccountSettings` |
| `access-gateway` | `components/access-gateway/access-gateway.js` | `MicroAccessGateway` |
| `carousel` | `components/carousel/carousel.js` | `MicroCarousel` |
| `order-schedule` | `components/order-schedule/order-schedule.js` | `MicroOrderSchedule` |
| `readings` | `components/compositions/reading-context.js` | `MicroReadings` |
| `product` | `components/product-context/*.js` (مدخل يجمع core وكل renderers) | `MicroProduct` |
| `icons` | `shared/icons.js` | `MicroIcons` |
| `labels` | `shared/labels.js` | `MicroLabels` |

- مدخلات IIFE تُولَّد داخل البناء في مجلد مؤقت أو `tools/package/iife-entries/` (متتبعة إن كانت يدوية، مولدة إن لم تكن — اختر ووثّق؛ الأهم ألا يتكرر منطق المكون).
- البناء حتمي: نفس الدخل ← نفس البايتات.
- `node tools/build-package.mjs --check`: يبني في مجلد مؤقت ويتحقق من: نجاح البناء، كل نقطة دخول موجودة، كل ملف ESM فيه exports متوقعة، صفر وصول `window` في المستوى الأعلى (اختبار import تحت Node بلا DOM — انظر R3)، وأن `standalone.html` مبني من نفس المخرجات. **لا** يقارن بـ`dist/` متتبع (لم يعد متتبعًا).

### R2.3 حذف النسخ المكررة وتحديث المستهلكين

1. `git rm -r src dist`. أضف `/dist/` إلى `.gitignore`. احذف من `tools/build-package.mjs` كل منطق «مرايا src».
2. `package.json`:
   ```json
   {
     "name": "@micro/ui",
     "version": "0.2.0",
     "private": true,
     "type": "module",
     "engines": { "node": ">=20" },
     "files": ["dist/", "README.md", "CHANGELOG.md"],
     "sideEffects": ["**/*.css", "./dist/iife/**"],
     "scripts": {
       "build": "node tools/build-package.mjs",
       "check": "node tools/build-package.mjs --check",
       "prepare": "node tools/build-package.mjs",
       "typecheck": "tsc -p tools/package/tsconfig.json --noEmit"
     },
     "exports": {
       "./<family>": { "types": "./dist/types/<family>.d.ts", "import": "./dist/esm/<family>.js" },
       "./<family>.css": "./dist/css/<family>.css",
       "./styles.css": "./dist/css/styles.css",
       "./micro-ui.css": "./dist/css/micro-ui.css",
       "./iife/*": "./dist/iife/*",
       "./assets/*": "./dist/assets/*",
       "./package.json": "./package.json"
     },
     "devDependencies": { "esbuild": "…", "typescript": "…" }
   }
   ```
   (اكتب مدخلًا صريحًا لكل عائلة في جدول R2.2 بدل `<family>`؛ لا wildcards في مدخلات JS.) ملاحظة: `prepare` يحتاج أن يعمل `tools/build-package.mjs` من حزمة مثبتة من git؛ تأكد أن `files` لا يمنع ذلك (npm يشغّل prepare في نسخة git الكاملة قبل التحزيم).
3. **المستهلكون داخل المستودع:** كل `<script src="…components/…/*.js">` و`…/labels.js` و`…/shared/icons.js` في `previews/**/*.html`، `components/*/*.html`، `examples/**`، وأي fixture داخل `tools/*.py` (مثل light-calendar، light-release، light-data، component-consumption، clone-lifecycle، integration-boundaries، api-lifecycle، product-context، mobile-experience) يتحول إلى `dist/iife/<family>.js` (مسار نسبي صحيح)، مع إبقاء ترتيب التحميل. ملفات labels لم تعد تُحمَّل منفصلة (مضمنة في IIFE).
4. `tools/preview-server.py`: عند البدء يشغّل `node tools/build-package.mjs` إن كان `dist/` غائبًا أو أقدم من أي ملف مصدر (مقارنة mtime)، ويطبع ذلك. احذف `src` من `PUBLIC_DIRS` وأضف `dist`.
5. `tools/check-all.py`: أول خطوة `node tools/build-package.mjs` (بناء فعلي)، ثم البوابات.
6. `tools/build-ui-system-showcase-standalone.py`: يضمّن JS من `dist/iife/` بدل `components/`. `--check` يبني ثم يقارن. `standalone.html` يبقى متتبعًا.
7. `tools/manifest-build.py`: احذف `src` و`dist` من `PUBLIC_DIRS`؛ أعد بناء `MANIFEST.json`.
8. `tools/hardcoded-text-check.py`: حدّثه للبنية الجديدة (النصوص فقط في `components/*/labels.js`؛ لا ملفات labels تُحمَّل في الصفحات بعد الآن — احذف فحص «الاقتران» القديم واستبدله بفحص أن كل عائلة تستورد `./labels.js`).
9. `docs/GETTING-STARTED.md`، `docs/API.md`، `README.md`، `AGENTS.md` (قسم مصادر الحقيقة)، `docs/TESTING.md`: حدّث الوصف (المصدر ESM، IIFE مولدة، لا `src/`، البناء قبل المعاينة).

**القبول:**
- `git ls-files src dist | wc -l` = 0.
- `grep -rln "^\s*(function\s*()" components shared --include=*.js` = صفر (لا أغلفة IIFE في المصدر).
- `grep -rn "DOMContentLoaded\|readyState\|MicroConfig" components shared --include=*.js` = صفر.
- `grep -rn "window\.\(Micro\|MicroLabels\)" components shared --include=*.js` = صفر.
- كل `components/*/*.js` و`shared/*.js` فيها `export` واحد على الأقل.
- كل البوابات ناجحة بأعداد ≥ الأساس، و`visual-regression` ناجحة مقابل `v0.1.0` (allowlist: concepts فقط حتى الآن).
- `standalone --check` ناجح، و`git status` نظيف بعد `check-all`.

## R3 — الحزمة قابلة للاستيراد فعلًا (F1)

1. **الأنواع:** لكل مدخل في جدول R2.2 ملف `tools/package/types/<family>.d.ts` مكتوب يدويًا (أو مولد من JSDoc — اختر ووثّق) يصف:
   - `init(root: Element | Document, options?: <Family>Options): <Family>Instance`
   - `<Family>Instance` بـ`root`، `destroy(): void`، و`update(...)` بتوقيعها الدقيق من R4.
   - كل دالة عامة أخرى مصدّرة.
   - أنواع `options` (بما فيها `labels?: Partial<<Family>Labels>`) و`<Family>Labels` بالمفاتيح الدلالية من R5.
   - أسماء الأحداث وأنواع `detail` كـ`interface <Family>EventMap` + تعريف `declare global { interface HTMLElementEventMap {...} }`.
   - `tools/package/types/iife.d.ts` يصف `window.Micro*` (بديل `micro-ui.d.ts` الحالي).
2. `tools/package/tsconfig.json` و`tools/package/types-test.ts`: ملف اختبار يستورد كل مدخل من `@micro/ui/<family>` (عبر `paths` أو اسم الحزمة بعد التثبيت المحلي)، يستدعي `init`/`update`/`destroy` وكل دالة عامة بتوقيعها الصحيح، ويستمع لحدث واحد لكل عائلة لها أحداث. `npm run typecheck` يجب أن ينجح.
3. **`tools/package-install-check.mjs`** (بوابة جديدة باسم `package-install` في `check-all`):
   1. `npm pack` في مجلد مؤقت.
   2. مشروع مؤقت (`npm init -y`، `"type": "module"`) و`npm install <tarball>`.
   3. **تحت Node بلا DOM:** `await import('@micro/ui/<family>')` لكل مدخل — يجب أن ينجح دون خطأ (يثبت عدم وجود أثر جانبي)، ويتحقق أن الصادرات المتوقعة موجودة (`init`، `destroy`، …).
   4. يتحقق أن كل ملف في `exports` موجود فعلًا في الحزمة، وأن `require.resolve`/`import.meta.resolve` يعمل لكل مدخل.
   5. يشغّل `tsc --noEmit` على `types-test.ts` ضد الحزمة المثبتة.
   6. **في المتصفح (Playwright):** صفحة داخل المشروع المؤقت بـ`<script type="importmap">` يشير إلى `node_modules/@micro/ui/dist/esm/`، تحمّل `@micro/ui/styles.css`، تستورد Buttons وFields وNavigation وData وproduct، وتستدعي `init` يدويًا: صفر أخطاء console، صفر طلبات فاشلة (خطوط وأيقونات وصور تُحمَّل من الحزمة المثبتة)، وعناصر المكونات مرسومة (مثلًا `.m-btn` موجود ومقاسه ≥ 48px).
   7. تثبيت من git: `npm install git+file://<repo-root>#HEAD` في مشروع مؤقت آخر يشغّل `prepare` ويُنتج `dist/` ويمر بنفس اختبار الاستيراد تحت Node.
4. **`examples/esm-app/`** جديد: `index.html` بـimportmap إلى `../../dist/esm/`، يبني شاشة فيها Buttons وFields وNavigation وتركيب C14، مع `init` يدوي و`destroy` عند زر «إزالة» لإثبات دورة SPA. يُضاف إلى `preview-runtime-check` وإلى `visual-regression` (صفحة جديدة بلا مرجع — مسموح).
5. `examples/vanilla-app/` يتحول لاستهلاك `dist/iife/`.
6. `docs/GETTING-STARTED.md`: ثلاثة طرق مع أمثلة كود كاملة قابلة للنسخ: (أ) bundler (`import { init } from '@micro/ui/buttons'` + `import '@micro/ui/styles.css'`)، (ب) importmap بلا bundler، (ج) IIFE بـ`<script>`. وطريقة التثبيت: `npm install github:Qays7753/micro-ui-design-system#v0.2.0`. وجدول المدخلات من R2.2.

**القبول:** `npm run typecheck` ناجح؛ بوابة `package-install` ناجحة بكل خطواتها السبع؛ `examples/esm-app` بلا أخطاء.

## R4 — عقد دورة حياة موحد (F2)

لكل مدخل JS في جدول R2.2 (عدا `icons` و`labels`):

```js
const instance = init(root, options?);   // root: Element (أو Document للتوافق)
instance.root;                             // العنصر الجذر
instance.update(arg?);                     // انظر الجدول
instance.destroy();                        // يزيل كل المستمعات والمراقبات والمؤقتات والحالة المملوكة
destroy(root);                             // export مريح: يدمر instance المرتبط بالجذر إن وجد
getInstance(root);                         // export: يعيد instance أو null
```

قواعد ملزمة:
1. `init` على جذر له instance حي يعيد **نفس** instance (WeakMap داخلي)، ويطبق `options` الجديدة إن أعطيت (أو يتجاهلها — اختر ووثّق لكل عائلة)، ولا يضاعف المستمعات.
2. `destroy()` مرتين لا يرمي خطأ. بعد `destroy` يعمل `init` من جديد.
3. إزالة الجذر من DOM دون `destroy` لا ترمي أخطاء لاحقًا (المراقبات تتحقق من `isConnected`).
4. بعد `destroy` لا يبقى أي مستمع على `window` أو `document` أو `root` أضافه المكون، ولا `MutationObserver`/`ResizeObserver`/`IntersectionObserver` حي، ولا مؤقت (`setTimeout`/`setInterval`/`requestAnimationFrame`) معلق.
5. `destroy` لا يمسح قيم المستخدم ولا يعيد HTML الأصلي إلا حيث يوثق العقد الحالي ذلك (لا تغيير سلوك).
6. الأحداث المخصصة تبقى بأسمائها وتفاصيلها الحالية (لا تغيير)، وتُوثَّق كاملة في `docs/API.md` والأنواع.

دلالة `update` لكل عائلة (تُطبق كما هي ما لم يتعارض مع السلوك الحالي؛ أي تعديل يُسجَّل):

| المدخل | `instance.update(...)` |
|---|---|
| buttons | `update({ loading?: boolean, loadingLabel?: string })` يغلف `setLoading` |
| fields | `update()` = `sync` الحالي (صامت) |
| selection | `update()` يعيد قراءة حالة المجموعات |
| picker | `update(items?)` = `setOptions` الحالي |
| organization | `update()` يعيد فحص الأقسام والصور الرمزية |
| data / packed-circle / metric-comparison | `update()` يعيد التصيير من DOM المصدر |
| messages | `update()` يعيد فحص الرسائل |
| navigation / action-sheet | `update()` يعيد ربط العناصر الجديدة تحت الجذر |
| info-strip | `update()` = `rescan` الحالي |
| info-strip-peek / carousel | `update({ index?, ...options })` = `goTo` الحالي؛ وأيضًا `instance.goTo/next/prev/getIndex` |
| account-settings | `update()` يعيد فحص اللوحات |
| access-gateway | `update(handlers)` يحدّث callbacks دون ربط مضاعف |
| order-schedule | `update(orders)` = `setData` الحالي؛ يبقى `instance.setData` |
| readings | `update()` = `sync` الحالي |
| product | العقد الموجود `mount/replace/resolve/destroy` يبقى؛ أضف `init(root, model)` و`instance.update(model)` = `replace` |

7. **Buttons:** اليوم لا `init`. أضف `init(root)` يربط حراسة التحميل لكل `.m-btn` تحت الجذر؛ `setLoading(button, flag, opts)` يبقى export مستقلًا.
8. **`tools/api-lifecycle-check.py`:** وسّعه ليغطي **كل** المدخلات في الجدول وكل القواعد 1–5 أعلاه عبر ESM (صفحة اختبار تستورد من `dist/esm`)، بتغليف `addEventListener/removeEventListener` على `window` و`document` وكل العناصر، وتغليف المراقبات والمؤقتات وعدّها. سيناريو لكل مدخل: init → init مكرر (نفس instance) → update → destroy → destroy مكرر → فحص صفر متبقيات → init من جديد → إزالة الجذر بلا destroy → انتظار إطارين → صفر أخطاء. ويجب أن يتحقق أيضًا أن `window.Micro*` في IIFE تعرض نفس الدوال + الـaliases (R-D10).

**القبول:** `api-lifecycle` ينجح لكل المدخلات الـ19 (عدا icons/labels) بكل الخطوات؛ الأنواع تطابق التنفيذ (`typecheck` ناجح)؛ `docs/API.md` فيه قسم لكل مدخل بنفس البنية: init/options/instance/update/events/destroy/مثال.

## R5 — نصوص بمفاتيح دلالية وتخصيص كامل (F3)

1. أعد تسمية **كل** مفاتيح النصوص في الملفات الثلاثة عشر `components/*/labels.js` من `kNNN` إلى أسماء دلالية بصيغة `camelCase` مجمعة بنقاط حسب الموضع، مثل:
   - `operation.title`، `operation.referencePrefix`، `operation.actions.recheck`، `operation.actions.retry`
   - `schedule.weekdays.full` (مصفوفة)، `schedule.weekdays.short`، `schedule.orders.count` (صيغ جمع: `{ zero, one, two, few, many, other }`)
   - `carousel.next`، `carousel.prev`، `carousel.position` (مع متغيرات `{index}`/`{count}`)
   القاعدة: من يقرأ المفتاح يعرف أين يظهر النص دون فتح الكود.
2. حدّث كل الاستدعاءات في ملفات السلوك. المتغيرات داخل النص بصيغة `{name}` موحدة.
3. **التخصيص في كل مدخل:** `init(root, { labels })` يدمج جزئيًا لهذا instance فقط، و`setLabels(partial)` export عام يغير الافتراضي لكل النسخ. **يشمل Carousel وPicker** (المؤجل في الجولة الأولى). `setLocale(locale)` في `labels` يبقى للأرقام.
4. ولّد من ملفات النصوص `docs/LABELS.md` (أداة `tools/labels-doc-build.py` بوضع `--check` داخل `check-all`): جدول لكل عائلة: المفتاح، النص الافتراضي، المتغيرات، أين يظهر. ويُولَّد منه أيضًا نوع `<Family>Labels` في الأنواع (أو يُتحقق من التطابق).
5. `tools/hardcoded-text-check.py`: أضف فشلًا عند وجود أي مفتاح يطابق `^k\d+$`، وعند مفتاح مستخدم في الكود غير موجود في labels، أو مفتاح في labels غير مستخدم.
6. اختبار في `api-lifecycle` أو بوابة جديدة `labels-override`: لكل مدخل له نصوص، `init` بـlabels بديلة لمفتاحين على الأقل يغيّر النص الظاهر فعلًا، ونسخة ثانية بلا labels تبقى بالافتراضي (عزل النسخ)، و`setLabels` يغيّر الافتراضي.
7. النصوص الافتراضية تبقى **حرفيًا** كما هي (R-D15)؛ `visual-regression` يثبت ذلك.

**القبول:** صفر مفاتيح `kNNN`؛ `docs/LABELS.md` مولد ومطابق؛ `labels-override` ناجح لكل المدخلات؛ `visual-regression` ناجحة.

## R6 — Manage بلا حفظ محلي (F4)

1. `components/product-context/operation.js`: احذف فعل `save-local` ونصه والخيار `{local:true}` المرتبط، واحذف مسار `local-saved` في العرض. أي `phase: 'local-saved'` يُعامل `uncertain` (نفس معاملة الحالة غير المعروفة اليوم).
2. `components/product-context/product-core.js` وأي ملف آخر يذكر `local-saved` أو `save-local`: أزل المنطق المرتبط بهما فقط.
3. `components/product-context/specification.md`: حدّث الأسطر التي تذكر الحفظ المحلي (حاليًا 8، 47، 49، 74) لتقول: C08 Online-only؛ لا `save-local` ولا `local-saved`؛ `connection: local` يمنع الإرسال كما هو.
4. `docs/COMPOSITIONS.md`، `docs/API.md`، الأنواع، `previews/product-context/lab.js` وبيانات المختبر: أزل أي حالة أو زر يعرض الحفظ المحلي، واستبدل حالة المختبر المقابلة بحالة `uncertain` أو `offline` موجودة.
5. `tools/product-context-check.py`: احذف الحالات التي تختبر `save-local`/`local-saved` كنجاح (اذكرها بالاسم في التقرير)، وأضف حالات: (أ) لا يظهر أي زر حفظ محلي في أي `destination`، (ب) `phase: 'local-saved'` يُعرض كـ`uncertain` بلا ادعاء نجاح، (ج) `connection: 'offline'` و`'local'` يعطلان الإرسال في C08 وC14.
6. أضف إلى `tools/baselines/visual-allowlist.json` الصفحات التي يتغير فيها مشهد C08 فقط، مع السبب ورقم القرار. لا تضف صفحة لم يتغير فيها C08.
7. `docs/DECISIONS.md`: سجّل القرار R-D11 والسبب.

**القبول:** `grep -rn "save-local\|local-saved\|حفظ محلي" components previews docs` = صفر نتائج إلا في `DECISIONS.md` و`CHANGELOG.md`؛ product-context ناجح؛ visual ناجح مع allowlist محدودة بالصفحات المتأثرة.

## R7 — CI جاهز للتركيب (F8)

1. حدّث `tools/ci/ci.yml`:
   - `on: push` و`pull_request`.
   - `actions/checkout` بـ`fetch-depth: 0` و`fetch-tags: true` (للبوابة البصرية والمقارنة مع `origin/main`).
   - Node 20 (`actions/setup-node` مع cache npm)، `npm ci`.
   - Python عبر `astral-sh/setup-uv`، `uv sync`.
   - تثبيت Chromium لـPlaywright (`uv run playwright install --with-deps chromium`).
   - `uv run python tools/check-all.py` **دون** `--skip-visual`.
   - `npm run typecheck`.
   - رفع مخرجات الفحص عند الفشل كـartifact (مجلد `--out` المؤقت).
2. `tools/ci/README.md`: خطوة نقل الملف إلى `.github/workflows/ci.yml` (أمر واحد)، والصلاحية المطلوبة (`workflow` scope).
3. تحقق محليًا من صحة YAML (مثلًا `python -c "import yaml; yaml.safe_load(open('tools/ci/ci.yml'))"` إن توفرت PyYAML، أو أي مدقق متاح) وسجّل النتيجة.
4. **لا تحاول دفع `.github/workflows/`** (R-D14).

**القبول:** الملف محدث وصالح، وكل أوامره تعمل محليًا بنفس الترتيب على نسخة نظيفة.

## R8 — توثيق وإصدار 0.2.0

1. `CHANGELOG.md` قسم `0.2.0` بعناوين: Breaking (ESM مصدر، dist غير متتبع، مسارات IIFE الجديدة، مفاتيح النصوص، حذف save-local، حذف src/)، Added (ESM، الأنواع، lifecycle الموحد، labels لكل المدخلات، esm-app، package-install، visual من git ref)، Fixed (روابط concepts، فحوص تكتب داخل المستودع)، Deprecated (aliases في IIFE).
2. `docs/API.md`: قسم لكل مدخل بالبنية الموحدة من R4، وروابط إلى `docs/LABELS.md` والأنواع.
3. `docs/GETTING-STARTED.md`: كما في R3.6، مع ترتيب CSS الإلزامي وملاحظة أن الخطوط والأيقونات تُحمَّل نسبيًا من الحزمة.
4. `docs/STATUS.md`: الإصدار 0.2.0، النضج من الكتالوج (بلا ترقية)، ما لم يُختبر (Safari/WebKit، الأجهزة الفعلية بينها Samsung Galaxy S25/Chrome، اللمس الحقيقي، قارئات الشاشة، safe areas، native zoom، forced-colors، أُطر محددة مثل React/Vue)، والمؤجلات.
5. `README.md`: تحديث قسم التثبيت والمدخلات بإيجاز.
6. `AGENTS.md`: حدّث «مصادر الحقيقة» (المصدر ESM، `dist/` مبني وغير متتبع) و«البوابات» (`npm ci` + `check-all` + `typecheck`). **لا** تغيّر الثوابت. قسم «التفويض الحالي» يبقى يشير إلى هذه الخطة.
7. `package.json` بالإصدار `0.2.0`.

**القبول:** كل الروابط سليمة (`link-check`)، وكل أمثلة الكود في GETTING-STARTED منسوخة من `examples/` العاملة أو مطابقة لها.

## R9 — التحقق النهائي والتسليم

1. **نسخة نظيفة تمامًا:** `git clone` جديد في مجلد مؤقت ← `uv sync && npm ci && uv run python tools/check-all.py && npm run typecheck` ← كلها ناجحة، و`git status` نظيف بعدها. سجّل المخرجات المختصرة في التقرير.
2. `visual-regression` مقابل `v0.1.0`: ناجحة، مع جدول الصفحات المسموح اختلافها وسببها (يجب أن تكون concepts وصفحات C08 فقط).
3. صفر أخطاء JavaScript أو موارد مفقودة في كل صفحات `previews/` و`components/*/*.html` و`examples/**`.
4. أعد ملء جدول F1–F10 في التقرير: لكل بند «مغلق» مع الدليل (أمر + نتيجة)، أو «غير مغلق» مع السبب. **لا تكتب «مغلق» بلا دليل.**
5. وسم `v0.2.0` على آخر commit وادفعه (`git push origin v0.2.0`). لا تحرك أو تحذف `v0.1.0`.
6. قسم ختامي في التقرير: ما يبقى على المالك — نقل `tools/ci/ci.yml` إلى `.github/workflows/`، الاعتماد البصري، اختبار Samsung Galaxy S25/Chrome، قرار رفع النضج، اختيار إطار التطبيق، الدمج إلى `main`، وحذف الفروع القديمة (`ccr-1bbe1186-fys05f`، `review/component-readiness-20261117`، `feature/google-only-access-gateway-2026-11-18`).
7. لا PR ولا دمج. انتهِ هنا.
