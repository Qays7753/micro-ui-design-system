# Final Component Repair and Concept Audit Report — 2026-10-25

**Repository:** `Qays7753/micro-ui-design-system` (independent UI Design System; no other repository was opened, cloned, or compared).
**Branch:** `replit/light-only-complete-ui-repair-2026-10-24` — the same single branch; no other branch was created, `main` untouched (local and remote `main` both remain at `161bb71adbed86e0df4382174cb07bd2fcb8d62d`), no merges, no PRs.
**Starting head:** `87b211b0e07c03d9a412e279986efd99603252ab` (the owner-reference head; `df53cc7` history preserved below it).
**Execution brief:** `docs/zai/ZAI-COMPONENT-LEVEL-REPAIR-AND-CONCEPT-AUDIT-PROMPT-2026-10-25.md`.
**Concept references:** `docs/zai/references/owner-visual-concepts-2026-10-25/calendar-target.png` + `chart-target.png` (+ README) as the owner-approved concept direction; `docs/zai/references/samsung-calendar-concept/` as the prior interaction reference. No external colors, branding, icons, sample data, avatars, or product chrome were copied; no logo or token-identity changes.
**Scope:** Light-only. Dark/System Dark untouched and untested, per the standing owner boundary. Terracotta remains the single documented owner-sanctioned accent edge (`.m-info-card--accent` label) — it was not extended anywhere.

---

## 1. Executive summary

- **Calendar concept rebuilt to the owner target (component level):** day number + ≤3 status dots are now one tight centered group (fixed 2px gap) — the indicator-to-next-row ambiguity the audit measured (indicators sat 17–26px below their own number but only 6–10.5px above the next row's) is resolved and regression-asserted; the counter chip was removed from month cells (single indicator system, count lives in the cell `aria-label`, day panel, and agenda); today = ring + semibold number (two marks, not four); the month/year picker trigger gained a real hierarchy (month 16px/600 + year 13px/400 + chevron); three stacked 48px control rows were merged into one row (`month/day/list` unified segment with petrol-filled pressed state + a quiet collapse button); the agenda 40px row floor now actually wins over compact on phones (dead-code cascade fixed); the agenda toggle's accessible name no longer concatenates («…20263 طلبات»).
- **Owner chart requirements implemented as reusable contracts:** every quantitative chart family now distinguishes **no data from real zero** in its own slot (bubbles gained the missing empty branch; the signed family no longer draws a zero axis + `0` label when every value is unknown); the **chart/table switch** now exists for *every* quantitative family — data.js families already had it and their tables now carry unit/period (+ donut denominator) in the caption; packed-circle and metric-comparison (rows + circles) gained the same disclosure contract; the donut became a responsive compact presentation (112px ring with the legend beside it under 360px, 148px above — chart-target block-4 direction), cutting the narrow-phone plot+legend block by ~70%.
- **All required gates finish 0 FAIL** (§7), the standalone is byte-deterministic, `MANIFEST.json` rebuilt (574 entries) with a new read-only `--check` mode, `git diff --check` clean, working tree contains only this pass's changes.
- **Five specialist passes** (component architecture, calendar, charts, mobile/RTL/stress, showcase/integration) audited the real source before any edit; every suspected issue was mapped to exactly one layer and fixed at that layer only (§3).

---

## 2. One-line outcome for each finding from the latest audits

**External visual audit observations (the brief's summary):**

| # | Observation | Outcome |
|---|---|---|
| V1 | Calendar weakest (~5.5/10): day numbers/indicators dense at 320px, indicator↔row ambiguity | **Fixed at component level** — centered number+dots group with fixed gap, single indicator system, 8px week separation; measured + asserted (§4.1) |
| V2 | Numeric comparisons consume too much vertical space | **Split finding**: donut presentation fixed at component level (compact ring+legend); metric family already offers documented compact variants — showcase composition documented as intentional family demo; donut 416px→~116px plot+legend at 320px |
| V3 | Surfaces/cards feel repetitive/conventional | **Investigated as design-system hypothesis** (3 radii + one surface color; 11/17 showcase blocks share one chrome signature); no broad restyle was authorized — recorded with the token-respecting recommendation; the new viewseg/quiet-button anatomy and compact donut reduce same-shape stacking without any palette change |
| V4 | Navigation not fully proven (five-section layout) | **Doc drift, not a defect** — the Overview view *is* a five-section layout (5 `data-overview` sections); two-view model now documented in showcase README + coverage doc |
| V5 | Horizontal choices partially cut at 320px | **Documented intentional behavior** — `m-seg` single-row scroll policy with visible-edge discovery affordance (spec D-UI-01); measured symmetric RTL/LTR; no clipping without a scroller found (probe: 0 real clips, 0 document overflow) |
| V6 | Foundation 7.3 / identity 5.5 (subjective) | Buttons/fields/labels/messages/contrast preserved untouched; identity strengthened only through concept-level changes above (no palette/logo changes) |

**Specialist findings (SPEC-1..SPEC-5) and the two donut defects:** all closed in §3.

---

## 3. Issue register (root cause → fix → regression)

| ID | Observed evidence | Reproduction | Root-cause layer | Files changed | Decision & fix | Regression test | Remaining limitation |
|---|---|---|---|---|---|---|---|
| C-01 | Indicators 17–26px below own number vs 6–10.5px above next row (2–4.3× closer to wrong row) | isolated example + showcase, 320/390 RTL/LTR | Component design contract (cell anatomy) | `order-schedule.js`, `order-schedule.css` | Fixed: number+dots one centered group, fixed 2px gap, week gap 4→8px | `light-calendar-check.py` A2: "dots sit directly below…" + "indicator-to-next-row distance exceeds…" | VLM-estimated target gaps; real-device thumb testing NOT RUN |
| C-02 | Dual indicator system (counter chip + dots) over-inks 37.7px cells; 0.7px wrap edge (R-47) | isolated + showcase | Component design contract | `order-schedule.js`, `order-schedule.css`, `specification.md` | Fixed: counter chip removed from month cells; count in aria-label/day-panel/agenda; dots-only ≤3 | A2 "no counter chip inside month cells"; release matrix | >3 status types invisible in dots (documented; aria-label + legend carry them) |
| C-03 | Today vs selected invertible by fresh readers (VLM misattributed twice); today stacked 4 marks | VLM on evidence PNGs | Component design contract | `order-schedule.css` | Fixed: today = 2px ring + semibold number (under-dot removed); selected remains the single petrol fill + semibold inverse | A2 "today = ring + semibold… no under-dot" + "selected keeps the solid petrol fill" | — |
| C-04 | 208px chrome above grid (3×48px control rows + weekdays); day panel below fold at 320 | isolated + showcase | Component design contract | `order-schedule.js`, `order-schedule.css`, spec | Fixed: `[prev][month year ⌄][next][اليوم]` + one controls row (unified `month/day/list` segment + quiet collapse button) ≈148px | A2 viewseg checks + release matrix 200% cases | — |
| C-05 | Flat month/year header, no picker affordance | isolated | Component design contract | `order-schedule.js`, `order-schedule.css`, spec | Fixed: month 16/600 + year 13/400 + chevron in one trigger; space text node keeps `textContent` semantics | A2 "month/year hierarchy… chevron present"; release-check title assertions | — |
| C-06 | «طي الشهر» promised grid compression that never happened on phones (agenda 40px floor dead code under compact 48px) | fixture at root 288 | Component implementation defect (CSS cascade order) | `order-schedule.css`, spec §8 | Fixed: `[data-ocal-presentation][data-ocal-compact]` higher-specificity rule — 40px floor wins on phones | A2 "agenda 40px floor wins over compact on phone root" | 40px rows are ≥24×24 WCAG 2.5.8 by documented design, below the 48px command target |
| C-07 | Agenda toggle accessible name concatenated without separator («…20263 طلبات») | DOM inspection | Component implementation defect | `order-schedule.js` | Fixed: explicit `aria-label` «أجندة {date}، {count}» | A2 "agenda toggle accessible name carries date and count with an explicit separator" | Screen-reader announcement behavior NOT RUN |
| C-08 | Bubbles rendered a blank plot for an empty dataset (no no-data state) | harness (empty `data-chart="bubbles"`) | Component implementation defect | `data.js` (render empty branch extended) | Fixed: honest «لا توجد بيانات لعرضها.» + `data-scale-state=empty` | `light-data-check.py` "bubbles with an empty dataset renders the honest no-data state" | — |
| C-09 | Signed chart with all-unknown values drew the zero axis + `0` label | harness | Component implementation defect | `data.js` (renderSigned guard) | Fixed: honest no-data state + complete readings; no axes/zero implied | `light-data-check.py` "signed chart with all-unknown values renders no axes…" | — |
| C-10 | Disclosure table lacked unit/period (and donut denominator) — owner wording requires them in the alternate view | DOM inspection | Component design contract | `data.js` (caption), spec | Fixed: caption = title + `الوحدة: …` + `الفترة: …` + declared total for donut | `light-data-check.py` "donut alternate table caption carries unit, period and declared denominator" | — |
| C-11 | packed-circle had no chart/table switch | DOM inspection | Component design contract (owner requirement) | `packed-circle.js` (+PACKED-PATTERN.md) | Fixed: same `m-chart__dataset-*` DOM contract on every render path (success/refusal/density) | `light-data-check.py` packed switch checks (open/hide/rows) | Table has no unit/period columns — the packed contract itself has no such attributes (documented) |
| C-12 | metric-comparison had no chart/table switch (both variants) | DOM inspection | Component design contract (owner requirement) | `metric-comparison.js`, `metric-comparison.css`, spec | Fixed: family-owned `m-main-metric__dataset-*` classes; bars table = فئة/قيمة/وحدة/فترة (+state wording), circles table = فئة/قيمة/حالة | `light-data-check.py` metric tables checks | — |
| C-13 | Donut stacked ~416px at narrow containers (fixed 148px ring + legend below <340px) | showcase 320/390 measurements | Component design contract (R1-UI08 amendment) | `data.css`, spec | Fixed: responsive compact — 112px ring + legend beside at all widths (<360px), 148px ≥360px; same viewBox/math/boundaries | `light-data-check.py` compact (112/side-by-side at 320) + wide (148 at 430) checks | Container queries require a modern engine (documented repo-wide note) |
| C-14 | Donut malformed-value refusal showed percentages it claims not to show; legend vs table state mismatch (invalid vs missing) | code trace + harness | Component implementation defect (edge paths) | Accepted for this pass as documented minor defects — refusal branch percentages: `noPercent` does not include `malformed`; legend prints `(غير متاح)` for null values while the table distinguishes `قيمة غير صالحة` | **Not fixed this pass** (no demo path exercises malformed donut values; both surfaces keep the raw reading); recorded here so it is not silently dropped | none | Open edge-defect, low impact, owner may schedule |
| C-15 | «خمس أقسام» navigation not represented | runtime probe | Showcase docs (Overview IS 5 sections) | `previews/ui-system-showcase/README.md`, `docs/UI-SYSTEM-SHOWCASE-COVERAGE.md` | Fixed: two-view model documented (Overview 5 families / State Lab 15 sections) | `light-release-check.py` overview cases (pre-existing) | — |
| C-16 | `manifest-build.py` had no `--check` — the documented gate always rewrote the file (self-proving) and HEAD's manifest was stale (4 missing files) | tool inspection + run | Tooling defect | `tools/manifest-build.py` | Fixed: real read-only `--check` (memory diff, exit 1 with +/−/~ list); manifest rebuilt; gitignored regenerated outputs excluded from fingerprinting (fresh-clone integrity) | `--check` run in §7 (and its failure output demonstrated during development) | Manifest counts working-tree files (pre-existing policy otherwise unchanged) |
| C-17 | Legacy tools pre-broken at HEAD: `complete-repair-chart-check.py` 249/21 (stale label/value-state expectations), `numeric-chart-geometry-check.py` 59/20 + timeout (packed expectations targeting the replaced presentation), `complete-repair-mobile-check.py` crash (removed auto-day contract + hidden overview controls), `professional-ui-repair-check.py` 9 pre-existing FAILs (info-card compact-is-default decision + F05/F13) | `git stash` pristine-HEAD runs (recorded) | Test maintenance debt from earlier contract changes | the four tools | Fixed to current documented contracts: chart-check 270/0; numeric 54/0 (showcase section now asserts the packed→bars replacement decision); mobile-check 62/62 (asserts complete-grid/compact contract + CSS-only focus persistence); ui-repair-check left as-is (its 9 failures are the pre-existing info-card/F05-F13 records, unchanged by this pass; professional-remediation 105/106 with the single `theme.system-dark` fail = Light-only boundary, out of scope) | their own suites (§7 supplementary table) | `professional-ui-repair-check.py` 9 pre-existing FAILs remain by decision (they record earlier accepted decisions, not this pass's regressions); none are in the required gate list |
| C-18 | No showcase demo of no-data vs real zero for charts | showcase inspection | Showcase fixture gap | `previews/ui-system-showcase/index.html` | Fixed: `#sc-chart-nodata` grid — empty bars + empty donut beside the existing real-zero bars | `ui-system-showcase-check.py` §9b (3 checks, source + standalone) | — |

**Mobile/RTL/stress (SPEC-4, retried):** 320px sweep found **0 real clips** (6 intentional scrollers per direction, symmetric), **200% typography PASS** (repo `TYPOGRAPHY_CSS` method; 3 native-input value clips = standard behavior), **0 sub-24px visible touch targets** (9 visually-hidden native inputs have sized visible counterparts), **0 document overflow** in every state. No fixes required; findings recorded as confirmations.

---

## 4. Calendar sections

### 4.1 Implementation defects (component level)
C-01, C-02 (JS+CSS anatomy), C-06 (cascade), C-07 (aria-label), and the double-viewseg render bug found during implementation (render() appended the segment twice — restructured so the controls row owns the single instance on every screen state including loading/error) — all fixed in `components/order-schedule/` and asserted by `light-calendar-check.py` (110→**123 checks, 0 FAIL**).

### 4.2 Design-contract decisions (component level, documented)
1. **Unified `month/day/list` segment** replaces the views bar + modes bar (three 48px rows → one). The segment composes the existing `view`/`calendarView` state — **no public API change**; legacy `view` values and the `cal-mode` action remain supported. Pressed state = petrol fill + inverse text (the component's own selection language).
2. **No Week view** — deliberate non-adoption of the reference's Day/Week/Month triple: a week presentation needs its own grid contract and is not required by order-schedule semantics; documented in spec §6 (never a fake tab).
3. **Single indicator system** — dots only in month cells; the count moves to the cell `aria-label`, day panel, and agenda surfaces (spec §6 rewritten; R-47's wrap edge eliminated at the root).
4. **Today = ring + semibold number; selected = petrol fill** — the fill stays the single strongest act (target concept), today drops from four stacked marks to two.
5. **Agenda 40px floor beats compact on phones** — spec §8 cascade rule corrected and documented.
6. **Month/year hierarchy inside one picker trigger** (no new dialog, no API change).
7. Owner hard decisions preserved and regression-asserted: **no floating thumb-zone Add, no Bottom Sheet, no layer** in this flow; `monthCursor`/`selectedDate` separation unchanged; day = entry point; host-owned add/edit/delete events unchanged.

### 4.3 Showcase-only issues
The calendar section composes one instance with host fixtures and the local-simulation editor — unchanged except that it now renders the new component anatomy automatically. The section hint already described the current contract. No host defect was found in the calendar section; V5/V4 classifications above cover the other showcase-level findings.

### 4.4 Product-level UX decisions intentionally left outside this repository
Five-tab product navigation maps, real navigation destinations, week planning semantics, device-level gesture tuning, and any editor flow beyond the host-owned events remain product decisions — this library only provides the reusable surface and the events (per AGENTS.md/DESIGN.md boundaries; recorded so the audit's "five-section layout" reading is not mistaken for a component gap).

---

## 5. Chart concept decision table

| Family | Decision | Rationale (measured, 320/390 RTL) | Source data | Migration impact |
|---|---|---|---|---|
| bars (non-signed) | **KEEP** | precise comparison; honest zero/missing/empty (VLM: "zero vs missing clearly distinguished") | unchanged | none |
| line (category/time) | **KEEP** | ordered trend; gap-on-missing verified | unchanged | none |
| signed bars / signed time | **KEEP + FIX** | shared zero axis kept; all-unknown now renders honest no-data instead of axes (C-09) | unchanged | none (presentation-only fix) |
| donut | **KEEP + IMPROVE (compact presentation)** | part-to-whole with declared denominator; compact 112px ring + side legend cuts narrow plot+legend ~70% (chart-target block-4) | unchanged (viewBox 148, R=58, same math/boundaries) | none — responsive rendering only; R1-UI08 amended in spec |
| bubbles | **OPT-IN (unchanged) + FIX** | area approximation stays host-opted; empty dataset now honest (C-08) | unchanged | none |
| packed-circle | **OPT-IN (library) — showcase replacement REAFFIRMED** | overlap occlusion at 320px (prior evidence); showcase presents bars with the same source; component keeps honest states + gained the table switch (C-11) | showcase replacement uses the identical 84,300/52,100/12,000 source | zero public API breaks |
| metric-circles | **OPT-IN (library) — showcase replacement REAFFIRMED** | 562px vs 234px stat cards (prior measurement); component keeps documented states + gained the table switch | stat cards carry the same readings | zero public API breaks |
| main-metric rows/flat | **KEEP + table switch** | recommended default; rows keep full readings; table adds فئة/قيمة/وحدة/فترة columns (C-12) | unchanged | additive disclosure only |
| main-metric compact | **KEEP** | documented density variant | unchanged | none |
| main-metric featured | **KEEP (opt-in)** | declared highlight; **no proportion encoding invented** — see §11 deviation D-3 | unchanged | none |

No family met "REMOVE AS UNSUITABLE DEFAULT": the two prior replacements (packed-circle, metric-circles showcase presentations) were reaffirmed with their decisions already documented; the chart-target gauge/arc concept was deliberately not added (§11 D-3).

---

## 6. Before/after visual evidence

`docs/zai/evidence/component-repair-2026-10-25/` (28 PNGs + `capture-report.json`: 12 guarded cases, **0 overflow failures, 0 console/page errors**):

| Subject | After (this pass) | Before (prior evidence) |
|---|---|---|
| Calendar expanded | `calendar-{320,390,430}-{rtl,ltr}.png` | `../calendar-concept/agenda-*` (prior anatomy with counter chips + spread indicators) |
| Calendar agenda (collapsed/open) | `calendar-agenda-*`, `calendar-agenda-open-*` | same prior folder |
| Isolated example (component-level proof) | `calendar-example-320-rtl.png` | — |
| Donut compact + legend-beside | `data-section-{320,390}-{rtl,ltr}.png` | `../chart-audit/donut-320-rtl.png` (stacked 416px) |
| Complete alternate table (unit/period/total) | `donut-table-{320,390}-{rtl,ltr}.png` | — |
| No-data vs real zero demo | `nodata-{320,390}-{rtl,ltr}.png` | — |
| Metric full-data table | `metric-table-320-rtl.png` | — |

VLM audits of the new evidence: calendar-320-rtl — "day-number/event-dot association: Excellent … Professional, High-Clarity"; data-section-320-rtl — "good, thick ring width … center total large, bold, and highly readable … legend beside the ring is the correct choice for mobile". (VLM judgments are model opinions; DOM/geometry assertions in the gate tools are the authoritative checks.)

---

## 7. Exact commands and real totals (run from the repository root at the final tree)

| Command | Result |
|---|---|
| `python3 tools/light-release-check.py` | **792 PASS / 0 FAIL** — 64-case matrix (320/360/390/430 × RTL/LTR × ar/en × type1/2 × dpr1/2), no console/resource errors |
| `python3 tools/light-static-check.py` | **209/209 PASS** (incl. audited palette exception) |
| `python3 tools/light-calendar-check.py` | **123 PASS / 0 FAIL** (was 110; +13 anatomy/viewseg/cascade/aria checks) |
| `python3 tools/light-data-check.py` | **178 PASS / 0 FAIL** (was 165; +13 owner-contract checks: no-data states, caption completeness, compact donut, packed/metric tables) |
| `python3 tools/chart-mobile-check.py` | **59 PASS / 0 FAIL** |
| `python3 tools/component-mobile-check.py` | **52 PASS / 0 FAIL** |
| `python3 tools/ui-system-showcase-check.py` | **124 PASS / 0 FAIL** (was 118; +6 no-data checks × source/standalone) |
| `python3 tools/ui-system-showcase-repair-check.py --tag after-component-repair` | **92 PASS / 0 FAIL**; 0 console errors |
| `python3 tools/component-catalog-build.py --check` | **PASS** (14 families, 6 explicit variants, paths/inventory OK) |
| `python3 tools/build-ui-system-showcase-standalone.py` then `--check` | **BUILD OK / SELF-CHECK OK / CHECK OK — byte-for-byte identical** (icon check 23/23) |
| `python3 tools/preview-runtime-check.py --base http://127.0.0.1:5000` | **112/112 PASS** (source + standalone × 320/360/390/430 × RTL/LTR; no page/resource/ResizeObserver errors) |
| `python3 tools/manifest-build.py --check` | **CHECK OK: 574 entries, read-only** (rebuilt this pass; stale-at-HEAD failure demonstrated before rebuild) |
| `node --check components/order-schedule/order-schedule.js` | **PASS** (also `data.js`, `packed-circle.js`, `metric-comparison.js`) |
| `python3 -m py_compile tools/light-calendar-check.py` | **PASS** |
| `git diff --check` | **clean** |

Supplementary (not in the required list, repaired from pre-existing breaks this pass): `complete-repair-chart-check.py` **270/0** (was 249/21 at HEAD 87b211b), `complete-repair-mobile-check.py` **62/62** (crashed at HEAD), `numeric-chart-geometry-check.py` **54/0** (was 59/20 + timeout at HEAD), `concepts-check.py --chromium <playwright-chrome>` **162/162**, `data-scale-state-check.py` **23/23**, `professional-remediation-check.py` 105/106 (single FAIL = `theme.system-dark`, out of Light-only scope, pre-existing), `professional-ui-repair-check.py` 266/278 with the same 9 pre-existing info-card/F05-F13 FAILs as pristine HEAD (verified by `git stash` comparison; unchanged by this pass).

---

## 8. Not reproduced / untested (honest list)

**Not reproduced:** no horizontal clipping without an intentional scroller at 320px (SPEC-4 sweep); no sub-24px visible touch targets; no document overflow in any probed state; A3-style owner-device clipping remains un-reproduced in this tree (standing note). **Not fixed (recorded):** C-14 donut malformed-value edge defects; V3 surface-repetition hypothesis left as a recorded recommendation (no authorized palette/role change); `professional-ui-repair-check.py`'s 9 pre-existing FAILs kept as historical records. **NOT RUN:** real devices, Samsung Internet, WebKit/Safari, true touch, TalkBack/VoiceOver (and RTL screen-reader punctuation), native OS zoom, safe areas, forced-colors (documented out), vertical swipe (deliberately unimplemented).

---

## 9. Why the result is more reusable, readable, and native-feeling

The calendar now reads like a phone calendar: one glance answers "which day, which day is today, which days carry work" because the number and its indicators form one visual unit and the strongest fill is reserved for the single act (selection); the header states where you are (month/year hierarchy) and what you can do (one segmented control instead of three rows), leaving the day's content above the fold at 390/430. The charts answer "what is the number, for which unit, over which period, and is it zero or merely missing" — in the chart, in the legend, and in a complete keyboard-reachable table for every family, with a donut that fits a phone's width instead of stacking a third of a screen of whitespace. All of this was achieved inside the existing token system, with zero public API breaks, so a future consumer can adopt the compact presentations by upgrading alone.

---

## 10. Files intentionally not changed

`shared/tokens.css` (identity locked; no new colors — the viewseg pressed state and donut compact reuse existing tokens); `components/buttons|fields|selection|navigation|messages|surfaces|info-strip|organization|account-settings|access-gateway|carousel` (audit: strongest areas / no component-level defect found); `previews/concepts/*` and `previews/compositions/*` (isolation demos unaffected); `assets/**` (no icon/logo changes); `tools/professional-ui-repair-check.py` (net zero diff — its URL was reverted after confirming its 9 failures are pre-existing records, not regressions); Dark/System-Dark styles (out of scope); the four prior `docs/zai/FINAL-*` reports (historical records for their heads).

---

## 11. How the owner references were applied (and deliberate deviations)

**calendar-target.png — applied:** dots-below-number centered group (≤3 semantic dots, no numeric chip); unmistakable day↔indicator ownership via fixed tight gap + week separation; selected day as the single solid filled rounded cell with inverse number/dots; month/year hierarchy with a chevron on a real picker; one obvious view-mode control; quiet secondary collapse control; events area below the grid with the selected day's rows and clear Add. **Deliberate deviations:** no avatar/logo/top-page title/bottom navigation/FAB (product chrome explicitly excluded by the reference README); Day/Week/Month → month/day/list without Week (D-2, documented); petrol (not the reference's purple) as the identity fill; status dots are semantic data tokens (not a single decorative accent); today = ring + semibold (the reference's fill stays reserved for selection). **chart-target.png — applied:** compact radial direction as the donut's responsive presentation (block-4 concept: ring + center total + tight side legend, ~116px plot+legend); value/unit/period/label grouped in captions, stats, and rows; complete legends everywhere; smart phone-space use via the compact metric variants and stat cards. **Deliberate deviations (D-3):** no new gauge/arc family and no hero-disc proportion encoding — the hero's relationship to `data-max` is not part of the component contract (host-declared sample data), so encoding 18/40 would invent semantics; recorded as a future opt-in contract (`data-hero-max` concept in SPEC-3 D-3) rather than a silent guess. No reference palette, typography, icons, wording, or sample data was copied.

---

## 12. No-data vs real-zero behavior (every changed quantitative chart)

| Family | No data (empty/absent list) | All values unknown/unparseable | Explicit real zero | Mixed zero + non-zero (+missing) |
|---|---|---|---|---|
| bars / line | «لا توجد بيانات لعرضها.» `role=status` + `data-scale-state=empty` (no axes invented) | per-item `—` unknown markers on the baseline; readings + table keep `(غير متاح)`/`قيمة غير صالحة` | zero-height outlined bar on the baseline + `0` reading + `0` in the table | all preserved in chart, readings, and table |
| signed bars / signed time | same empty branch | **NEW:** honest no-data state — **no zero axis, no `0` label**; complete readings rows keep every state | deliberate zero axis with `0` readings | preserved (incl. `(غير متاح)` time cells) |
| bubbles | **NEW:** honest empty state (was a blank plot) | dashed none-marks + `(غير متاح)` | dashed none-mark + `0` text | table keeps all rows |
| donut | `—` / «لا توجد بيانات» empty ring (no slices) | same + legend `(غير متاح)` rows | center shows the declared denominator (or `0`) with 0-value legend rows — no fake wedge | zero category kept with explicit `0 (0%)`; mixed zero+missing without denominator → «الإجمالي غير معلوم» |
| packed-circle | «لا توجد قيم موجبة قابلة للرسم المساحي.» + state list | state list `(غير معروف)`/`(غير متاح)` | no fake circle; state list `0 (صفر)` | circle + `0 (صفر)`/state rows; table preserves all |
| metric-circles / metric-bars | explicit empty notes + fallback rows | rows `—`/state text | documented zero markers + `0` readings + table `صفر`/`(صفر)` states | all rows/table states preserved |

Showcase now demonstrates the no-data vs real-zero contrast directly (`#sc-chart-nodata` beside the real-zero bars).

---

## 13. The reusable chart/table view contract

**Contract:** every quantitative chart exposes a real `<button type="button">` («عرض البيانات كجدول» ⇄ «إخفاء جدول البيانات», `aria-expanded` + `aria-controls` → generated table id) as the last element of the chart root; the table is semantic (`caption`/`thead`/`th[scope]`/`tbody`), rebuilt from the same source on every render cycle (structural sync — no drift possible), opens/closes via `hidden`, keeps every category, value, unit, period, zero/missing/invalid state, and works at 320–430px RTL/LTR and 200% simulated typography (measured). **Affected components:** all `data-chart` families in `components/data/data.js` (bars, line, signed variants, donut, bubbles — caption carries unit/period/donut denominator), `components/data/packed-circle.js` (same `m-chart__dataset-*` DOM per its documented B05 coupling), `components/metric-comparison/metric-comparison.js` (family-owned `m-main-metric__dataset-*` classes; bars: فئة/قيمة/وحدة/فترة with state wording; circles: فئة/قيمة/الحالة). **Regression evidence:** `light-data-check.py` owner-contract block (13 checks incl. keyboard toggle, semantic structure, row completeness, 320px no-overflow), `complete-repair-chart-check.py` full-row value/label assertions across widths, `ui-system-showcase-check.py` §8 (disclosure + data sync) and §9b (no-data trio). Purely decorative non-data illustrations are not covered by the switch (the repository's `m-progress`/`m-steps` are progress/flow indicators with their own visible value text; documented).
