/// <reference types="vitest/config" />
/**
 * @micro/ds — library build.
 *
 * JS + CSS come out of `dist/`: index.js (ESM, react/react-dom/vaul external)
 * and styles.css (single file, fonts emitted as woff2 assets).
 * Build targets are derived from the browserslist query in package.json
 * (BRIEF section 0 / plan section 2: iOS 16.4+, Chrome 116+, Samsung 23+).
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import browserslist from 'browserslist';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pkgDir = fileURLToPath(new URL('.', import.meta.url));

/**
 * Convert the browserslist query to esbuild target strings.
 * - ios_saf 16.4 -> safari16.4
 * - chrome / and_chr -> chromeNN
 * - samsung 23 -> chrome116 (Samsung Internet 23 is Chromium-based and newer
 *   than Chromium 116; 116 is the safe shared feature floor).
 */
function esbuildTargetsFromBrowserslist(): string[] {
  const entries = browserslist(undefined, { path: pkgDir });
  const min = new Map<string, { major: number; minor: number }>();
  const families: Array<{ name: string; family: string; fixed?: { major: number; minor: number } }> = [
    { name: 'ios_saf', family: 'safari' },
    { name: 'ios', family: 'safari' },
    { name: 'chrome', family: 'chrome' },
    { name: 'and_chr', family: 'chrome' },
    { name: 'and', family: 'chrome' },
    { name: 'samsung', family: 'chrome', fixed: { major: 116, minor: 0 } },
  ];
  for (const entry of entries) {
    const [rawName, rawVersion = ''] = entry.split(/\s+/);
    const family = families.find((f) => f.name === rawName);
    if (!family) continue;
    const version = family.fixed;
    const [rawMajor, rawMinor = '0'] = rawVersion.split('.');
    const major = version?.major ?? Number.parseInt(rawMajor, 10);
    const minor = version?.minor ?? Number.parseInt(rawMinor, 10);
    if (!Number.isFinite(major) || !Number.isFinite(minor)) continue;
    const current = min.get(family.family);
    if (!current || major < current.major || (major === current.major && minor < current.minor)) {
      min.set(family.family, { major, minor });
    }
  }
  return [...min.entries()].map(
    ([family, v]) => (v.minor > 0 ? `${family}${v.major}.${v.minor}` : `${family}${v.major}`),
  );
}

const targets = esbuildTargetsFromBrowserslist();

export default defineConfig({
  // Relative asset URLs in the emitted CSS (dist/styles.css -> ./assets/...).
  base: './',
  plugins: [react()],
  resolve: {
    // The library must stay self-contained: no path aliases into app code.
    alias: {},
  },
  build: {
    target: targets,
    cssTarget: targets,
    // Vite's library mode inlines all assets by default; we need real woff2
    // files in dist/assets because the app preloads three of them (BRIEF 27.8).
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(pkgDir, 'src/index.ts'),
      formats: ['es'],
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^vaul($|\/)/],
      output: {
        // Keep a single flat entry: dist/index.js + dist/styles.css.
        entryFileNames: 'index.js',
        assetFileNames: (info): string => {
          // Fonts keep a stable, extension-based name; the CSS entry is named by lib.cssFileName.
          if (info.names?.[0] && /\.woff2$/.test(info.names[0])) {
            return 'assets/[name][extname]';
          }
          return '[name][extname]';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['src/test-setup.ts'],
  },
});
