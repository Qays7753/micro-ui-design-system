# ZAI — Calendar Reference-Fidelity Correction and Donut Closure

## Execution mode

This is a corrective implementation pass on the existing independent UI Design System repository.

Work on the same existing feature branch only:

```text
replit/light-only-complete-ui-repair-2026-10-24
```

Current starting head:

```text
318118e3f745568b58028f12c73390ad2739ea10
```

Do not create another branch. Do not modify `main`. Do not merge. Push the finished work back to this same branch.

The repository is independent. Do not open, clone, link, or compare against the old Micro repository.

## Why this corrective pass is required

The previous Calendar implementation improved several implementation details, but it does not faithfully implement the owner-approved Calendar concept. It treated the reference image as a collection of isolated details instead of implementing the complete Calendar composition. In particular, it replaced the visible `Day / Week / Month` concept with `Month / Day / List` and left the resulting Calendar materially different from the owner-provided target.

Do not defend the previous result merely because its existing tests pass. The existing result is the baseline to correct, not the target to preserve.

The authoritative visual reference is:

```text
docs/zai/references/owner-visual-concepts-2026-10-25/calendar-target.png
```

Read its accompanying rules first:

```text
docs/zai/references/owner-visual-concepts-2026-10-25/README.md
```

The owner also supplied a reference implementation that explains the intended structure and interaction more precisely than the screenshot alone:

```text
docs/zai/references/owner-visual-concepts-2026-10-25/calendar-reference-implementation.html
```

The image is the owner's approved visual and interaction direction. Rebuild the Calendar concept close to the reference's overall structure, hierarchy, density, and reading flow, while using this repository's official identity, tokens, typography, Arabic RTL/LTR support, order-schedule data, events, and component boundaries.

Treat `calendar-reference-implementation.html` as a reference implementation/specification for the exact composition and behavior: header row, controls row, `Day / Week / Month` selector, month navigator, seven-column grid, day-number-plus-dot anatomy, selected-day treatment, events-today region, compact event cards, and the vertical reading order. Use its structure to remove ambiguity about what the owner means by “make it like the reference.” It is not production code to paste into the repository. Reimplement the behavior inside the reusable component using the existing architecture, DOM safety rules, tokens, accessibility contract, RTL/LTR behavior, and host-owned order data.

The reference code is intentionally a prototype and may contain choices that must not be copied: external Google Fonts, a new violet palette, hardcoded sample data, `innerHTML` from data, a phone frame, an avatar, a floating bottom navigation shell, and a standalone global event model. Do not import those dependencies or unsafe patterns. Preserve the visual composition and interaction intent while making the implementation reusable, secure, token-driven, and specific to this system.

Do not copy the reference's purple palette, logo, avatar, external icons, wording, sample data, or unrelated product shell. The Calendar region is the required reference. A profile avatar, bottom navigation bar, and other application-shell chrome are host/product concerns, not automatic parts of the reusable Calendar component.

## Phase 0 — architecture inquiry before editing

Before changing code, inspect the actual current source and write a short architecture note in the final report. Do not ask the owner a question and stop; answer these questions from the repository:

1. What is owned by the reusable `components/order-schedule/` component and what is owned by the Showcase host?
2. Where are the Calendar header, view selector, month grid, week/day content, events/agenda region, Add action, and Edit/Delete actions generated?
3. What is the current public API and state model for `view`, `calendarView`, `presentation`, `selectedDate`, and `monthCursor`?
4. How are host-owned orders and `order-schedule:*` events passed between the component and the Showcase?
5. What is required to add a real reusable Week presentation without breaking existing consumers or creating a fake tab?
6. Which existing tests and examples must change if the Calendar contract becomes `Day / Week / Month`?
7. Which pieces of the reference image must remain outside the component because they belong to an application shell?

Cite the actual files and functions. Do not use the architecture note as an excuse to postpone implementation. After answering it, implement the corrected contract in the same pass.

## Phase 1 — Calendar must match the owner concept

Implement a real, reusable Calendar composition that is recognizably aligned with `calendar-target.png`.

### Required top structure

The Calendar region must have:

1. A compact mobile header with clear hierarchy and month/year navigation.
2. A real, visible, functional `Day / Week / Month` view selector. `Week` must not be replaced by `List` in this selector. All three states must be functional and tested. If the existing list view remains useful, keep it as a separate supported surface, but it is not a substitute for Week in the reference selector.
3. A compact Month header with previous/next navigation and a real Month/Year picker.
4. The initial Showcase state must open in the Month presentation so the owner can compare it with the supplied Month reference.
5. A complete month grid at narrow widths, with stable column alignment and no accidental horizontal page overflow.

### Required month-grid concept

The month grid must follow the reference's reading behavior, not merely pass geometry checks:

- Day numbers must have clear ownership of their event markers.
- Markers must remain compact, aligned, and visually separated from the next week.
- The selected day must have one clear branded selected treatment.
- The current day must be distinct from selection without competing with it.
- Grid separators and grouping may be subtle, but the seven columns and week rows must be easy to scan.
- Do not create excessive blank vertical space merely to pass a minimum size.
- Use existing identity and semantic data tokens. Do not introduce a new palette.
- Arabic RTL and LTR must both have correct logical and visual order.
- Long labels and simulated 200% typography must grow or reflow without clipping or hiding information.

### Required events region

The reference is not only a month grid. It clearly continues into an events area below the calendar. Implement the reusable equivalent for this repository:

- A clear localized equivalent of `Events today` for the selected date.
- Compact, polished event/order cards or rows directly below the grid.
- Each event must expose its title, time when present, relevant secondary information, and semantic status.
- Status must use this repository's semantic tokens and text, not the reference colors.
- Cards must be compact and information-dense without becoming tiny or unreadable.
- Add must be an obvious in-page action in the events region, not a floating thumb-zone button.
- Edit/Delete remain host-owned event actions inside the supported order surface and must not consume the title width unnecessarily.
- Empty, loading, error, retry, no-selected-day, long-title, long-note, and many-order states must remain honest and usable.

Do not add the reference's bottom navigation, avatar, product title bar, or unrelated shell to the reusable Calendar. If a host-level preview needs a shell to demonstrate the reference composition, implement that only in the Showcase host and document the ownership. Do not use the missing shell as a reason to omit the required Calendar grid and events composition.

### Interaction and contract requirements

- `Day`, `Week`, and `Month` must be real functioning states, not visual labels.
- The reference implementation is the minimum behavior target for the three view modes: Month shows the full grid, Week shows the selected week's seven days with the selected day's events, and Day shows the selected day's event surface. Do not substitute List for Week in the reference selector. A separate List surface may remain for compatibility, but it is not the reference's Week mode.
- Week view must use a documented reusable contract appropriate to scheduled orders: dates, selected day, order markers/rows, navigation, empty state, and keyboard behavior.
- Preserve host-owned data and event boundaries. The component renders and emits events; it does not persist data or call a backend.
- Preserve RTL/LTR, keyboard navigation, focus recovery, accessible names, and visible focus.
- Keep command targets at or above the repository's command target. Do not shrink controls to imitate the screenshot.
- Do not introduce a Bottom Sheet or floating Add action into this Calendar flow.
- Update `components/order-schedule/specification.md`, the isolated example, Showcase fixtures, and regression tests together with the implementation.
- Do not silently delete the existing list surface. If a contract is changed, document compatibility and migration behavior.

## Phase 2 — close the remaining Donut defects

Fix these two confirmed component-level defects from the previous pass.

### A. No-data must not render a chart ring

When the Donut dataset is absent, null, or empty:

- Do not render an SVG ring, empty circle, axes, slices, or fake marks.
- Render only a compact honest no-data state inside the chart slot.
- Keep the state accessible and consistent with the other chart families.
- A real explicit zero is different: retain a deliberate zero-state with a readable `0` and truthful wording. Do not hide real zero data.

Add a regression test that asserts no SVG/ring geometry exists for the no-data Donut and that the real-zero Donut remains distinct.

### B. Malformed values must have consistent semantics

When any Donut category contains a malformed value such as `12oops`:

- Refuse proportional drawing.
- Do not display percentages for any category in the refusal path.
- Make the Legend and the alternate table use the same state classification.
- Distinguish malformed/invalid from missing/null.
- Preserve the original category and raw reading in the complete fallback view.

Add regression coverage for malformed values, including Legend text, table text, and the absence of percentage output.

## Verification requirements

Run the complete required repository gates after the changes:

```bash
python3 tools/light-release-check.py
python3 tools/light-static-check.py
python3 tools/light-calendar-check.py
python3 tools/light-data-check.py
python3 tools/chart-mobile-check.py
python3 tools/component-mobile-check.py
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag calendar-fidelity-donut-final
python3 tools/component-catalog-build.py --check
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/manifest-build.py --check
python3 tools/preview-runtime-check.py --base <local-preview-base>
node --check components/order-schedule/order-schedule.js
node --check components/data/data.js
git diff --check
```

Required result: zero failures in every required gate. Do not change a test only to make it pass; update expectations only when the component contract genuinely changed and document the change.

Capture fresh evidence at 320, 360, 390, and 430px in RTL and LTR for:

- Month view matching the owner reference structure.
- Week view.
- Day view.
- Event region with populated orders.
- Empty/no-selected-day state.
- Donut no-data state with no SVG ring.
- Donut real-zero state.
- Donut malformed-value fallback and table.

Compare the Calendar evidence against the owner image using this checklist: overall composition, `Day / Week / Month` control, month header, grid scanability, selected/current-day distinction, event region, compact spacing, status treatment, and identity adaptation.

## Required report and delivery

Update or create:

```text
docs/zai/FINAL-CALENDAR-FIDELITY-AND-DONUT-REPAIR-2026-10-25.md
```

The report must include:

1. Starting and ending commits, branch name, and confirmation that `main` was untouched.
2. The architecture inquiry answers with source paths and function names.
3. A before/after comparison against `calendar-target.png`, including every deliberate deviation and why.
4. Confirmation that `Day / Week / Month` are all functional, with the exact state/API contract.
5. Files changed at component versus Showcase level.
6. No-data versus real-zero versus malformed Donut behavior and regression results.
7. Exact commands and real PASS/FAIL totals, never invented totals.
8. Untested limits such as real-device, Safari/WebKit, screen readers, and true touch.
9. A clear statement that the branch is ready for human visual review only after all required gates are green.

Commit and push to the same existing feature branch. Do not merge. Do not modify `main`.
