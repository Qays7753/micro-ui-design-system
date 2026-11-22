# Changelog

All notable changes to `@micro/ds` live here (SemVer).

## 0.1.0 (2026-11-22) — batch 1 foundations (stage S1)

- Package scaffold: `@micro/ds`, library mode Vite build (ESM, react/react-dom/vaul
  external), strict TypeScript, ESLint 9 flat config, Stylelint 16 with
  browserslist feature checking, Vitest + React Testing Library.
- Tokens: `docs/design-system/tokens.json` → `src/tokens/tokens.css`
  (`--mds-*`), `tokens.ts` (typed tree + `getToken`), `tailwind-theme.css`
  (Tailwind 4 `@theme` bindings). Byte-exact `--check` mode.
- Fonts: self-hosted subset woff2 (variable Rubik 300–900, IBM Plex Sans Arabic
  400/500/600), OFL licenses, `fonts.css` with `font-display: swap` and two
  metric-matched local fallback faces computed from the real font metrics.
- Icons: 44 React components generated from Phosphor (BRIEF 23.23 + 5.5
  semantic names) with per-icon weight sets, RTL flip list, and the Micro ask
  symbol rendered from the approved favicon geometry.
- i18n: Arabic dictionary (`ar.ts`, BRIEF 24), `pluralAr` (Intl.PluralRules),
  12-hour `formatTime12`.
- lib: `formatMoney` (BRIEF 8 complete), amount-visibility context, `usePress`
  (8px cancel from tokens, 500ms long-press), `useVisualViewport`, layer
  registry (max 2 sheets, token z-index vars).
- Lab data from BRIEF section 25 (verbatim, Jordanian).
- 63 tests; generators deterministic (`tokens:check`, `icons:check`).
