# تقرير الجولة الثانية — إكمال جاهزية الربط @micro/ui 0.2.0

هذا التقرير يُحدَّث بعد كل مرحلة R0–R9 وفق `PLAN.md` (القسم 5). الحقيقة حرفيًا: لا يُعلن بند مغلق إلا بدليل (أمر + نتيجة). البوابات بعد كل مرحلة: `uv sync && npm ci && uv run python tools/check-all.py && git diff --check`.

## جدول F1–F10 (يُملأ عند الإغلاق الفعلي)

| # | المشكلة | المرحلة | الحالة | الدليل |
|---|---|---|---|---|
| F1 | لا ES modules ولا أنواع لكل عائلة | R2، R3 | **مغلق (R2+R3)** | R2: `dist/esm/<entry>.js` للمداخل الـ21 مع صادرات متحققة وبلا أثر جانبي (`node tools/build-package.mjs --check` → OK). R3: `tools/package/types/<entry>.d.ts` لكل مدخل (+`iife.d.ts`) تُنسخ إلى `dist/types/`؛ `npm run typecheck` ناجح؛ بوابة `package-install` تثبت الحزمة فعلًا (tarball وgit عبر prepare) وتستوردها تحت Node وبالمتصفح — OK بكل خطواتها السبع |
| F2 | لا instance بـdestroy() إلا Order Schedule وMicroProduct | R4 | مفتوح | — |
| F3 | مفاتيح نصوص بلا معنى (kNNN) وCarousel/Picker بلا options.labels | R5 | مفتوح | — |
| F4 | C08 يعرض save-local وlocal-saved خلافًا لOnline-only | R6 | مفتوح | — |
| F5 | ثلاث نسخ متتبعة (components/ وsrc/ وdist/) | R2 | **مغلق (R2)** | `git ls-files src dist | wc -l` = 0؛ `/dist/` في .gitignore؛ البناء حتمي (hash MANIFEST ثابت عبر 3 تشغيلات) |
| F6 | البوابة البصرية مربوطة بمسار مطلق خارج المستودع | R1 | **مغلق (R1)** | `git grep -n "/home/z"` لا يُرجع سوى سطر وصف F6 في ملف الخطة نفسه (وثيقة المالك)؛ المرجع يُولَّد من `--baseline-ref v0.1.0` في worktree مؤقت: `uv run python tools/visual-regression-check.py --out /tmp/micro-vr-r1` → compared 62 / passed 61 / allowed 1 / failed 0 |
| F7 | روابط footer في concepts أصبحت نصًا | R1 | **مغلق (R1)** | footer فيه 4 روابط `<a href>` حية (API.md وTESTING.md وGETTING-STARTED.md ومواصفة info-strip)؛ بوابة preview-runtime: 114/114 (حالتا concepts-footer جديدتان)؛ الارتفاع حُفظ 2335px والفرص 0.1455% مسموح (R-D13) |
| F8 | CI غير مفعّل (الملف في tools/ci) | R7 | مفتوح | — |
| F9 | فحوص تكتب داخل المستودع + قوائم مجلدات قديمة | R1 | **مغلق (R1)** | `grep -rn "generated-artifacts" tools/*.py` = صفر؛ `manifest-build --check` يرفض أي مجلد في PUBLIC_DIRS غير موجود (reviews/prompts/handoff حُذفت من القائمتين)؛ `git status` نظيف بعد check-all |
| F10 | ملفات product-context JS مضغوطة غير مقروءة | R2 | **مغلق (R2)** | الملفات الثمانية أعيدت كتابتها: سطر لكل تعليمة، أسماء واضحة (model/node/root/ctx)، كل وحدة تصدّر type وrender |

## R0 — التجهيز

**ما نُفذ (2026-11-22):**

1. المزامنة: `git fetch --tags` ثم `git checkout feature/integration-readiness-2026-11-21 && git pull --ff-only` — الرأس `d757c84` (خطة الجولة الثانية)، متطابق مع البعيد.
2. النسب: `git merge-base --is-ancestor v0.1.0 HEAD` → نجح (exit 0). المستودع كامل غير shallow (`git rev-parse --is-shallow-repository` → false).
3. هذا التقرير أُنشئ بجدول F1–F10.
4. أرقام الأساس من `uv sync && npm ci && uv run python tools/check-all.py`:

| البوابة | العدد |
|---|---|
| standalone | مطابق بايت-ببايت |
| catalog | 14 عائلة / 8 متغيرات / 14 تراكيب |
| manifest | 1062 مدخلًا |
| package | src mirrors + dist متطابقة مع بناء حتمي |
| static | 417/417 |
| link-check | 148 ملفًا / 0 مكسور |
| hardcoded-text | PASS |
| audit | 67/67 |
| product-context | 306/306 |
| light-release | 35/35 |
| mobile-experience | 126/126 |
| light-calendar | 164/164 |
| light-data | 185/185 |
| component-consumption | 37/37 |
| integration-boundaries | 77/77 |
| clone-lifecycle | 31/31 |
| api-lifecycle | 58/58 |
| numeric-geometry | 51/51 |
| ui-system-showcase | 126/126 |
| preview-runtime | 112/112 |
| visual-regression | OK (محليًا — مرجع pre-phase9 موجود خارج الشجرة) |
| git-diff-check | نظيف |

**إجمالي:** 22 بوابة / 22 ناجحة / 0 فاشلة.

**ملاحظات على الأساس مقابل خط الأساس في الخطة (قسم 4):** أرقام الخطة سُجلت عند `v0.1.0` (static 416، link-check 147، manifest 1061)؛ الرأس الحالي `d757c84` يضيف `docs/plans/integration-readiness-round2-2026-11-22/PLAN.md` (ملف md متتبع جديد) فصار static 417 وlink-check 148 وmanifest 1062. لا انخفاض في أي عدد.

**سلوك البوابة البصرية في الأساس:** نجحت محليًا لأن مجلد مرجع خارج الشجرة (بمسار مطلق خاص بجهاز المنفّذ) موجود محليًا؛ هذا نفسه عيب F6: على أي نسخة نظيفة دون هذا المجلد تُفشل البوابة. يُصلح في R1.

**Commit:** `f516ad2`

## R1 — بوابات قابلة للتشغيل في أي مكان (F6، F7، F9)

**ما نُفذ (2026-11-22):**

1. **F6 — `tools/visual-regression-check.py` أُعيد كتابته:** لا `BASELINE_ROOT` ولا مسار آلة؛ المرجع يُولَّد من git ref عبر `--baseline-ref` (الافتراضي `v0.1.0`) داخل worktree مؤقت (`git worktree add --detach`) يُحذف دائمًا في `finally` حتى عند الفشل؛ إن كانت نسخة الـref تحتاج بناءً (يوجد `package.json` ولا يوجد `dist/`) تشغّل الأداة `node tools/build-package.mjs` داخل الـworktree؛ `--baseline <dir>` يبقى لمرجع جاهز. **`tools/visual-baseline-capture.py`** يقبل `--root <dir>` (شجرة تُصوَّر بخادمها الداخلي على منفذ حر) و`--base-url` صريحًا — نفس الأداة الحالية تصوّر المرجع والحالي. **`tools/baselines/visual-allowlist.json`**: صفحات مسموح اختلافها مع `reason` و`decision`؛ المدرجة تُبلَّغ «اختلاف مسموح» ولا تفشل إلا عند فرق مقاس أو > 15% (يفشلان دائمًا).
2. **F7 — روابط concepts:** النصان «تقرير الفحص» و«تعليمات حزمة المصدر القابل للتعديل» عادا رابطين حقيقيين (`../../docs/TESTING.md` و`../../docs/GETTING-STARTED.md`؛ «دليل التعديل» ← `../../docs/API.md` كان رابطًا وبقي). حُفظ ارتفاع الصفحة 2335px بتغليف الرابطين في `<span>` واحد (قرار موثق في DECISIONS)؛ الصفحة في allowlist بسبب R-D13/F7. **`tools/preview-runtime-check.py`** أُضيفت له حالتان صريحتان: footer فيه 4 روابط `<a href>` وكلها تحل إلى استجابات ناجحة.
3. **F9 — لا كتابة داخل الشجرة:** `ui-system-showcase-check.py` و`preview-runtime-check.py` تكتبان في `tempfile.mkdtemp` (أو `--out`). حُذفت `reviews` و`prompts` و`handoff` من `PUBLIC_DIRS` في `preview-server.py` و`manifest-build.py`، وأُضيف لـ`manifest-build --check` فشل عند ذكر مجلد غير موجود.
4. **check-all/توثيق:** وصف البوابة البصرية حُدّث في `tools/check-all.py` و`docs/TESTING.md` (البندان 8 و9 و10) و`tools/README.md`؛ `--skip-visual` أصبح «تشخيص يدوي فقط» وCI يشغّل البوابة؛ تعليق `tools/ci/ci.yml` حُدّث (لا مسار آلة).

**أرقام البوابات بعد R1** (`uv run python tools/check-all.py`): **22/22 ناجحة** — static 418/418 (+1: ملف allowlist الجديد يفحصه static ضمن tools)، link-check 149 ملفًا/0 مكسور (+1: visual-allowlist.json)، manifest 1064 مدخلًا (+2: allowlist وREPORT)، preview-runtime **114/114** (+2 حالتا concepts-footer)، visual-regression: compared 62 / passed 61 / allowed 1 / failed 0، وكل الأعداد الأخرى كما في الأساس (audit 67، product-context 306، light-release 35، mobile-experience 126، light-calendar 164، light-data 185، component-consumption 37، integration-boundaries 77، clone-lifecycle 31، api-lifecycle 58، numeric-geometry 51، ui-system-showcase 126). `git status` نظيف بعد التشغيل.

**بنود القبول:**

| البند | محقق | الدليل |
|---|---|---|
| visual-regression يعمل دون ملف خارجي ويقارن ≥ 57 صفحة وينجح | نعم | `--out /tmp/micro-vr-r1` → 62 مقارنة / 61 نجاح / 1 مسموح / 0 فشل؛ المرجع من worktree عند `v0.1.0` |
| `grep -rn "/home/z"` = صفر | نعم* | `git grep -n "/home/z"` يُرجع سطرًا واحدًا فقط في ملف الخطة نفسه (نص وصف العيب F6 — وثيقة المالك، لا يُعدل)؛ صفر في كل الكود والتوثيق التشغيلي |
| `grep -rn "generated-artifacts" tools/*.py` = صفر | نعم | grep exit 1 (لا نتائج) |
| footer concepts فيه روابط عاملة وgit status نظيف بعد check-all | نعم | preview-runtime 114/114؛ `git status --porcelain` = 0 |

**الافتراضات:** (موثقة في DECISIONS R1) بقاء المسار الحرفي داخل نص الخطة؛ تغليف الرابطين للحفاظ على الارتفاع.

**المؤجلات:** لا شيء جديد.

**Commit:** `b1fd854`

## R2 — مصدر واحد بصيغة ES modules وبناء جديد (F1 جزئيًا، F5، F10)

**ما نُفذ (2026-11-22):**

- **R2.1:** حُوّل كل مصدر السلوك إلى ES modules في مكانه: 18 ملفًا قياسيًا بمحوّل آلي + 13 ملف labels (وحدات بيانات `export const defaults`) + `shared/labels.js` (نواة السجل: registerLabels/getLabel/setLabels/setLocale/getLocale/formatNumber/plural/pluralCategory) + `shared/script-base.js` و`shared/integrations.js` + `shared/icons.js` (ready كسولة في ESM) + product-context كاملًا بقراءة يدوية (F10): النواة والـrenderers السبعة تصدّر type/render. لا غلاف IIFE، لا تهيئة تلقائية، لا وصول DOM في المستوى الأعلى (استيراد تحت Node ينجح للـ44 وحدة).
- **R2.2:** `tools/build-package.mjs` جديد: `dist/esm/<entry>.js` (esbuild esm+bundle+splitting، هدف es2020)، `dist/iife/<entry>.js` من مداخل مولدة (غلوبالات + تهيئة تلقائية تحترم MicroConfig وdata-micro-manual) + `dist/iife/micro-ui.js`، CSS بايت-ببايت (شجرة كاملة + ملف لكل مدخل + micro-ui.css + styles.css بترتيب موثق)، أصول وخطوط وشعار وأيقونات، MANIFEST. حتمي: نفس البايتات عبر التشغيلات. `--check`: بناء + كل مدخل موجود + صادرات ESM مطابقة + استيراد Node بلا DOM ينجح.
- **R2.3:** `git rm -r src dist` و`/dist/` في .gitignore؛ package.json 0.2.0 (type module، exports لكل المداخل، prepare يبني عند التثبيت من git، devDeps esbuild+typescript)؛ كل مستهلكي المستودع (43 صفحة HTML + fixtures بوابات light-data/light-calendar/light-release/api-lifecycle/clone-lifecycle/component-consumption/product-context/integration-boundaries) على `dist/iife/`؛ preview-server يبني تلقائيًا عند قدماء dist؛ check-all يبني أولًا؛ standalone يضمّن من dist/iife ويبني قبله؛ hardcoded-text: فحص استيراد labels في المصدر بدل اقتران الصفحات + فحص صادرات ESM مقابل الأنواع (يعمل عند توفر R3)؛ AGENTS/README/CHANGELOG/TESTING حُدثت.

**أرقام البوابات:** check-all **22/22 ناجحة** (انظر جدول DECISIONS رقم 10) — visual-regression: 62 مقارنة / 62 نجاح / صفر اختلافات مسموحة جديدة (التحويل صامت بصريًا حرفيًا: كل الصفحات ضمن 0.1% مقابل v0.1.0).

**سبب نزول static من 416 إلى 270 (طلب المالك 2026-11-22):** بوابة static تصدر فحص صياغة واحدًا لكل ملف **متتبع** (py/js/css) وفحص روابط لكل ملف md/html متغير مقابل `origin/main`. عند `v0.1.0` كانت المرآتان المكررتان `src/` (نسخة كاملة من components+shared) و`dist/` (مخرجات البناء) **متتبعتين** (عيب F5): 40+40 ملف js و30+31 ملف css وملف py واحد و11 صفحة html داخل `src/` — كلها تُفحص كأي ملف مصدر. تنفيذ R-D4 في R2 (حذف `src/` و`dist/` من التتبع) أخرجها من عدّاد البوابة:

| الفحص | عند v0.1.0 | بعد R2 | الفرق |
|---|---|---|---|
| javascript syntax | 146 | 69 | −77 (−80 ملفات المرآتين، +3 وحدات `shared/` جديدة: labels/script-base/integrations) |
| CSS balanced delimiters | 114 | 53 | −61 (−30 في src/ و−31 في dist/) |
| python compile | 30 | 29 | −1 (`src/assets/brand/micro-logo/v1/tools/export_brand.py` حُذفت مع المرآة) |
| changed active links | 109 | 102 | −7 صافيًا (−11 صفحة html من مرآة src خرجت، +4 دخلت: خطة وتقرير الجولة الثانية وصفحتا buttons المحدثتان) |
| tokens/palette/global | 4+4+9 | 4+4+9 | 0 |
| **المجموع** | **416** | **270** | **−146** |

الدليل (أُعيد إنتاج الرقمين في worktree معزول): `git worktree add --detach /tmp/wt-v010 v0.1.0` ثم `python3 tools/light-static-check.py --out /tmp/static-v010.json` → **416/416 PASS**؛ وعلى HEAD → **270/270 PASS**. لا فحص أُضعف ولا حالة حُذفت من البوابة: المصدر نفسه ما زال يُفحص مرة واحدة في `components/` و`shared/`، ومطابقة `dist/` المولدة للمصدر تُفرض الآن من بوابة package (`build --check`: بناء + صادرات + بلا أثر جانبي) بدل تكرار فحص صياغة الملفات المولّدة.

**الافتراضات:** موثقة في DECISIONS R2 (بنود 1–9).

**المؤجلات:** الأنواع لكل مدخل وبوابة package-install وexamples/esm-app (R3)؛ توثيق GETTING-STARTED الشامل بطرقه الثلاث يُستكمل في R3.6/R8.

**Commit:** `0aad2d8`

## R3 — الحزمة قابلة للاستيراد فعلًا (F1)

**ما نُفذ (2026-11-22):**

1. **الأنواع (يدويًا — قرار DECISIONS R3.1):** `tools/package/types/<entry>.d.ts` لكل مدخل من الـ21 (init/options/instance/update/destroy/getInstance، دوال العائلة العامة، `<Family>Labels` بالمفاتيح الدلالية المستهدفة من R5، و`<Family>EventMap` بأسماء الأحداث وتفاصيلها الحرفية + `declare global { interface HTMLElementEventMap }` لكل عائلة لها أحداث) + `tools/package/types/iife.d.ts` بديل `micro-ui.d.ts` المحذوف (يصف `window.Micro*` = صادرات المدخل زائد مهملات R-D10). البناء ينسخها إلى `dist/types/` وبوابة `package --check` تفرض ملفًا لكل مدخل.
2. **typecheck:** `tools/package/tsconfig.json` (strict، paths `@micro/ui/*` إلى `./types/*`) + `tools/package/types-test.ts` (يستورد كل مدخل ويستدعي الواجهة كاملة ويستمع لحدث لكل عائلة لها أحداث) + `tools/package/types-iife-test.ts` (الغلوبالات والمهملات و`MicroConfig`) — `npm run typecheck` ناجح.
3. **بوابة `package-install` الجديدة** (`tools/package-install-check.mjs` في check-all): npm pack بعد بناء حتمي ← مشروع مؤقت type:module ← تثبيت الـtarball ← استيراد الـ21 مدخلًا تحت Node بلا DOM مع فحص كل صادر متوقع دالة ← كل أهداف exports موجودة و`import.meta.resolve` لكل مدخل ← `tsc --noEmit` على types-test.ts ضد الحزمة المثبتة ← فحص Chromium بصفحة importmap إلى `node_modules/@micro/ui/dist/esm/` تستورد Buttons وFields وNavigation وData وproduct وتهيئ يدويًا (زر 48×112px، حقل ورسم ومنتج مرسومون، صفر أخطاء console وصفر طلبات فاشلة) ← تثبيت `git+file://<repo>#<branch>` يبني `dist/` عبر prepare ويمر بنفس اختبار الاستيراد.
4. **`examples/esm-app/`** جديد: importmap صريح إلى `../../dist/esm/`، شاشة Buttons+Fields+Navigation+تركيب C14 (Manage) عبر مدخل product، init يدوي وزر «إزالة التركيب» يستدعي `destroy()` وزر «إعادة التركيب» — دورة SPA كاملة. أُضيف إلى `preview-runtime-check` (5 حالات: مكونات مرسومة، الإزالة تفرّغ DOM، الإعادة تركّب، صفر أخطاء، صفر موارد فاشلة) وإلى `visual-baseline-capture` (صفحة جديدة بلا مرجع عند v0.1.0 — تُبلَّغ «جديدة» ولا تُقارن).
5. **examples/vanilla-app:** تحقُّق أنه يستهلك `dist/iife/` فعلًا (حُوّل ضمن R2.3.3 مع كل المستهلكين) — `grep -rln "components/" examples/` = صفر.
6. **docs/GETTING-STARTED.md أعيدت كتابته:** التثبيت (`npm install github:Qays7753/micro-ui-design-system#v0.2.0` مع prepare)، جدول المداخل الـ21، والطرق الثلاث بأمثلة كاملة قابلة للنسخ: (أ) bundler، (ب) importmap بلا bundler (مرتبط بمثال esm-app الحي)، (ج) سكربتات IIFE (مرتبط بvanilla-app)؛ ترتيب CSS الإلزامي، والأنواع والنصوص.
7. **إصلاحات اكتشفها التنفيذ:** (أ) خلل كامن في `hardcoded-text-check.py` القسم 4 (`Path.stem` على `*.d.ts` يقص اللاحقة الأخيرة فقط فلم يكن الفحص يعمل إطلاقًا) — صُحح وصار يفحص 116 صادرًا؛ (ب) حصانة البناء من اكتشاف esbuild لـtsconfig (ملف فارغ في `.build-entries`) — بدونه تغيرت بايتات dist بمجرد وجود tools/package/tsconfig.json (DECISIONS R3.3).
8. **توثيق:** TESTING.md (بوابة package-install في المشغّل الواحد + typecheck)، tools/README.md (وصفا build-package المحدث وpackage-install)، docs/API.md (تحديث وصف بوابة النصوص)، MANIFEST.json (534 مدخلًا).

**أرقام البوابات (check-all كاملة):** 23 بوابة / **23 ناجحة / 0 فاشلة** — static 271/271 (+1 رابط صفحة esm-app)، link-check 138/0، hardcoded-text: 116 صادر ESM مقابل الأنواع (فحص جديد يعمل فعليًا)، package-install: **OK (7 خطوات)**، preview-runtime **119/119** (+5 حالات esm-app)، visual-regression: compared 62 / passed 61 / allowed 1 / failed 0 / **new: examples/esm-app/index.html** (بلا مرجع عند v0.1.0 — مسموح)، وكل الأعداد الأخرى كما بعد R2 (audit 67، product-context 306، light-release 35، mobile 126، light-calendar 164، light-data 185، consumption 37، boundaries 77، clone 31، api-lifecycle 58، numeric 51، showcase 126، manifest 534). `npm run typecheck` ناجح. `git status` نظيف بعد التشغيل.

**بنود القبول:**

| البند | محقق | الدليل |
|---|---|---|
| `npm run typecheck` ناجح | نعم | `tsc -p tools/package/tsconfig.json --noEmit` — خروج 0 بلا أخطاء (types-test + types-iife-test) |
| بوابة package-install ناجحة بكل خطواتها السبع | نعم | `node tools/package-install-check.mjs` → OK (7 خطوات): زر 48×112px وfield/chart/product مرسومون وصفر أخطاء؛ وفي check-all: `package-install -> OK \| package-install: OK (7 خطوات)` |
| examples/esm-app بلا أخطاء | نعم | preview-runtime 119/119 (حالات esm-app الخمس)؛ visual-regression: صفحة جديدة، 0 فشل؛ صفر أخطاء console وموارد في التشغيلين |

**الافتراضات:** موثقة في DECISIONS R3 (بنود 1–9): الأنواع يدويًا؛ iife.d.ts بديلًا؛ حصانة tsconfig؛ mount مؤقتًا في فحص المتصفح حتى R4؛ تثبيت git بمرجع الفرع؛ مداخل importmap صريحة؛ typecheck عبر paths؛ vanilla-app تحقق لا تحويل؛ package-install خارج --quick.

**المؤجلات:** لا شيء جديد من بنود R3 (مهملات R-D10 تُنفذ في R4؛ مفاتيح النصوص الدلالية في R5).

**Commit:** `b76471c`
