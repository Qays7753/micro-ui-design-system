/**
 * Lab build config — the single-file lab (plan D11).
 *
 * `vite-plugin-singlefile` inlines the JS and the CSS into one index.html;
 * targets derive from the package browserslist like the library build
 * (plan section 2). The library fonts keep their `?no-inline` query, so Vite
 * emits the woff2 subsets beside the HTML — `tools/build-standalone.mjs` then
 * data-URI-fies them into the final standalone file, which runs from file://
 * with zero network requests (K24, ds-standalone-mode). Output goes to
 * node_modules/.lab-dist; the copy script places the bytes at
 * $DS_LAB_STANDALONE_OUT (ds-lab-fresh contract).
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import browserslist from 'browserslist';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const labDir = fileURLToPath(new URL('.', import.meta.url));
const dsDir = resolve(labDir, '..');

/** Same browserslist → esbuild mapping as the library build (plan section 2). */
function esbuildTargets(): string[] {
  const families: Record<string, string> = {
    ios_saf: 'safari',
    ios: 'safari',
    chrome: 'chrome',
    and_chr: 'chrome',
    and: 'chrome',
    samsung: 'chrome',
  };
  const min = new Map<string, number>();
  for (const entry of browserslist(undefined, { path: dsDir })) {
    const [name, version = '0'] = entry.split(/\s+/);
    const family = families[name];
    if (!family) continue;
    const major = Number.parseInt(name === 'samsung' ? '116' : version, 10);
    const current = min.get(family);
    if (!Number.isFinite(major)) continue;
    if (current === undefined || major < current) min.set(family, major);
  }
  return [...min.entries()].map(([family, major]) => `${family}${major}`);
}

export default defineConfig({
  root: labDir,
  base: './',
  plugins: [react(), viteSingleFile()],
  resolve: {
    // The lab imports the library as a consumer would: by package name,
    // through the public entry only (K1/K2).
    alias: { '@micro/ds': resolve(dsDir, 'src/index.ts') },
  },
  build: {
    target: esbuildTargets(),
    cssTarget: esbuildTargets(),
    outDir: resolve(dsDir, 'node_modules/.lab-dist'),
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
  },
});
