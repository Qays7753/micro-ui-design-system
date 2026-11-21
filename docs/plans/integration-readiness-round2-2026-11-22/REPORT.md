# تقرير الجولة الثانية — إكمال جاهزية الربط @micro/ui 0.2.0

هذا التقرير يُحدَّث بعد كل مرحلة R0–R9 وفق `PLAN.md` (القسم 5). الحقيقة حرفيًا: لا يُعلن بند مغلق إلا بدليل (أمر + نتيجة). البوابات بعد كل مرحلة: `uv sync && npm ci && uv run python tools/check-all.py && git diff --check`.

## جدول F1–F10 (يُملأ عند الإغلاق الفعلي)

| # | المشكلة | المرحلة | الحالة | الدليل |
|---|---|---|---|---|
| F1 | لا ES modules ولا أنواع لكل عائلة | R2، R3 | مفتوح | — |
| F2 | لا instance بـdestroy() إلا Order Schedule وMicroProduct | R4 | مفتوح | — |
| F3 | مفاتيح نصوص بلا معنى (kNNN) وCarousel/Picker بلا options.labels | R5 | مفتوح | — |
| F4 | C08 يعرض save-local وlocal-saved خلافًا لOnline-only | R6 | مفتوح | — |
| F5 | ثلاث نسخ متتبعة (components/ وsrc/ وdist/) | R2 | مفتوح | — |
| F6 | البوابة البصرية مربوطة بمسار مطلق خارج المستودع | R1 | **مغلق (R1)** | `git grep -n "/home/z"` لا يُرجع سوى سطر وصف F6 في ملف الخطة نفسه (وثيقة المالك)؛ المرجع يُولَّد من `--baseline-ref v0.1.0` في worktree مؤقت: `uv run python tools/visual-regression-check.py --out /tmp/micro-vr-r1` → compared 62 / passed 61 / allowed 1 / failed 0 |
| F7 | روابط footer في concepts أصبحت نصًا | R1 | **مغلق (R1)** | footer فيه 4 روابط `<a href>` حية (API.md وTESTING.md وGETTING-STARTED.md ومواصفة info-strip)؛ بوابة preview-runtime: 114/114 (حالتا concepts-footer جديدتان)؛ الارتفاع حُفظ 2335px والفرص 0.1455% مسموح (R-D13) |
| F8 | CI غير مفعّل (الملف في tools/ci) | R7 | مفتوح | — |
| F9 | فحوص تكتب داخل المستودع + قوائم مجلدات قديمة | R1 | **مغلق (R1)** | `grep -rn "generated-artifacts" tools/*.py` = صفر؛ `manifest-build --check` يرفض أي مجلد في PUBLIC_DIRS غير موجود (reviews/prompts/handoff حُذفت من القائمتين)؛ `git status` نظيف بعد check-all |
| F10 | ملفات product-context JS مضغوطة غير مقروءة | R2 | مفتوح | — |

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

**Commit:** (يُسجل بعد الرفع)

