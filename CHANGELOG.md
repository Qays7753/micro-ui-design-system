# Changelog — @micro/ui

All notable changes to the Micro UI library are documented here. SemVer is followed from 0.1.0.

## 0.1.0 — 2026-11-21 (فرع الربط feature/integration-readiness-2026-11-21)

### Added
- العقد الموحد لدورة حياة API العائلات (المرحلة 6 — 2026-11-21): اسم `update(root, data)` موحد لكل عائلة لها JavaScript يفوّض إلى التنفيذ القائم نفسه (`sync`/`render`/`setData`/`rescan`/`setOptions`/`goTo` — الأسماء القديمة تبقى تعمل طوال 0.x وفق D10)، و`MicroButtons.init(root)` اكتشاف موثق يعيد أزرار النطاق (الربط تلقائي)، مع توثيق عدم انطباق `update` على العائلات بلا مفهوم بيانات (Buttons/Selection/Organization/Messages/Navigation/Account Settings) بدل اختراع سلوك، وإعلان الغلوبالات الثانوية (MicroPacked/MicroInfoPeek/MicroReadings/MicroIcons/MicroActionSheet) في `micro-ui.d.ts`. البوابة الجديدة `tools/api-lifecycle-check.py` (داخل `check-all`) تثبت لكل عائلة: init مرتين لا يضاعف المستمعات، وupdate لا يزدهر، وdisconnect/destroy يزيلان المستمعات بلا أخطاء صفحة/كونسول.
- بنية الحزمة `@micro/ui` 0.1.0 **خاصة** (`"private": true` — لا نشر على npm دون قرار المالك، D9): Vanilla بدون إطار، صفر اعتماديات تشغيل، `engines.node >= 20`، وesbuild أداة بناء وحيدة ضمن devDependencies. خرائط تصدير `css/js/fonts` + `micro-ui.d.ts` في `package.json`.
- `src/` مرآة مولّدة بايت-ببايت للمصدر القابل للتعديل (`components/` و`shared/` و`assets/`)، و`dist/` بناء حتمي متتبع: CSS منسوخ بايت-ببايت دون معالجة (D15) و`dist/css/micro-ui.css` (fonts ثم tokens ثم motion)، وJS عبر esbuild (IIFE، es2019، بلا تصغير)، وخطوط وشعار v2 وأيقونات، و`dist/MANIFEST.json` ببصمات sha256.
- `tools/build-package.mjs` البناء الحتمي ووضع `--check` (بوابة `package` داخل `check-all`)، و`tools/package/micro-ui.d.ts` تعريفات TypeScript محيطية لـ`window.Micro*` الحقيقية.
- `examples/vanilla-app/`: مثال مستقل يستهلك من `src/` مباشرة — شاشات الدخول الأربع (تركيب C13) وشاشة مركّبة من Buttons وFields وData.
- سير عمل CI محفوظ حرفيًا في `tools/ci/ci.yml` بانتظار تركيبه من المالك (توكن الرفع بلا نطاق workflow — انظر docs/DECISIONS.md المرحلة 4).
- تركيب C13 شاشات بوابة الدخول الأربع (draft-for-review) مع حالات `data-auth-state` يقودها المضيف.
- `tools/check-all.py` مدخل الفحوص الموحد، و`tools/link-check.py` لفحص الروابط، و`tools/baselines/identity.json` لقيم الهوية المحمية.
- الكتالوج في هذا الإصدار: 14 عائلة / 8 متغيرات / 13 تركيبًا.
- سجل النصوص الافتراضية (المرحلة 7 — 2026-11-21): كل نص عربي ظاهر داخل JS العائلات (بما فيه aria-label) انتقل إلى `components/<family>/labels.js` لكل عائلة (13 عائلة) يسجّل `window.MicroLabels['<family>']` بالصياغة الحرفية السابقة، وملفات السلوك تقرأ النص وقت الاستخدام، مع تحميل labels.js قبل ملف السلوك في كل صفحة (يفحص آليًا). التخصيص: `MicroX.setLabels(partial)` على كل عائلة ذات نصوص، و`handlers.labels` في Access Gateway init، و`MicroLabels.setLocale(locale)` للتنسيق (الافتراضي `ar-u-nu-latn` بأرقام لاتينية بلا فواصل كما هو اليوم حرفيًا — لا تغيير بصري افتراضيًا)، وصيغ جمع الطلبات عبر `Intl.PluralRules('ar')` بنفس الصياغة الحرفية. بوابة جديدة `tools/hardcoded-text-check.py` داخل `check-all`: صفر نصوص عربية داخل سلاسل JS خارج ملفات labels، واقتران التحميل في الصفحات، وتغطية مفاتيح النصوص، وتغطية كل دالة عامة على `window.Micro*` في `micro-ui.d.ts`.
- `window.MicroConfig = { autoInit: false }` قبل التحميل يوقف الربط التلقائي عند DOMContentLoaded/readyState في مسار IIFE لكل العائلات (متبقي المرحلة 6)، مع بقاء كائنات الواجهة للتهيئة اليدوية؛ وأُضيف `setLabels` و`MicroLabels`/`MicroConfig` إلى `micro-ui.d.ts` و`docs/API.md` (قسم «النصوص الافتراضية وتخصيصها»).


### Changed
- إعادة هيكلة التوثيق إلى مجموعة عقود حالية واحدة (STATUS/API/COMPOSITIONS/DESIGN-FOUNDATIONS/TESTING/HANDOFF/DECISIONS).
- زر «ابدأ الآن» في شاشة المستخدم الجديد بترولي (ثابت الهوية) بدل تراكوتا المرجع.

### Removed
- الأرشيف التاريخي للمستودع بعد tag `archive/pre-integration-2026-11-21` (D6).
