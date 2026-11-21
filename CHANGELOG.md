# سجل التغييرات

## 0.2.0 (قيد الإعداد — الجولة الثانية R2)

### Breaking
- المصدر ES modules بصادرات مسماة؛ لا `window.Micro*` من المصدر — الغلوبالات في `dist/iife/<entry>.js` فقط (R-D2/R-D3).
- `src/` حُذفت نهائيًا و`dist/` غير متتبع — يبنيه `npm run build`/`prepare` (R-D4).
- مسارات IIFE الجديدة: `dist/iife/<entry>.js` بدل `dist/js/<file>.js`؛ ملفات labels لا تُحمّل منفصلة (مضمنة).
- مفاتيح نصوص `kNNN` كما هي في هذه المرحلة (تُعاد تسميتها في R5).

### Added
- `dist/esm/<entry>.js` قابلة للاستيراد (`import { init } from '@micro/ui/buttons'`) مع صفر أثر جانبي عند الاستيراد.
- مدخل واحد لكل عائلة (21 مدخلًا) + `dist/iife/micro-ui.js` شامل + `dist/css/styles.css`.

### Fixed
- setLabels كانت موثقة ومفقودة من تنفيذ AccessGateway/AccountSettings في 0.1.0 (options.labels كانت ترمي خطأ) — أُوفّرت الآن.

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
- الكتالوج في هذا الإصدار: 14 عائلة / 8 متغيرات / 14 تركيبًا.
- سجل النصوص الافتراضية (المرحلة 7 — 2026-11-21): كل نص عربي ظاهر داخل JS العائلات (بما فيه aria-label) انتقل إلى `components/<family>/labels.js` لكل عائلة (13 عائلة) يسجّل `window.MicroLabels['<family>']` بالصياغة الحرفية السابقة، وملفات السلوك تقرأ النص وقت الاستخدام، مع تحميل labels.js قبل ملف السلوك في كل صفحة (يفحص آليًا). التخصيص: `MicroX.setLabels(partial)` على كل عائلة ذات نصوص، و`handlers.labels` في Access Gateway init، و`MicroLabels.setLocale(locale)` للتنسيق (الافتراضي `ar-u-nu-latn` بأرقام لاتينية بلا فواصل كما هو اليوم حرفيًا — لا تغيير بصري افتراضيًا)، وصيغ جمع الطلبات عبر `Intl.PluralRules('ar')` بنفس الصياغة الحرفية. بوابة جديدة `tools/hardcoded-text-check.py` داخل `check-all`: صفر نصوص عربية داخل سلاسل JS خارج ملفات labels، واقتران التحميل في الصفحات، وتغطية مفاتيح النصوص، وتغطية كل دالة عامة على `window.Micro*` في `micro-ui.d.ts`.
- `window.MicroConfig = { autoInit: false }` قبل التحميل يوقف الربط التلقائي عند DOMContentLoaded/readyState في مسار IIFE لكل العائلات (متبقي المرحلة 6)، مع بقاء كائنات الواجهة للتهيئة اليدوية؛ وأُضيف `setLabels` و`MicroLabels`/`MicroConfig` إلى `micro-ui.d.ts` و`docs/API.md` (قسم «النصوص الافتراضية وتخصيصها»).


- **سد الفجوات الوظيفية (المرحلة 8 — 2026-11-21، D15–D19):** ثلاث إضافات Draft-for-review فوق `MicroProduct` بنمط C07–C12، وكلها UI-only (المضيف يمرر البيانات ويحل الوعود):
  - **C14 سجل عمليات Manage** (`components/product-context/manage.js`): صفوف عمليات (مبيعات/مصاريف) بنص ظاهر على مبنى C02/Organization، نموذج إدخال (مبلغ بوحدة + نوع + تاريخ + ملاحظة) بأزرار B01، وملخص فترة بقيم المضيف حصريًا — **قاعدة صارمة: المكتبة لا تحسب أي مجاميع مالية**. Online-only: offline يعطل الإرسال بنص واضح، زر الإرسال يظهر حالة تحميل مع pending ولا نجاح قبل resolve، والفشل يحفظ القيم مع retry صريح بgrant. لا save-local ولا طابور.
  - **C09 وضع results لنتائج بحث Market (D17):** يستقبل مصفوفة نتائج من المضيف ويرسمها صفوفًا فوق رأس البحث نفسه، بحالات منفصلة: لا إعلانات أصلًا (`resultsState:"no-ads"`)، لا نتائج لهذا البحث (`no-results`)، فشل القراءة (retry بgrant)، وتحميل؛ صورة مفقودة/فاشلة/غير آمنة تُستبدل ببديل ثابت بحد لمس ولا تكسر التخطيط.
  - **C12 وضع queue لقائمة مراجعة متعددة (D18/D19):** قائمة ← تفاصيل، والتفاصيل هي عنصر C12 نفسه (وضع `item` — أعيدت تسميته من `queue`). الأنواع الثلاثة (إعلان/بلاغ/طلب سائق) بنص ظاهر، الترتيب كما يمرره المضيف حرفيًا، واختيار عنصر يطلق `open-review{itemId,revision}` ولا يقرر شيئًا. بنية القائمة عامة لإعادة الاستخدام لقوائم أخرى لاحقًا (قائمة مهام السائق D19 غير منفذة عمدًا).
  - حالات فحص جديدة في `tools/product-context-check.py` لكل حالة من حالات التراكيب الثلاثة (250 ← 306 حالة)، و24 نصًا افتراضيًا جديدًا (k145–k168) في سجل نصوص العائلة، ومحاكاة مضيف موثقة في مختبر سياق المنتج (أزرار إقرار النجاح/الفشل/النتيجة غير المؤكدة القائمة).

### Changed
- تعديل نص C08 لاتصال Manage المنقطع (k50) من «تحقق من مزامنة التغييرات المحلية.» إلى نص Online-only صريح: «الكتابة متاحة أثناء الاتصال فقط؛ لا حفظ محلي ولا طابور مزامنة (المرحلة 8 — توافق Online-only).» — توافقًا مع قرار Manage المتصل (السلوك العام لـC08 بgrants الصريحة لم يتغير).
- إعادة تسمية وضع عرض عنصر المراجعة المفرد في C12 من `queue` إلى `item` ليسمي `queue` قائمة المراجعة متعددة العناصر (عقد البيانات Draft والتصحيح في المرحلة نفسها؛ لا مستهلك خارجي).
- إعادة هيكلة التوثيق إلى مجموعة عقود حالية واحدة (STATUS/API/COMPOSITIONS/DESIGN-FOUNDATIONS/TESTING/HANDOFF/DECISIONS).
- زر «ابدأ الآن» في شاشة المستخدم الجديد بترولي (ثابت الهوية) بدل تراكوتا المرجع.

### Removed
- الأرشيف التاريخي للمستودع بعد tag `archive/pre-integration-2026-11-21` (D6).
