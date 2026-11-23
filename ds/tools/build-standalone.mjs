/**
 * build-standalone.mjs — turns the single-file lab build into the final
 * standalone artifact (the ds-lab-fresh contract, S2 report decision 8):
 *
 *   DS_LAB_STANDALONE_OUT  absolute or cwd-relative output file
 *   default                <repo>/previews/ds-lab/standalone.html
 *
 * The vite step (lab/vite.config.ts) has already inlined the JS and CSS into
 * node_modules/.lab-dist/index.html. The library fonts keep their documented
 * `?no-inline` query, so the woff2 subsets are emitted beside it — this
 * script base64-inlines them into the HTML (K24: file:// with zero network
 * requests), then writes the bytes to the destination. Nothing here is
 * volatile, so two rebuilds of the same sources produce identical bytes
 * (ds-lab-fresh).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(here, '../node_modules/.lab-dist');
const html = resolve(distDir, 'index.html');
const out = process.env.DS_LAB_STANDALONE_OUT
  ? resolve(process.cwd(), process.env.DS_LAB_STANDALONE_OUT)
  : resolve(here, '../../previews/ds-lab/standalone.html');

if (!existsSync(html)) {
  process.stderr.write('build-standalone: node_modules/.lab-dist/index.html missing — run the vite build first\n');
  process.exit(1);
}

let page = readFileSync(html, 'utf8');

// Inline every emitted woff2 the CSS references: url(./NAME.woff2) -> data URI.
const emitted = new Set(readdirSync(distDir));
for (const match of [...page.matchAll(/url\(\.\/([^)]+\.woff2)\)/g)]) {
  const name = match[1];
  if (!emitted.has(name)) {
    process.stderr.write(`build-standalone: font referenced but not emitted: ${name}\n`);
    process.exit(1);
  }
  const data = readFileSync(resolve(distDir, name));
  // The data URI must stay wrapped in url() — a bare src:data:... is invalid
  // CSS and the whole @font-face rule is dropped silently.
  page = page.replaceAll(`url(./${name})`, `url(data:font/woff2;base64,${data.toString('base64')})`);
}

const leftovers = [...page.matchAll(/url\(\.\//g)].length;
if (leftovers > 0) {
  process.stderr.write(`build-standalone: ${leftovers} relative url() references remain\n`);
  process.exit(1);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, page);
process.stdout.write(`standalone: ${out}\n`);
