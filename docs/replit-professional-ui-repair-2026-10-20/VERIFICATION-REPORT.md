# Professional Micro UI repair — verification

## Identity and environment

- Date: 2026-10-20 UTC (Asia/Amman local date also 2026-10-20).
- Source branch/SHA: `ui/native-svg-polish-2026-10-12` / `feb19f0f417307c1e41a5b87f214b51b8f29c727`.
- Repair branch: `replit/professional-ui-complete-repair-2026-10-20`.
- Final repair implementation SHA: `7ab7c4a5be93fca2218cfe35106fc7310bead0aa`; the following documentation-only commit binds the same tested source bytes.
- Tested browser: **Chromium 152.0.7977.64**, Playwright 1.63.0, Linux headless.
- Tested final source SHA-256: `ded163cc45e66f5279c45150511ff67f05fe5267d2ce55e2b565c076039ab7fe`.
- Fingerprint input: sorted path names and file bytes under components/, shared/, previews/ui-system-showcase/ (includes specs and generated standalone). JSON binds every focused assertion to date, HEAD at execution, viewport, direction and this content identity. The same source bytes are subsequently committed; documentation-only changes outside those paths do not invalidate it.
- Focused JSON: `generated-artifacts/professional-ui-repair/after/results.json`.

The untouched-source baseline was reproduced before component changes with loaded IBM Plex fonts: 17 PASS / 128 FAIL. Baseline fixture had 145 assertions. The final suite was expanded to 278 assertions, so this is not a same-inventory improvement ratio. Baseline component-only SHA-256: `17d7219c1bb0aabdd2163ccf21aa09515452f9f83f29d9f10fe4099d2851cac0`.

## Exact commands and final results

| Command (repository root) | Final result |
|---|---|
| `python3 tools/build-ui-system-showcase-standalone.py` | PASS: generated from source; self-check byte-identical |
| `python3 tools/build-ui-system-showcase-standalone.py --check` | PASS: byte-for-byte determinism and 23 matching icon symbols |
| `python3 tools/component-mobile-check.py` | PASS: 52 / 52 |
| `python3 tools/chart-mobile-check.py` | PASS: 59 / 59 |
| `python3 tools/ui-system-showcase-check.py` | PASS: 118 / 118 |
| `python3 tools/ui-system-showcase-repair-check.py --tag replit-professional-repair` | PASS: 88 / 88 |
| `python3 tools/concepts-check.py` | PASS: 157 / 157 |
| `python3 tools/data-scale-state-check.py` | PASS: 23 / 23 |
| `python3 tools/professional-ui-repair-check.py --tag after` | PASS: 278 / 278 |
| `git diff --check` | PASS |

Initial browser commands were **NOT RUN** due to missing Python Playwright, then missing downloaded Chromium, then the downloaded binary's missing Nix shared library. These setup attempts are not treated as UI failures or PASS results. The existing project dependency was installed, available system Chromium selected, and every listed command subsequently completed successfully. Browser selection remains portable: explicit MICRO_CHROMIUM_PATH, otherwise system Chromium, otherwise Playwright bundled browser.

Exact final logs: `generated-artifacts/professional-ui-repair/commands/*.log`, `focused.log`, and `existing-showcase/verification.txt`, `existing-repair/repair-check-replit-professional-repair.txt`.

GitHub push gate: **BLOCKED (authentication)**. The dry-run before and after binding the existing source-control connection returned “Invalid username or token”. The implementation is committed locally; neither remote branch delivery nor a PR has been claimed. Main remains untouched.

## Focused regression coverage

- Visible packed background and unchanged 2:1 diameter ratio for 100:25 areas; zero/missing/negative stay non-area states.
- 12-digit Latin and Arabic readings for bars/line, measured collision/bounds fallback, visibly complete rows, no clipping or row overlap. Normal small values return to plot-only reading. Source DOM and semantic disclosure retained.
- Long Arabic/Latin labels with diacritics; measured normal spacing and enlarged 26px text line separation.
- Actionbar icon 48×48 in normal/stack mode; long text action can wrap.
- Carousel short active vs very long inactive, long active without clipping, expansion/collapse, source-showcase responsive centered peek; existing checks cover keyboard, pointer/drag, focus/inert and reduced motion.
- Compact dots hidden only in opt-in mode, full mode restores real 48px direct-navigation targets.
- Info-card compact vs untouched default and complete long/zero/negative/missing/invalid text.
- Optional flat main metric vs preserved default circle; complete long and missing readings.
- MicroData root/container disconnect, width changes and repeated init/disconnect cycles; deferred font-ready callback does not reconnect.
- MicroFields root binding before wrapper binding, multiple fields, repeated init without duplicate events; clear, count, message, focus, readonly/disabled and dynamic min/max/step.
- Metric comparison real observer cleanup and duplicate guard, root/container re-init; controlled test sets ResizeObserver unavailable **before** scripts load and spies on resize listeners through three cleanup/re-init cycles. Deferred fonts.ready is explicitly controlled, not a claim about real old devices.
- Natural source-showcase surface stage and own-surface composition.

## Viewport/direction and visual inspection

Every cell below passed the focused fixture, source-showcase composition/peek and overflow checks. Saved carousel, info-strip and flat metric screenshots were visually inspected via contact sheets; long-number bar/line screenshots likewise inspected at all four widths and both directions.

| CSS viewport | RTL | LTR |
|---|---|---|
| 320 | PASS | PASS |
| 360 | PASS | PASS |
| 390 | PASS | PASS |
| 430 | PASS | PASS |

Normal, long labels, long numbers, zero/missing/negative/invalid, expanded/collapsed, disabled/loading/focus-visible and reduced-motion states are covered across the focused + existing suites. Not every legacy command independently executes every cell; e.g. the existing repair command is 320/390 RTL. The new focused suite supplies all eight cells. LTR for info-strip remains review-only, per its existing contract.

Visual evidence:

- `after/chart-{bars,line}-{320,360,390,430}-{rtl,ltr}.png`: long-number full visible readings and chart semantics.
- `after/sc-carousel-root-*-*.png`, `after/sc-strip-*-*.png`, `after/sc-main-metric-flat-*-*.png`: focused source components.
- `after/sc-carousel-*-*.png`, `after/sc-info-strip-*-*.png`, `after/sc-metric-*-*.png`: complete source sections.
- `after/fixture-*-*.png`: combined stress/lifecycle fixture.
- `after/sheets/{charts,controls,flat}-{rtl,ltr}.png`: contact sheets inspected during delivery.
- `preview-info-strip.jpg`: actual running Replit preview at 390px.
- `before/results.json`, `before/fixture-*-*.png`: baseline evidence; separate from historical reviews/.

All paths above are relative to `generated-artifacts/professional-ui-repair/`. They are generated outputs, excluded from Git/deployment. A self-contained evidence HTML companion is delivered separately for viewing; rerunning the focused command regenerates machine evidence/screenshots.

## Before/after measurements

Loaded IBM Plex, source fixture, Chromium; numbers below measured at 320 RTL unless stated. The JSON retains the individual geometry for all cells.

| Case | Before | After |
|---|---|---|
| Packed circles | transparent HTML background | visible category background; diameter ratio still 2:1 |
| Actionbar icon | 248×48px (390 RTL: 54.375×48px) | 48×48px at all widths/directions |
| Short active carousel | active 58px; viewport 834px due to inactive content | active 58px; viewport 74px including 16px shadow padding |
| Compact navigation dots | 2 visible fixture targets plus arrows/status | 0 visible dots in compact; full mode still has 2 × 48px targets |
| Bar label line step | 40px | 23px (measured ink + line box + gap) |
| Line label line step | 37px | 23px |
| Bar SVG with long labels | 336px | 253px; full numeric readings in visible rows |
| Line SVG with long labels | 367px | 284px; full numeric readings in visible rows |
| Simple info card | default 135.969px; proposed compact had no effect | default 135.969px, opt-in compact 99.969px |
| Flat opt-in | circle aspect ratio 1:1 | auto content height; default circle remains |
| Source surface stage | mandatory min-height 240px | no mandatory min-height; explicit comparison mode only |

No horizontal page overflow, clipped important reading or overlapping numeric row was detected in the focused matrix. The final focused run had **zero JavaScript console or local-resource errors**; existing browser suites likewise reported no such errors. Main was not changed or merged. shared/tokens.css, fonts and icons were unchanged. standalone.html was generated, never manually edited.

## Explicit limitations / NOT RUN

Real Android/iOS hardware, Safari/WebKit, real touch, TalkBack/VoiceOver, physical safe areas, phone keyboard and native zoom: **NOT RUN**. Enlarged text and pointer behavior are simulations, not device certification. No complete WCAG claim or production-ready claim. Chromium verification is **not real-device Android/iOS certification**.
