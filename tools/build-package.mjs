#!/usr/bin/env node
/* @micro/ui — البناء الحتمي للحزمة (المرحلة 5).
 *
 * بناء (بلا وسائط):  node tools/build-package.mjs
 *   1) مزامنة مرايا المصدر: components/ وshared/ وassets/ تُنسخ بايت-ببايت
 *      إلى src/ (src/components، src/shared، src/assets) باستثناء ملفات
 *      التوثيق *.md (روابطها نسبية لشجرة المستودع لا للحزمة) — src/ مرآة
 *      مُتابَعة (committed) للمصدر القابل للاستهلاك.
 *   2) توليد dist/ من src/:
 *      - dist/css/<family>/<file>.css لكل CSS عائلة، وdist/css/shared/<file>.css
 *        للملفات المشتركة (نسخ بايت-ببايت — لا معالجة CSS إطلاقًا وفق D15).
 *      - dist/css/micro-ui.css = fonts.css ثم tokens.css ثم motion.css
 *        (سلسلة بايت-ببايت تفصلها أسطر جديدة).
 *      - dist/js/<basename>.js لكل components/<family>/<file>.js وshared/<file>.js عبر esbuild
 *        (format iife، target es2019، بلا تصغير؛ charset utf8 وlegalComments none
 *        للحتمية).
 *      - dist/fonts/ (fonts.css + woff2)، dist/brand/micro-logo/v2/،
 *        dist/icons/، وdist/assets/{icons,surfaces}/ كي تُحلّ المسارات
 *        النسبية url("../../assets/...") و"../assets/icons/" داخل CSS/JS
 *        المنسوخين حرفيًا.
 *      - dist/micro-ui.d.ts نسخة من tools/package/micro-ui.d.ts.
 *      - dist/MANIFEST.json: بصمات sha256 لكل مخرجات dist بترتيب محدد.
 *
 * فحص (--check): يعيد البناء في مجلد مؤقت ويقارن بايت-ببايت مع dist/
 * المُتابَعة، ويتحقق أن مرايا src/ مطابقة للمصدر؛ أي فرق = خروج 1 بقائمة
 * الفروق. البناء حتمي: نفس شجرة الدخل تعطي نفس بايتات الخرج (لا طوابع
 * زمنية ولا مسارات مطلقة في المخرجات).
 */
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const MIRROR_DIRS = ["components", "shared", "assets"];
// ملفات التوثيق (*.md) لا تدخل المرآة: روابطها النسبية (../../docs و
// ../../previews و../../tools) تُحلّ في شجرة المستودع فقط، وتوثيق الحزمة
// سطح آخر (README.md وCHANGELOG.md عبر files). كل ما عداها يُنسخ بايت-ببايت.
const MIRROR_EXCLUDE_SUFFIXES = [".md"];
const ESBUILD_OPTIONS = {
  format: "iife",
  target: ["es2019"],
  minify: false,
  charset: "utf8",
  legalComments: "none",
  bundle: false,
  logLevel: "silent",
  write: false,
};

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

/** نسخة بايت-ببايت (بلا أي معالجة CSS — ثابت D15). */
function copyCss(sourceFile, targetDir, targetRel) {
  copyInto(sourceFile, targetDir, targetRel);
}

/** مداخل JS: كل components/<family>/<file>.js وshared/<file>.js (مرتبة). */
function jsEntries() {
  const entries = [];
  for (const family of readdirSync(path.join(ROOT, "components"), { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (!family.isDirectory()) continue;
    for (const rel of walkRel(path.join(ROOT, "components", family.name))) {
      if (rel.endsWith(".js")) entries.push({ source: `components/${family.name}/${rel}`, output: path.basename(rel) });
    }
  }
  for (const rel of walkRel(path.join(ROOT, "shared"))) {
    if (rel.endsWith(".js")) entries.push({ source: `shared/${rel}`, output: path.basename(rel) });
  }
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.output)) die(`build-package: JS basename collision on ${entry.output} (keep dist/js/<basename>.js unique)`);
    seen.add(entry.output);
  }
  return entries.sort((a, b) => (a.source < b.source ? -1 : 1));
}

/** إخراج esbuild الحتمي لمدخل واحد (سلسلة UTF-8 كما ولّدها esbuild). */
async function esbuildEntry(sourceRel) {
  const result = await esbuild.build({ ...ESBUILD_OPTIONS, entryPoints: [path.join(ROOT, sourceRel)] });
  return result.outputFiles[0].text;
}

/** سلسلة micro-ui.css: fonts ثم tokens ثم motion بفواصل أسطر جديدة. */
function microUiBundleCss() {
  const parts = [
    readFileSync(path.join(ROOT, "assets", "fonts", "fonts.css")),
    readFileSync(path.join(ROOT, "shared", "tokens.css")),
    readFileSync(path.join(ROOT, "shared", "motion.css")),
  ];
  return Buffer.concat([parts[0], Buffer.from("\n"), parts[1], Buffer.from("\n"), parts[2]]);
}

/** توليد محتوى dist كاملًا داخل distDir (بلا لمس src/ أو dist/ الفعلية). */
async function buildDistInto(distDir) {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  // 1) CSS العائلات والمشترك — نسخ بايت-ببايت بالبنية: css/<family>/<file>.css
  for (const family of readdirSync(path.join(ROOT, "components"), { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (!family.isDirectory()) continue;
    for (const rel of walkRel(path.join(ROOT, "components", family.name))) {
      if (rel.endsWith(".css")) copyCss(path.join(ROOT, "components", family.name, rel), distDir, `css/${family.name}/${rel}`);
    }
  }
  for (const rel of walkRel(path.join(ROOT, "shared"))) {
    if (rel.endsWith(".css")) copyCss(path.join(ROOT, "shared", rel), distDir, `css/shared/${rel}`);
  }

  // 2) الحزمة الشاملة + ملفات الخطوط المجاورة لها (تحلّ url('./…') حرفيًا).
  writeFileSync(path.join(distDir, "css", "micro-ui.css"), microUiBundleCss());
  for (const rel of walkRel(path.join(ROOT, "assets", "fonts"))) {
    if (rel.endsWith(".woff2")) copyInto(path.join(ROOT, "assets", "fonts", rel), distDir, `css/${rel}`);
  }

  // 3) JS عبر esbuild — dist/js/<basename>.js
  const entries = jsEntries();
  for (const entry of entries) {
    const code = await esbuildEntry(entry.source);
    mkdirSync(path.join(distDir, "js"), { recursive: true });
    writeFileSync(path.join(distDir, "js", entry.output), code);
  }

  // 4) الخطوط الكاملة، الشعار v2، الأيقونات، وأصول المسارات النسبية.
  for (const rel of walkRel(path.join(ROOT, "assets", "fonts"))) {
    if (rel.endsWith(".woff2") || rel === "fonts.css") copyInto(path.join(ROOT, "assets", "fonts", rel), distDir, `fonts/${rel}`);
  }
  for (const rel of walkRel(path.join(ROOT, "assets", "brand", "micro-logo", "v2"))) {
    copyInto(path.join(ROOT, "assets", "brand", "micro-logo", "v2", rel), distDir, `brand/micro-logo/v2/${rel}`);
  }
  for (const rel of walkRel(path.join(ROOT, "assets", "icons"))) {
    copyInto(path.join(ROOT, "assets", "icons", rel), distDir, `icons/${rel}`);
  }
  // CSS/JS المنسوخين يحيلون إلى ../../assets/ و../assets/ — تُحلّ داخل dist
  // بإبقاء البنية النسبية نفسها (icons لأقنعة CSS وقاعدة icons.js،
  // وsurfaces لأمواج surfaces.css).
  for (const rel of walkRel(path.join(ROOT, "assets", "icons"))) {
    copyInto(path.join(ROOT, "assets", "icons", rel), distDir, `assets/icons/${rel}`);
  }
  for (const rel of walkRel(path.join(ROOT, "assets", "surfaces"))) {
    copyInto(path.join(ROOT, "assets", "surfaces", rel), distDir, `assets/surfaces/${rel}`);
  }

  // 5) التعريفات والبصمات.
  cpSync(path.join(ROOT, "tools", "package", "micro-ui.d.ts"), path.join(distDir, "micro-ui.d.ts"));
  const manifest = {};
  for (const rel of walkRel(distDir)) {
    if (rel === "MANIFEST.json") continue;
    manifest[rel] = sha256(path.join(distDir, rel));
  }
  writeFileSync(path.join(distDir, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n");
  return { files: Object.keys(manifest).length + 1 };
}

/** ملفات المرآة من شجرة المصدر: كل الملفات عدا المستثنى (توثيق المستودع). */
function mirrorFiles(name) {
  return walkRel(path.join(ROOT, name)).filter(
    (rel) => !MIRROR_EXCLUDE_SUFFIXES.some((suffix) => rel.endsWith(suffix))
  );
}

/** مزامنة مرايا src/ — نسخ بايت-ببايت بنفس البنية (بلا ملفات التوثيق). */
function syncSrcMirror() {
  mkdirSync(SRC, { recursive: true });
  for (const name of MIRROR_DIRS) {
    rmSync(path.join(SRC, name), { recursive: true, force: true });
    for (const rel of mirrorFiles(name)) copyInto(path.join(ROOT, name, rel), SRC, `${name}/${rel}`);
  }
}

/** فروق المرآة: ملفات المصدر مقابل src/ (مجموعة + بصمات). */
function mirrorDiff() {
  const diffs = [];
  const expected = {};
  for (const name of MIRROR_DIRS) {
    for (const rel of mirrorFiles(name)) expected[`${name}/${rel}`] = sha256(path.join(ROOT, name, rel));
  }
  const actualTop = readdirSync(SRC, { withFileTypes: true }).map((e) => e.name).sort();
  const expectedTop = [...MIRROR_DIRS].sort();
  for (const stray of actualTop.filter((n) => !expectedTop.includes(n))) {
    diffs.push(`src/${stray}: unexpected entry (src/ mirrors components/ shared/ assets/ only)`);
  }
  const actual = {};
  for (const name of MIRROR_DIRS) {
    const dir = path.join(SRC, name);
    if (statSync(dir, { throwIfNoEntry: false })) {
      for (const rel of walkRel(dir)) {
        if (MIRROR_EXCLUDE_SUFFIXES.some((suffix) => rel.endsWith(suffix))) {
          diffs.push(`src/${name}/${rel}: documentation file does not belong in the mirror`);
          continue;
        }
        actual[`${name}/${rel}`] = sha256(path.join(dir, rel));
      }
    }
  }
  for (const rel of Object.keys(expected).sort()) {
    if (!(rel in actual)) diffs.push(`src/${rel}: missing from mirror`);
    else if (actual[rel] !== expected[rel]) diffs.push(`src/${rel}: differs from ${rel}`);
  }
  for (const rel of Object.keys(actual).sort()) {
    if (!(rel in expected)) diffs.push(`src/${rel}: not in source (stale mirror file)`);
  }
  return diffs;
}

/** فروق شجرتين dist: مجموعة الملفات + البصمات (بايت-ببايت عبر sha256). */
function treeDiff(actualDir, expectedDir) {
  const diffs = [];
  const actualFiles = statSync(actualDir, { throwIfNoEntry: false }) ? walkRel(actualDir) : [];
  const expectedFiles = statSync(expectedDir, { throwIfNoEntry: false }) ? walkRel(expectedDir) : [];
  const actualSet = new Set(actualFiles);
  const expectedSet = new Set(expectedFiles);
  for (const rel of expectedFiles) {
    if (!actualSet.has(rel)) diffs.push(`dist/${rel}: missing`);
    else if (sha256(path.join(actualDir, rel)) !== sha256(path.join(expectedDir, rel))) diffs.push(`dist/${rel}: content differs`);
  }
  for (const rel of actualFiles) {
    if (!expectedSet.has(rel)) diffs.push(`dist/${rel}: unexpected (stale build output)`);
  }
  return diffs;
}

async function main() {
  const check = process.argv.includes("--check");
  if (check) {
    const problems = [];
    const mirrorProblems = mirrorDiff();
    problems.push(...mirrorProblems.map((p) => `src: ${p}`));
    const temp = mkdtempSync(path.join(tmpdir(), "micro-ui-dist-"));
    try {
      await buildDistInto(path.join(temp, "dist"));
      problems.push(...treeDiff(DIST, path.join(temp, "dist")));
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
    if (problems.length) {
      console.error(`package check: FAIL (${problems.length} difference${problems.length === 1 ? "" : "s"})`);
      for (const line of problems.slice(0, 50)) console.error("  " + line);
      if (problems.length > 50) console.error(`  … and ${problems.length - 50} more`);
      console.error("rebuild with: node tools/build-package.mjs");
      process.exit(1);
    }
    console.log("package check: OK (src mirrors and dist tree are byte-identical to a fresh deterministic build)");
    return 0;
  }
  syncSrcMirror();
  const { files } = await buildDistInto(DIST);
  console.log(`package build: OK (src/ mirrors synced; dist/ ${files} files)`);
  return 0;
}

main().catch((error) => die(`build-package: ${error && error.message ? error.message : error}`));
