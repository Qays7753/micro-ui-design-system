# Changelog — @micro/ui

All notable changes to the Micro UI library are documented here. SemVer is followed from 0.1.0.

## 0.1.0 — 2026-11-21 (فرع الربط feature/integration-readiness-2026-11-21)

### Added
- بنية الحزمة `@micro/ui` 0.1.0 **خاصة** (`"private": true` — لا نشر على npm دون قرار المالك، D9): Vanilla بدون إطار، صفر اعتماديات تشغيل، `engines.node >= 20`، وesbuild أداة بناء وحيدة ضمن devDependencies. خرائط تصدير `css/js/fonts` + `micro-ui.d.ts` في `package.json`.
- `src/` مرآة مولّدة بايت-ببايت للمصدر القابل للتعديل (`components/` و`shared/` و`assets/`)، و`dist/` بناء حتمي متتبع: CSS منسوخ بايت-ببايت دون معالجة (D15) و`dist/css/micro-ui.css` (fonts ثم tokens ثم motion)، وJS عبر esbuild (IIFE، es2019، بلا تصغير)، وخطوط وشعار v2 وأيقونات، و`dist/MANIFEST.json` ببصمات sha256.
- `tools/build-package.mjs` البناء الحتمي ووضع `--check` (بوابة `package` داخل `check-all`)، و`tools/package/micro-ui.d.ts` تعريفات TypeScript محيطية لـ`window.Micro*` الحقيقية.
- `examples/vanilla-app/`: مثال مستقل يستهلك من `src/` مباشرة — شاشات الدخول الأربع (تركيب C13) وشاشة مركّبة من Buttons وFields وData.
- سير عمل CI محفوظ حرفيًا في `tools/ci/ci.yml` بانتظار تركيبه من المالك (توكن الرفع بلا نطاق workflow — انظر docs/DECISIONS.md المرحلة 4).
- تركيب C13 شاشات بوابة الدخول الأربع (draft-for-review) مع حالات `data-auth-state` يقودها المضيف.
- `tools/check-all.py` مدخل الفحوص الموحد، و`tools/link-check.py` لفحص الروابط، و`tools/baselines/identity.json` لقيم الهوية المحمية.
- الكتالوج في هذا الإصدار: 14 عائلة / 8 متغيرات / 13 تركيبًا.

### Changed
- إعادة هيكلة التوثيق إلى مجموعة عقود حالية واحدة (STATUS/API/COMPOSITIONS/DESIGN-FOUNDATIONS/TESTING/HANDOFF/DECISIONS).
- زر «ابدأ الآن» في شاشة المستخدم الجديد بترولي (ثابت الهوية) بدل تراكوتا المرجع.

### Removed
- الأرشيف التاريخي للمستودع بعد tag `archive/pre-integration-2026-11-21` (D6).
