# Final Repair Report — 2026-10-24 (Phase A)

Branch: `replit/light-only-complete-ui-repair-2026-10-24`
Base commit at start of this pass: `8d3e84d05fdbdd81af754ffd194bed9b5d0e1893`
Final commit of this pass: recorded in the repository log immediately after this file (see `git log -1`).
Scope: Light-only release of the independent Micro UI design system repository. Dark Mode and System Dark were not exercised, per the release boundary.

## 1. Summary

All three Phase A items are closed:

- **A1 — Info Card overflow (the four documented release-gate failures): fixed.** The English host-owned unit value `Unavailable` no longer pushes outside `.m-info-card` under RTL and simulated 200% typography. `light-release-check.py` reports **792 PASS / 0 FAIL** (baseline before this pass in this environment: 786 PASS / 6 FAIL — the four documented cases plus two more at 390px with the same root cause, see §3.1).
- **A2 — Calendar responsive contract: replaced with the complete compact month grid.** The five-date `date-rail` no longer exists as any width's month representation; the complete month grid renders at every root width, and the month title / grid / day panel can no longer contradict each other. `light-calendar-check.py` reports **85 PASS / 0 FAIL** under the corrected contract (it reported 79 PASS / 0 FAIL under the old five-date contract, which the task identified as encoding the defect).
- **A3 — Owner screenshot clipping (`اليوم` / `إضافة طلب` left edge): not reproduced** in the real Showcase host across RTL viewports 320/360/390/430/525, all Showcase width controls, and the narrow calendar state. Documented with measurements and screenshots; **no speculative CSS was added**.

## 2. Exact branch and commits

| Item | Value |
| --- | --- |
| Repository | `Qays7753/micro-ui-design-system` (independent; no other repository was opened or compared) |
| Branch worked on | `replit/light-only-complete-ui-repair-2026-10-24` (the existing branch only) |
| Start head | `8d3e84d05fdbdd81af754ffd194bed9b5d0e1893` |
| Phase A final head | the commit that carries this file; verify with `git log --oneline -3` on the branch |
| Merge into `main` | **None.** `main` was not modified, no merge commit was created, no PR was opened |
| New remote branches | **None.** Only the existing branch was pushed |

## 3. Root causes and repairs

### 3.1 A1 — Info Card unit overflow

**Symptom.** Release-gate cases `320-rtl-en-type2-dpr1`, `320-rtl-en-type2-dpr2`, `360-rtl-en-type2-dpr1`, `360-rtl-en-type2-dpr2` failed "visible real components with clean Overview and no horizontal page overflow": at 320 CSS px `documentElement.scrollWidth = 355`, at 360 px `= 375`.

**Root cause.** `components/info-strip/info-strip.css` gave `.m-info-card__number` the wrapping contract (`min-width: 0` + `overflow-wrap: anywhere`) but gave `.m-info-card__unit` none. The English host value `Unavailable` is a single unbreakable word; at the type-level-2 enlargement (2em ≈ 28px, ≈172px wide) the unit's min-content width exceeded the card, expanded the reading line, the card, and finally the document. DPR does not change CSS overflow, which is why dpr1/dpr2 failed identically. In this verification environment (Chromium 143.0.7499.4) the same defect also crossed the 320/360 threshold and additionally failed `390-rtl-en-type2-dpr1/dpr2`; the earlier run (Chromium 152) had only the four documented cases. One root cause explains all six.

**Repair (reusable, component-level).** `.m-info-card__unit` now follows the same measuring contract already used by `__number`, `__label`, and several calendar text nodes (pattern "R3-2b" in this codebase): `min-width: 0; max-width: 100%; overflow-wrap: anywhere`. The complete word remains present and readable — it wraps inside its card when it cannot fit; nothing is hidden, clipped, resized, or re-languaged. No fixture, language, or direction was changed.

**Regression coverage.** The failing assertion (`pageWidth <= viewport` with real English host content incl. `Unavailable` unit values) runs in all 64 matrix cases of `light-release-check.py`; all now pass. Focused visual evidence: `docs/zai/evidence/a1-info-card-320-rtl-en-type2-dpr1.png`, `docs/zai/evidence/a1-info-card-360-rtl-en-type2-dpr2.png`.

### 3.2 A2 — Calendar responsive contract and month/rail contradiction

**Defect 1 root cause.** `components/order-schedule/order-schedule.js` deliberately switched to a five-date rail under a 360px component root (`var compactMonth = width > 0 && width < 360` → `data-ocal-layout="date-rail"`). The Showcase's effective calendar root is 358px at the default 390px canvas (canvas padding 2 × 16px), so the real host displayed five nearby dates instead of the month. The isolated source check "passed" because it asserted exactly this five-date behavior — a false positive against the intended calendar contract.

**Defect 2 root cause.** `shiftMonthCursor()` updated `state.monthCursor` (heading + grid) but the rail was built from a separate `state.railCursorDate`, and the day panel from `state.selectedDate`. Navigating to September left the rail centered on October 5–9 and the day panel on "Wednesday 7 October 2026" under a "September 2026" heading.

**Chosen contract (2026-10-24): the complete compact month grid.**

The five-date rail is removed entirely. The month view now renders **one DOM structure — the full month grid — at every root width**. Below a 360px root the grid enters the *compact presentation*, signalled by a new root attribute `data-ocal-compact="true"`:

- Geometry: cell width `(100% − 6×4px) / 7` (37.7px at a 288px root, 43.4px at 328px, 47.7px at 358px) with a row height floor of `max(2.7em, --micro-touch-min)` so every day target keeps **height ≥ 48px** and **width ≥ 24px** (WCAG 2.5.8 Target Size Minimum). At ≥360px the cells return to the existing 48px squares. Command controls (nav, today, picker, modes, rows, add, retry) keep the ≥48px contract at every width.
- Why this is correct: a month calendar whose narrow presentation hides 25+ of ~30 days fails the component's core job — "every day of the displayed month must remain discoverable and reachable". 7 × 48px + 6 × 4px = 360px, so full-size cells are geometrically impossible below 360px; a scrollable or partial representation was explicitly disallowed. 24–48px wide × 48px+ tall day cells are the standard geometry of production phone calendars (iOS/Android month views) and exceed the WCAG AA minimum; the alternative — keeping the rail — preserved larger targets only by sacrificing the month itself, and the rail's `overflow-x: auto` scrolling was an undocumented interaction. The compact grid keeps everything discoverable with zero interaction cost, keeps RTL/LTR/keyboard/focus semantics unchanged (roving tabindex, arrow navigation, Home/End, Enter/Space), and needs no new tokens or visual language.
- Implementation consequence: the compact state is **CSS-only on the root attribute** (no re-render). Resizing across the 360px boundary can no longer lose focus or shift state — the previously required focus-restore machinery in `updateResponsiveView()` was removed because its reason for existence is gone.

**Month coherence (Defect 2).** With the rail gone, heading, grid, and day panel all derive from one state model (`monthCursor` + `selectedDate`). The one remaining honest ambiguity — browsing a month that does not contain the selected date — is now represented explicitly: the day panel shows a **browsing state** (`data-ocal-day-browsing="true"`): title «لا يوم محدد في ‹الشهر› ‹السنة›», the browsed month's order count, and an "إضافة طلب" button with no day. A selected day from another month is never shown as if it belonged to the displayed month. Selecting a day in the browsed month, pressing «اليوم», or a programmatic `setSelectedDate()` returns the normal day panel.

**Public API changes (documented in `components/order-schedule/specification.md`):**

- `data-ocal-layout` values are now `month-grid | day | list` (`date-rail` removed); month view is always `month-grid`.
- New root attribute `data-ocal-compact="true|false"`.
- Removed internal action `date-rail-day` and the `[data-ocal-date-rail]` element.
- New button attribute `[data-ocal-add-date]`; the `order-schedule:add-request` event detail `date` is now also `null` when adding from a browsing month without a selected day (previously `null` only in list view). `day-select`, `order-open`, ordering rules, data semantics, and all other options/events are unchanged.

### 3.3 A3 — Screenshot clipping investigation

Per instructions this was reproduced before any fix, using the real Showcase host, the real width controls (State Lab), and RTL direction:

- Viewports tested: 320, 360, 390, 430, 525 (the last including both the default 390px canvas → 358px compact root, i.e. the exact owner scenario, and the 320px canvas → 288px narrowest root).
- Measured per case: `document.documentElement.scrollWidth`, `document.body.scrollWidth`, `#sc-ocal-root`, `.m-ocal`, `.m-ocal__cal-bar`, `.m-ocal__todaybtn`, `.m-ocal__daypanel-head`, `.m-ocal__add`, `.m-ocal__rail-track` (absent by design after A2 — recorded as null), `.showcase-canvas`, `.sc-block--ocal`.

**Verdict: not reproduced.** In every case `documentElement.scrollWidth == clientWidth == viewport`, `#sc-ocal-root` has no scroll overflow, and neither `.m-ocal__todaybtn` nor `.m-ocal__add` crosses the viewport edge (`left ≥ 0`, `right ≤ innerWidth`). Full-page screenshots were inspected visually at 320 and 525; the controls are complete. Zero console errors. **No speculative CSS was added.** The owner screenshot most plausibly reflects a state outside this repository's rendered output (e.g. a stale build, browser zoom, or a device pixel-ratio rendering artifact); it is recorded as an unproven risk in the Phase B review rather than patched here.

Evidence: `docs/zai/evidence/a3-clip-probe/measurements.json`, `docs/zai/evidence/a3-clip-probe/rtl-*.png` (full pages), `docs/zai/evidence/a3-clip-probe/ocal-crop-*.png` (calendar close-ups).

## 4. Changed files and why

| File | Change | Why |
| --- | --- | --- |
| `components/info-strip/info-strip.css` | Added `min-width: 0; max-width: 100%; overflow-wrap: anywhere` to `.m-info-card__unit` (+ comment) | A1 root-cause fix; same contract as `__number` |
| `components/order-schedule/order-schedule.js` | Removed rail builder/state/keyboard/click paths (`buildDateRail`, `focusRailDate`, `railCursorDate`, `date-rail-day`); month layout always `month-grid`; new `data-ocal-compact` attribute; simplified `updateResponsiveView` (attribute flip only, no re-render); browsing day-panel state + `data-ocal-add-date` on add buttons | A2 Defects 1+2 |
| `components/order-schedule/order-schedule.css` | Removed all `.m-ocal__rail*` rules; compact-grid overrides (`gridrow min-height: max(2.7em, var(--micro-touch-min))`, `cell { aspect-ratio: auto; min-height: 48px }` under `[data-ocal-compact="true"]`); updated contract comment; transition list updated | A2 styling for the corrected contract |
| `components/order-schedule/specification.md` | Rewrote responsive contract (§6, §8), root-attribute table, event table (add-request `date:null` in browsing state), keyboard section, §5 browsing honesty | Document the corrected public contract |
| `components/order-schedule/example-usage.html` | Demo-1 title logic reads `data-ocal-compact` → «شبكة الشهر المدمجة»; hint text updated; observer watches the new attribute | Example must name the real presentation |
| `previews/ui-system-showcase/index.html` | Calendar section hint text updated (was describing the five-date rail workaround) | Host copy must match the component contract |
| `previews/ui-system-showcase/standalone.html` | Regenerated by `tools/build-ui-system-showcase-standalone.py` | Generated file; never hand-edited; byte-deterministic |
| `tools/light-calendar-check.py` | Rewritten narrow-width sections + new coherence/browsing/keyboard/resize regression suite (85 checks) | Old check encoded the five-date contract (false positive); task requires tests for the corrected contract |
| `tools/light-release-check.py` | Calendar matrix expects `month-grid` + compact flag + 31 grid days; target-size assertion split into command controls (≥48px) vs compact day cells (h≥48, w≥24); picker check now also asserts the honest browsing panel | Same false-positive correction in the release gate |
| `tools/ui-system-showcase-repair-check.py` | F-08 rewritten: compact branch (complete month, min cell h≥48/w≥24) vs wide branch (48px square); old noMonth/rail branch removed (fails now if the grid is missing) | Host-level regression for the corrected contract in the real Showcase |
| `MANIFEST.json` | Regenerated via `tools/manifest-build.py` | Delivery inventory must match the tree |
| `docs/zai/FINAL-REPAIR-REPORT-2026-10-24.md` | This report | Required deliverable |
| `docs/zai/evidence/**` | A1/A2/A3 screenshots + A3 measurements JSON | Required visual evidence |

## 5. Tests added or changed (and why the expected behavior changed)

- `tools/light-calendar-check.py` — 85 checks (was 79). Changed expectations: layout is `month-grid` at every root; `data-ocal-compact` flips at 360px; the complete month (31 October days) is asserted at 288/328/358/398 roots in RTL and LTR; day-cell geometry asserts the documented compact floor (h≥48, w≥24) instead of the old 48px-square-or-rail rule. Added regression coverage required by the task: prev/next month coherence (heading+grid+panel), honest browsing panel, `add-request` `date:null` honesty, selection after browsing another month, compact December→January year boundary, compact keyboard navigation incl. focus crossing a month boundary, live resize flipping the compact flag without losing focus or re-rendering, plus the retained picker/Escape/Back focus-restoration, loading/error/empty, RTL/LTR grid keyboard, and example-page checks.
- `tools/light-release-check.py` — the 64-case calendar matrix now asserts the corrected contract (see §4). The old `date-rail` expectation was a false positive by construction; documented per §5 of the task instructions.
- `tools/ui-system-showcase-repair-check.py` F-08 — host-level (real Showcase) regression of the same corrected contract at 320/390 widths.

## 6. Verification — full command list and results

Environment: Python 3.12.15, Node v24.21.0, Chromium 143.0.7499.4 (Playwright headless). All commands run from the repository root.

| Command | Result |
| --- | --- |
| `python3 tools/light-release-check.py` | **792 PASS / 0 FAIL**; 64 matrix cases (baseline before repair: 786 PASS / 6 FAIL) |
| `python3 tools/light-static-check.py` | **168/168 PASS** |
| `python3 tools/light-calendar-check.py` | **85 PASS / 0 FAIL** (79 PASS / 0 FAIL under the old, defective contract) |
| `python3 tools/light-data-check.py` | **165 PASS / 0 FAIL** |
| `python3 tools/chart-mobile-check.py` | **59 PASS / 0 FAIL** |
| `python3 tools/component-mobile-check.py` | **52 PASS / 0 FAIL** |
| `python3 tools/ui-system-showcase-check.py` | **118 PASS / 0 FAIL** |
| `python3 tools/ui-system-showcase-repair-check.py --tag after` | **88 PASS / 0 FAIL**; 0 console errors |
| `python3 tools/component-catalog-build.py --check` | **PASS** (14 families, 6 explicit variants, paths and inventory OK) |
| `python3 tools/build-ui-system-showcase-standalone.py` then `--check` | **BUILD OK (1071 KB); SELF-CHECK OK — byte-for-byte identical regeneration** |
| `node --check components/order-schedule/order-schedule.js` | **PASS** |
| `python3 -m py_compile tools/light-calendar-check.py` | **PASS** |
| `python3 tools/preview-runtime-check.py --base http://127.0.0.1:8977` | **112/112 PASS** (source + standalone × 320/360/390/430 × RTL/LTR; no page/resource/ResizeObserver errors) |
| `git diff --check` | **PASS** |

Additional gates observed: no browser console errors, resource errors, or ResizeObserver errors in any tested Showcase state (each tool records this independently); the standalone remains deterministic and was re-verified after all source edits.

## 7. Visual evidence

- A1 (Info Card unit wraps inside the card, 200% type, RTL): `docs/zai/evidence/a1-info-card-320-rtl-en-type2-dpr1.png`, `docs/zai/evidence/a1-info-card-360-rtl-en-type2-dpr2.png`
- A2 (complete compact month grid at 288/328/358px roots, RTL/LTR, plus wide 398px): `docs/zai/evidence/calendar-contract/root-{288,328,358,398}-{rtl,ltr}.png`
- A3 (clip probe): `docs/zai/evidence/a3-clip-probe/measurements.json` + full-page `rtl-320-canvas320.png`, `rtl-360-canvas360.png`, `rtl-390-canvas390.png`, `rtl-430-canvas430.png`, `rtl-525-canvas390-default.png`, `rtl-525-canvas320-narrowest.png` + close-ups `ocal-crop-320.png`, `ocal-crop-320-daypanel.png`, `ocal-crop-525.png`
- Full release matrices (64 Showcase + 64 Calendar screenshots) regenerate under `generated-artifacts/light-only-repair/acceptance/` via `light-release-check.py` (gitignored by design; reproducible from the recorded commands).

## 8. Remaining limitations (explicit)

- **A3 owner screenshot: not reproduced.** No repository defect was found for the reported left-edge clipping; nothing was patched for it. Listed in the Phase B review as an unproven risk.
- **Compact day-cell width (37.7–47.7px) is below the repository's 48px command-control target** at roots under 360px, while meeting WCAG 2.5.8 (≥24px) with ≥48px height. This is a documented, deliberate contract decision (§3.2), not an oversight; it is also the universal geometry of production mobile month calendars.
- Verification is Chromium-only (headless). Real devices, WebKit/Safari, true touch, screen readers, native OS zoom, and safe areas remain untested — unchanged from the repository's standing NOT-RUN list.
- The two extra baseline failures at 390px (§3.1) existed only in this environment's font metrics; they share the A1 root cause and are closed by the same fix.
- Type-level-2 density inside compact cells keeps the pre-existing vertical-growth behavior (badges wrap; row floor grows with em). No new density regression was observed in the 64-case matrix.

## 9. Main-branch and merge confirmation

- `main` was **not** modified: no commit, no merge, no rebase against it, no push to it.
- No pull request was opened and no additional branch was created (local or remote).
- All work is committed to and pushed on the single existing branch `replit/light-only-complete-ui-repair-2026-10-24`.
- `git diff --check` is clean and the working tree is clean after the push.
