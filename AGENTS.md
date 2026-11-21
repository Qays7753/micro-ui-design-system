# Micro UI — عقد العمل

## النطاق

مستودع `micro-ui-design-system` مكتبة UI مستقلة (HTML/CSS/JS) لمكونات Micro القابلة لإعادة الاستخدام وتراكيبها المحدودة، للهاتف العربي RTL أولًا. تحسين مصدر المكونات ومواصفاتها وحالاتها وأمثلتها ومعرضها. لا تطبيق منتج هنا: لا OAuth ولا مصادقة ولا شبكة ولا تخزين ولا جلسات ولا منطق أعمال ولا حسابات مالية — كل ذلك ملك التطبيق المضيف.

## مصادر الحقيقة

- `shared/tokens.css` — التوكنز التنفيذية الوحيدة.
- `docs/COMPONENT-CATALOG.json` — مصدر النضج الوحيد للعائلات والمتغيرات والتراكيب؛ `docs/COMPONENT-INVENTORY.md` مولّد منه.
- `components/<family>/specification.md` — مواصفة العائلة؛ تُقرأ قبل أي تعديل عليها.
- `docs/SYSTEM-CONTRACTS.md` — العقود الهندسية النافذة.
- `docs/DECISIONS.md` — سجل قرارات الحسم والافتراضات والمؤجلات.
- `assets/` — الخطوط (IBM Plex المحلي) والأيقونات والشعار v2 المعتمد.
- `previews/` — أمثلة مستقلة؛ `previews/ui-system-showcase/` المعرض الأخير، و`standalone.html` فيه مولّد آليًا.
- **الجولة الثانية (R2):** المصدر ES modules — `components/<family>/*.js` و`shared/*.js` تصدّر API علنيًا ولا تنشئ `window` (R-D2). `dist/` مخرج بناء غير متتبع (`node tools/build-package.mjs`): `dist/esm/<entry>.js` (bundle+splitting)، `dist/iife/<entry>.js` (غلوبالات `window.Micro*` + تهيئة تلقائية — R-D3)، CSS وأصول. كل المستهلكين داخل المستودع (صفحات وfixtures) يحمّلون `dist/iife/`؛ لا مرآة `src/` بعد الآن (R-D4).
- `tools/baselines/identity.json` — قيم الهوية المحمية التي تقارن بها الفحوص.

## ثوابت لا تُكسر

1. لا تغيير لقيم `shared/tokens.css` القائمة. يُسمح فقط بإضافة توكن جديد مشتق حرفيًا من قيمة موجودة ومطلوب لتركيب جديد، مع توثيقه في `docs/DECISIONS.md`.
2. Light-only: لا Dark ولا System-dark ولا مفاتيح ثيم ولا فحوص Dark.
3. الهاتف وRTL والعربية افتراضيًا. أهداف اللمس 48px (`--micro-touch-min`). لا تقليل لأهداف اللمس أو للخط من أجل احتواء المحتوى.
4. التراكوتا `#D97757` محصورة بدورها: عدّاد التصفية وحافة الملخص المختار. الإجراء الأساسي بترولي `#164D59`.
5. المكتبة UI فقط: لا OAuth ولا تحقق Google ولا شبكة ولا `fetch` ولا تخزين (localStorage/sessionStorage/cookies) ولا جلسات ولا منطق أعمال.
6. الأرقام والمبالغ والوحدات صادقة: المفقود ليس صفرًا، ولا يُخفى رقم أو وحدة بسبب الضيق، ولا لون وحده للدلالة.
7. لا ترقية نضج لأي عائلة أو متغير أو تركيب. كل جديد يدخل `draft-for-review`.
8. `previews/ui-system-showcase/standalone.html` يولَّد فقط بـ`tools/build-ui-system-showcase-standalone.py` ولا يُعدَّل يدويًا.
9. لا دمج إلى `main`، ولا Pull Request، ولا نشر npm، ولا حذف فروع بعيدة، ولا force-push على غير فرع العمل.
10. لا تعطيل أو تخطي أو إضعاف أي فحص لتحصل على نجاح.
11. لا تفتح مستودع تطبيق Micro ولا تعتمد عليه.

## حالات الاعتماد

`stable-ui` و`draft-for-review` و`proposed` كما يعرّفها الكتالوج. النضج لا يُرقَّى آليًا؛ الاعتماد البصري قرار مالك منفصل عن نجاح الفحوص.

## التفويض الحالي

تفويض واحد نافذ: تنفيذ `docs/plans/integration-readiness-round2-2026-11-22/PLAN.md` كاملًا (المراحل R0–R9) على فرع العمل `feature/integration-readiness-2026-11-21` ورفع كل مرحلة عليه، دون توقف أو أسئلة. القرارات المعتمدة في القسم 2 من تلك الخطة؛ وقواعد الحسم عند الطوارئ في قسمها 3، وسجلها `docs/DECISIONS.md`. الجولة الأولى (`docs/plans/integration-readiness-2026-11-21/PLAN.md`) منتهية عند الوسم `v0.1.0`؛ أي تفويض تاريخي آخر منتهٍ.

## البوابات

بعد كل مرحلة: `uv sync && npm ci` ثم `uv run python tools/check-all.py` من جذر المستودع — يبني الحزمة أولًا (`node tools/build-package.mjs`)، ثم بوابات البناء بوضع `--check` وكل بوابات الجودة والبوابة البصرية (مرجعها من git ref)، ويطبع ملخصًا، ويفشل عند أي إخفاق. الفحوص تعمل على نسخة shallow (المقارنات مقابل `origin/main` افتراضيًا، وقيم الهوية من `tools/baselines/identity.json`).

## ما لا يُختبر آليًا

Safari/WebKit، الأجهزة الفعلية (بينها Samsung Galaxy S25/Chrome)، اللمس الحقيقي، قارئات الشاشة، safe areas، native zoom، forced-colors — تسجَّل «غير مختبرة» ولا يستنتج نجاحها من فحوص Chromium.
