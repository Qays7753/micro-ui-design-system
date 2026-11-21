#!/usr/bin/env node
/* @micro/ui — البناء الحتمي للحزمة (الجولة الثانية R2.2).
 *
 * بناء (بلا وسائط):  node tools/build-package.mjs
 *   يبني dist/ من المصدر مباشرة (لا مرآة src/ بعد الآن — حُذفت بقرار R-D4):
 *     dist/esm/<entry>.js        — esbuild format=esm, bundle, splitting=true
 *                                  (مشترك shared/* في chunks مشتركة)، هدف
 *                                  es2020 (import.meta.url جزء من مواصفة
 *                                  الوحدات)، بلا تصغير.
 *     dist/iife/<entry>.js       — من مدخل مولّد: window.MicroX = {...api}
 *                                  + تهيئة تلقائية تحترم MicroConfig.autoInit
 *                                  وdata-micro-manual (R-D3). هدف es2019،
 *                                  وbanner يخزّن document.currentScript.src
 *                                  في globalThis.__microIifeBaseUrl كي تحل
 *                                  الوحدات مسارات أصولها النسبية
 *                                  (../assets/...) كما في 0.1.0.
 *     dist/iife/micro-ui.js      — كل العائلات في ملف واحد.
 *     dist/css/<entry>.css       — ملف CSS الأساسي لكل مدخل (نسخ بايت-ببايت).
 *     dist/css/<family>/<f>.css  — شجرة CSS الكاملة كما في 0.1.0 (تضم
 *                                  الملفات الإضافية: auth-screens، welcome،
 *                                  operational-row، value-context...).
 *     dist/css/micro-ui.css      — fonts.css ثم tokens.css ثم motion.css
 *                                  (سلسلة بايت-ببايت تفصلها أسطر جديدة).
 *     dist/css/styles.css        — micro-ui.css ثم كل CSS العائلات بالترتيب
 *                                  الموثق أدناه (STYLES_ORDER).
 *     dist/types/<entry>.d.ts    — من tools/package/types/ (R3).
 *     dist/assets/ وdist/fonts/ وdist/icons/ وdist/brand/ — لحل المسارات
 *                                  النسبية (icons.js وscript-base وأمواج
 *                                  surfaces وشعار assistant).
 *     dist/MANIFEST.json         — بصمات sha256 لكل مخرجات dist.
 *
 * فحص (--check): يبني في مجلد مؤقت ويتحقق: نجاح البناء، وجود كل نقطة
 *   دخول، أن كل ملف ESM تصدّر الأسماء المتوقعة، وأن الاستيراد تحت Node
 *   (بلا DOM) ينجح — يثبت عدم وجود أثر جانبي/وصول DOM في المستوى الأعلى.
 *   لا يقارن بـdist/ متتبع (dist/ غير متتبع منذ R-D4).
 *
 * البناء حتمي: نفس الدخل ← نفس البايتات (لا طوابع زمنية ولا مسارات
 * مطلقة في المخرجات).
 */
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

/* جدول نقاط الدخول (R2.2): المدخل | المصدر | الغلوبال في IIFE |
   تهيئة تلقائية؟ | الأسماء العامة في مدخل ESM (يفحصها --check).
   R-D10 (الجولة الثانية R4): الأسماء المهملة (disconnect/sync/rescan/
   render/update الجذرية) تبقى في المصدر وتظهر في نسخة IIFE فقط — مدخل
   ESM مولّد يعيد تصدير الأسماء العامة الحصرية أدناه. */
const ENTRIES = [
  { entry: "buttons", source: "components/buttons/buttons.js", global: "MicroButtons", autoInit: false,
    exports: ["init", "setLoading", "destroy", "getInstance"] },
  { entry: "fields", source: "components/fields/fields.js", global: "MicroFields", autoInit: true,
    exports: ["init", "destroy", "getInstance", "setLabels"] },
  { entry: "selection", source: "components/selection/selection.js", global: "MicroSelection", autoInit: true,
    exports: ["init", "setSwitchPending", "destroy", "getInstance", "setLabels"] },
  { entry: "picker", source: "components/selection/picker.js", global: "MicroPicker", autoInit: true,
    exports: ["init", "update", "destroy", "getInstance", "setOptions", "setStatus", "clearSelection", "getSelected", "setLabels"] },
  { entry: "organization", source: "components/organization/organization.js", global: "MicroOrganization", autoInit: true,
    exports: ["init", "destroy", "getInstance", "setLabels"] },
  { entry: "data", source: "components/data/data.js", global: "MicroData", autoInit: true,
    exports: ["init", "getSelection", "setSelection", "destroy", "getInstance", "setLabels"] },
  { entry: "packed-circle", source: "components/data/packed-circle.js", global: "MicroPacked", autoInit: true,
    exports: ["init", "destroy", "getInstance", "setLabels"] },
  { entry: "messages", source: "components/messages/messages.js", global: "MicroMessages", autoInit: true,
    exports: ["init", "toast", "closeToast", "announce", "resetAnnouncements", "destroy", "getInstance", "setLabels"] },
  { entry: "navigation", source: "components/navigation/navigation.js", global: "MicroNavigation", autoInit: true,
    exports: ["init", "openLayer", "requestClose", "closeLayer", "appliedFilters", "setAppliedFilters", "destroy", "getInstance", "setLabels"] },
  { entry: "action-sheet", source: "components/navigation/action-sheet.js", global: "MicroActionSheet", autoInit: true,
    exports: ["init", "open", "close", "destroy", "getInstance", "setLabels"] },
  { entry: "info-strip", source: "components/info-strip/info-strip.js", global: "MicroInfoStrip", autoInit: true,
    exports: ["init", "destroy", "getInstance", "setLabels"] },
  { entry: "info-strip-peek", source: "components/info-strip/info-strip-peek.js", global: "MicroInfoPeek", autoInit: true,
    exports: ["init", "goTo", "next", "prev", "getIndex", "destroy", "getInstance", "setLabels"] },
  { entry: "metric-comparison", source: "components/metric-comparison/metric-comparison.js", global: "MicroMetricComparison", autoInit: true,
    exports: ["init", "destroy", "getInstance", "setLabels"] },
  { entry: "account-settings", source: "components/account-settings/account-settings.js", global: "MicroAccountSettings", autoInit: true,
    exports: ["init", "destroy", "getInstance", "setLabels"] },
  { entry: "access-gateway", source: "components/access-gateway/access-gateway.js", global: "MicroAccessGateway", autoInit: true,
    exports: ["init", "destroy", "getInstance", "setLabels"] },
  { entry: "carousel", source: "components/carousel/carousel.js", global: "MicroCarousel", autoInit: true,
    exports: ["init", "goTo", "next", "prev", "getIndex", "destroy", "getInstance", "setLabels"] },
  { entry: "screen", source: "components/screen/screen.js", global: "MicroScreen", autoInit: true,
    exports: ["init", "update", "destroy", "getInstance"] },
  { entry: "order-schedule", source: "components/order-schedule/order-schedule.js", global: "MicroOrderSchedule", autoInit: false,
    exports: ["init", "update", "getInstance", "destroy", "setLabels"] },
  { entry: "readings", source: "components/compositions/reading-context.js", global: "MicroReadings", autoInit: true,
    exports: ["init", "destroy", "getInstance"] },
  { entry: "product", source: "components/product-context", global: "MicroProduct", autoInit: false,
    exports: ["register", "mount", "contextKey", "init", "destroy", "getInstance", "setLabels"] },
  { entry: "icons", source: "shared/icons.js", global: "MicroIcons", autoInit: false,
    exports: ["hydrate", "ready"] },
  { entry: "labels", source: "shared/labels.js", global: "MicroLabels", autoInit: false,
    exports: ["registerLabels", "getLabel", "familyLabels", "setLabels", "setLocale", "getLocale", "formatNumber", "pluralCategory", "plural"] },
];

/* الملفات الإضافية لمدخل product (النواة + كل renderers — R2.2). */
const PRODUCT_RENDERERS = [
  "context", "operation", "market", "delivery", "assistant", "review", "manage",
];

/* ملف CSS الأساسي لكل مدخل (نسخ بايت-ببايت إلى css/<entry>.css). */
const ENTRY_CSS = {
  "buttons": "components/buttons/buttons.css",
  "fields": "components/fields/fields.css",
  "selection": "components/selection/selection.css",
  "picker": "components/selection/picker.css",
  "organization": "components/organization/organization.css",
  "data": "components/data/data.css",
  "packed-circle": "components/data/packed-circle.css",
  "messages": "components/messages/messages.css",
  "navigation": "components/navigation/navigation.css",
  "action-sheet": "components/navigation/action-sheet.css",
  "info-strip": "components/info-strip/info-strip.css",
  "info-strip-peek": "components/info-strip/info-strip-peek.css",
  "metric-comparison": "components/metric-comparison/metric-comparison.css",
  "account-settings": "components/account-settings/account-settings.css",
  "access-gateway": "components/access-gateway/access-gateway.css",
  "carousel": "components/carousel/carousel.css",
  "screen": "components/screen/screen.css",
  "order-schedule": "components/order-schedule/order-schedule.css",
  "product": "components/product-context/product-context.css",
};

/* ترتيب styles.css الموثق (GETTING-STARTED: fonts ثم tokens ثم motion ثم
   CSS العائلات)؛ الترتيب بين العائلات بترتيب تحميل المعرض المعتمد. */
const STYLES_ORDER = [
  "components/buttons/buttons.css",
  "components/fields/fields.css",
  "components/selection/selection.css",
  "components/selection/picker.css",
  "components/organization/organization.css",
  "components/organization/operational-row.css",
  "components/data/data.css",
  "components/data/packed-circle.css",
  "components/messages/messages.css",
  "components/navigation/navigation.css",
  "components/navigation/action-sheet.css",
  "components/access-gateway/access-gateway.css",
  "components/access-gateway/auth-screens.css",
  "components/access-gateway/welcome.css",
  "components/info-strip/info-strip.css",
  "components/info-strip/value-context.css",
  "components/info-strip/info-strip-peek.css",
  "components/metric-comparison/metric-comparison.css",
  "components/account-settings/account-settings.css",
  "components/order-schedule/order-schedule.css",
  "components/carousel/carousel.css",
  "components/screen/screen.css",
  "components/product-context/product-context.css",
  "components/surfaces/surfaces.css",
  "components/surfaces/curves.css",
  "components/compositions/reading-layout.css",
  "components/compositions/form-surface.css",
  "components/compositions/mobile-shell.css",
];

const ESBUILD_COMMON = {
  minify: false,
  charset: "utf8",
  legalComments: "none",
  logLevel: "silent",
  bundle: true,
};

/* banner لملفات IIFE: يُنفَّذ قبل الحزمة فالتقط src السكربت الحالي —
   بذلك تحل الوحدات مسارات ../assets النسبية كما في 0.1.0 (R2.2). */
const IIFE_BANNER = "if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}";

function die(message) {
  console.error(message);
  process.exit(1);
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

/** كل الملفات تحت dir كمسارات نسبية منه، بترتيب محدد (sorted). */
function walkRel(dir) {
  const out = [];
  const stack = [""];
  while (stack.length) {
    const rel = stack.pop();
    const abs = path.join(dir, rel);
    const entries = readdirSync(abs, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1));
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) stack.push(childRel);
      else if (entry.isFile()) out.push(childRel);
    }
  }
  return out.sort();
}

function copyInto(sourceFile, targetDir, targetRel) {
  mkdirSync(path.dirname(path.join(targetDir, targetRel)), { recursive: true });
  cpSync(sourceFile, path.join(targetDir, targetRel));
}

function autoInitCode(global) {
  return `
(function () {
  function enabled() {
    return !(window.MicroConfig && window.MicroConfig.autoInit === false)
      && !document.querySelector('[data-micro-manual]');
  }
  function start() { if (enabled() && typeof window.${global}.init === 'function') window.${global}.init(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
`;
}

/** مدخل ESM مولّد لكل عائلة (R-D10): يعيد تصدير الأسماء العامة وحدها —
    الأسماء المهملة (disconnect/sync/rescan/render/update الجذرية) تبقى في
    المصدر وتظهر في نسخة IIFE فقط، فلا تصل إلى مدخل ESM أبدًا. */
function writeEsmEntry(entryDir, spec) {
  const source = spec.entry === "product"
    ? writeProductAggregator(entryDir)
    : path.join(ROOT, spec.source);
  const file = path.join(entryDir, "esm", `${spec.entry}.mjs`);
  mkdirSync(path.dirname(file), { recursive: true });
  let prologue = "";
  if (spec.entry === "product") {
    // تسجيل renderers أثر جانبي مقصود — المرجع الصريح يمنع اجتثاثه مهما
    // تغيرت إعدادات sideEffects، فلا يعمل mount بنوع غير مسجل أبدًا.
    const ids = PRODUCT_RENDERERS.map((name, i) => `r${i}`);
    prologue = PRODUCT_RENDERERS.map((name, i) =>
      `import * as ${ids[i]} from ${JSON.stringify(path.join(ROOT, "components/product-context", name + ".js"))};`).join("\n")
      + `\nvoid [${ids.join(", ")}];\n`;
  }
  writeFileSync(file, prologue + `export { ${spec.exports.join(", ")} } from ${JSON.stringify(source)};\n`, "utf8");
  return file;
}

async function buildEsm(distDir, entryDir) {
  const entryPoints = {};
  for (const spec of ENTRIES) {
    entryPoints[spec.entry] = writeEsmEntry(entryDir, spec);
  }
  const result = await esbuild.build({
    ...ESBUILD_COMMON,
    entryPoints,
    format: "esm",
    splitting: true,
    target: ["es2020"], // import.meta.url (script-base) جزء من مواصفة الوحدات
    outdir: "esm",
    write: false,
  });
  for (const file of result.outputFiles) {
    const rel = path.relative("esm", file.path);
    mkdirSync(path.dirname(path.join(distDir, "esm", rel)), { recursive: true });
    writeFileSync(path.join(distDir, "esm", rel), file.contents);
  }
  return result.outputFiles.length;
}

/** مجمع product: يعيد تصدير صادرات النواة ويستورد كل renderers (تسجيل
    جانبي عند التحميل) — R2.2: مدخل واحد يجمع core وكل renderers. */
function writeProductAggregator(entryDir) {
  const file = path.join(entryDir, "product-aggregate.mjs");
  writeFileSync(file, [
    `export * from ${JSON.stringify(path.join(ROOT, "components/product-context/product-core.js"))};`,
    ...PRODUCT_RENDERERS.map((name) => `import ${JSON.stringify(path.join(ROOT, "components/product-context", name + ".js"))};`),
  ].join("\n"), "utf8");
  return file;
}

/** مدخل IIFE مولّد لمدخل واحد (يكتب في مجلد مؤقت): يستورد الوحدة، ينشئ
    الغلوبال، ويضيف التهيئة التلقائية والخصائص التوافقية. */
function writeIifeEntry(entryDir, spec) {
  const source = spec.entry === "product"
    ? writeProductAggregator(entryDir)
    : path.join(ROOT, spec.source);
  let extra = "";
  if (spec.entry === "labels") {
    // توافق 0.1.0: خاصية locale قابلة للقراءة على الغلوبال.
    extra = `\nObject.defineProperty(window.MicroLabels, 'locale', { configurable: true, get: function () { return window.MicroLabels.getLocale(); } });\n`;
  }
  if (spec.entry === "icons") {
    // توافق 0.1.0: الترطيب المتعجل عند التحميل كخاصية ready.
    extra = `\nwindow.MicroIcons.ready = window.MicroIcons.hydrate();\n`;
  }
  const file = path.join(entryDir, `${spec.entry}.mjs`);
  writeFileSync(file, [
    `import * as api from ${JSON.stringify(source)};`,
    `window.${spec.global} = Object.assign({}, api);`,
    extra,
    spec.autoInit ? autoInitCode(spec.global) : "",
  ].join("\n"), "utf8");
  return file;
}

async function buildIife(distDir, entryDir) {
  mkdirSync(path.join(entryDir, "iife"), { recursive: true });
  let count = 0;
  for (const spec of ENTRIES) {
      const file = writeIifeEntry(path.join(entryDir, "iife"), spec);
      const result = await esbuild.build({
        ...ESBUILD_COMMON,
        entryPoints: [file],
        format: "iife",
        target: ["es2019"],
        banner: { js: IIFE_BANNER },
        write: false,
      });
      writeFileSync(path.join(distDir, "iife", `${spec.entry}.js`), result.outputFiles[0].contents);
      count++;
    }
    // micro-ui.js — كل العائلات في ملف واحد (ترتيب الجدول).
    const productAggregate = writeProductAggregator(entryDir);
    const imports = ENTRIES.map((spec) => {
      const source = spec.entry === "product" ? productAggregate : path.join(ROOT, spec.source);
      const id = `api_${spec.entry.replace(/-/g, "_")}`;
      return { spec, id, line: `import * as ${id} from ${JSON.stringify(source)};` };
    });
    const globals = imports.map(({ spec, id }) => {
      let extra = "";
      if (spec.entry === "labels") extra = `\nObject.defineProperty(window.${spec.global}, 'locale', { configurable: true, get: function () { return window.${spec.global}.getLocale(); } });`;
      if (spec.entry === "icons") extra = `\nwindow.MicroIcons.ready = window.MicroIcons.hydrate();`;
      return `window.${spec.global} = Object.assign({}, ${id});${extra}`;
    }).join("\n");
    const autoInits = ENTRIES.filter((s) => s.autoInit).map((s) => autoInitCode(s.global)).join("\n");
    const bundleEntry = path.join(entryDir, "micro-ui.mjs");
    writeFileSync(bundleEntry, [
      imports.map((i) => i.line).join("\n"),
      globals,
      autoInits,
      "",
    ].join("\n"), "utf8");
    const result = await esbuild.build({
      ...ESBUILD_COMMON,
      entryPoints: [bundleEntry],
      format: "iife",
      target: ["es2019"],
      banner: { js: IIFE_BANNER },
      write: false,
    });
    writeFileSync(path.join(distDir, "iife", "micro-ui.js"), result.outputFiles[0].contents);
    count++;
  return count;
}

function buildCss(distDir) {
  // 1) شجرة CSS الكاملة كما في 0.1.0: css/<family>/<file>.css — بايت-ببايت.
  for (const family of readdirSync(path.join(ROOT, "components"), { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (!family.isDirectory()) continue;
    for (const rel of walkRel(path.join(ROOT, "components", family.name))) {
      if (rel.endsWith(".css")) {
        copyInto(path.join(ROOT, "components", family.name, rel), distDir, `css/${family.name}/${rel}`);
      }
    }
  }
  for (const rel of walkRel(path.join(ROOT, "shared"))) {
    if (rel.endsWith(".css")) copyInto(path.join(ROOT, "shared", rel), distDir, `css/shared/${rel}`);
  }
  // 2) ملف كل مدخل (الأساسي) مسطحًا: css/<entry>.css.
  for (const [entry, cssPath] of Object.entries(ENTRY_CSS)) {
    cpSync(path.join(ROOT, cssPath), path.join(distDir, "css", `${entry}.css`));
  }
  // 3) الحزمة الشاملة: fonts ثم tokens ثم motion.
  const parts = [
    readFileSync(path.join(ROOT, "assets", "fonts", "fonts.css")),
    readFileSync(path.join(ROOT, "shared", "tokens.css")),
    readFileSync(path.join(ROOT, "shared", "motion.css")),
  ];
  const microUi = Buffer.concat([parts[0], Buffer.from("\n"), parts[1], Buffer.from("\n"), parts[2]]);
  writeFileSync(path.join(distDir, "css", "micro-ui.css"), microUi);
  // 4) styles.css = micro-ui.css ثم كل CSS العائلات بالترتيب الموثق.
  const styles = [microUi, ...STYLES_ORDER.map((rel) => readFileSync(path.join(ROOT, rel)))];
  writeFileSync(path.join(distDir, "css", "styles.css"), Buffer.concat(
    styles.flatMap((buffer, index) => index === 0 ? [buffer] : [Buffer.from("\n"), buffer])
  ));
  return Object.keys(ENTRY_CSS).length + 2;
}

function buildAssets(distDir) {
  // الخطوط الكاملة + fonts.css.
  for (const rel of walkRel(path.join(ROOT, "assets", "fonts"))) {
    if (rel.endsWith(".woff2") || rel === "fonts.css") {
      copyInto(path.join(ROOT, "assets", "fonts", rel), distDir, `fonts/${rel}`);
    }
  }
  // woff2 بجوار micro-ui.css (تحلّ url('./…') داخل الحزمة الشاملة).
  for (const rel of walkRel(path.join(ROOT, "assets", "fonts"))) {
    if (rel.endsWith(".woff2")) copyInto(path.join(ROOT, "assets", "fonts", rel), distDir, `css/${rel}`);
  }
  // الشعار v2 (العلوي كما في 0.1.0) + نسخة تحت assets/ يحلها assistant
  // عبر '../assets/brand/...' من موضع الحزمة.
  for (const rel of walkRel(path.join(ROOT, "assets", "brand", "micro-logo", "v2"))) {
    copyInto(path.join(ROOT, "assets", "brand", "micro-logo", "v2", rel), distDir, `brand/micro-logo/v2/${rel}`);
    copyInto(path.join(ROOT, "assets", "brand", "micro-logo", "v2", rel), distDir, `assets/brand/micro-logo/v2/${rel}`);
  }
  // الأيقونات (علوية + تحت assets/ يحلها icons.js عبر '../assets/icons/').
  for (const rel of walkRel(path.join(ROOT, "assets", "icons"))) {
    copyInto(path.join(ROOT, "assets", "icons", rel), distDir, `icons/${rel}`);
    copyInto(path.join(ROOT, "assets", "icons", rel), distDir, `assets/icons/${rel}`);
  }
  // أمواج surfaces (تحلها url('../../assets/surfaces/…') داخل CSS المنسوخ).
  for (const rel of walkRel(path.join(ROOT, "assets", "surfaces"))) {
    copyInto(path.join(ROOT, "assets", "surfaces", rel), distDir, `assets/surfaces/${rel}`);
  }
}

function buildTypes(distDir) {
  // الأنواع من tools/package/types (R3): ملف لكل مدخل + iife.d.ts —
  // يتحقق --check من اكتمالها لكل مدخل.
  const typesDir = path.join(ROOT, "tools", "package", "types");
  if (!statSync(typesDir, { throwIfNoEntry: false })) return 0;
  let count = 0;
  for (const rel of walkRel(typesDir)) {
    copyInto(path.join(typesDir, rel), distDir, `types/${rel}`);
    count++;
  }
  return count;
}

/** توليد محتوى dist كاملًا داخل distDir. */
async function buildDistInto(distDir) {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(path.join(distDir, "esm"), { recursive: true });
  mkdirSync(path.join(distDir, "iife"), { recursive: true });
  mkdirSync(path.join(distDir, "css"), { recursive: true });

  /* مدخلات التوليد في مجلد ثابت تحت الجذر (لا mkdtemp): تعليقات حدود
     الوحدات في مخرجات esbuild غير المصغّرة تتضمن مسار المدخل نسبةً إلى
     موضع ملف الخرج — مسار عشوائي يكسر الحتمية؛ مسار ثابت يجعل البايتات
     مستقرة عبر التشغيلات والأجهزة. يُحذف بعد البناء (مولَّد لا متتبع). */
  const entryDir = path.join(ROOT, "tools", "package", ".build-entries");
  rmSync(entryDir, { recursive: true, force: true });
  mkdirSync(entryDir, { recursive: true });
  /* حصانة البناء من اكتشاف tsconfig: esbuild يبحث عن أقرب tsconfig.json
     فوق ملف المدخل ويطبّق خياراته (مثل alwaysStrict من strict) على مخرجات
     IIFE، فتتغير البايتات بوجود tools/package/tsconfig.json (R3). ملف فارغ
     داخل مجلد المداخل يثبت السلوك على الافتراضي مهما أضيف حوله. */
  writeFileSync(path.join(entryDir, "tsconfig.json"), "{}\n", "utf8");
  try {
    const esmFiles = await buildEsm(distDir, entryDir);
    const iifeFiles = await buildIife(distDir, entryDir);
    const cssFiles = buildCss(distDir);
    buildAssets(distDir);
    const typeFiles = buildTypes(distDir);

    const manifest = {};
    for (const rel of walkRel(distDir)) {
      if (rel === "MANIFEST.json") continue;
      manifest[rel] = sha256(path.join(distDir, rel));
    }
    writeFileSync(path.join(distDir, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n");
    return { files: Object.keys(manifest).length + 1, esmFiles, iifeFiles, cssFiles, typeFiles };
  } finally {
    rmSync(entryDir, { recursive: true, force: true });
  }
}

/** تحقق --check: كل مدخل موجود وESM تصدّر الأسماء المتوقعة والاستيراد
    تحت Node (بلا DOM) ينجح — إثبات عدم وجود أثر جانبي عند الاستيراد. */
async function verify(distDir) {
  const problems = [];
  for (const spec of ENTRIES) {
    const esmPath = path.join(distDir, "esm", `${spec.entry}.js`);
    if (!statSync(esmPath, { throwIfNoEntry: false })) {
      problems.push(`esm/${spec.entry}.js: missing`);
      continue;
    }
    const iifePath = path.join(distDir, "iife", `${spec.entry}.js`);
    if (!statSync(iifePath, { throwIfNoEntry: false })) {
      problems.push(`iife/${spec.entry}.js: missing`);
    }
    // R3: لكل مدخل ملف أنواع مطابق في dist/types.
    const typesPath = path.join(distDir, "types", `${spec.entry}.d.ts`);
    if (!statSync(typesPath, { throwIfNoEntry: false })) {
      problems.push(`types/${spec.entry}.d.ts: missing`);
    }
    try {
      const imported = await import(`file://${esmPath}`);
      const names = Object.keys(imported).sort();
      const expected = [...spec.exports].sort();
      const missing = expected.filter((n) => !names.includes(n));
      if (missing.length) problems.push(`esm/${spec.entry}.js: missing exports {${missing.join(", ")}}`);
    } catch (error) {
      problems.push(`esm/${spec.entry}.js: import failed under Node (side effect?): ${error.message}`);
    }
    const iifeText = readFileSync(iifePath, "utf8");
    if (!iifeText.includes(`window.${spec.global}`)) {
      problems.push(`iife/${spec.entry}.js: global ${spec.global} not assigned`);
    }
  }
  // micro-ui.js: كل الغلوبالات.
  const microUi = readFileSync(path.join(distDir, "iife", "micro-ui.js"), "utf8");
  for (const spec of ENTRIES) {
    if (!microUi.includes(`window.${spec.global}`)) {
      problems.push(`iife/micro-ui.js: global ${spec.global} missing`);
    }
  }
  // الملفات الأساسية.
  for (const rel of ["css/micro-ui.css", "css/styles.css", "MANIFEST.json", "types/iife.d.ts"]) {
    if (!statSync(path.join(distDir, rel), { throwIfNoEntry: false })) {
      problems.push(`${rel}: missing`);
    }
  }
  for (const [entry, cssPath] of Object.entries(ENTRY_CSS)) {
    if (!statSync(path.join(distDir, "css", `${entry}.css`), { throwIfNoEntry: false })) {
      problems.push(`css/${entry}.css: missing (from ${cssPath})`);
    }
  }
  return problems;
}

async function main() {
  const check = process.argv.includes("--check");
  if (check) {
    const temp = mkdtempSync(path.join(tmpdir(), "micro-ui-dist-"));
    let problems;
    try {
      await buildDistInto(path.join(temp, "dist"));
      problems = await verify(path.join(temp, "dist"));
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
    if (problems.length) {
      console.error(`package check: FAIL (${problems.length} problem${problems.length === 1 ? "" : "s"})`);
      for (const line of problems.slice(0, 50)) console.error("  " + line);
      process.exit(1);
    }
    console.log(`package check: OK (${ENTRIES.length} entries build, ESM exports verified, no side effects at import, types for every entry)`);
    return 0;
  }
  const { files, esmFiles, iifeFiles, cssFiles } = await buildDistInto(DIST);
  console.log(`package build: OK (dist/ ${files} files: esm ${esmFiles}, iife ${iifeFiles}, css ${cssFiles}+)`);
  return 0;
}

main().catch((error) => die(`build-package: ${error && error.message ? error.message : error}`));
