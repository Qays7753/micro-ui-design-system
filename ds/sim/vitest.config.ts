/// <reference types="vitest/config" />
/*
 * ds/sim — Vitest + Testing Library (PLAN-SIM tech table). The library rides
 * the same '@micro/ds' source alias as the app builds, so the tests exercise
 * the real component code. Environment: jsdom (React DOM testing).
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const simDir = fileURLToPath(new URL('.', import.meta.url));
const dsDir = resolve(simDir, '..');

export default defineConfig({
  plugins: [react()],
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
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    css: false,
  },
});
