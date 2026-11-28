/*
 * ds/sim — the PWA build (the deployable simulation, PLAN-SIM SA1/§9.ب).
 *
 * Same toolchain as the Micro app itself (PLAN-SIM tech table):
 * Vite 7 + @vitejs/plugin-react + Tailwind 4 vite plugin + vite-plugin-pwa
 * (registerType: 'autoUpdate', workbox for offline). The library is imported
 * from its source by the '@micro/ds' alias exactly like the lab, so every
 * component change reaches the simulation automatically.
 *
 * base is the GitHub Pages subpath so the service worker scope, start_url and
 * every asset resolve under /micro-ui-design-system/.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import { SIM_VERSION } from './src/version';

const simDir = fileURLToPath(new URL('.', import.meta.url));
const dsDir = resolve(simDir, '..');

/** The published GitHub Pages base (owner decision 1, PLAN-SIM). */
const PAGES_BASE = '/micro-ui-design-system/';

export default defineConfig({
  base: PAGES_BASE,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Micro',
        short_name: 'Micro',
        // 5.9: the sim version is non-standard, so it rides the description —
        // imported from src/version.ts so the badge and the manifest can
        // never disagree about which build is on the phone.
        description: `المحاكاة التجريبية ${SIM_VERSION}`,
        lang: 'ar',
        dir: 'rtl',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#E8ECEF',
        theme_color: '#E8ECEF',
        start_url: `${PAGES_BASE}?source=pwa`,
        scope: PAGES_BASE,
        icons: [
          {
            src: `${PAGES_BASE}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${PAGES_BASE}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${PAGES_BASE}icons/maskable-icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the built app shell AND the emitted font subsets, so the
        // installed app opens with no network (§9.ب item 6).
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/micro-ui-design-system\/sw\.js$/],
      },
    }),
  ],
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
    outDir: 'dist',
    emptyOutDir: true,
  },
});
