/*
 * ds/sim — the standalone single-file build (PLAN-SIM tech table, second
 * build config like the lab): vite-plugin-singlefile inlines the JS and the
 * CSS; the library fonts keep their ?no-inline query so the woff2 subsets
 * are emitted beside the HTML and tools/build-single.mjs then data-URI-fies
 * them into the final previews/micro-sim/micro-sim.html which runs from
 * file:// with zero network requests.
 *
 * No service worker and no PWA plugin here: the single file IS the offline
 * app. base stays relative so the file opens from any path.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const simDir = fileURLToPath(new URL('.', import.meta.url));
const dsDir = resolve(simDir, '..');

export default defineConfig({
  root: simDir,
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    // Exact-match aliases (object aliases prefix-match and would also
    // rewrite '@micro/ds/styles.css' into 'index.ts/styles.css').
    alias: [
      { find: /^@micro\/ds$/, replacement: resolve(dsDir, 'src/index.ts') },
      { find: /^@micro\/ds\/styles\.css$/, replacement: resolve(dsDir, 'src/styles.css') },
      // The library SOURCE lives outside this package, so its bare peer
      // imports (react / react-dom / vaul) cannot walk up to this package's
      // node_modules — map them explicitly (the host provides the peers).
      { find: /^react$/, replacement: resolve(simDir, 'node_modules/react') },
      { find: /^react\//, replacement: `${resolve(simDir, 'node_modules/react')}/` },
      { find: /^react-dom$/, replacement: resolve(simDir, 'node_modules/react-dom') },
      { find: /^react-dom\//, replacement: `${resolve(simDir, 'node_modules/react-dom')}/` },
      { find: /^vaul$/, replacement: resolve(simDir, 'node_modules/vaul') },
      { find: /^vaul\//, replacement: `${resolve(simDir, 'node_modules/vaul')}/` },
    ],
  },
  build: {
    target: 'es2022',
    cssTarget: 'safari16',
    // The standalone entry — its minimal head keeps the file self-contained.
    rollupOptions: { input: resolve(simDir, 'index-single.html') },
    outDir: resolve(simDir, 'node_modules/.single-dist'),
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
  },
});
