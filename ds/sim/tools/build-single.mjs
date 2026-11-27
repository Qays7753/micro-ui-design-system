/**
 * build-single.mjs — turns the single-file build into the final standalone
 * artifact (the ds/lab build-standalone.mjs pattern): the vite step
 * (vite.singlefile.config.ts) has already inlined the JS and CSS into
 * node_modules/.single-dist/index.html; the library fonts keep their
 * documented `?no-inline` query so the woff2 subsets are emitted beside it —
 * this script base64-inlines them into the HTML, then writes the bytes to
 * previews/micro-sim/micro-sim.html (file:// with zero network requests).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(here, '../node_modules/.single-dist');
const html = resolve(distDir, 'index-single.html');
const out = process.env.SIM_SINGLE_OUT
  ? resolve(process.cwd(), process.env.SIM_SINGLE_OUT)
  : resolve(here, '../../../previews/micro-sim/micro-sim.html');

if (!existsSync(html)) {
  process.stderr.write('build-single: node_modules/.single-dist/index.html missing — run the vite build first\n');
  process.exit(1);
}

let page = readFileSync(html, 'utf8');

// Inline every emitted woff2 the CSS references: url(./NAME.woff2) -> data URI.
const emitted = new Set(readdirSync(distDir));
for (const match of [...page.matchAll(/url\(\.\/([^)]+\.woff2)\)/g)]) {
  const name = match[1];
  if (!emitted.has(name)) {
    process.stderr.write(`build-single: font referenced but not emitted: ${name}\n`);
    process.exit(1);
  }
  const data = readFileSync(resolve(distDir, name));
  page = page.replaceAll(`url(./${name})`, `url(data:font/woff2;base64,${data.toString('base64')})`);
}

const leftovers = [...page.matchAll(/url\(\.\//g)].length;
if (leftovers > 0) {
  process.stderr.write(`build-single: ${leftovers} relative url() references remain\n`);
  process.exit(1);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, page);
process.stdout.write(`single: ${out}\n`);
