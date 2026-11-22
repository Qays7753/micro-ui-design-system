import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      // eslint is for hand-written code; generated files are verified by
      // `npm run tokens:check` / `npm run icons:check` (byte-exact regeneration).
      'src/tokens/tokens.ts',
      'src/icons/*.tsx',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        // Hand-written browser globals for library code (no `globals` package:
        // plan D13 fixes the allowed devDependency list).
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        navigator: 'readonly',
        HTMLElement: 'readonly',
        SVGSVGElement: 'readonly',
        Element: 'readonly',
        Event: 'readonly',
        PointerEvent: 'readonly',
        FocusEvent: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        TouchEvent: 'readonly',
        Node: 'readonly',
        ResizeObserver: 'readonly',
        MutationObserver: 'readonly',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
      // Library convention: unused leading-underscore parameters keep the
      // handler signatures required by shared prop types.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // The library intentionally co-exports providers (components) with their
      // hooks and contexts; fast refresh matters in the consuming app, which
      // imports through the package entry, not these files directly.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    rules: {
      // Library code never logs to the console in production.
      'no-console': 'error',
    },
  },
);
