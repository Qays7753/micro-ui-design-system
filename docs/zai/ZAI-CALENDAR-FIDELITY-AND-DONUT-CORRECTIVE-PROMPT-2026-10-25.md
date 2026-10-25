# ZAI — Calendar Visual Fidelity and Clean Mobile Preview Repair

## Execution mode

Work on the same existing feature branch only:

```text
replit/light-only-complete-ui-repair-2026-10-24
```

Current remote tip before this pass:

```text
2608485bb3dabc41ad25c557c25329cd11f44b8e
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

### Owner's final product and review contract — highest priority

This is the owner's latest authoritative correction. It supersedes every conflicting Calendar or Showcase presentation rule elsewhere in this prompt and in earlier reports. Do not preserve two competing visual contracts. Keep data models, order logic, routes, storage, export formats, public props, services, and semantic event/data ownership unchanged.

Read and apply the companion contract as well:

```text
docs/zai/references/owner-visual-concepts-2026-10-25/CALENDAR-MONTH-VISUAL-REFINEMENT-INSTRUCTIONS-2026-10-25.md
```

#### 1. Calendar identity and structure

- The screen title remains `الطلبات`.
- Do not add a centered `Calendar` title.
- Do not add a back button to the Calendar screen.
- Do not add an avatar to the Calendar screen or its top zone.
- Do not copy the reference image's content, sample event names, avatar, violet colors, phone frame, or product chrome. Use the reference only for contrast, hierarchy, proportions, spacing, control shape, calendar-card composition, event clarity, and mobile density.
- Keep one real Day/Week/Month segmented control. It controls the Calendar mode only.
- Add one separate, clearly labelled Calendar/List toggle. It must actually switch the orders surface between:
  - Calendar mode: Day/Week/Month calendar views, date navigation, dots, legend, and the selected-day event region.
  - List mode: an organized order list using the same real order data and actions.
- The Calendar/List toggle must have an unambiguous visible purpose and truthful `aria-label`, `aria-pressed`, and state. Its label should describe the view it will open, such as `عرض القائمة` while Calendar is active and `عرض التقويم` while List is active.
- Day/Week/Month must not be confused with Calendar/List. Calendar/List changes the surface type; Day/Week/Month changes the calendar range within Calendar mode.
- Do not add Settings or Filter controls at this stage. A control without a confirmed product role must not be shown merely for decoration.

#### 2. Final numeric-only date contract

The owner's current decision is numeric dates only. The earlier `month name + year` instruction is revoked and must not be implemented.

- Never show a visible Arabic or English month name anywhere in the Calendar surface, including the month navigator, day title, event heading, week range, list heading, empty state, or visible picker options.
- The visible month header must use a numeric form such as `10 / 2026`, with a clear month/year hierarchy and a real picker affordance if the picker is exposed.
- Full visible dates must use `DD/MM/YYYY`, such as `07/10/2026`.
- Week ranges must use numeric dates only, such as `04–10/10/2026`.
- Day numbers, month numbers, year numbers, and times use Latin digits `0–9` and safe bidi isolation (`<bdi>` or equivalent).
- Weekday abbreviations may remain localized Arabic weekday labels (`أحد، إثن، ثلا، أرب، خمي، جمع، سبت`) because they are weekday labels, not month names.
- Accessible names must remain complete and truthful; they must not cause visible month-name text to leak into the product surface. Prefer numeric date names when the accessibility contract permits it and document any necessary non-visible localization.

#### 3. Visual contract for the Calendar screen

- Use existing repository semantic tokens, IBM Plex Sans Arabic, existing repository-owned icon assets, logical RTL/LTR properties, and Light-only behavior. Never hardcode hex, add a new color, add an external icon dependency, or add a new spacing/radius value.
- Keep the mobile hierarchy compact and readable at 360×780, while remaining robust at 320/360/390/430px.
- Keep exactly one filled brand surface in the viewport: `إضافة طلب`. Active/selected states use `brand-tint` and `brand-ink`.
- Use one segmented Day/Week/Month container, borderless secondary navigation controls, and clear contrast between canvas, control surface, Calendar card, events, and bottom navigation.
- Keep fixed cell geometry and an always-reserved dots slot so event presence never moves day-number baselines.
- Keep the Sunday-first contract in LTR and RTL, with dates, weekday labels, dots, selected state, and today state attached to the same date.
- Keep selected state on the number chip only, not the whole cell. Keep today distinct. Keep dots solid, compact, semantically ordered, and owned by their date cell.
- Keep the Calendar card restrained and token-driven. Follow the companion contract's rule about no inner grid lines; do not reintroduce the old grid-divider treatment merely to pass an old screenshot expectation.
- Keep the status legend inside the Calendar card and remove any detached/floating legend.
- Keep the event area below the Calendar with concise real labels, count, empty state, and the primary `إضافة طلب` action.
- Keep order cards as one tappable surface with a directional chevron. Do not restore circular Edit/Delete buttons on the card face. Edit/Delete remain reachable from the existing details flow with confirmation for deletion.
- Keep the edge-to-edge bottom navigation and the repository's existing navigation contract.

#### 4. Two separate review surfaces are required

The default app-like preview and the complete component review are different deliverables. Do not claim that a hidden DOM root is equivalent to a visible review experience.

**Clean App Preview:**

- Keep a natural product-like app entry with concise product labels only: Home, Orders, Reports, Account, Calendar/List, and real reachable states.
- Do not show component names, implementation notes, PASS/FAIL labels, fixture controls, measurement overlays, or diagnostic chrome in this surface.
- The Calendar/List control must be reachable from the Orders screen and visibly demonstrate both states.

**Full Component Showcase:**

- Provide a clearly reachable, separate review surface for the owner. It may be a dedicated view, route, or clearly labelled review link; it must not require guessing hidden anchors such as `#sc-canvas` or `#state-lab`.
- Show every current component family from the catalog (14 families) and every explicit optional variant (6 variants) in organized sections or short review screens. Do not cram everything into one giant unreadable screen.
- Include the relevant states where they exist: default, selected, disabled, error, success, empty/no-data, loading, long text, RTL/LTR, text stress, and the real Calendar/List states.
- The Full Component Showcase may use component names and review labels because it is explicitly a review surface. The Clean App Preview must not.
- Each showcased component must use the real reusable component, public API, CSS, and realistic deterministic fixture data. Do not create screenshot-only mocks or a second fake implementation.
- Keep the existing diagnostic/test infrastructure available for automated checks, but make the owner-facing Full Component Showcase easy to reach and visually understandable.

#### 5. Proof required before delivery

- Perform a real visual walkthrough at RTL and LTR. Open the Orders screen, switch Calendar/List, switch Day/Week/Month inside Calendar mode, navigate dates/months, inspect dots and legend, open an order, edit it, delete it with confirmation, add an order, and inspect the Full Component Showcase.
- Capture actual viewport screenshots at exactly `360×780` CSS pixels and `320×640` CSS pixels, plus robustness screenshots at 320/360/390/430 where applicable. Do not use `full_page` screenshots while naming them as viewport screenshots. If full-page evidence is also useful, give it a separate filename that states its real dimensions.
- Verify there is no horizontal overflow, no clipping, no unexpected scroll ownership, no visible month names, no central Calendar title, no back button, and no Calendar-screen avatar.
- Verify the first order card is visible at the canonical viewport and that the Calendar/List toggle has a real state change, not merely a visual label.
- Run every relevant gate from this prompt, regenerate `MANIFEST.json` after all final files/evidence/report changes, and ensure every gate is green.
- The final report must include the exact starting commit, exact ending commit, exact remote HEAD returned by `git ls-remote`, exact gate totals, exact screenshot dimensions, changed files, and any untested limits. Do not write placeholders such as “the commit carrying this report”.
- Commit and push only to `replit/light-only-complete-ui-repair-2026-10-24`. Do not create another branch, modify `main`, or merge.

If GitHub authentication is required, use this manual placeholder only in the agent conversation:

```text
[INSERT_RESTRICTED_GITHUB_TOKEN_HERE]
```

Never save a real token in the repository, prompt, report, evidence, or commit.

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

The current Showcase is a component catalogue/lab. The owner does not want that as the default experience. Convert the default review surface into a small real mobile application experience that happens to use every reusable component family. It must feel like a natural phone app, not a page that labels and displays components for inspection. Use the real components and host contracts.

### Canonical review device and scale

Use the standard Samsung Galaxy S25 profile as the canonical visual review target:

- CSS viewport: `360 × 780` in portrait.
- Browser/CSS zoom: exactly `100%`.
- Device pixel ratio: `3` may be used only when capturing a device-faithful screenshot; it must not change CSS layout decisions.
- Physical `1080 × 2340` pixels are not CSS layout dimensions and must not be used to scale the UI.
- Do not use `zoom`, `transform: scale(...)`, canvas fitting, artificial min/max scaling, or a device-specific shrink/expand workaround.
- Do not add a Galaxy-specific production breakpoint or user-agent branch. Build normal responsive CSS that naturally renders at the canonical viewport.

The `320`, `390`, and `430` CSS-pixel cases remain robustness checks. They are not permission to make the default Showcase look like a responsive component catalogue. The canonical owner-facing screenshot and first visual review must be the natural `360 × 780` app surface.

Device reference URLs used for this target:

```text
https://phone-simulator.com/devices/samsung-galaxy-s25
https://www.screensize.io/blog/galaxy-s25.html
```

### Clean preview requirements

- Render the default app surface at the canonical Samsung S25 viewport: `360 × 780` CSS pixels, portrait, at 100% CSS zoom. Also test 320, 390, and 430 CSS pixels for robustness.
- Support RTL and LTR.
- The default preview must feel like a real mobile application surface, not a documentation page and not a desktop catalogue squeezed into a phone.
- The default entry must open directly into the app-like mobile experience. The owner must not need to open State Lab, expand a component section, toggle fixture controls, or dismiss documentation before seeing the product-like surface.
- Organize the component families across a small number of coherent app-like screens or real navigation states. It is acceptable that one screen does not show every component at once; the owner must be able to reach all of them through natural app navigation or actual product surfaces.
- Use real app structure and hierarchy: a plausible app header, real navigation, content sections, actual actions, and concise domain fixtures. Do not label a screen with component names such as `m-chart`, `Fields`, `Order Schedule`, `State Lab`, `Variant`, or `Demo` unless that label would genuinely exist in the product.
- Use the real reusable components, real component CSS, real public APIs, and concise realistic fixtures.
- Every component family in the current catalog must appear at least once in a coherent product-like context, using multiple short screens or states where necessary. Do not cram all families into one giant screen.
- Remove from the clean preview anything that would not be transferred into the real system: test harness chrome, State Lab labels, component-family headings, explanatory paragraphs, implementation notes, PASS/FAIL badges, measurement overlays, debug controls, source-path text, fixture-switch controls, and duplicate showcase scaffolding.
- Keep those test fixtures and diagnostic paths in the repository if the tests need them, but isolate them from the clean mobile-review surface. Do not delete test infrastructure merely to make the clean preview look better.
- Do not add a decorative phone frame around the preview. The browser viewport itself is the Samsung S25 phone preview; a frame that will not exist in the real application is not product UI.
- Do not add invented business features. Use only the current component contracts and host-owned fixture data necessary to demonstrate them.
- Keep text direct and minimal. Every visible label in the clean preview must be a real product label, action, status, date, or value—not an explanation of the component.
- Ensure the clean preview can be opened directly and captured without first opening a diagnostic lab or toggling hidden test controls.
- Keep the previous standalone build deterministic and update it from source.

The clean preview is a review surface, not a second production app. Do not duplicate component implementations or create fake screenshots. Mount the same reusable components that will later be integrated into the real system, and isolate only the host composition and fixture data.

### Mandatory hands-on visual acceptance loop

Do not deliver based only on source inspection or automated gate totals. Before the final commit:

1. Start the real local Preview from the final source and the final standalone output.
2. Open the clean app-like entry at the canonical Samsung S25 profile (`360 × 780` CSS px, 100% zoom, portrait).
3. Interact with it as a user: navigate between the available mobile screens, open the Calendar, switch Day/Week/Month, move between dates, inspect event rows, press the existing actions, open representative forms/overlays, and exercise the component states that are reachable in the clean app flow.
4. Repeat at RTL and LTR and at the robustness widths. Check the first screen, the content above the fold, scroll ownership, focus/pressed states, text wrapping, visual hierarchy, and whether any component still looks like a labelled demo instead of a native-feeling app surface.
5. If anything is visibly broken, inconsistent, clipped, oversized, too empty, too web-like, mislabeled, non-functional, or not appropriate for the real mobile product, fix the reusable component or the correct host layer immediately. Do not merely document the issue as a limitation.
6. Reopen and retest the changed flow after every correction. Recapture the evidence and rerun the relevant regression checks, then rerun the complete gates before delivery.

The final evidence must demonstrate an actual usable app-like Mobile Preview, not just isolated component screenshots. Do not stop at “technically passes” if the visual result still looks like a component laboratory.

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
8. Clean mobile preview: direct app-like entry at `360 × 780`, no diagnostic chrome, no test-only labels, no device frame or artificial scaling, no desktop overflow, and all catalog component families covered by real component roots or documented screens.
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
- canonical Samsung Galaxy S25 app surface at `360 × 780` CSS pixels and 100% zoom;
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
14. Record the canonical preview viewport (`360 × 780` CSS px, 100% zoom) and confirm that no artificial scaling or device-specific layout hack was used.

Commit and push all implementation, tests, evidence, standalone, manifest, and report updates to the same feature branch. Do not merge and do not modify `main`.
