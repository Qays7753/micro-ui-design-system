# خطة: تجهيز مكتبة Micro UI للربط بالتطبيق — تنفيذ كامل دون توقف

## 0. الدور وطريقة العمل

أنت تعمل على المستودع `Qays7753/micro-ui-design-system`. المهمة تنفيذ الخطة أدناه **كاملة ومن البداية حتى المرحلة 10 دون توقف ودون أن تسأل المالك أي سؤال**. كل القرارات معتمدة مسبقًا في القسم 2. إذا ظهر شيء غير مغطى، طبّق قواعد القسم 3 وتابع.

- اقرأ قبل البدء: `README.md`، `DESIGN.md`، `docs/CURRENT-STATE.md`، `docs/SYSTEM-CONTRACTS.md`، `docs/COMPONENT-API-CONTRACTS.md`، `docs/COMPONENT-CATALOG.json`، ومواصفة كل عائلة قبل تعديلها.
- **هذا البرومت يتقدم على أي تفويض أو قيد تاريخي في `AGENTS.md` أو `README.md` أو `CURRENT-STATE.md`** يتعارض معه؛ تلك الملفات ستُعاد كتابتها في المرحلة 2. أما ثوابت الهوية في القسم 1 فلا يتجاوزها شيء.
- بعد كل مرحلة: شغّل البوابات، اعمل commit واضحًا بالإنجليزية بصيغة `type(scope): summary`، ثم `git push`، وحدّث تقرير التقدم (القسم 5). لا تنتظر ردًا.

## 1. ثوابت لا تُكسر أبدًا

1. لا تغيير في `shared/tokens.css` (القيم الموجودة)، ولا في الألوان أو الخطوط (IBM Plex المحلية) أو الأيقونات أو الشعار v2 أو Geometry B. يُسمح فقط بإضافة توكن **جديد** إذا كان مشتقًا حرفيًا من قيمة موجودة ومطلوبًا لتركيب جديد، مع توثيقه.
2. Light-only. لا Dark ولا System-dark ولا مفاتيح ثيم ولا فحوص Dark.
3. الهاتف وRTL والعربية افتراضيًا. أهداف اللمس 48px (`--micro-touch-min`). لا تقليل لأهداف اللمس أو للخط من أجل احتواء المحتوى.
4. التراكوتا `#D97757` محدود بدوره الحالي في المستودع (عدّاد التصفية وحافة الملخص المختار)؛ الإجراء الأساسي بترولي `#164D59`.
5. المكتبة UI فقط: لا OAuth، ولا تحقق من Google، ولا شبكة، ولا `fetch`، ولا تخزين (localStorage/sessionStorage/cookies)، ولا جلسات، ولا منطق أعمال، ولا حسابات مالية. كل ذلك للتطبيق المضيف.
6. الأرقام والمبالغ والوحدات والبيانات المفقودة تبقى صادقة: المفقود ليس صفرًا، ولا يُخفى رقم أو وحدة بسبب الضيق، ولا لون وحده للدلالة.
7. لا ترقية نضج لأي عائلة أو متغير أو تركيب. كل جديد يدخل `draft-for-review`.
8. `previews/ui-system-showcase/standalone.html` يُولَّد فقط بـ`tools/build-ui-system-showcase-standalone.py` ولا يُعدَّل يدويًا.
9. لا دمج إلى `main`، ولا Pull Request، ولا نشر على npm، ولا حذف فروع بعيدة، ولا force-push على فرع غير فرع العمل.
10. لا تعطيل أو تخطي أو إضعاف أي فحص لتحصل على نجاح.
11. لا تفتح مستودع تطبيق Micro ولا تعتمد عليه.

## 2. القرارات المعتمدة من المالك

| # | القرار |
|---|---|
| D1 | فرع العمل الوحيد: `feature/integration-readiness-2026-11-21`، **موجود مسبقًا** على الريموت فوق `origin/main` (91744a5)، ويحتوي هذه الخطة ومرجع Micro-Auth. اعمل عليه مباشرة، وكل الرفع عليه. |
| D2 | فرع `origin/feature/google-only-access-gateway-2026-11-18` معتمد: انقل commits الثلاثة (`6ec5fac`, `692b188`, `2462307`) إلى فرع العمل، **دون** تعديلاته على `AGENTS.md` و`DESIGN.md`. |
| D3 | فرع `origin/review/component-readiness-20261117`: خذ ملف `COMPONENT-READINESS-PLAN.md` فقط وضعه في `docs/plans/component-readiness-2026-11-17/PLAN.md`. هو مرجع الفجوات في المرحلة 8. |
| D4 | الفروع القديمة (`ccr-*`, `review/*`, `feature/google*`) لا تُحذف؛ تُذكر في التقرير النهائي كقابلة للحذف. |
| D5 | المرجع البصري لشاشات الدخول الأربع موجود على الفرع في `docs/references/micro-auth/` (مستخرج من `Micro-Auth.zip` الذي قدمه المالك). لا يوجد ملف مرفق آخر. |
| D6 | الأرشيف التاريخي يُحذف من الشجرة بعد tag أرشيف (المرحلة 3). `references/micro-data-colors-v1.html` يبقى. |
| D7 | المكتبة **Vanilla بدون إطار** (ES modules + IIFE للتوافق). لا React ولا Vue ولا طبقات إطار في هذه المهمة. |
| D8 | اسم الحزمة `@micro/ui`، الإصدار `0.1.0`، `"private": true`، الترخيص `UNLICENSED`. |
| D9 | Node 20 LTS، أداة البناء esbuild فقط، صفر اعتماديات تشغيل (runtime dependencies). |
| D10 | `window.Micro*` والأسماء القديمة (`disconnect`/`destroy`) تبقى تعمل طوال `0.x` كـaliases. |
| D11 | CI عبر GitHub Actions على فرع العمل مسموح. |
| D12 | التطابق البصري بعد إعادة الهيكلة (المراحل 4–7): لقطات 360×780 RTL قبل/بعد بفرق ≤ 0.1% من البكسلات لكل لقطة؛ أكثر من ذلك خطأ يجب إصلاحه. |
| D13 | التراكيب الجديدة تُبنى من العائلات والتوكنز والأيقونات الموجودة فقط، وعلى نمط C07–C12. |
| D14 | العربية افتراضية؛ خيار `labels` اختياري لتغيير النصوص. لا ترجمة إنجليزية جاهزة. الصياغة الحالية تبقى حرفيًا. |
| D15 | Manage: قائمة عمليات (مبيعات/مصاريف) بمبلغ ووحدة وتاريخ ونوع، نموذج إدخال عملية، ملخص فترة؛ حالات: تحميل، فارغ، انتظار تأكيد الخادم، فشل، offline يمنع الكتابة. |
| D16 | العملة في بيانات الأمثلة الاصطناعية فقط: `د.أ`. المكوّنات لا تفترض عملة؛ الوحدة يمررها المضيف دائمًا. |
| D17 | نتيجة بحث Market: صورة اختيارية، عنوان، سعر بوحدة، اسم المورد، حالة الإعلان. |
| D18 | قائمة المراجعة: أنواع إعلان/بلاغ/طلب سائق؛ لكل عنصر النوع والعنوان والتاريخ والحالة. الترتيب يمرره المضيف؛ لا أولوية أو فرز مخترع. |
| D19 | قائمة مهام السائق: **لا تُنفّذ**. تُصمم قائمة المراجعة قابلة لإعادة الاستخدام لاحقًا. |
| D20 | المتصفحات: الفحص الآلي على Chromium فقط. Safari/WebKit، الأجهزة الفعلية، قارئات الشاشة، safe areas، native zoom تُسجَّل «غير مختبرة». |

## 3. قواعد عدم التوقف

1. **فحص فشل:** أصلح السبب وأعد التشغيل. لا تتجاوز الفحص.
2. **بند يتعارض مع ثوابت القسم 1:** لا تنفذه، سجّله في `docs/DECISIONS.md` بعنوان «مؤجل — يحتاج قرار المالك» مع السبب، وتابع بقية العمل.
3. **غموض:** اختر الحل الأبسط المتوافق مع العقود الحالية، وسجّل الافتراض في `docs/DECISIONS.md` (التاريخ، البند، الافتراض، السبب).
4. **فشل شبكة أو push:** أعد المحاولة حتى 4 مرات بفواصل متزايدة. إن استمر، تابع العمل محليًا واعمل commit لكل مرحلة، وأعد الرفع لاحقًا.
5. **استحالة تقنية تمنع مرحلة كاملة:** سجّلها، وانتقل إلى المرحلة التالية غير المعتمدة عليها.
6. التوقف الوحيد المسموح: بعد إنهاء المرحلة 10.

## 4. البوابات الأساسية (بعد كل مرحلة)

قبل المرحلة 4 (الأسماء الحالية):

```bash
uv sync
uv run python tools/build-ui-system-showcase-standalone.py --check
uv run python tools/component-catalog-build.py --check
uv run python tools/manifest-build.py --check
uv run python tools/light-static-check.py
uv run python tools/component-audit-check.py
uv run python tools/product-context-check.py --out <tmp>
uv run python tools/light-release-check.py --review-scope
uv run python tools/mobile-experience-check.py --out <tmp>
git diff --check
```

من المرحلة 4 فصاعدًا: `uv run python tools/check-all.py` الذي يضم كل ما سبق وما يُضاف. النتيجة الحالية المرجعية على `main` (91744a5): static 429/429، audit 67/67، product-context 250/250، light-release 35/35، mobile-experience 49/49؛ لا يُقبل أي انخفاض في عدد الحالات الناجحة إلا إذا حُذفت حالة لأن موضوعها حُذف، مع ذكر ذلك.

قبل المرحلة 1 مباشرة: التقط لقطات مرجعية 360×780 RTL Light لكل صفحة في `previews/` و`components/*/example-usage.html` والمعرض، واحفظها خارج المستودع (أو في مسار مُستثنى في `.gitignore`)، لاستخدامها في D12.

## 5. التقرير

ملف واحد: `docs/plans/integration-readiness-2026-11-21/REPORT.md`. بعد كل مرحلة أضف: ما نُفّذ، الملفات الأساسية، hash الـcommit، نتائج البوابات بالأرقام، الافتراضات، المؤجلات، وما لم يُختبر. لا لقطات أو أدلة ثقيلة داخل المستودع.

---

## المرحلة 0 — بيئة الفحص

1. استنساخ كامل (`git fetch --unshallow` إن كان shallow) وجلب كل الفروع. انتقل إلى فرع العمل الموجود (D1): `git checkout feature/integration-readiness-2026-11-21`.
2. أزل الاعتماد على commit ثابت `161bb71adbed86e0df4382174cb07bd2fcb8d62d` من: `tools/light-static-check.py`، `tools/light-release-check.py`، `tools/light-evidence-capture.py`، `tools/product-context-check.py`.
   - قيم الهوية المرجعية (قيمة Petrol وبقية التوكنز المحمية، بصمات SHA-256 لملفات الشعار v2) تُستخرج **مرة واحدة** من ذلك الـcommit وتُحفظ في `tools/baselines/identity.json`، والفحوص تقارن بها.
   - مقارنات `git diff` تصبح نسبةً إلى `origin/main` افتراضيًا، أو قيمة تُمرَّر بـ`--base`.
3. أي فحص يكتب داخل المستودع (مثل `generated-artifacts/`) يكتب افتراضيًا في مجلد مؤقت، أو في مسار مُضاف إلى `.gitignore`.
4. أضف إلى `.gitignore`: `.venv/`، `generated-artifacts/`، `node_modules/`، `dist/` (سيُعاد النظر في `dist` بالمرحلة 5).
5. أضف في `README.md` قسمًا قصيرًا لتشغيل الفحوص: `uv sync` ثم `uv run python tools/...`.

**القبول:** كل البوابات تعمل وتنجح على نسخة shallow جديدة (`git clone --depth 1`)، و`git status` نظيف بعد تشغيلها.

## المرحلة 1 — دمج الفروع وشاشات الدخول

1. **فرع المراجعة (D3):** انقل الخطة إلى `docs/plans/component-readiness-2026-11-17/PLAN.md`.
2. **فرع Google (D2):** cherry-pick للـcommits الثلاثة بالترتيب. عند التعارض في `AGENTS.md`/`DESIGN.md` احتفظ بنسخة `main`، ثم أضف إلى `DESIGN.md` فقرة عامة: «Access Gateway يوفّر واجهات UI فقط؛ المضيف يملك Google Identity Services والتحقق والجلسة وتحديد حالة الجديد/العائد والوجهات».
3. انقل `docs/superpowers/plans/*` إلى `docs/plans/access-gateway-2026-11-18/` واحذف `docs/superpowers/`. حدّث كل الروابط.
4. **مرجع Micro-Auth (D5):** موجود على الفرع في `docs/references/micro-auth/`: `README.md`، `previews/` (اللقطات الأربع و`states/`)، `svg/`، `tokens/micro-auth-tokens.json`. مجلد `web/` الأصلي (منطق GIS والمصادقة وشعار بديل) **مستبعد عمدًا**؛ لا تعِد إنشاءه ولا تنقل منطقه، ومسارات `web/...` المذكورة في README المرجع نصية تاريخية لا روابط تُصلح. الشعار المعتمد هو أصول v2 في `assets/brand`.
5. **مطابقة الشاشات الأربع مع المرجع** (`components/access-gateway/auth-screens.css` والأمثلة الأربعة):
   - طابق التخطيط والمحتوى والتسلسل والأشكال الزخرفية مع لقطات `previews/1..4`.
   - أضف حالات الشاشة 2 من `previews/states/`: تحميل (loading)، خطأ اتصال (network)، إلغاء (cancelled)، رفض مصادقة (auth). تُعرض بمنطقة حالة نصية واضحة، يقودها المضيف بخاصية مثل `data-auth-state="loading|error-network|error-cancelled|error-auth"`، دون أي منطق محلي. لا تنتقل الواجهة لأي ترحيب عند الخطأ.
   - **قواعد حسم التعارض بين المرجع والمستودع (معتمدة):**
     - أهداف اللمس وارتفاع الأزرار: 48px وفق توكنز المستودع (المرجع يذكر 44/52) — استخدم `--micro-button-min-height`.
     - زر «ابدأ الآن» في شاشة المستخدم الجديد: **بترولي** (المرجع يجعله تراكوتا، وهذا يخالف القسم 1 بند 4). سجّل ذلك في `docs/DECISIONS.md`.
     - أحجام الخطوط والزوايا والحركة: أقرب توكن موجود في `tokens.css`؛ لا قيم مكتوبة مباشرة. سجّل أي فرق ظاهر عن المرجع.
     - الخط: IBM Plex المحلي من `assets/fonts`، لا Google Fonts.
     - الألوان المرجعية `#164D59 #507F8B #D97757 #172D32 #50656A #F7F8F4 #DCE5E2` موجودة في التوكنز؛ استخدم التوكنز لا القيم. ألوان الضغط (`#0F3A43`, `#C9684A`) غير موجودة: استخدم حالة الضغط المعرّفة حاليًا في `buttons.css`.
     - زر Google: يرسمه المضيف عبر GIS داخل `data-google-provider-slot`؛ لا رسم بديل ولا تنسيق للزر. بدون مضيف يظهر الموضع فارغًا بإطار منقّط كما في المرجع.
     - روابط الشروط/الخصوصية لا تظهر إلا إذا مرر المضيف عناوين حقيقية.
   - الحركة اختيارية وتُلغى مع `prefers-reduced-motion`.
6. سجّل الشاشات الأربع في `docs/COMPONENT-CATALOG.json` كتركيب `C13 — Access gateway screens` بحالة `draft-for-review`، ثم أعد بناء الكتالوج والفهرس وMANIFEST.
7. وسّع `tools/mobile-experience-check.py --phase login` ليغطي الحالات الأربع الجديدة: نص ظاهر، `aria-live` مناسب، لا انتقال لشاشة ترحيب، لا overflow أفقي عند 360 و320.

**القبول:** فحص login ينجح بكل حالاته؛ الكتالوج 14 عائلة / 8 متغيرات / 13 تركيبًا؛ لا نص `superpowers` ولا رابط مكسور.

## المرحلة 2 — عقد عمل واحد

1. أعد كتابة `AGENTS.md` (أقل من 80 سطرًا تقريبًا) بالأقسام: النطاق، مصادر الحقيقة، ثوابت الهوية والنطاق (القسم 1 هنا)، حالات الاعتماد، **تفويض حالي واحد** يذكر فرع العمل، البوابات (`check-all`)، وما لا يُختبر آليًا.
2. احذف كل التفويضات التاريخية، والإشارة إلى `feature/ui-system-component-audit-repair-2026-11-11` (فرع غير موجود)، وجملة «لا تنشئ فرعًا خارج main» المتعارضة.
3. أعد كتابة `DESIGN.md`: الهوية والحدود فقط، بلا سجل جولات.

**القبول:** لا تعارض بين جملتين في `AGENTS.md`؛ كل مسار مذكور فيه موجود في الشجرة.

## المرحلة 3 — تنظيف التوثيق والمستودع

1. أنشئ tag محليًا وادفعه: `archive/pre-integration-2026-11-21` على رأس فرع العمل قبل أي حذف.
2. قبل الحذف، ابحث في كل ما سيبقى (`components/`، `previews/`، `tools/`، `shared/`، و`docs/` العليا) عن روابط أو مراجع لملفات داخل المجلدات المحذوفة. أي ملف ما زال مرجعًا لعقد حالي يُنقل إلى `docs/` أو يُدمج في الوثيقة المناسبة.
3. احذف من الشجرة: `docs/zai/`، `_audit-resources/`، `reviews/`، `docs/replit/`، `docs/replit-professional-ui-repair-2026-10-20/`، `docs/review-evidence-repairs-2026-11-11/`، `docs/audits/`، `docs/proposals/` (بعد استخراج ما يلزم بالبند 2)، `handoff/`، `deliverables/`، والصور/اللقطات التاريخية غير المستخدمة من أي صفحة حالية. يبقى `references/micro-data-colors-v1.html` و`docs/references/micro-auth/`.
   - إن كانت صفحة في `previews/` تعتمد على ملف من `docs/proposals/` (مثل معاينات الرسوم)، انقل المعتمد عليه إلى `previews/` أولًا أو احذف الصفحة المقترحة إن كانت مقترحًا تاريخيًا غير مستخدم في عقد حالي، وسجّل القرار.
4. ادمج ملفات `docs/*.md` العليا في المجموعة التالية فقط (احذف الأصل بعد الدمج):

| الملف الجديد | يدمج |
|---|---|
| `docs/STATUS.md` | `CURRENT-STATE.md`، `UI-RELEASE.md`، `IMPLEMENTATION-VERIFICATION.md`: صفحة واحدة بالإصدار والنضج وما لم يُختبر والفجوات والمؤجلات |
| `docs/GETTING-STARTED.md` | جديد: التثبيت، ترتيب CSS، الاستيراد، مثال أدنى (يُكمل في المرحلة 5) |
| `docs/API.md` | `COMPONENT-API-CONTRACTS.md`، `COMPONENT-CONSUMPTION.md`، `FAMILY-CONSUMPTION.md`، `SHARED-ACTIONS.md`، `SHARED-SPEC.md`، `UI-USAGE-SOP.md`، `MICRO-COMPONENTS-GUIDE.md` |
| `docs/COMPOSITIONS.md` | `COMPOSITIONS.md`، `COMPOSITION-CONTRACTS.md`، `MOBILE-CAPABILITIES.md`، `UI-COMPOSITION-RULES.md`، `BOUNDARY-FIXTURES.md`، `READING-TASK-GUIDE.md`، `READABLE-SOURCE.md` |
| `docs/SYSTEM-CONTRACTS.md` | يبقى، ويُضاف إليه `UI-PLATFORM-NOTES.md` |
| `docs/DESIGN-FOUNDATIONS.md` | `UI-VISUAL-SYSTEM.md`، `COMPONENT-GEOMETRY.md`، `MOBILE-MOTION.md`، `VISUAL-ACCEPTANCE.md`، `docs/foundations/*` |
| `docs/COMPONENT-INVENTORY.md` | يبقى (مولد من الكتالوج) |
| `docs/COMPONENT-CATALOG.json` | يبقى |
| `docs/TESTING.md` | `UI-SYSTEM-SHOWCASE-COVERAGE.md`، `UI-SYSTEM-SHOWCASE-REPAIR-TRACKER.md` (الجزء الحالي فقط)، وما لا يُختبر |
| `docs/DECISIONS.md` | `UI-DECISIONS.md` + الافتراضات الجديدة |
| `docs/HANDOFF.md` | `UI-FINAL-HANDOFF.md`، `UI-OWNER-HANDOFF.md`، `MOBILE-EXPERIENCE-HANDOFF.md`، `EDITABLE-DELIVERY.md` (المحتوى الصالح حاليًا فقط) |
| `docs/product-context/` | احتفظ بـ`COVERAGE.md` فقط محدثًا، واحذف التقارير والأدلة |
| `docs/plans/` | المكان الوحيد للخطط |

   عند الدمج: احتفظ بكل **قاعدة أو عقد ساري**؛ احذف سرد الجولات والتواريخ والعدادات القديمة. إن تعارضت قاعدتان، يتقدم `SYSTEM-CONTRACTS.md` ثم الأحدث، وسجّل الحسم في `DECISIONS.md`.
5. `README.md` قصير: ما المكتبة، التثبيت، تشغيل المعرض، روابط الملفات أعلاه. بلا «الجولة الأحدث/النشطة/السابقة».
6. حدّث `tools/component-catalog-build.py` و`tools/manifest-build.py` وأي فحص يقرأ مسارات توثيق محذوفة.
7. أضف `tools/link-check.py`: يفحص كل الروابط النسبية في `*.md` و`*.html` المتتبعة بـgit، ويفشل عند رابط مكسور.

**القبول:** صفر روابط مكسورة؛ لا ملف في `docs/` هو سجل جولة؛ `manifest-build --check` ينجح بعد إعادة البناء؛ سجّل حجم الشجرة قبل/بعد في التقرير.

## المرحلة 4 — أدوات الفحص وCI

1. جرد كل ملفات `tools/` وصنّفها في جدول داخل `tools/README.md`: (أ) بوابة حالية، (ب) أداة بناء، (ج) تاريخي.
2. لكل سكربت (ج): إن كانت فيه حالات تغطي سلوكًا حاليًا غير مغطى في (أ)، انقلها إلى أقرب بوابة حالية؛ ثم احذف السكربت.
3. `tools/check-all.py`: يشغّل كل بوابات (أ) وأدوات (ب) بوضع `--check` و`link-check` و`git diff --check`، يطبع ملخصًا بعدد النجاح/الفشل لكل بوابة، ويعيد exit code غير صفري عند أي فشل.
4. `.github/workflows/ci.yml`: على `push` و`pull_request`؛ Ubuntu، Python 3.12+ عبر uv، Node 20، تثبيت Chromium لـPlaywright، `uv run python tools/check-all.py`، وبناء الحزمة بـ`--check` (بعد المرحلة 5).
5. أضف فحص التطابق البصري `tools/visual-regression-check.py` (D12) مقابل اللقطات المرجعية من بداية العمل، يُشغَّل محليًا ومن CI إن أمكن حفظ المرجع خارج المستودع؛ وإلا يبقى محليًا ويُذكر ذلك.

**القبول:** CI أخضر على فرع العمل؛ كل سكربت متبقٍ في `tools/` مستخدم في `check-all` أو موثق كأداة.

## المرحلة 5 — الحزمة والتوزيع

1. `package.json` (D8, D9): `name`, `version`, `private`, `license`, `type: "module"`, `engines.node >=20`, `exports` لكل عائلة (`"./buttons"`, `"./buttons.css"` …)، و`"./styles.css"` الشامل، و`"./tokens.css"`، و`"./assets/*"`؛ `files`؛ `sideEffects: ["*.css", "./dist/iife/*"]`؛ scripts: `build`, `build:check`.
2. **مصدر واحد:** لكل عائلة فيها JS أنشئ `src/<family>/index.js` (أو حوّل الملف الحالي) ليصدّر API كـES module. ولّد نسخة IIFE من **نفس المصدر** بـesbuild إلى `components/<family>/<file>.js` (أو اجعل الملفات الحالية مولدة) بحيث تبقى `previews/` تعمل بالمسارات الحالية وتبقى `window.Micro*` (D10). لا تكرار يدوي للكود. إن اخترت إبقاء الملفات الحالية كمصدر وتوليد ESM منها، فوثّق ذلك؛ المهم مصدر واحد.
3. `tools/build-package` (Node script) يُنتج `dist/`:
   - `dist/esm/<family>.js`
   - `dist/iife/micro-ui.js` (كل العائلات) و`dist/iife/<family>.js`
   - `dist/css/<family>.css`، و`dist/micro-ui.css` = fonts + tokens + motion + كل العائلات بالترتيب الصحيح
   - `dist/assets/` (fonts, icons, brand)
   - `dist/types/*.d.ts`
   - وضع `--check` يعيد البناء ويقارن بايت ببايت بـ`dist` المتتبع، أو يتحقق من البناء دون تتبع `dist` — اختر واحدًا ووثّقه (التوصية: `dist` غير متتبع، والفحص يبني ويختبر).
4. ملفات `.d.ts` لكل عائلة: دوال `init/destroy/update`، الخيارات، أسماء الأحداث وأنواع `detail`، و`labels`.
5. `shared/icons.js` يصبح قابلًا للاستيراد ESM أيضًا.
6. `examples/vanilla-app/`: صفحة تستورد من `dist/esm` و`dist/micro-ui.css` ثلاث عائلات على الأقل (Buttons, Fields, Navigation) وتركيبًا واحدًا، دون أي ملف من `previews/`، بلا أخطاء console. أضف فحصًا له في `check-all`.
7. `CHANGELOG.md` (SemVer) بإدخال `0.1.0`.
8. `docs/GETTING-STARTED.md`: التثبيت عبر git (`npm install github:Qays7753/micro-ui-design-system#<tag>`)، ترتيب CSS الإلزامي (fonts → tokens → motion → العائلة)، مثال ESM ومثال IIFE.

**القبول:** `npm pack` ينتج حزمة تعمل في `examples/vanilla-app`؛ كل الـpreviews والمعرض و`standalone --check` ناجحة؛ `visual-regression-check` ضمن D12.

## المرحلة 6 — توحيد العقد البرمجي

1. لكل عائلة لها JS، بما فيها `fields`, `info-strip`, `metric-comparison`, `access-gateway`, `account-settings`, `buttons`, `order-schedule`, وملفات `components/product-context/*`:
   ```
   const instance = MicroX.init(root, options?)   // يعيد instance
   instance.update(data?)                          // حيث ينطبق
   instance.destroy()                              // يزيل كل المستمعات والمراقبات والمؤقتات
   ```
   - `options.labels` (المرحلة 7).
   - الأحداث بصيغة `micro-<family>:<event>` مع `detail` موثق. الأحداث الحالية تبقى بأسمائها الحالية إن كانت تتبع الصيغة؛ غير ذلك أضف الاسم الموحد وأبقِ القديم يطلق أيضًا خلال `0.x` وعلّمه deprecated.
   - Buttons: `init` يغلّف `setLoading` الحالي. Order Schedule: يقبل `root` كبقية العائلات.
   - `disconnect` و`destroy` القديمة تبقى aliases (D10).
2. **التهيئة التلقائية:** الملفات الـ16 التي تستخدم `DOMContentLoaded`/`readyState` — تبقى التهيئة التلقائية في IIFE فقط، وتُلغى من ESM. أضف إيقافها في IIFE عبر `window.MicroConfig = { autoInit: false }` قبل التحميل، أو `data-micro-manual` على العنصر.
3. ضمانات SPA لكل عائلة: init مرتين على نفس الجذر يعيد نفس instance ولا يضاعف المستمعات؛ destroy ثم init يعمل؛ إزالة العقدة من DOM دون destroy لا ترمي أخطاء؛ لا تسرّب مستمعات على `window`/`document` بعد destroy.
4. `tools/api-lifecycle-check.py` (Playwright): لكل عائلة سيناريو init → update → destroy → init، مع عدّ المستمعات (بتغليف `addEventListener`/`removeEventListener` في الصفحة) والتحقق من عدم وجود أخطاء. يدخل في `check-all`.
5. حدّث `docs/API.md` و`.d.ts` بحيث يتطابقان بندًا ببند، وأضف فحصًا بسيطًا يتأكد أن كل دالة عامة في JS مذكورة في `.d.ts`.

**القبول:** `api-lifecycle-check` ينجح لكل العائلات؛ D12 محقق؛ كل البوابات ناجحة.

## المرحلة 7 — النصوص

1. استخرج كل نص ظاهر للمستخدم مكتوب داخل JS إلى كائن نصوص افتراضي عربي لكل عائلة (`src/<family>/labels.js` أو ما يناسب البنية). أمثلة معروفة: أيام الأسبوع وصيغ «لا طلبات/طلب واحد/طلبان» في `order-schedule.js`؛ والنصوص الظاهرة في `data.js`، `carousel.js`، `navigation.js`، `metric-comparison.js`، `packed-circle.js`، `info-strip*.js`، `messages.js`، `selection/*.js`، `fields.js`، `access-gateway.js`، `account-settings.js`، `product-context/*.js`.
2. التخصيص: `options.labels` لكل instance، و`MicroX.setLabels(partial)` عام. دمج جزئي فوق الافتراضي.
3. صيغ الجمع بـ`Intl.PluralRules('ar')` (zero/one/two/few/many/other)، مع إبقاء النصوص الحالية حرفيًا للحالات الموجودة.
4. تنسيق الأرقام والتواريخ عبر `Intl` مع `options.locale` (الافتراضي `ar`)، مع الحفاظ على العزل الاتجاهي الحالي للأرقام وعدم تغيير شكل الأرقام الظاهر حاليًا (إن كانت الأرقام لاتينية حاليًا تبقى لاتينية افتراضيًا).
5. `tools/hardcoded-text-check.py`: يفشل إذا وُجد نص عربي داخل سلاسل JS خارج ملفات النصوص الافتراضية (تُستثنى التعليقات). يدخل في `check-all`.
6. اختبار: تمرير labels بديلة يغيّر النصوص الظاهرة؛ بلا labels تتطابق الصفحات حرفيًا مع ما قبل المرحلة.

**القبول:** الفحصان ينجحان؛ D12 محقق.

## المرحلة 8 — سد الفجوات الوظيفية

ارجع إلى `docs/plans/component-readiness-2026-11-17/PLAN.md`. كل بند: مواصفة في `components/product-context/specification.md` (أو مواصفة التركيب)، renderer بنفس نمط `product-core.js` وملفات C07–C12، مثال في `previews/product-context/`، تسجيل في الكتالوج `draft-for-review`، حالات في `tools/product-context-check.py`، ونصوص عبر labels (المرحلة 7). بيانات الأمثلة اصطناعية وتقول ذلك صراحة.

1. **C14 — Manage (D15, D16):**
   - صفوف عمليات بمبنى C02/Organization: النوع (مبيعات/مصاريف) بنص لا بلون فقط، المبلغ مع الوحدة الممررة، التاريخ، وصف قصير.
   - نموذج إدخال عملية بـFields (مبلغ بوحدة، نوع، تاريخ، ملاحظة) وButtons.
   - ملخص فترة يعرض قيمًا يمررها المضيف (المكتبة لا تحسب مجاميع مالية)؛ يمكن استخدام Data/Metric الموجودة للقراءة.
   - الحالات: تحميل، فارغ، `pending` (انتظار تأكيد الخادم — لا «تم الحفظ» قبل `resolve` من المضيف)، فشل مع إجراء إعادة المحاولة، offline يعطّل الإرسال بنص واضح. لا save-local ولا طابور.
   - عدّل نص C08 الذي يوحي بمزامنة محلية/حفظ محلي لـManage ليتوافق مع Online-only، وسجّل التغيير.
2. **C09 — نتائج بحث Market (D17):** mode `results` يستقبل مصفوفة نتائج من المضيف ويرسمها صفوفًا/بطاقات بالحقول المحددة؛ حالات منفصلة: لا إعلانات أصلًا، لا نتائج للبحث، فشل القراءة، تحميل. صورة مفقودة لا تكسر التخطيط.
3. **C12 — قائمة مراجعة متعددة (D18, D19):** mode `queue` قائمة → تفاصيل (التفاصيل هي عنصر C12 الحالي). الأنواع الثلاثة بنص ظاهر؛ الترتيب كما يمرره المضيف؛ حالات فارغ/فشل/تحميل؛ اختيار عنصر يطلق حدثًا بمعرّفه ولا يقرر شيئًا. اجعل القائمة عامة بما يكفي لإعادة استخدامها لاحقًا لقوائم أخرى.
4. أضف التراكيب الجديدة إلى المعرض `previews/ui-system-showcase/` إن كان المعرض يعرض C07–C12، ثم أعد توليد `standalone.html`.

**القبول:** فحوص التراكيب تنجح عند 360×780 RTL، و320 حيث يوجد ضيق؛ لا overflow أفقي؛ أهداف لمس 48px؛ لا نجاح يُعرض قبل تأكيد المضيف؛ الكتالوج 14/8/14.

## المرحلة 9 — ملغاة (D7)

لا طبقات إطار. اذكر في `docs/STATUS.md` أن wrappers الإطارات مؤجلة لحين تحديد التطبيق.

## المرحلة 10 — التحقق النهائي والتسليم

1. `uv run python tools/check-all.py` كامل ناجح، وCI أخضر على آخر commit.
2. صفر أخطاء JavaScript أو موارد مفقودة في كل صفحات `previews/` و`components/*/example-usage.html` و`examples/vanilla-app`.
3. `docs/STATUS.md` نهائي: الإصدار `0.1.0`، نضج كل عائلة/متغير/تركيب من الكتالوج، ما لم يُختبر (D20)، المؤجلات من `DECISIONS.md`.
4. tag `v0.1.0` على آخر commit في فرع العمل وادفعه.
5. أكمل `REPORT.md` بقسم ختامي: جدول المراحل 0–10 (الحالة، commits، نتائج الفحوص)، قائمة كل الافتراضات والمؤجلات، الفروع القابلة للحذف (D4)، وما يبقى على المالك: الاعتماد البصري، اختبار Samsung Galaxy S25/Chrome الفعلي، قرار رفع النضج، اختيار إطار التطبيق، والدمج إلى `main`.
6. لا PR ولا دمج. انتهِ هنا.
