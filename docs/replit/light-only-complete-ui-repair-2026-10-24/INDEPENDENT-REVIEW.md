# Independent light-only review

**Date:** 2026-10-24  
**Independent runner:** `tools/light-release-check.py`  
**Evidence:** `generated-artifacts/light-only-repair/acceptance/`  
**Baseline for unchanged-logo and legacy-token checks:** `161bb71adbed86e0df4382174cb07bd2fcb8d62d`

## Judgment

The Calendar stress matrix passed all 64 configurations and the related state, picker, geometry, and overflow assertions. The integrated Overview/Showcase and standalone checks also verified their real source components and routes. The independent suite is **not a clean release pass yet**: it reports **788 passed, 4 failed**. All four failures reproduce one fixable Info-card text overflow when English content is enlarged to 200% at 320/360px in RTL. No product source was edited by this review.

## Coverage and counts

This runner's counts include only its own recorded checks. They do **not** include focused component runs by other contributors.

| Independent coverage | Cases | Result |
| --- | ---: | --- |
| Integrated Showcase matrix: 320/360/390/430 CSS px × RTL/LTR × Arabic/English host content × type levels 1/2 × DPR 1/2 | 64 | Included in 788/4 total |
| Calendar stress matrix: viewports 320/360/390/430 mapped to Calendar roots 288/328/358/398 CSS px × RTL/LTR × Arabic/English host orders × type levels 1/2 × DPR 1/2 | 64 | **64/64 passed**, including all Calendar assertions |
| Overall checks recorded by this runner | — | **788 passed / 4 failed** |

Calendar coverage uses the actual `components/order-schedule/order-schedule.css` and `.js`, loaded in an isolated host fixture through the component's real `MicroOrderSchedule.init()` API. Below 360px the fixture asserts the source's date-rail layout; at 398px it asserts the month-grid layout. On every Calendar configuration it checks normal data, empty, one long host order, five orders and their count, loading, error/retry, month/year picker availability and focus, 48px targets, document/root horizontal overflow, and selected-versus-displayed date state. It changes the picker to January 2027 while keeping the selected day in October 2026, and verifies that navigation emits no selection event. Each case's state and geometry is recorded in `independent-review.json`.

For Calendar type level 2, the runner measures computed font and line height on real HTML text-bearing Calendar elements after fonts load. It then doubles those values with component-class overrides; SVG and icon geometry are not altered. For source elements whose computed line-height is `normal`, the report retains that computed value and explicitly supplies a proportional numeric line height for the doubled-font test. This is CSS text enlargement, not browser zoom.

English Calendar fixtures supply real English order titles, customer names, and status text; they do not assert that the Calendar's built-in Arabic labels are translated. English Showcase cases keep the document and outer Showcase canvas `lang="ar"`; only populated, visibly translated Overview component sections get `lang="en"`. The Arabic Showcase shell/header remains Arabic. No Dark/System-dark tests were run.

## Fixable issue — four English type-2 Overview failures

The only independent failures are:

- `320-rtl-en-type2-dpr1`
- `320-rtl-en-type2-dpr2`
- `360-rtl-en-type2-dpr1`
- `360-rtl-en-type2-dpr2`

In each case the clean-Overview/no-horizontal-overflow assertion fails. At 320px, `documentElement.scrollWidth` is 355px; at 360px it is 375px. A targeted geometry probe identifies the English **“Unavailable”** `.m-info-card__unit` inside the unavailable info card: at type level 2 the word occupies about 172px and protrudes left of its narrow card. It remains a single unbreakable word. The shipped `components/info-strip/info-strip.css` gives `.m-info-card__reading` wrapping, but the unit itself has no anywhere-break rule; the test's text enlargement exposes the overflow when the real English unit is longer than the Arabic source value. DPR does not change the CSS overflow.

Reproduction: load the Overview source at 320px or 360px, set RTL, use the English host fixture and type-level-2 enlargement, then inspect the unavailable info card's `.m-info-card__unit` and `document.documentElement.scrollWidth`. The likely source fix is to let long unit text break within its card (or otherwise constrain that reading); do not hide it by changing the document language or omitting authentic English host content. Main should apply any product fix and rerun these four affected measurements. The current report and screenshots preserve the failing state for comparison.

## Technical review

- The Light matrix loaded the integrated Showcase and real component sources, showed the expected current components, checked no visible diagnostic/log controls in Overview, controls at least 48×48px, active component state, viewport overflow, and genuine English field/demo host content.
- The independent Calendar stress matrix passed every layout, selected/displayed state, content-state, focus, picker, target-size, and overflow assertion at its four mapped root widths.
- Direct State Lab route and control checks, deep links to `#state-lab`, `#brand-proof`, `#sc-fields`, and `#sc-ocal`, field normal → error → success → clear → input behavior, and FIELD-001/002/003 focus/message/target checks passed.
- The generated standalone was tested without deferring it: Light Overview initialized with real fields/metrics, clean visible diagnostics, and no horizontal page overflow. The normal Overview, State Lab, and component deep links were checked in the served source page; standalone startup was checked as a visitor route.
- The 121 v2 logo files match the baseline SHA-256 set. The legacy token definitions remain byte-for-byte unchanged inside the Light-only nonmatching media gate; the official Accent and original Petrol assertions passed.
- The browser reported no script, console, or network errors.
- `independent-review.json` and `fixtures-used.json` contain the source-hash snapshot for the integrated Showcase, standalone output, fonts, and loaded component CSS/JS. All listed files matched those hashes at final artifact inspection. The Showcase index hash is `38753b5ce44417ee04de4e9aaae6a3a52427777f6b0fe49fa7343cc903f57e23`.

## Visual review

The sampled regular-size Showcase pages are clean, readable, and show the actual field, button, info-card, metric, and Calendar components. The English host-content capture has genuine English labels and values within the Arabic shell rather than pretending the Arabic page is globally English. The failing type-2 Info card overflow is visible as a real layout defect and is covered above.

One non-failing narrow-layout visual caution: with 200% text in the Calendar's 288/328/358px date rail, the short Arabic weekday abbreviations wrap over multiple lines inside their day targets. They remain present, inside the rail, and do not cause page/root overflow; the rail targets still meet 48px. This is reflow rather than clipping, but the abbreviated labels look cramped at the strongest text setting.

Acceptance contains 154 PNGs, including all 64 Showcase and 64 Calendar matrix screenshots, representative scrolled Showcase fixtures, focused-field evidence, and standalone startup. Chromium used for this run was `152.0.7977.64`; other browser engines, assistive-technology/screen-reader behavior, native browser zoom, and device hardware were not covered.

## Attribution of separate focused runs

The owner-reported Calendar **79**, Data **165**, and existing Chart **59** focused checks are not part of this runner's 788/4. Likewise, the original baseline counts (52/59) and the main-owned chart-pair screenshot captures are separate evidence and are not added to this independent count.
