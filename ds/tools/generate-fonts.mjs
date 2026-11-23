#!/usr/bin/env node
/**
 * generate-fonts.mjs — self-hosted, subset woff2 fonts for @micro/ds (plan D8,
 * BRIEF 27.8 + 5.3).
 *
 * Steps (deterministic; upstream sources are fetched on demand):
 *   1. Subset the source TTFs with pyftsubset (repo venv) to woff2:
 *        rubik-var.woff2      — variable Rubik, full wght axis kept (300–900)
 *        plex-arabic-400/500/600.woff2 — IBM Plex Sans Arabic weights
 *      Unicode coverage: Latin letters + digits, ASCII punctuation, guillemets,
 *      bullet, ellipsis, minus, bidi/format controls, and the Arabic blocks
 *      (0600-06FF, 0750-077F, FB50-FDFF, FE70-FEFF, incl. ، ؛ ؟ and tatweel).
 *   2. Copy the OFL license files next to the fonts.
 *   3. Read real metrics with fontTools (ds/tools/font-metrics.py) and compute
 *      the metric-matched local fallback faces ('MDS Fallback Display' /
 *      'MDS Fallback Text') — see font-metrics.py for the math.
 *   4. Emit src/fonts/fonts.css: @font-face rules (font-display: swap, Rubik
 *      weight range 300 900), fallback faces, and the :root override that
 *      inserts each fallback right after its webfont in the font stacks.
 *   5. Coverage check: every character of every non-ASCII string literal in
 *      src/i18n/ar.ts and lab/src/data must exist in the cmap of all four
 *      subset fonts (format/bidi controls are exempt — shapers handle them).
 *
 * Sources (pinned, never committed, never a machine-absolute path):
 *   Downloaded from the official google/fonts repository at the pinned
 *   commit below into a fresh temp dir; every file is verified by sha256
 *   before use:
 *     ofl/rubik/Rubik[wght].ttf                      (variable, wght 300-900)
 *     ofl/ibmplexsansarabic/IBMPlexSansArabic-{Regular,Medium,SemiBold}.ttf
 *     ofl/rubik/OFL.txt, ofl/ibmplexsansarabic/OFL.txt
 *   MDS_FONT_SOURCE_DIR may point at a directory already holding the same
 *   files (still sha256-verified) for offline regeneration.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const dsRoot = join(scriptDir, '..');
const repoRoot = join(dsRoot, '..');
const outDir = join(dsRoot, 'src', 'fonts');
const venvPython = join(repoRoot, '.venv', 'bin', 'python');
const pyftsubset = join(repoRoot, '.venv', 'bin', 'pyftsubset');

// Pinned upstream: the official google/fonts repository at one commit, each
// file pinned by sha256. A mismatch anywhere refuses to build — regeneration
// is byte-deterministic from known sources only.
const GOOGLE_FONTS_COMMIT = '06bfe0d62a98375cb09c942fa18e68bd32cff057';
const GOOGLE_FONTS_BASE = `https://raw.githubusercontent.com/google/fonts/${GOOGLE_FONTS_COMMIT}/`;
const PINNED_SOURCES = {
  'rubik-var.ttf': { path: 'ofl/rubik/Rubik[wght].ttf', sha256: '1b3a7437ba2af80e465e773ed60c5036d1ba6ace492d89046dbcf18fb31e4e88' },
  'plex-400.ttf': { path: 'ofl/ibmplexsansarabic/IBMPlexSansArabic-Regular.ttf', sha256: '6f611412270a132bbac838da9259d4c68569b4175f3b3b8fa3fa36a30b56dab9' },
  'plex-500.ttf': { path: 'ofl/ibmplexsansarabic/IBMPlexSansArabic-Medium.ttf', sha256: 'b8363ab9f733dfa4f8e96b8b2102c24b5cf4110fb96d1d3d9a9412f6fb49cf74' },
  'plex-600.ttf': { path: 'ofl/ibmplexsansarabic/IBMPlexSansArabic-SemiBold.ttf', sha256: '597bd5502e5997be4414e4c9c88834b30ff3784250c84f20bce2b20e53ebd467' },
  'OFL-rubik.txt': { path: 'ofl/rubik/OFL.txt', sha256: '472cbe7c25441df63e9c7864b43eb3c0f4b3df950c66a76224e6cfe1eae843fb' },
  'OFL-ibmplex.txt': { path: 'ofl/ibmplexsansarabic/OFL.txt', sha256: '7e6b2818edbd8f6a01ae80641cc8f16a51080d08fb4e532be3a0b6f74adb07da' },
};

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

// Fetch the pinned sources into a temp dir (or MDS_FONT_SOURCE_DIR). Every
// file is sha256-verified no matter where it came from.
let sourceDirIsTemp = false;
async function fetchPinnedSources() {
  const dir = process.env.MDS_FONT_SOURCE_DIR
    || ((sourceDirIsTemp = true), mkdtempSync(join(tmpdir(), 'micro-ds-fonts-')));
  for (const [name, meta] of Object.entries(PINNED_SOURCES)) {
    const dest = join(dir, name);
    if (!existsSync(dest) || sha256(dest) !== meta.sha256) {
      const url = GOOGLE_FONTS_BASE + meta.path.split('/').map(encodeURIComponent).join('/');
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`pinned source download failed (HTTP ${res.status}): ${meta.path} @ ${GOOGLE_FONTS_COMMIT}`);
      }
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    }
    const got = sha256(dest);
    if (got !== meta.sha256) {
      throw new Error(`sha256 mismatch for ${name}: got ${got}, pinned ${meta.sha256} — refusing to build from an unknown source`);
    }
  }
  return dir;
}
const sourceDir = await fetchPinnedSources();

// Arabic + Latin + digits + the punctuation the dictionary actually uses.
const UNICODES = [
  'U+0020-0040', // space, ASCII punctuation, digits 0-9, : ; < = > ? @
  'U+0041-005A', // A-Z — "Ask Micro" appears in screen-reader texts (BRIEF 23.17)
  'U+0061-007A', // a-z
  'U+00AB', 'U+00BB', // « »
  'U+00B7', // · (SaveState: «مسودة · لم تُحفظ»)
  'U+0600-06FF', // Arabic (incl. ، U+060C, ؛ U+061B, ؟ U+061F, tatweel U+0640)
  'U+0750-077F',
  'U+200C-200F', // ZWNJ, ZWJ, LRM, RLM
  'U+2014', // — (missing value «—», SaveState failed line)
  'U+2022', // • (hidden amounts use 4 bullets — BRIEF 23.22)
  'U+2026', // …
  'U+2066-2069', // directional isolates
  'U+2212', // − minus (out amounts — BRIEF 8)
  'U+FB50-FDFF', 'U+FE70-FEFF', // Arabic presentation forms
].join(',');

const FONTS = [
  { source: 'rubik-var.ttf', output: 'rubik-var.woff2', family: 'Rubik', weight: '300 900', license: 'OFL-rubik.txt' },
  { source: 'plex-400.ttf', output: 'plex-arabic-400.woff2', family: 'IBM Plex Sans Arabic', weight: '400', license: 'OFL-ibmplex.txt' },
  { source: 'plex-500.ttf', output: 'plex-arabic-500.woff2', family: 'IBM Plex Sans Arabic', weight: '500', license: 'OFL-ibmplex.txt' },
  { source: 'plex-600.ttf', output: 'plex-arabic-600.woff2', family: 'IBM Plex Sans Arabic', weight: '600', license: 'OFL-ibmplex.txt' },
];

const LICENSES = [
  { source: 'OFL-rubik.txt', output: 'OFL-rubik.txt' },
  { source: 'OFL-ibmplex.txt', output: 'OFL-ibmplex.txt' },
];

// Reference for the metric-matched fallback: an Arial-metric font, resolved
// at run time through fontconfig (what local('Arial') actually resolves to —
// Liberation Sans on Linux). No Noto Sans Arabic file exists locally, so
// Arial metrics are the practical reference; Liberation Sans is also what
// fontconfig resolves for local('Arial') in the sandbox browsers.
// Override for machines without fontconfig: MDS_REFERENCE_FONT (tools/README.md).
function findReferenceFont() {
  const override = process.env.MDS_REFERENCE_FONT;
  if (override) return override;
  const resolved = run('fc-match', ['-f', '%{file}', 'Arial:style=Regular']).trim();
  if (resolved && existsSync(resolved)) return resolved;
  throw new Error('no Arial-metric reference font found via fc-match — set MDS_REFERENCE_FONT (see tools/README.md)');
}
const REFERENCE_FONT = findReferenceFont();

function findSource(name) {
  const candidate = join(sourceDir, name);
  if (!existsSync(candidate)) {
    throw new Error(`pinned source not found: ${name} in ${sourceDir}`);
  }
  return candidate;
}

function run(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', cwd: dsRoot });
}

function subset(font) {
  const source = findSource(font.source);
  const outputPath = join(outDir, font.output);
  run(pyftsubset, [
    source,
    `--unicodes=${UNICODES}`,
    '--flavor=woff2',
    // Keep every OpenType feature: tnum is mandatory for numbers (BRIEF 5.3).
    '--layout-features=*',
    `--output-file=${outputPath}`,
  ]);
  const size = statSync(outputPath).size;
  if (size === 0) throw new Error(`empty subset output: ${outputPath}`);
  chmodSync(outputPath, 0o644); // deterministic file modes across machines
  return { ...font, source, outputPath, size };
}

// ---------------------------------------------------------------------------
// Metric-matched fallback math (see ds/tools/font-metrics.py for details)
// ---------------------------------------------------------------------------

function pct(value) {
  // Keep 3 decimals — enough for sub-0.1px accuracy at text sizes.
  return `${Number(value.toFixed(3))}%`;
}

function fallbackFace(web, ref) {
  const webAsc = web.ascender / web.upem;
  const webDesc = Math.abs(web.descender) / web.upem;
  const webGap = web.lineGap / web.upem;
  const refAsc = ref.ascender / ref.upem;
  const refDesc = Math.abs(ref.descender) / ref.upem;
  const sizeAdjust = (webAsc + webDesc) / (refAsc + refDesc);
  return {
    sizeAdjust: pct(sizeAdjust * 100),
    ascentOverride: pct((webAsc / sizeAdjust) * 100),
    descentOverride: pct((webDesc / sizeAdjust) * 100),
    lineGapOverride: pct((webGap / sizeAdjust) * 100),
  };
}

// ---------------------------------------------------------------------------
// fonts.css
// ---------------------------------------------------------------------------

function generateFontsCss(subsets, rubikFace, plexFace, rubikAxis) {
  const lines = [];
  lines.push('/* GENERATED FILE — DO NOT EDIT.');
  lines.push(' * Generated by ds/tools/generate-fonts.mjs (plan D8, BRIEF 27.8 + 5.3).');
  lines.push(' * Regenerate with `npm run fonts`. Determinism: same sources -> same bytes.');
  lines.push(' *');
  lines.push(' * Preload (app responsibility, BRIEF 27.8): exactly three files —');
  lines.push(' *   rubik-var.woff2, plex-arabic-400.woff2, plex-arabic-600.woff2.');
  lines.push(' * Plex 500 loads normally with font-display: swap (label / body-strong).');
  lines.push(' *');
  lines.push(' * The `?no-inline` query on the URLs is Vite\'s documented opt-out from');
  lines.push(' * library-mode asset inlining, so `npm run build` emits real woff2 files');
  lines.push(' * under dist/assets/ that the app can preload. Static servers ignore the');
  lines.push(' * query string. Single-file lab builds should strip it (one-line plugin)');
  lines.push(' * to let the fonts inline — see ds/README.md.');
  lines.push(' */');
  lines.push('');
  lines.push('/* --- Webfonts (self-hosted, subset: Arabic + Latin + punctuation) --- */');
  lines.push('');
  lines.push(`@font-face {`);
  lines.push(`  font-family: 'Rubik';`);
  lines.push(`  src: url('./rubik-var.woff2?no-inline') format('woff2');`);
  lines.push(`  font-weight: 300 900;`);
  lines.push(`  font-style: normal;`);
  lines.push(`  font-display: swap;`);
  lines.push('}');
  lines.push(`/* Variable wght axis ${rubikAxis.min}-${rubikAxis.max} kept in full; only 500 and 600 are used (BRIEF 5.3). */`);
  for (const weight of [400, 500, 600]) {
    const s = subsets.find((x) => x.weight === String(weight));
    lines.push('');
    lines.push('@font-face {');
    lines.push(`  font-family: 'IBM Plex Sans Arabic';`);
    lines.push(`  src: url('./${s.output}?no-inline') format('woff2');`);
    lines.push(`  font-weight: ${weight};`);
    lines.push('  font-style: normal;');
    lines.push('  font-display: swap;');
    lines.push('}');
  }
  lines.push('');
  lines.push('/* --- Metric-matched local fallbacks (BRIEF 27.8) ---');
  lines.push(' * Computed with fontTools from the real font files (hhea metrics;');
  lines.push(' * both webfonts set OS/2 USE_TYPO_METRICS with sTypo == hhea).');
  lines.push(' * Reference: Arial metrics via Liberation Sans (no Noto Sans Arabic');
  lines.push(' * file locally). On Android the face resolves to Noto Sans Arabic;');
  lines.push(' * on iOS it fails and the stack falls to the system Arabic font —');
  lines.push(' * the <=2px shift on real devices is an owner-device check.');
  lines.push(' * Sources tried in order: a real Arabic local font first, then');
  lines.push(' * Arial-metric fonts. */');
  for (const face of [
    { name: 'MDS Fallback Display', css: rubikFace, weight: '300 900', note: 'mirrors the Rubik axis range' },
    { name: 'MDS Fallback Text', css: plexFace, weight: '400 600', note: 'mirrors the hosted Plex weights' },
  ]) {
    lines.push('');
    lines.push('@font-face {');
    lines.push(`  font-family: '${face.name}';`);
    lines.push(`  src: local('Noto Sans Arabic'), local('Arial'), local('Helvetica'), local('Liberation Sans');`);
    lines.push(`  /* ${face.note} */`);
    lines.push(`  font-weight: ${face.weight};`);
    lines.push('  font-style: normal;');
    lines.push(`  size-adjust: ${face.css.sizeAdjust};`);
    lines.push(`  ascent-override: ${face.css.ascentOverride};`);
    lines.push(`  descent-override: ${face.css.descentOverride};`);
    lines.push(`  line-gap-override: ${face.css.lineGapOverride};`);
    lines.push('}');
  }
  lines.push('');
  lines.push('/* --- Font stacks (tokens.css holds the literal tokens.json values; the');
  lines.push(' * only change here inserts each metric-matched fallback right after its');
  lines.push(' * webfont, order otherwise preserved — documented deviation) --- */');
  lines.push('');
  lines.push(':root {');
  lines.push(`  --mds-font-display: 'Rubik', 'MDS Fallback Display', 'IBM Plex Sans Arabic', 'MDS Fallback Text', sans-serif;`);
  lines.push(`  --mds-font-text: 'IBM Plex Sans Arabic', 'MDS Fallback Text', sans-serif;`);
  lines.push('}');
  lines.push('');
  return lines.filter((line) => line !== '').join('\n');
}

// ---------------------------------------------------------------------------
// Coverage check: dictionary + lab data characters must exist in every cmap
// ---------------------------------------------------------------------------

const FORMAT_CONTROLS = new Set([
  0x200b, 0x200c, 0x200d, 0x200e, 0x200f, // ZWSP, ZWNJ, ZWJ, LRM, RLM
  0x2066, 0x2067, 0x2068, 0x2069, // directional isolates
  0xfeff, 0x061c, // BOM / Arabic letter mark
]);

function extractTextValues(file) {
  let source = readFileSync(file, 'utf8');
  // Comments (and the math symbols they borrow) are not UI text.
  source = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const values = [];
  // Single- and double-quoted strings without escapes (our files use none).
  for (const match of source.matchAll(/'([^'\n]*)'/g)) values.push(match[1]);
  for (const match of source.matchAll(/"([^"\n]*)"/g)) values.push(match[1]);
  return values;
}

function collectCharacters() {
  // All i18n files (dictionary + time/plural format tokens) and lab data.
  const files = [
    ...walkDataFiles(join(dsRoot, 'src', 'i18n')),
    ...walkDataFiles(join(dsRoot, 'lab', 'src', 'data')),
  ];
  const chars = new Map(); // char -> Set of files
  for (const file of files) {
    for (const value of extractTextValues(file)) {
      // Skip pure-ASCII strings (code identifiers / English comments).
      if (!/[^\u0000-\u007f]/.test(value)) continue;
      // Placeholder braces ({amount} etc.) are interpolation syntax, not text.
      const text = value.replace(/\{[^{}]*\}/g, '');
      for (const char of text) {
        const code = char.codePointAt(0);
        if (FORMAT_CONTROLS.has(code) || code === 0x0a || code === 0x09) continue;
        if (!chars.has(char)) chars.set(char, new Set());
        chars.get(char).add(file);
      }
    }
  }
  return chars;
}

function walkDataFiles(dir) {
  let out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out = [...out, ...walkDataFiles(full)];
    else if (/\.ts$/.test(entry.name) && !/\.test\.[cm]?tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function checkCoverage(cmaps) {
  const chars = collectCharacters();
  const missing = [];
  for (const [char, files] of chars) {
    const code = char.codePointAt(0);
    for (const cmap of cmaps) {
      if (!cmap.codepoints.includes(code)) {
        missing.push({ char, code: `U+${code.toString(16).toUpperCase()}`, font: cmap.path, files: [...files] });
        break; // one entry per char is enough to report
      }
    }
  }
  return { checked: chars.size, missing };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const subsets = FONTS.map((f) => subset(f));
function normalizeLicenseText(text) {
  // Upstream OFL files ship with CRLF endings and stray trailing spaces; the
  // repository keeps them LF-clean so whitespace gates stay green. The
  // license wording itself is byte-preserved.
  return text.replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/[ \t]+$/, '')).join('\n');
}
for (const license of LICENSES) {
  const from = findSource(license.source);
  const dest = join(outDir, license.output);
  writeFileSync(dest, normalizeLicenseText(readFileSync(from, 'utf8')), 'utf8');
  chmodSync(dest, 0o644);
}

const metricsJson = JSON.parse(run(venvPython, [join(scriptDir, 'font-metrics.py'), 'metrics',
  ...subsets.map((s) => s.source),
  REFERENCE_FONT,
]));
const [rubik, plex, , , reference] = [metricsJson[0], metricsJson[1], metricsJson[2], metricsJson[3], metricsJson[4]];
if (!rubik.variable) throw new Error('Rubik.ttf is not variable — wrong source file');
const rubikAxis = rubik.axes.find((a) => a.tag === 'wght');

const rubikFace = fallbackFace(rubik, reference);
const plexFace = fallbackFace(plex, reference);

const css = generateFontsCss(subsets, rubikFace, plexFace, rubikAxis);
writeFileSync(join(outDir, 'fonts.css'), css, 'utf8');
chmodSync(join(outDir, 'fonts.css'), 0o644);

// Coverage check on the subset outputs (woff2).
const cmapJson = JSON.parse(run(venvPython, [join(scriptDir, 'font-metrics.py'), 'cmap',
  ...subsets.map((s) => s.outputPath),
]));
const coverage = checkCoverage(cmapJson);

console.log('[fonts] subsets:');
for (const s of subsets) console.log(`  ${s.output}  ${(s.size / 1024).toFixed(1)} KB (from ${s.source})`);
console.log(`[fonts] rubik wght axis: ${rubikAxis.min}-${rubikAxis.max}`);
console.log(`[fonts] fallback display: size-adjust ${rubikFace.sizeAdjust}, ascent ${rubikFace.ascentOverride}, descent ${rubikFace.descentOverride}`);
console.log(`[fonts] fallback text:    size-adjust ${plexFace.sizeAdjust}, ascent ${plexFace.ascentOverride}, descent ${plexFace.descentOverride}`);
console.log(`[fonts] coverage: ${coverage.checked} distinct characters checked against 4 cmaps`);

if (coverage.missing.length > 0) {
  console.error('[fonts] MISSING GLYPHS (dictionary/lab text not covered):');
  for (const m of coverage.missing) console.error(`  ${m.char} ${m.code} missing from ${m.font}`);
  process.exit(1);
}
console.log('[fonts] coverage OK');

if (sourceDirIsTemp) rmSync(sourceDir, { recursive: true, force: true });
