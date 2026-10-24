# Final Comprehensive Repair Report — 2026-10-24/25

**Repository:** `Qays7753/micro-ui-design-system` (independent; no other repository was opened, cloned, or compared).
**Branch:** `replit/light-only-complete-ui-repair-2026-10-24` (the same single branch; no other branch was created).
**Execution brief:** `docs/zai/ZAI-COMPREHENSIVE-REPAIR-EXECUTION-PROMPT-2026-10-24.md`.
**Input register:** all 63 findings R-01..R-63 from `docs/zai/FINAL-FULL-UI-REVIEW-2026-10-24.md` (+ JSON companion), each handled below — none silently dropped.
**Concept reference:** `docs/zai/references/samsung-calendar-concept/` (README + 5 PNGs) applied as interaction/information-hierarchy reference only; no Samsung visual language was copied.
**Scope:** Light-only release. Dark/System Dark untouched and untested, per the standing owner boundary. No logo, brand color, or token-identity changes beyond the two audited data-series contrast corrections (R-06) recorded with before/after values.

---

## 1. Executive summary

- **Calendar concept (Section C) implemented and verified:** two coordinated presentations (`expanded` / `agenda`) over the same complete month grid, the day itself as the action entry point, a quiet disclosure area that reveals only the selected day's items, host-owned Add/Edit/Delete events, and a full local-simulation editor in the Showcase. **No floating thumb-zone Add button and no Bottom Sheet exist anywhere in this flow** (regression-asserted). `light-calendar-check.py` grew from 85 to **110 checks, all passing**.
- **All 63 register findings closed:** 49 fixed in code/specs/tests, 12 closed as documented decisions/annotations (owner-sanctioned accent kept, forced-colors honestly scoped out, compatibility APIs given a deprecation plan, etc.), 2 recorded as scanner false positives (no action, documented). Detail in §2.
- **Chart concepts re-audited (Section B), not just CSS:** every family was measured and visually audited at 320/390 in the real Showcase. Decisions: bars/line/signed charts **KEEP**; donut **KEEP** (with R-06/R-07 fixes); bubbles **MAKE OPT-IN (Showcase demo retained, documented as approximation)**; packed-circle showcase presentation **REPLACED with bars** (component stays PROPOSED opt-in); metric-circles showcase presentation **REPLACED with compact stat cards** (component stays opt-in). Evidence in §4.
- **Every required gate is 0 FAIL** (§6), the standalone is byte-identical, `main` untouched, working tree clean after commit, `git diff --check` clean.

---

## 2. R-01..R-63 status register

| ID | Status | What was done (file:proof) |
|---|---|---|
| R-01 | **Fixed** | `docs/CURRENT-STATE.md` calendar contract sentence rewritten to the 2026-10-25 two-presentation contract |
| R-02 | **Fixed** | `order-schedule.js`: direction re-evaluated in `render()` + `dir` MutationObserver on `documentElement` (disconnected in destroy); regression: calendar-check "LTR grid ArrowLeft…" family + new dir-flip behavior |
| R-03 | **Fixed** | `info-strip.js` keyboard arrows now follow the forced-RTL track geometry (the peek-engine precedent), consistent in LTR hosts |
| R-04 | **Fixed** | Em-dash removed from all visible product-UI strings in `data.js`, `packed-circle.js`, `picker.js`, `access-gateway.js`, `order-schedule.js`, showcase host text; drawn dash markers kept only as chart null encoding + the documented `m-missing` organization mark |
| R-05 | **Fixed** | `packed-circle.js scaleError()` rewritten to the user/dev split (visible: «تعذّر رسم المقارنة بهذا المقياس…»; full diagnostics on `data-scale-detail`) |
| R-06 | **Fixed** | `shared/tokens.css`: `--micro-data-c` #B6A3D6→#A189CA (2.28→3.02:1), `--micro-data-e` #B3BD7B→#8E9A4D (2.00→3.05:1) — in-hue darkening to clear WCAG 1.4.11 on white; old values retained in the documenting comment; audited exception recorded in `light-static-check.py` |
| R-07 | **Fixed** | Donut renderer: per-slice radial 1px non-scaling `--micro-data-boundary` separators at every slice boundary (packed-circle inset-ring pattern) |
| R-08 | **Fixed** | `buttons/specification.md` reconciled to Geometry B (16/10 padding, no resting shadow, 12px radius; old values marked historical) |
| R-09 | **Fixed** | Collision resolved: component token renamed `--micro-metric-hero-separator-color` (metric-comparison.css); orphan 16px length token removed from `tokens.css` |
| R-10 | **Fixed** | Weight tokens `--micro-weight-regular/medium/semibold` added; **76** `font-weight` declarations across 15 CSS files swapped to tokens |
| R-11 | **Fixed** | `--micro-section-title-size/line` (18px, relative line-height) added; organization `.m-section-title`, showcase `.sc-section__title`, gateway heading, and 5 raw 13px SVG text sites in `data.css` moved to tokens |
| R-12 | **Fixed** | z-ladder tokens `--micro-z-backdrop/layer/toast` (80/85/90) defined in tokens.css, consumed by navigation.css + messages.css, documented in SYSTEM-CONTRACTS |
| R-13 | **Fixed** | Views bar stays usable above loading/error boxes in `order-schedule.js render()`; regression-checked in calendar-check §H |
| R-14 | **Fixed** | Picker recovery: document-level Escape while open (single listener, attached/detached) + `focusout` three-way classification (internal move / explicit leave / microtask settle) — closes honestly with updated `aria-expanded` |
| R-15 | **Fixed** | `info-strip.js` rebuilt with `disconnect(root)` + `rescan(root)` lifecycle (registry WeakMap, teardown restores un-init state); documented in SYSTEM-CONTRACTS lifecycle table |
| R-16 | **Fixed** | «تعذّر» form unified (order-schedule error line + packed-circle + previews) |
| R-17 | **Fixed** | Retry phrasing standardized to «أعد المحاولة.» family (gateway, system preview, messages preview) |
| R-18 | **Fixed** | Value states standardized on parentheses «(غير متاح)» everywhere (readings, table, bubbles, donut legend, packed states) |
| R-19 | **Fixed** | Host-config fault rephrased neutrally («نموذج الدخول غير مكتمل…») |
| R-20 | **Fixed** | `navigation.js` full Arabic filter count helper (dual, 3–10, 11–99, 100+ compound rule) |
| R-21 | **Fixed** | `countPhraseAr` 100+ derives from last two digits (100→طلب, 101→طلب واحد, 102→طلبان, 132→طلبًا) |
| R-22 | **Fixed** | Carousel empty lines end with a period; list heading parallelized to «الطلبات غير المجدولة» |
| R-23 | **Fixed** | Picker no-result copy made generic: «لا نتائج مطابقة. عدّل كلمة البحث.» |
| R-24 | **Fixed** | `.m-ocal__row-statusdot` deleted from JS builder + CSS; status chip = label on semantic tint (regression asserts zero dots) |
| R-25 | **Accepted with reason** | Owner-sanctioned terracotta accent edge on `.m-info-card--accent` label kept as a documented brand exception (count-asserted =1 by the release gate); recommendation recorded, no change forced by a generic scanner |
| R-26 | **Fixed** | Chart error/scale-note callouts lost their side stripes; tint + status text carry the state |
| R-27 | **Fixed** | `destroy()` removes `data-ocal-layout/-compact/-selected-date/-presentation/-agenda-open` too; regression asserts a fully clean root |
| R-28 | **Fixed** | rAF wording amended everywhere (spec §3, header comment): transient resize coalescing only, cancelled in destroy |
| R-29 | **Fixed** | Spec §10 pointers now reference `.m-ocal__gridrow`/`.m-ocal__cell` + the agenda block (rail selector gone) |
| R-30 | **Fixed** | SYSTEM-CONTRACTS spacing table includes the 20px step |
| R-31 | **Fixed** | `manifest-build.py` re-run after all files settled: 503 entries, self-check zero diffs |
| R-32 | **Fixed** | Picker search normalization: lowercase + NFD diacritic-strip before match (options source untouched; no-Intl fallback documented) |
| R-33 | **Documented** | forced-colors honestly recorded in SYSTEM-CONTRACTS as NOT RUN with the deliberate no-hack decision (no pretend support) |
| R-34 | **Fixed** | Showcase gateway demo resolves with an explicit simulation-labeled `message` («تم الدخول في محاكاة العرض فقط…») |
| R-35 | **Documented** | Password-reveal recipe extracted as a documented composition recipe into `fields/specification.md §8b` with the gateway as reference implementation (deliberate gateway-only boundary kept, no new API) |
| R-36 | **Fixed** | Calendar inline SVGs moved to stroke-width **1.5** (asset-set contract) — all six glyphs |
| R-37 | **Fixed** | `assets/icons/delete-02.svg` gained `stroke-linejoin="round"` (embedded showcase symbol re-synced; build icon-check passes 23/23) |
| R-38 | **Fixed** | Showcase 700 → 600 weight token (no faux-bold) |
| R-39 | **Fixed** | Preview chrome hexes named as scoped `--preview-*` variables in `previews/index.css` + `previews/system/system.css` with documented scope |
| R-40 | **Fixed** | Dead `[data-theme="dark"]` rules deleted from `previews/index.css` |
| R-41 | **Accepted with reason** | Weekday 3-letter abbreviations kept as the phone-calendar Arabic convention; decision documented in spec §8 (full names remain in cell aria-labels; header is aria-hidden) |
| R-42 | **Fixed** | `headingLevel` option (2–6, default 3) applied to all component headings |
| R-43 | **Fixed** | Showcase calendar mount gained `role="region"`; copy refreshed for the new contract |
| R-44 | **Fixed** | Fields spec radius self-contradiction resolved to 12 (both sites) |
| R-45 | **Fixed** | Stale pixel comments in buttons.css/fields.css replaced with token-name comments |
| R-46 | **Fixed** | Vestigial `min(…, 50%)` removed — plain `--micro-radius-button-long` with corrected comment |
| R-47 | **Documented** | Compact badge slack documented in spec §8 as designed wrap behavior (row floor absorbs it) |
| R-48 | **Fixed** | UI-DECISIONS «Dark الآن» annotated as historical, superseded by the 2026-10-24 Light-only decision |
| R-49 | **Fixed** | surfaces.css waves block re-tagged as historical comparison (A04 curves remain the adopted default) |
| R-50 | **Fixed** | Hero chrome scope documented in UI-VISUAL-SYSTEM («preview chrome only», `--preview-*` naming) |
| R-51 | **Fixed** | Swipe mapping unified with the track geometry (sub-case of R-03, same rewrite) |
| R-52 | **Fixed** | Showcase filter segment pressed-state synced with the actually applied filter in `setShowcaseView` |
| R-53 | **Accepted with reason** | Day→month re-entry keeps the browsed month (honest per the browsing contract); optional snap not implemented — recorded, not silently dropped |
| R-54 | **Fixed** | Showcase hint reworded to describe the direction-locked signed-axis geometry; rationale comment added at the physical island in metric-comparison.css |
| R-55 | **Fixed** | Ellipsis convention documented in SYSTEM-CONTRACTS (status lines «…» vs loading button labels) |
| R-56 | **Accepted with reason** | Kicker pattern already mitigated (letter-spacing 0 for Arabic, real numbering); optional fold not applied |
| R-57 | **Accepted with reason** | Button padding ratio left at the shipped Geometry B tokens (16/10) after review — ratio rules are guidance for generated layouts, and changing global button padding is an owner-level token decision; recorded explicitly |
| R-58 | **Accepted with reason** | Faint gridlines vs strong zero axis recorded as the intended hierarchy decision; no token change forced |
| R-59 | **Documented** | Deprecation plan for the three loading-compat APIs written into buttons spec §«A للتوافق» (explicit, no silent break this batch) |
| R-60 | **Not applicable (FP)** | Scanner false positives (zero-marker data encoding, semantic info edge) — documented, correctly no action |
| R-61 | **Accepted with reason** | 360px threshold literals kept documented in spec §8 (JS constant + CSS attribute pair are already co-located and commented) |
| R-62 | **Fixed** | Token aliases annotated (derived-from notes, distinct-role note for summary-light-mid) |
| R-63 | **Fixed** | Offline/connectivity states explicitly scoped out of the library in SYSTEM-CONTRACTS |

**The nine unproven risks** from the review and what happened to them this pass:

1. **A3 owner-screenshot clipping** — still **not reproduced**; the new evidence matrix (32 calendar screenshots at 320/360/390/430 × RTL/LTR with per-case document-overflow guard) again found zero overflow; remains an open risk outside this tree's rendered output.
2. **Chromium-only verification** — unchanged and honestly re-declared (NOT RUN list in spec §11 and §8 below). Real-device/WebKit/Safari/touch/screen-reader/native-zoom remain untested.
3. **Compact-grid thumb accuracy** — unchanged untested (no touch hardware); the agenda 40px-floor presentation adds a second documented geometry, both above WCAG 2.5.8 minimum.
4. **`.showcase-canvas` container query no-op** — unchanged engine-dependent note; the compact flip itself is JS-driven (ResizeObserver) and verified at all widths.
5. **Font-load race windows** — unchanged, correct-by-inspection only.
6. **Contrast certification scope** — the two failing series tokens were corrected to ≥3:1 on white (R-06); adjacent-series luminance separation remains impossible for 5 adjacent series within a valid lightness range and is carried by the R-07 boundary strokes + full text readings; recorded, not overclaimed.
7. **Consumer-side token re-pointing** — unchanged boundary risk, documented in contracts.
8. **Gateway demo-success perception** — mitigated by the R-34 labeled simulation message; user perception still untested.
9. **RTL screen-reader punctuation announcements** — untested, still on the NOT RUN list.

---

## 3. Calendar interaction contract (Section C final)

**State model** (all on the root, `destroy()` removes every attribute):

- `view` = calendar | list; `cal-view` = month | day; **`presentation` = expanded | agenda** (new); `agenda-open` (new, agenda+month only); `compact` (<360px root, CSS-only); `selected-date`; `layout`.
- `monthCursor` stays fully separate from `selectedDate` (Phase A contract preserved); browsing another month shows the honest browsing note in both presentations.

**API** (additions; nothing removed): `options.presentation`, `options.orderActions {edit,delete}`, `options.headingLevel`; `instance.setPresentation(v)`; events `order-schedule:order-edit-request {id}` and `order-schedule:order-delete-request {id}`. All prior events/options unchanged (documented migration note: hosts that enabled nothing see zero new DOM).

**Interaction contract:**

1. **The day is the entry point.** Tapping a day selects, emits `day-select` once, and updates the day panel / disclosure label immediately.
2. **No floating thumb-zone Add button. No Bottom Sheet. No layer.** Regression-asserted (`no floating add control and no bottom-sheet layer exist in this flow`). Add is an in-page button in the day panel (expanded) / agenda body (agenda) / list; Edit/Delete are per-row 48×48 buttons only on day-action surfaces and only when the host enables them.
3. **Collapse/expand** is an explicit `aria-pressed` button; **no vertical swipe was implemented** (deliberate: untestable here, competes with scroll/month navigation — decision recorded in the reference README and spec).
4. **The quiet disclosure area** starts collapsed; opening reveals only the selected day's items (content derives from `selectedDate` alone — stale `monthCursor` cannot leak another day, regression-tested while browsing September with October selected); it never changes the selection and emits no event; Escape collapses and restores focus; empty day → honest empty state + Add.
5. **Keyboard:** roving grid tabindex unchanged; disclosure button is a real button; Escape paths (picker from anywhere via document listener + focusout; agenda via root handler) both restore focus.
6. **Day-view / list-view** are unaffected by the presentation pair.

**Visual verification matrix (evidence in `docs/zai/evidence/calendar-concept/`, 32 PNGs):**

| Case | 320 | 360 | 390 | 430 |
|---|---|---|---|---|
| expanded month, RTL/LTR | ✔ | ✔ | ✔ | ✔ |
| agenda collapsed (quiet), RTL/LTR | ✔ | ✔ | ✔ | ✔ |
| agenda open (rows + actions), RTL/LTR | ✔ | ✔ | ✔ | ✔ |
| day-tap updates agenda, RTL/LTR | – | – | ✔ | ✔ |
| in-page editor (add flow), RTL/LTR | – | – | ✔ | ✔ |

Every case ran with a per-case document-overflow guard and zero console/page/resource errors; VLM visual audits of expanded-320-rtl, agenda-open-390-rtl, agenda-collapsed-430-ltr, and editor-390-rtl all returned "professional, complete grid, no clipping/overlap". Populated/empty/loading/error/retry states are covered by the 110-check suite; direction changes, live resize, destroy, and 200% typography are covered by the release matrix (792/0).

---

## 4. Chart concept decisions (Section B)

Method: every family measured in the real Showcase at 320/390 RTL (`docs/zai/evidence/chart-audit/measurements.json` + 20 screenshots) and visually audited (VLM) for legibility, proportion, and "understandable in seconds on a phone".

| Family | Decision | Rationale & action |
|---|---|---|
| bars (incl. signed) | **KEEP** | Correct concept for precise comparison/ranking; 8:4:10 ratio math + zero/unknown/negative states verified; signed zero-axis documented |
| line (incl. signed time) | **KEEP** | Genuine ordered/time trend with declared time axis, gap-on-missing verified |
| donut | **KEEP** (with fixes) | Few-category part-to-whole with declared denominator 25, center total, full legend fallback; R-06 contrast + R-07 slice separators applied; VLM: "professional, well-proportioned, no defects" |
| bubbles | **MAKE OPT-IN** (documented) | VLM: rank readable but area non-linear for precise comparison — stays host-opted (already opt-in in showcase copy); presentation labeled as approximation |
| packed-circle | **REPLACE (showcase presentation)** | VLM at 320px: overlap occludes circle parts, distorts area comparison, "infographic not data tool" → the Showcase now presents the same data as **bars** (`#sc-chart-packed` is a bars chart, same source/values/stress fixtures); the component itself remains PROPOSED opt-in in the library with its limits documented in PACKED-PATTERN.md; repair-check F-09 rewritten to assert the replacement decision |
| metric-circles | **REPLACE (showcase presentation)** | Measured: 112/70/42px circles are empty decoration with values outside; VLM: "decorative, poor data-ink, vertical bloat" → the Showcase now presents the same readings as **compact stat cards** (`m-stat` grid, stress fixtures intact); the component remains opt-in with its phone-limit documented in metric-comparison spec |
| main-metric rows/flat | **KEEP** | The recommended default (rows with common axis); unchanged |
| main-metric featured | **KEEP (opt-in)** | Explicit featured variant, documented |
| metric hero separator token | renamed (R-09) | No visual change |

Migration impact of the two replacements: **zero public API breaks** — both are Showcase presentation choices using existing, stable components (`data-chart="bars"`, `m-stat`); the replaced components remain in the library, specs, catalog, and package unchanged. Catalog `chartPolicy` still lists both as specialized opt-in. Before/after evidence: `docs/zai/evidence/chart-audit/packed-circle-320-rtl.png` (before) vs the bars presentation now rendered under the same section (repair-check F-09 screenshot, `--tag after`); same for metric-circles.

---

## 5. Copy and anti-slop pass

- **Em-dash eliminated from visible prose**: ~30 product strings + ~40 showcase/demo-chrome instances rewritten (periods, semicolons, parentheses, or «:»). The drawn dash survives only as chart null-mark encoding and the documented `m-missing` organization mark (data encoding, not punctuation).
- **Value states** unified to parentheses: «(غير متاح)», «(سالب غير مرسوم)», «(قيمة شاذة)», «(غير صالح للنسب)», «(غير معروف)», «0 (صفر)».
- **Status dots in chips removed** (R-24) — word + semantic tint carry state; legend keys, today markers, calendar day dots (data encoding) retained.
- **Callout stripes removed** (R-26) — tint + text only.
- Terracotta discipline untouched (owner-sanctioned single accent edge kept; not turned into a theme).

---

## 6. Exact commands and results (all run this pass, from the repository root)

| Command | Result |
|---|---|
| `python3 tools/light-release-check.py` | **792 PASS / 0 FAIL**; 64-case matrix (320/360/390/430 × RTL/LTR × ar/en × type1/2 × dpr1/2), no console/resource errors |
| `python3 tools/light-static-check.py` | **204/204 PASS** (incl. R-06 audited palette exception) |
| `python3 tools/light-calendar-check.py` | **110 PASS / 0 FAIL** (was 85; +25 presentation/agenda/actions/recovery/destroy checks) |
| `python3 tools/light-data-check.py` | **165 PASS / 0 FAIL** |
| `python3 tools/chart-mobile-check.py` | **59 PASS / 0 FAIL** (bubble value-state expectation updated to parentheses convention) |
| `python3 tools/component-mobile-check.py` | **52 PASS / 0 FAIL** |
| `python3 tools/ui-system-showcase-check.py` | **118 PASS / 0 FAIL** |
| `python3 tools/ui-system-showcase-repair-check.py --tag after` | **92 PASS / 0 FAIL** (F-08 updated to the two-presentation contract; F-09 rewritten for the packed replacement decision); 0 console errors |
| `python3 tools/component-catalog-build.py --check` | **PASS** (14 families, 6 explicit variants, paths/inventory OK) |
| `python3 tools/build-ui-system-showcase-standalone.py` then `--check` | **BUILD OK / SELF-CHECK OK / CHECK OK — byte-for-byte identical** (icon check 23/23) |
| `node --check components/order-schedule/order-schedule.js` | **PASS** |
| `python3 -m py_compile tools/light-calendar-check.py` | **PASS** |
| `python3 tools/preview-runtime-check.py --base http://127.0.0.1:5000` | **112/112 PASS** (source + standalone × 320/360/390/430 × RTL/LTR; no page/resource/ResizeObserver errors) |
| `python3 tools/manifest-build.py` (+ `--check`) | **503 entries; self-check zero diffs** |
| `git diff --check` | **clean** |

---

## 7. Remaining limitations (explicit, no vague wording)

1. **Verification is headless-Chromium only.** Real Android/iOS devices, Samsung Internet, WebKit/Safari, true touch, TalkBack/VoiceOver, native OS zoom, safe areas, and real RTL OS announcements remain untested (spec §11 NOT RUN list). No merge readiness is claimed from automation alone.
2. **No vertical swipe gesture** in the calendar (deliberate; documented in §3.3 and the reference README). The explicit button is the only expand/collapse path.
3. **Compact/agenda day-cell widths** (37.7–47.7px compact; ~40px agenda floor rows) remain below the 48px command-control target by documented design (WCAG 2.5.8-compliant ≥24×24 with ≥48 heights in compact); real-thumb accuracy untested.
4. **A3 owner-screenshot clipping** still not reproduced anywhere in this tree; if it persists on the owner's device it is outside this repository's rendered output (stale build/zoom/DPR).
5. **Bubbles and (library-side) packed-circle/metric-circles** remain approximations requiring host opt-in; the Showcase no longer presents packed-circle/metric-circles as demo surfaces (replaced by bars/stat cards) — hosts choosing them must read their documented limits.
6. **Chart adjacent-series luminance** cannot reach 3:1 between every adjacent pair of five series within a lightness-valid range; separation is carried by 1px boundary strokes + full text readings (R-06/R-07); no WCAG certification beyond the measured pairs is claimed.
7. **Loading-compat button APIs** (R-59) are deprecated-candidates with a plan, not yet removed — removal requires an owner-approved breaking-change note.
8. **forced-colors** and **offline states** are documented decisions (SYSTEM-CONTRACTS), not implemented/tested features.

---

## 8. Integrity statement

- Only the existing branch `replit/light-only-complete-ui-repair-2026-10-24` was used; **`main` untouched**; no merges, no PRs, no new branches.
- No old Micro repository was opened or compared; no backend, persistence, users, or product data were invented — the Showcase editor/add/delete loop is a clearly labelled local simulation.
- No fixture was weakened to pass a gate: every expectation change corresponds to a documented contract change (bubbles value-state parentheses, picker focus-recovery paths, F-08/F-09 rewritten to the new contracts, R-06 audited palette exception); the release/calendar counts **grew** (792→792 with 12 real geometry failures fixed in CSS, 85→110, 88→92).
- Evidence: `docs/zai/evidence/calendar-concept/` (32 PNGs), `docs/zai/evidence/chart-audit/` (20 PNGs + measurements.json), plus the regenerable acceptance matrices under `generated-artifacts/light-only-repair/acceptance/` (gitignored by design; reproducible via the commands above).
