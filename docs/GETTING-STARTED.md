# البدء — Micro UI

مكتبة Vanilla (بدون إطار) للهاتف العربي RTL، Light-only، صفر اعتماديات تشغيل. الحزمة `@micro/ui` 0.2.0 **خاصة** (`"private": true`) — لا نشر على npm دون قرار المالك؛ الاستهلاك عبر git. مصدر السلوك الوحيد: **ES modules** في `components/<family>/*.js` و`shared/*.js` (R-D2)، والحزمة تُبنى حتميًا إلى `dist/` غير المتتبع (`node tools/build-package.mjs` — R-D4/D5).

## التثبيت

```bash
npm install github:Qays7753/micro-ui-design-system#v0.2.0
```

سكربت `prepare` في الحزمة يبني `dist/` تلقائيًا عند التثبيت من git (يحتاج Node 20+؛ أدوات البناء devDependencies فقط: esbuild وtypescript — R-D9). أو استنسخ المستودع وابنِ يدويًا:

```bash
git clone https://github.com/Qays7753/micro-ui-design-system.git
node tools/build-package.mjs
```

## المداخل

| المدخل | المصدر | الغلوبال في IIFE |
|---|---|---|
| `@micro/ui/buttons` | components/buttons/buttons.js | `MicroButtons` |
| `@micro/ui/fields` | components/fields/fields.js | `MicroFields` |
| `@micro/ui/selection` | components/selection/selection.js | `MicroSelection` |
| `@micro/ui/picker` | components/selection/picker.js | `MicroPicker` |
| `@micro/ui/organization` | components/organization/organization.js | `MicroOrganization` |
| `@micro/ui/data` | components/data/data.js | `MicroData` |
| `@micro/ui/packed-circle` | components/data/packed-circle.js | `MicroPacked` |
| `@micro/ui/messages` | components/messages/messages.js | `MicroMessages` |
| `@micro/ui/navigation` | components/navigation/navigation.js | `MicroNavigation` |
| `@micro/ui/action-sheet` | components/navigation/action-sheet.js | `MicroActionSheet` |
| `@micro/ui/info-strip` | components/info-strip/info-strip.js | `MicroInfoStrip` |
| `@micro/ui/info-strip-peek` | components/info-strip/info-strip-peek.js | `MicroInfoPeek` |
| `@micro/ui/metric-comparison` | components/metric-comparison/metric-comparison.js | `MicroMetricComparison` |
| `@micro/ui/account-settings` | components/account-settings/account-settings.js | `MicroAccountSettings` |
| `@micro/ui/access-gateway` | components/access-gateway/access-gateway.js | `MicroAccessGateway` |
| `@micro/ui/carousel` | components/carousel/carousel.js | `MicroCarousel` |
| `@micro/ui/screen` | components/screen/screen.js | `MicroScreen` |
| `@micro/ui/order-schedule` | components/order-schedule/order-schedule.js | `MicroOrderSchedule` |
| `@micro/ui/readings` | components/compositions/reading-context.js | `MicroReadings` |
| `@micro/ui/product` | components/product-context (النواة وكل renderers) | `MicroProduct` |
| `@micro/ui/icons` | shared/icons.js | `MicroIcons` |
| `@micro/ui/labels` | shared/labels.js | `MicroLabels` |

CSS: `@micro/ui/styles.css` (الكل بالترتيب الموثق أدناه) أو `@micro/ui/micro-ui.css` (fonts + tokens + motion) أو `@micro/ui/<family>.css` و`@micro/ui/css/<family>/<file>.css` لملف محدد. ملفات IIFE: `@micro/ui/iife/<entry>.js`، والأصول: `@micro/ui/assets/*` و`@micro/ui/fonts/*` و`@micro/ui/icons/*`.

## الطريقة (أ) — bundler (Vite / esbuild / webpack …)

```js
import { init } from '@micro/ui/buttons';
import { init as initFields } from '@micro/ui/fields';
import '@micro/ui/styles.css';

const instance = init(document);   // init يدوي — ESM بلا تهيئة تلقائية (R-D2)
```

أنواع كل مدخل تُحل تلقائيًا من `dist/types/<entry>.d.ts` عبر `exports` — لا إعداد إضافي لـTypeScript.

## الطريقة (ب) — importmap بلا bundler

خريطة استيراد صريحة لكل مدخل مستهلك (لاحظ الامتداد `.js`)، والأصول تُحل نسبيًا من `dist/esm`:

```html
<link rel="stylesheet" href="node_modules/@micro/ui/dist/css/styles.css">
<script type="importmap">
{
  "imports": {
    "@micro/ui/buttons": "./node_modules/@micro/ui/dist/esm/buttons.js",
    "@micro/ui/fields": "./node_modules/@micro/ui/dist/esm/fields.js",
    "@micro/ui/product": "./node_modules/@micro/ui/dist/esm/product.js"
  }
}
</script>
<script type="module">
  import { init } from '@micro/ui/buttons';
  import { mount } from '@micro/ui/product';
  init(document);
</script>
```

مثال كامل قابل للتشغيل (Buttons وFields وNavigation وتركيب C14 مع دورة destroy/remount): [examples/esm-app](../examples/esm-app/index.html) — يُقدَّم من خادم المستودع (`tools/preview-server.py` يبني الحزمة تلقائيًا عند قدمائها).

## الطريقة (ج) — سكربتات IIFE (بلا أدوات إطلاقًا)

```html
<link rel="stylesheet" href="node_modules/@micro/ui/dist/css/styles.css">
<script src="node_modules/@micro/ui/dist/iife/buttons.js"></script>
<script src="node_modules/@micro/ui/dist/iife/fields.js"></script>
<!-- أو كل العائلات ملفًا واحدًا: -->
<script src="node_modules/@micro/ui/dist/iife/micro-ui.js"></script>
```

ملفات IIFE توفر `window.Micro*` (R-D3) وتهيئ تلقائيًا عند `DOMContentLoaded` ما لم يُعطَّل ذلك بـ`window.MicroConfig = { autoInit: false }` أو وجود سمة `data-micro-manual` على الصفحة. الأسماء القديمة (`disconnect`/`sync`/`rescan`/`render`/`update` الجذرية) تبقى في IIFE فقط كأسماء مهملة حتى `1.0` (R-D10) — لا تُصدَّر من ESM. مثال: [examples/vanilla-app](../examples/vanilla-app/index.html).

## ترتيب تحميل CSS (إلزامي)

**fonts ثم tokens ثم motion (عند الحاجة) ثم CSS العائلات المستهلكة.** الحزمة الشاملة `micro-ui.css` تغطي الثلاثة الأولى معًا، وملفات `woff2` مجاورة لها فتُحل مسارات الخطوط نسبيًا من موضع الحزمة نفسها — وكذلك الأيقونات (`dist/assets/icons/`) وصور العلامة. `styles.css` = الحزمة الشاملة + كل CSS العائلات بالترتيب نفسه الذي يعرضه المعرض.

## الأنواع والنصوص

- أنواع كل مدخل: `dist/types/<entry>.d.ts` (تُنسخ من `tools/package/types/` عند البناء)؛ فحص الأنواع في المستودع: `npm run typecheck`. غلوبالات IIFE: `dist/types/iife.d.ts` — `/// <reference types="@micro/ui/iife" />` أو تضمين الملف في tsconfig.
- النصوص الافتراضية لكل عائلة في `components/<family>/labels.js` وتخصيصها جزئيًا عبر `setLabels(partial)` في كل مدخل، و`setLocale(locale)` (من مدخل labels) لتغيير تنسيق الأرقام — الافتراضي `ar-u-nu-latn` (أرقام لاتينية بلا فواصل). المفاتيح الكاملة لكل عائلة في [docs/LABELS.md](LABELS.md) والعقود التفصيلية في [docs/API.md](API.md).

## الفحص

```bash
uv sync
npm ci
uv run python tools/check-all.py
npm run typecheck
```

تشمل البوابات بوابة الحزمة (`package`) وبوابة `package-install` (تثبيت فعلي في مشروع مؤقت + استيراد تحت Node + فحص متصفح + تثبيت من git) وبقية بوابات الجودة والبناء؛ انظر [tools/README.md](../tools/README.md).
