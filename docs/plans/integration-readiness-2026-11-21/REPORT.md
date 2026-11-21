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
