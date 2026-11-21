# البدء — Micro UI

مكتبة Vanilla (بدون إطار) للهاتف العربي RTL، Light-only، صفر اعتماديات تشغيل. الحزمة `@micro/ui` 0.1.0 **خاصة** (`"private": true`) — لا نشر على npm دون قرار المالك (D9)؛ الاستهلاك عبر git. المصدر القابل للتعديل: `components/` و`shared/` و`assets/`، ومرآته المولّدة حتميًا `src/`، ومخرجات التوزيع `dist/`.

## التثبيت

الحزمة غير منشورة (D9)؛ الاستنساخ عبر git هو طريقة التثبيت الحالية:

```bash
git clone https://github.com/Qays7753/micro-ui-design-system.git
```

شجرة الحزمة المتتبعة: `src/` (مرآة بايت-ببايت للمصدر القابل للتعديل)، و`dist/` (بناء حتمي)، و`examples/` (مثال vanilla-app). لا تُعدَّل `src/` أو `dist/` يدويًا؛ عدّل `components/` و`shared/` و`assets/` ثم أعد البناء (انظر «البناء الحتمي» أدناه).

## الاستهلاك من dist (الحزمة)

خرائط التصدير في `package.json` (المسارات نسبية إلى جذر الحزمة):

| الاستيراد | الملف |
|---|---|
| `@micro/ui/css/micro-ui.css` | `dist/css/micro-ui.css` — الحزمة الشاملة: fonts ثم tokens ثم motion بسلسلة بايت-ببايت |
| `@micro/ui/css/<family>/<file>.css` | `dist/css/<family>/<file>.css` — CSS كل عائلة والملفات المشتركة (`css/shared/tokens.css`، `css/shared/motion.css`) |
| `@micro/ui/js/<file>.js` | `dist/js/<file>.js` — نسخة esbuild (IIFE، es2019، بلا تصغير) من كل ملف JS للعائلات |
| `@micro/ui/fonts/<file>` | `dist/fonts/` — fonts.css وملفات woff2 |
| `@micro/ui/micro-ui.d.ts` | `dist/micro-ui.d.ts` — تعريفات TypeScript محيطية لـ`window.Micro*` |

ترتيب تحميل CSS إلزامي: **fonts ثم tokens ثم motion (عند الحاجة) ثم CSS العائلات المستهلكة** — الحزمة الشاملة `micro-ui.css` تغطي الثلاثة الأولى معًا، وملفات woff2 مجاورة لها فتُحلّ مسارات الخطوط كما هي:

```html
<link rel="stylesheet" href="node_modules/@micro/ui/dist/css/micro-ui.css">
<link rel="stylesheet" href="node_modules/@micro/ui/dist/css/buttons/buttons.css">
<link rel="stylesheet" href="node_modules/@micro/ui/dist/css/fields/fields.css">
<!-- ثم JS العائلات مرة واحدة كسكربتات عادية (plain scripts) -->
<script src="node_modules/@micro/ui/dist/js/buttons.js"></script>
<script src="node_modules/@micro/ui/dist/js/fields.js"></script>
```

لا تغيير على طبيعة الملفات: JS يبقى سكربتات عادية توفر `window.Micro*` (D10)، والـCSS منسوخ بايت-ببايت دون أي معالجة أو تصغير (D15). التعريفات: `/// <reference types="@micro/ui/micro-ui.d.ts" />`.

## الاستهلاك من src (المرآة)

`src/` مرآة مولّدة ببنية المصدر نفسها: `src/components/<family>/…` و`src/shared/…` و`src/assets/…` (باستثناء ملفات التوثيق `*.md` — روابطها نسبية لشجرة المستودع؛ توثيق الحزمة هو هذا الملف و[API.md](API.md)). استهلكها بنفس ترتيب التحميل أعلاه بمسارات المرآة — هذا ما يفعله `examples/vanilla-app/`:

```html
<link rel="stylesheet" href="src/assets/fonts/fonts.css">
<link rel="stylesheet" href="src/shared/tokens.css">
<link rel="stylesheet" href="src/components/buttons/buttons.css">
<script src="src/components/buttons/buttons.js"></script>
```

الترتيب ذاته يسري على الشجرة القابلة للتعديل (`assets/fonts/fonts.css` ثم `shared/tokens.css` ثم `components/<family>/…`)؛ الاعتماديات المشروطة لكل عائلة في [API.md](../docs/API.md) (بطاقات الاعتماد). الخطوط IBM Plex محلية من `assets/fonts` — لا Google Fonts.

## تشغيل المثال vanilla-app

```bash
python3 tools/preview-server.py
# ثم افتح: http://localhost:5000/examples/vanilla-app/
```

المثال مستقل تمامًا: يستهلك من `src/` مباشرة (لا dist ولا previews)، ويتضمن شاشات الدخول الأربع (تركيب C13 المطابق لمرجع [Micro-Auth](references/micro-auth/README.md)) وشاشة مركّبة من Buttons وFields وData، دون أي منطق مضيف سوى محاكاة `?state=` في شاشة تسجيل الدخول.

## البناء الحتمي وفحص الحزمة

```bash
npm install          # مرة واحدة — أدوات البناء فقط (esbuild)، بلا اعتماديات تشغيل
npm run build        # node tools/build-package.mjs — مزامنة src/ ثم توليد dist/
npm run check        # node tools/build-package.mjs --check — إعادة بناء في مجلد مؤقت
                     # ومقارنة بايت-ببايت مع src/ وdist/ المتتبعتين
```

البناء حتمي: نفس شجرة الدخل تعطي نفس بايتات الخرج (لا طوابع زمنية)، و`dist/MANIFEST.json` يبصم كل مخرجات dist بـsha256. بوابة `package` داخل `check-all` تشغّل `--check` تلقائيًا. يتطلب Node 20+ (`engines.node`).

## مثال أدنى

```html
<button class="m-btn m-btn--primary" type="button">حفظ التغييرات</button>
<script>MicroButtons.setLoading(document.querySelector('.m-btn'), true, {loadingLabel: 'جارٍ الحفظ'});</script>
```

التهيئة تلقائية عند تحميل الوحدات؛ DOM المضاف ديناميكيًا يحتاج استدعاء `init` على جذره المحلي. العقود الكاملة لكل عائلة في [API.md](../docs/API.md).

## الفحص

```bash
uv sync
uv run python tools/check-all.py
```

تشمل البوابات بوابة الحزمة (`package`) وبقية بوابات الجودة والبناء؛ انظر [tools/README.md](../tools/README.md).
