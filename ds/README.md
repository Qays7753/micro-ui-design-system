# @micro/ds

Micro design system — React 19 + TypeScript, Arabic-first, RTL-first, phone and
tablet (iOS Safari 16.4+, Chrome 116+, Samsung Internet 23+). Batch 1
foundations: tokens, fonts, icons, Arabic copy and shared logic. Components
arrive in later stages (see `docs/plans/design-system-batch1/PLAN.md`).

Owner's lab link (updated every commit that touches `ds/`):
`https://raw.githack.com/Qays7753/micro-ui-design-system/design-system/previews/ds-lab/standalone.html`

## Install

Peer dependencies: `react` and `react-dom` (`^19`), and `vaul` (`^1`) for the
bottom sheet (from S7).

```bash
# from the repo (GitHub tag ds-v0.1.0 or a packed tarball)
pnpm add @micro/ds
```

## Use

```tsx
import { formatMoney, moneyTexts, NavTodayIcon, t } from '@micro/ds';
import '@micro/ds/styles.css'; // or rely on the JS entry's CSS import

const money = formatMoney('12.500', { texts: moneyTexts });
// money.display -> '12.500 د.أ'   money.aria -> '12 دينار و500 فلس'
```

CSS import order (already handled inside `styles.css`): base defaults → token
variables (`--mds-*`) → fonts (which insert the metric-matched fallbacks into
the two font stacks) → icon rules. Tailwind 4 users additionally import
`@micro/ds/src/tokens/tailwind-theme.css` (or copy it) so Tailwind's color /
spacing / radius / font / text namespaces map to our tokens instead of
Tailwind's defaults (BRIEF 0.7).

## Preloading fonts (BRIEF 27.8 — the app's job)

Exactly three files: the variable Rubik, Plex 400 and Plex 600. Plex 500 loads
normally with `font-display: swap`. After `npm run build` the files live at
`dist/assets/*.woff2`:

```html
<link rel="preload" href="/assets/rubik-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/plex-arabic-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/plex-arabic-600.woff2" as="font" type="font/woff2" crossorigin>
```

The `?no-inline` query in `src/fonts/fonts.css` is Vite's opt-out from
library-mode asset inlining, so the build emits real woff2 files. Single-file
lab builds should strip the query (a one-line Vite plugin) to let fonts inline
into `standalone.html`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run build` | Vite library build (`dist/index.js`, `dist/styles.css`, `dist/assets/*.woff2`) + `tsc` declaration emit |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint (src) + Stylelint (src CSS, browserslist-aware) |
| `npm test` | Vitest (jsdom + React Testing Library) |
| `npm run tokens` / `tokens:check` | Regenerate / byte-verify the token outputs from `docs/design-system/tokens.json` |
| `npm run icons` / `icons:check` | Regenerate / byte-verify the icon components from `@phosphor-icons/core` |
| `npm run fonts` | Subset fonts, compute fallback metrics, emit `fonts.css`, check cmap coverage |
| `npm run fonts:measure` | Playwright measurement (Chromium + WebKit) → `reports/ds-batch1/s1-font-measure.json` |

## Layout of the package (batch 1)

```
src/
  index.ts        # public entry: tokens, i18n, lib, icons (components join in S3+)
  styles.css      # base.css + tokens.css + fonts.css + icons.css
  base.css        # global defaults (BRIEF 23.24, 27) — tokens only
  tokens/         # GENERATED: tokens.css, tokens.ts, tailwind-theme.css
  fonts/          # GENERATED: 4 woff2 subsets + OFL licenses + fonts.css
  icons/          # GENERATED: 44 icon components + icons.css + assets/ask-symbol.svg
  i18n/           # ar.ts (all Arabic copy), plural.ts, time.ts
  lib/            # format-money, amount-visibility, use-press, use-visual-viewport, layers, types
lab/src/data/     # BRIEF section 25 lab data (Jordanian, verbatim)
tools/            # generators (tokens, fonts, icons) + font measurement
```

Generated files carry a `GENERATED FILE — DO NOT EDIT` header; edit the
generator (or `tokens.json`) and re-run. No component file may contain raw hex,
px or ms values — everything flows from `tokens.css` / `tokens.ts`
(BRIEF 0.2), and no lib or icon file contains Arabic text — all copy lives in
`src/i18n/ar.ts` (BRIEF 16.20, 24.4).

## Licenses

Fonts are under the SIL Open Font License: `src/fonts/OFL-rubik.txt`,
`src/fonts/OFL-ibmplex.txt`.
