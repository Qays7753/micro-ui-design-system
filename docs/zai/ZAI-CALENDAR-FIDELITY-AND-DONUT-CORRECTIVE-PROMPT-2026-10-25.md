# ZAI — Calendar Visual Fidelity and Clean Mobile Preview Repair

## Execution mode

Work on the same existing feature branch only:

```text
replit/light-only-complete-ui-repair-2026-10-24
```

Current remote tip before this pass:

```text
b31675d160c9ebaade22b7b36e4659cc80dbe071
```

Do not create another branch. Do not modify `main`. Do not merge. Pull the latest tip first and preserve all existing commits, including the previous order-bar containment fix.

This repository is an independent UI Design System. Do not open, clone, link, compare against, or import anything from the old Micro repository.

Dark Mode is completely out of scope. Do not redesign, activate, repair, or extend Dark Mode in this pass.

## Owner intent

The latest owner reference is the visual direction for the Calendar screen. It is not a request for a decorative clone or for a new unrelated product shell. Rebuild the same useful mobile composition using this repository's official tokens, typography, semantic colors, secure DOM construction, Arabic RTL/LTR support, and reusable component boundaries.

Read all of these before editing:

```text
docs/zai/references/owner-visual-concepts-2026-10-25/README.md
docs/zai/references/owner-visual-concepts-2026-10-25/calendar-target-latest-owner.png
docs/zai/references/owner-visual-concepts-2026-10-25/calendar-target.png
docs/zai/references/owner-visual-concepts-2026-10-25/calendar-reference-implementation.html
```

The latest owner PNG is the most important visual reference for the current corrections. The HTML is an executable concept reference, not production code to paste. Do not copy its violet palette, Google Font, avatar, phone frame, sample data, external assets, unsafe HTML interpolation, or global event model.

## Scope: two related deliverables

This pass has two deliverables:

1. Correct the reusable Calendar visual contract and its real mobile behavior.
2. Provide a clean, product-like mobile preview of the real components so the owner can inspect them as they would appear on a phone before future integration.

Do not solve this with a Showcase-only fake visual patch. Keep reusable component behavior in the reusable component and keep host/product composition in the preview host.

## Phase 0 — inspect before editing

Before changing code:

1. Pull the latest branch tip and record the exact starting commit.
2. Inspect the current Calendar source, CSS, specification, examples, Showcase host, standalone builder, catalog, and all relevant checks.
3. Inspect the existing order-bar containment implementation and verify that it already wraps the two existing circular Edit/Delete buttons without changing their content, size, icons, order, or actions.
4. Map which UI belongs to `components/order-schedule/`, which belongs to the Showcase host, and which elements are test-only diagnostics.
5. Inventory every current component family in the catalog and map each family to at least one clean mobile-preview context. Do not cram every component into one unreadable screen; use a small coherent set of mobile screens if needed.
6. Write this inventory and ownership map in the final report. Do not pause for a question unless a decision is genuinely impossible from the repository.

## Phase 1 — Calendar visual fidelity

### 1. Correct weekday order and date mapping

The current default `weekStart` is Saturday, which causes the visible weekday/date relationship to differ from the owner reference. Correct the Calendar contract so the reference concept is Sunday-first:

- LTR visual order: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday from left to right.
- RTL visual order: the same logical week is mirrored correctly, with Sunday at the logical RTL start and Saturday at the opposite edge. Do not merely reverse labels while leaving dates attached to the wrong columns.
- The date number, weekday label, event dots, selected state, and current-day state must remain attached to the same date in both directions.
- Week View must use the same corrected week-start contract.
- Update the API/specification and all tests/examples consistently. Do not silently break consumers that explicitly pass a different `weekStart` unless the contract documents the migration.

### 2. Numeric month and date presentation

Remove visible month names from the Calendar UI. The owner explicitly wants numeric month presentation:

- Month header: use a concise numeric form such as `07 / 2026` with a clear hierarchy and picker affordance.
- Full visible dates: use `DD/MM/YYYY`, for example `22/07/2026`.
- Use English digits `0–9` for day, month, year, and time values across the visual Calendar surface.
- Do not display Arabic or English month names in the visible Calendar, event heading, month navigator, day title, or visible date labels.
- Localized weekday abbreviations may remain localized, but must follow the corrected Sunday-first logical order and must not become multi-line or clipped.
- Keep accessible names truthful and complete; if a month name is useful for an accessibility label, do not expose it in the visible UI unless the repository's accessibility contract requires it. Document the choice.

### 3. Calendar card and grid

Bring the Calendar grid visually closer to the owner reference without introducing a new palette:

- Place the month grid in a distinct mobile Calendar surface/card with a restrained border, radius, and elevation/surface separation using existing tokens.
- Add subtle horizontal and vertical grid dividers so rows and columns are visually scannable. Do not use heavy black lines or decorative noise.
- Keep seven stable columns and complete 5/6-week coverage, including adjacent-month dates according to the existing contract.
- Keep the weekday header aligned exactly with the date columns.
- Keep event dots directly owned by their date cell, compact, and visually separated from the next row.
- Keep selected-day and current-day states distinct. The shape and hierarchy should follow the reference concept, but use the repository's official Petrol/semantic tokens rather than copying violet colors.
- Preserve touch targets, keyboard navigation, visible focus, RTL/LTR behavior, and no horizontal page overflow at 320/360/390/430px.

### 4. Typography and spatial hierarchy

Correct the visual hierarchy where it is genuinely inconsistent with the reference:

- Screen title, month/year control, weekday header, date numbers, event heading, and secondary metadata must have clearly differentiated scale, weight, and contrast.
- Do not make all text equally small or equally light.
- Do not add explanatory paragraphs, component names, diagnostic labels, or redundant helper copy to the product-like Calendar surface.
- Keep wording concise and scannable for fast mobile users. Show the important date, number, status, and action first.
- Preserve the existing event content and the existing order-bar containment behavior unless a specific Calendar contract requires a change. Do not rewrite the order hierarchy as part of this visual pass.

### 5. Preserve the completed order-bar containment correction

The previous correction is already correct and must not regress:

- The existing two circular Edit/Delete buttons remain separate.
- Their icons, size, hit targets, order, actions, and current content layout remain unchanged.
- The existing order bar's outer surface continues behind and around the button area so the buttons are contained by the same visible bar boundary.
- Do not move the buttons into the title, time, status, or secondary text.
- Do not merge, redesign, or replace the buttons.
- Verify the containment in RTL and LTR at all required widths after Calendar changes.

## Phase 2 — clean product-like mobile preview

The current Showcase contains diagnostic and component-lab material that is useful for tests but is not what the owner will transfer into the real application. Create or update a clean mobile-review mode using the real components and host contracts.

### Clean preview requirements

- Render at real phone viewport sizes: 320, 360, 390, and 430 CSS pixels, portrait.
- Support RTL and LTR.
- The preview must feel like a real mobile application surface, not a documentation page and not a desktop catalogue squeezed into a phone.
- Use the real reusable components, real component CSS, real public APIs, and concise realistic fixtures.
- Every component family in the current catalog must appear at least once in a coherent product-like context, using multiple short screens or states where necessary. Do not cram all families into one giant screen.
- Remove from the clean preview anything that would not be transferred into the real system: test harness chrome, State Lab labels, component-family headings, explanatory paragraphs, implementation notes, PASS/FAIL badges, measurement overlays, debug controls, source-path text, fixture-switch controls, and duplicate showcase scaffolding.
- Keep those test fixtures and diagnostic paths in the repository if the tests need them, but isolate them from the clean mobile-review surface. Do not delete test infrastructure merely to make the clean preview look better.
- Do not add a decorative phone frame around the preview. The browser viewport itself is the phone preview; a frame that will not exist in the real application is not product UI.
- Do not add invented business features. Use only the current component contracts and host-owned fixture data necessary to demonstrate them.
- Keep text direct and minimal. Every visible label in the clean preview must be a real product label, action, status, date, or value—not an explanation of the component.
- Ensure the clean preview can be opened directly and captured without first opening a diagnostic lab or toggling hidden test controls.
- Keep the previous standalone build deterministic and update it from source.

### Calendar in the clean preview

The clean mobile preview must show the corrected Calendar as a real mobile screen:

- numeric month/year;
- corrected Sunday-first date mapping;
- visible but restrained grid lines;
- selected/current-day distinction and event dots;
- events below the Calendar;
- existing order bars with Edit/Delete contained within their existing outer bar surface;
- no additional explanatory text or debug chrome.

### Other component preview coverage

Review all current component families in the clean preview for obvious visual defects that would make them look like a web demo rather than a native-feeling mobile UI. Fix only confirmed reusable defects exposed by this pass. Do not redesign unrelated components by taste or invent new product flows. Keep charts compact, readable, semantically correct, and table-discoverable according to the existing chart contract.

## Phase 3 — tests and regression coverage

Add or update deterministic regression checks for:

1. Sunday-first weekday/date alignment in LTR and RTL.
2. Numeric month/year and `DD/MM/YYYY` visible Calendar output with no visible month names.
3. Weekday header and grid column alignment.
4. Calendar card surface and restrained divider geometry, without relying only on screenshot pixels.
5. Selected/current-day and dot ownership.
6. Existing order-bar containment with two separate circular tools in RTL/LTR.
7. No horizontal overflow at 320/360/390/430px and simulated 200% typography.
8. Clean mobile preview: direct entry, no diagnostic chrome, no test-only labels, no desktop overflow, and all catalog component families covered by real component roots or documented screens.
9. No console, network, or resource errors in source and standalone previews.

Do not weaken or remove an existing test to make it pass. Update an expectation only when the documented component contract genuinely changed.

## Required verification commands

Run every relevant gate after implementation:

```bash
python3 tools/light-release-check.py
python3 tools/light-static-check.py
python3 tools/light-calendar-check.py
python3 tools/light-data-check.py
python3 tools/chart-mobile-check.py
python3 tools/component-mobile-check.py
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag calendar-visual-fidelity-mobile-preview
python3 tools/component-catalog-build.py --check
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/manifest-build.py --check
python3 tools/preview-runtime-check.py --base <local-preview-base>
node --check components/order-schedule/order-schedule.js
node --check components/data/data.js
git diff --check
```

Required result: zero failures in every gate. If a new clean-preview check is added, run it explicitly and include its exact total.

Capture fresh evidence at 320, 360, 390, and 430px in RTL and LTR for:

- clean mobile preview entry;
- Calendar Month screen;
- Calendar Week screen;
- Calendar Day screen;
- numeric month/date and corrected weekday order;
- visible grid dividers and selected/current-day/dot states;
- normal and long-text order bars with contained circular Edit/Delete buttons;
- representative clean screens covering every catalog component family;
- no-data, real-zero, malformed Donut states where applicable.

## Required final report and delivery

Update:

```text
docs/zai/FINAL-CALENDAR-FIDELITY-AND-DONUT-REPAIR-2026-10-25.md
```

The report must include:

1. Exact starting and ending commits, branch, and proof that `main` was untouched.
2. The Calendar visual defects found and the exact reusable/host files changed for each.
3. The final weekday/week-start contract for LTR and RTL.
4. The visible numeric date contract and confirmation that month names are absent from the product-like surface.
5. The Calendar card/grid/typography changes and why they are token-driven rather than a palette copy.
6. Confirmation that the order-bar containment fix was preserved without changing the two circular buttons or order content.
7. The clean mobile-preview architecture, what was removed from the clean surface, and what diagnostic/test paths remain isolated.
8. Component-family coverage map for the clean preview.
9. Exact commands and real PASS/FAIL totals. Never invent totals.
10. Fresh evidence paths for every required width and direction.
11. Untested limits such as real-device rendering, Safari/WebKit, screen readers, and true touch.
12. A clear statement that the same branch is ready for human visual review and merge consideration only after every required gate is green.
13. Paste a concise completion summary directly in the agent chat, including the final remote HEAD.

Commit and push all implementation, tests, evidence, standalone, manifest, and report updates to the same feature branch. Do not merge and do not modify `main`.
