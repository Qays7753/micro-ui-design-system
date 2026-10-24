# Z AI Execution Prompt — Comprehensive UI System Repair and Calendar Concept

You are continuing work on the **same existing feature branch** of the independent repository:

- Repository: `Qays7753/micro-ui-design-system`
- Branch: `replit/light-only-complete-ui-repair-2026-10-24`
- Current starting commit after the latest reference assets: `0741ff85549d8c94f050f86d18f9b7471ebc4e84`
- `main` is the source of truth only after a later human review and merge.

Do not create another branch. Do not work on `main`. Do not merge. Do not open or clone the old Micro repository. This repository is an independent UI Design System only; Micro is only a future consumer context and is not part of this task.

## Mission

Perform a final, root-cause-first, comprehensive repair of the independent UI Design System. Close every confirmed actionable finding from the full Z AI review, resolve the P1 backlog, review the visual quality of every relevant component in the real Showcase and standalone, and leave this same branch clean and ready for human review and eventual merge.

This is not a cosmetic patch round. The standard is a coherent, reusable, mobile-first Web UI with a genuine native-application feeling, professional information density, correct contracts, honest data presentation, strong RTL/LTR behavior, and a unified visual identity.

Do not preserve a weak chart, interaction, or visual pattern merely because it already exists. If a concept is wrong for its task, replace it with a better, simpler, more readable concept and update all related contracts, catalog entries, examples, Showcase states, tests, and deterministic standalone output.

## Required reading before changing code

Read the repository documents and source first, especially:

1. `AGENTS.md`, `DESIGN.md`, `docs/CURRENT-STATE.md`, `docs/SYSTEM-CONTRACTS.md`, `docs/UI-VISUAL-SYSTEM.md`, `docs/UI-DECISIONS.md`.
2. `docs/zai/FINAL-REPAIR-REPORT-2026-10-24.md`.
3. `docs/zai/FINAL-FULL-UI-REVIEW-2026-10-24.md` and its JSON companion. Treat every R-01 through R-63 as in scope. Do not silently drop a finding; close it, fix it, or explicitly justify and document why it is not actionable.
4. The complete relevant component specifications, examples, tests, catalog, and standalone build tooling.
5. The concept reference at:
   `docs/zai/references/samsung-calendar-concept/README.md`
   and every PNG in that folder.

The PNGs are extracted from a user-provided video as conceptual references. They are not a request to copy Samsung Calendar, its colors, typography, icons, text, spacing, branding, or exact layout. Use the interaction and information hierarchy only.

## Agent and token budget

Use no more than **five specialized sub-agents**, and only when each adds distinct value. Prefer four or fewer. Never launch one agent per finding and never launch a large fan-out for the 63 findings. Suggested roles are:

1. Component architecture and lifecycle.
2. Charts and data-visualization concepts.
3. Mobile RTL/LTR and accessibility.
4. Visual QA and Showcase evidence.
5. Design-system contracts and release verification.

You remain responsible for integrating their results. Do not stop for routine questions. Make the best evidence-based decision under the rules below and record it in the final report.

## Global non-negotiable constraints

- Light-only remains the active release. Do not redesign, activate, or repair Dark/System Dark in this task.
- Preserve the existing brand identity and official logo assets.
- Do not turn the system into a terracotta theme. Terracotta `--micro-brand-accent` remains a limited, intentional Brand Accent. Keep semantic state colors and data colors distinct.
- You may adjust semantic data-series colors only when contrast evidence proves it is needed. Record before/after values, role, contrast, and screenshots. Do not change Petrol, logo colors, or global identity colors as a shortcut.
- Do not use global `overflow-x:hidden`, clipping, hidden content, arbitrary fixed widths, font shrinking, or test-fixture changes to conceal a defect.
- Do not invent backend behavior, persistence, users, accounts, or product data. Showcase may use clearly labelled local demo state only.
- Preserve public compatibility when reasonable. If a public API must change for correctness, update every consumer, specification, catalog, example, test, and migration note in the same branch; never leave a silent breaking change.
- Do not add a feature only because the Samsung reference contains it. Implement only what fits this reusable system and the explicit Calendar contract below.

# A. Close the full confirmed review register

Review and resolve all R-01 through R-63 from the report. At minimum, close these groups:

### Contracts and documentation

- Update the stale Calendar contract that still mentions Date Rail.
- Reconcile button and field specifications with the actual Geometry B runtime.
- Remove the obsolete `.m-ocal__rail-day` guidance.
- Complete the spacing contract.
- Resolve the metric separator token type collision.
- Rebuild `MANIFEST.json` after the final files are settled.
- Correct stale comments, waves/default labels, historical Light-only/Dark wording, and preview scope notes.

### Copy and anti-slop quality

- Remove em-dashes from visible product prose and value-state text. Use normal punctuation or parentheses. Keep drawn chart null markers only when they are actual visual data encoding.
- Remove redundant status dots from order status chips, but keep legitimate calendar markers, legend keys, today markers, and data encoding.
- Remove redundant chart-callout stripes when the semantic tint and status text already communicate the state.
- Standardize Arabic error/retry/value-state wording, punctuation, filter pluralization, and counts above 100.
- Make generic Picker empty copy generic, not demo-specific.
- Do not remove the owner-approved limited terracotta accent edge merely to satisfy a generic scanner. Treat it as a documented brand exception unless visual evidence proves it is actually harmful.

### Interaction, lifecycle, and accessibility

- Keep the Calendar view controls usable during loading/error or provide an honest disabled equivalent.
- Make Picker Escape/focus recovery correct even when focus moves away from the component.
- Give Info Strip a correct reusable lifecycle (`disconnect`/destroy and re-scan) or document and enforce a deliberate static-only contract; prefer the reusable lifecycle fix.
- Clean Calendar data attributes on destroy.
- Amend the rAF wording to describe transient resize coalescing accurately; do not remove the correct rAF merely to satisfy stale prose.
- Normalize Picker search case/diacritics or document a deliberate language limitation.
- Handle or explicitly document forced-colors behavior without pretending it was tested.
- Make Showcase demo success unmistakably a local simulation.
- Place the password-reveal contract where reusable Fields consumers can find it, or document a deliberate gateway-only boundary.
- Correct heading/ARIA contracts and the role-less Showcase `aria-label`.

### Visual system and icon hygiene

- Add weight tokens where they provide real system value; do not mass-edit for the sake of token count alone.
- Add a section-title type contract where fixed levels currently sit outside tokens.
- Define or document the z-index ladder.
- Align Calendar inline icon stroke weight with the repository icon contract or document a justified exception.
- Normalize the one inconsistent delete icon.
- Remove faux-bold 700 where only 400/500/600 are shipped.
- Tokenize or explicitly scope preview-only raw colors.

# B. Re-evaluate chart concepts, not only chart CSS

Audit every chart family in the real Showcase at mobile widths before deciding its fate. For each family, explicitly record one of:

`KEEP`, `REFACTOR`, `MAKE OPT-IN`, `REPLACE`, or `REMOVE`.

Use the task of the visualization, not familiarity, as the decision criterion:

- Bars/rows remain the default for precise comparisons and ranking.
- Lines remain for genuine ordered/time trends, not arbitrary categories.
- Donut is allowed only for a clear part-to-whole task with few categories, strong slice separation, and a readable fallback list/table. If it fails those criteria, replace it with rows/bars.
- Bubbles and packed circles remain opt-in only. Replace them with bars/rows when area comparison is not immediately readable on a phone.
- Metric circles remain opt-in only. Replace them with compact metric rows/cards when they look decorative, oversized, or obscure the number.
- Keep complete readings, legends, units, periods, missing/unknown/negative/outlier states, and accessible text outside the graphic.
- No oversized childlike cards, giant decorative numerals, excessive dots, unexplained shapes, or graphics that require visual guessing.
- A chart is not accepted because its automated math passes. It must be visually legible, proportionate, and understandable in a few seconds on a phone.

For every replacement or removal, provide:

1. The failed concept and the user task it did not serve.
2. The replacement concept and why it is more professional.
3. API compatibility or migration impact.
4. Updated specification, catalog, Showcase, standalone, and regression tests.
5. Before/after screenshots at relevant mobile widths.

# C. Calendar: implement the approved concept, not a Samsung clone

The Calendar is a reusable scheduling surface for a lightweight dashboard. It must preserve the successful Phase A fixes, including the full month at narrow widths and the separation of `monthCursor` from `selectedDate`. Do not reintroduce the removed five-day Date Rail.

The reference concept is documented in `docs/zai/references/samsung-calendar-concept/README.md`. Follow that document as the authoritative interpretation of the video.

## C1. Expanded and collapsed states

Implement two coordinated presentations:

- **Expanded month:** complete seven-column month grid, all dates present, selected/today/focus states, concise markers, no long event titles forced into cells.
- **Collapsed agenda:** the month context compresses while preserving the selected date, and the selected-day content becomes available in the space below the compact calendar.

The transition must be coherent and stable. If vertical gestures are implemented, use a tested threshold that does not compete with page scroll or horizontal month navigation. Provide an explicit accessible control path as well. Do not use `display:none` in a way that destroys focus or state.

## C2. The day itself is the entry point

This is a hard owner decision:

- **Do not add a floating thumb-zone Add button.**
- **Do not make a thumb-zone button open a Bottom Sheet.**
- **Do not introduce a Bottom Sheet for this requested Calendar flow.**
- Tapping a day inside the Calendar is the primary interaction entry point.
- A selected day reveals an in-page contextual action area with only valid actions such as Add, Edit, and Delete.
- Add/Edit/Delete must be host-owned in the reusable component contract and can be demonstrated with clearly labelled local state in Showcase.
- If a long editor is needed, use a dedicated in-page state or explicitly host-owned route. Do not silently turn it into a sheet.

## C3. Collapsed blank area behavior

When the Calendar is collapsed, the area below the compact month is an intentional contextual disclosure area. Initially it may be visually quiet/empty. Tapping this area reveals the orders/items belonging to the currently selected day.

Requirements:

- It must reveal only the selected day’s items.
- It must never reveal items from another month/day because of stale `monthCursor` state.
- It must not change the selected date as a side effect.
- It must be keyboard reachable and have an accessible label/expanded state.
- It must work for populated, empty, loading, error, and retry states.
- It must not require a floating Add control.

## C4. Day markers and agenda content

Use a restrained, bounded marker contract:

- Maximum three semantic markers per day.
- Markers use existing semantic data/state tokens.
- Markers are not the only meaning channel; the agenda/list repeats meaning in text.
- Long titles, notes, and times belong below the grid.
- Do not reuse redundant dots inside status chips.
- Accessible labels must expose date, count, and summarized status.

The selected-day agenda should support:

- Title/order/request.
- Time where provided.
- Status with text.
- Short note/metadata where provided.
- Open/details event.
- Contextual Add/Edit/Delete action state.
- Honest empty/loading/error/retry behavior.

Do not invent persistence or a backend. Extend events/options only when they are reusable and document them.

## C5. Mobile interaction and visual QA

Do not declare Calendar complete after unit tests only. Use the real Showcase and standalone and verify visually:

- 320, 360, 390, and 430 CSS px.
- RTL and LTR.
- Expanded month.
- Collapsed month + selected-day disclosure area.
- Tap a day and see contextual actions.
- Tap the collapsed disclosure area and see only that day’s items.
- Empty selected day.
- Populated selected day with markers.
- Add/Edit/Delete local demonstration states.
- Keyboard-visible editor if an editor exists.
- Escape/Cancel restoration.
- Direction changes, resize, text stress, and 200% typography simulation.
- No document overflow, clipping, hidden text, console errors, resource errors, or ResizeObserver errors.

Use the repository brand tokens and native-feeling spacing. The result should feel compact, calm, professional, and purpose-built for a phone dashboard while visibly belonging to this independent system.

# D. Tests and acceptance gates

Add or update regression tests for every changed contract. In particular, test:

- Expanded/collapsed Calendar state.
- Day selection and selected-day action surface.
- Tap-to-reveal collapsed agenda area.
- Markers with maximum three semantic statuses.
- Add/Edit/Delete local Showcase state without a backend.
- No floating thumb Add button and no Bottom Sheet in this flow.
- Selected date remains stable through month browsing and collapse/expand.
- RTL/LTR fresh load and runtime direction behavior.
- Keyboard focus, Escape, restore, destroy, and double-init.
- Calendar and chart no-overflow behavior under 200% typography.
- Chart decision and replacement behavior.

Run all relevant existing gates and do not weaken or delete assertions merely to pass:

```bash
python3 tools/light-release-check.py
python3 tools/light-static-check.py
python3 tools/light-calendar-check.py
python3 tools/light-data-check.py
python3 tools/chart-mobile-check.py
python3 tools/component-mobile-check.py
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
python3 tools/component-catalog-build.py --check
python3 tools/build-ui-system-showcase-standalone.py
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/preview-runtime-check.py --base <local-preview-base>
node --check components/order-schedule/order-schedule.js
python3 -m py_compile tools/light-calendar-check.py
python3 tools/manifest-build.py --check

git diff --check
```

Required final result:

- Every release gate is `0 FAIL`.
- Runtime has no console/resource/ResizeObserver errors.
- Standalone is deterministic and byte-identical.
- The branch is clean.
- `main` remains untouched.
- No extra feature branch exists.

# E. Required final deliverables

Commit and push all work to the same branch only. Do not merge.

Add/update:

- Correct source, specs, tokens, tests, catalog, Showcase, and standalone as required.
- The Calendar concept reference documentation if implementation decisions changed.
- `docs/zai/FINAL-COMPREHENSIVE-REPAIR-REPORT-2026-10-24.md` with:
  - every R-01..R-63 status: fixed, accepted with reason, or not applicable;
  - the nine unproven risks and what was verified or deliberately left for real-device testing;
  - chart-by-chart KEEP/REFACTOR/MAKE OPT-IN/REPLACE/REMOVE decisions;
  - Calendar state/API contract and host-owned boundaries;
  - what was visually checked, with viewport/direction/state matrix;
  - before/after evidence paths;
  - exact commands and results;
  - remaining limitations, with no vague “future improvement” wording.

At the end of your response, report:

1. The exact branch name.
2. The final commit hash.
3. The files changed.
4. The chart decisions and replacements.
5. The Calendar interaction contract, explicitly confirming no thumb-zone Add button and no Bottom Sheet in this flow.
6. The complete test matrix and results.
7. Any remaining issue that prevents a confident merge.

Do not claim “ready for merge” merely because automated tests pass. It is ready for human review only when the visual evidence, Calendar interaction behavior, chart concepts, contracts, and full release gates all agree.
