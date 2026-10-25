# ZAI — Component-Level Repair, Calendar/Charts Concept Audit, and Full Verification

## Execution mode

You are the implementation agent for the independent UI Design System repository. You have repository access and must inspect the actual source before making decisions. Do not treat the attached visual audits as sufficient proof of a source-level defect.

Work directly on the existing single feature branch:

```text
replit/light-only-complete-ui-repair-2026-10-24
```

Current known head before this task:

```text
df53cc7bd660efca585dde33de63ed978d501216
```

Do not create another branch. Do not modify `main`. Do not merge. Push all work to the same existing feature branch and leave it ready for review and later merge.

Repository: `Qays7753/micro-ui-design-system`
Documentation/report path: `docs/zai/`
Access token: `[PROVIDE TEMPORARILY IN THE ZAI CHAT ONLY; NEVER COMMIT OR WRITE IT TO ANY FILE]`
Other Micro repository: `[INTENTIONALLY NOT PROVIDED — DO NOT OPEN, CLONE, LINK, COMPARE, OR REQUEST IT]`

## Non-negotiable product context

This repository is an independent, reusable UI Design System. It is being prepared for possible future consumption by another product, but it is not that product and it is not a production screen implementation.

The Showcase and standalone HTML are a component demo, visual harness, and integration fixture. They are used to discover how reusable components behave before future adoption. They are not the final product UI and must not be treated as proof of a complete product screen.

However, this does not make visual problems unimportant. A component can be technically functional and still have a poor or unsuitable design concept. If a problem is general to the reusable component or its design contract, fix the component itself. If it is caused only by the Showcase host, fixture data, or demo composition, fix only the Showcase/fixture. If it is a design-system decision, make the best professional decision, document it, and update the component contract when the decision changes the component.

The target is a professional, mobile-first Web UI with a strong native-app feeling on Android and iOS-sized screens. Do not turn it into a generic dashboard, a decorative Dribbble/Behance imitation, or a copy of Samsung. Use references for information hierarchy and interaction quality only.

## Scope boundaries

- Light-only is in scope.
- Dark/System Dark is out of scope. Do not redesign it, activate it, or spend implementation effort on it.
- The official brand identity is locked. Do not invent colors, replace the logo, or recolor the system broadly.
- The official terracotta brand accent remains limited and intentional. Do not turn the whole system terracotta and do not use it as a generic success, error, focus, or selected-state color.
- Do not connect this repository to the old Micro repository or compare against it.
- There are no production users, backend services, persistence requirements, or real product data in this repository. Showcase editor behavior must remain clearly labeled as local simulation.
- Do not add arbitrary hardcoded values or one-off CSS hacks just to improve one screenshot.
- Do not hide, clip, delete, or weaken content merely to make a gate pass.

## Source documents you must read first

Read the current branch versions of all of these before editing:

1. `docs/zai/FINAL-COMPREHENSIVE-REPAIR-REPORT-2026-10-24.md`
2. `docs/zai/FINAL-FULL-UI-REVIEW-2026-10-24.md`
3. `docs/zai/FINAL-FULL-UI-REVIEW-2026-10-24.json`
4. `docs/zai/FINAL-REPAIR-REPORT-2026-10-24.md`
5. `docs/zai/ZAI-COMPREHENSIVE-REPAIR-EXECUTION-PROMPT-2026-10-24.md`
6. `docs/zai/references/samsung-calendar-concept/README.md`
7. All current evidence under `docs/zai/evidence/calendar-concept/`, `docs/zai/evidence/calendar-contract/`, and `docs/zai/evidence/chart-audit/`.
8. The attached latest visual audit file, `pasted_content_20.txt`, if available in the conversation. If it is not available as a file, use the summary below.
9. `docs/zai/references/owner-visual-concepts-2026-10-25/README.md`.
10. `docs/zai/references/owner-visual-concepts-2026-10-25/calendar-target.png`.
11. `docs/zai/references/owner-visual-concepts-2026-10-25/chart-target.png`.

The latest visual audit reported the following observations from the standalone Showcase at 320, 390, and 430px with long text and large numbers:

- Approximate visual assessment: component foundation 7.3/10; visual identity distinctiveness 5.5/10. These are subjective review scores, not acceptance criteria.
- Buttons are among the strongest areas. Fields, visible labels, messages, contrast, and long button text were generally acceptable in the reviewed states.
- Calendar was the weakest area at approximately 5.5/10: day numbers and event indicators appear dense on 320px, with possible ambiguity between indicators and adjacent rows.
- Numeric comparisons consume too much vertical space and should be investigated for a more compact reusable presentation.
- Some surfaces, cards, and rounded bordered blocks feel visually repetitive or conventional. This is a design-system hypothesis, not permission to invent new colors or redesign every component.
- Navigation was not fully proven because the reviewed demo did not represent the intended five-section layout.
- Some horizontal choices appear partially cut at 320px, but it is not yet known whether this is intentional scrolling, a host issue, or a real component defect.
- The report recommends keeping the good foundation and not rebuilding every component indiscriminately.

Treat the external image URLs in that report as illustrative only. Do not copy their visual language, layout, assets, or colors.

## Owner-provided visual direction (must be followed)

The two PNG files in `docs/zai/references/owner-visual-concepts-2026-10-25/` are supplied by the owner as the desired concept direction for the next repair pass. Read the folder README before implementation.

`calendar-target.png` is the target direction for the reusable Calendar's mobile composition: clear month/year hierarchy, compact but readable month grid, unmistakable relationship between day numbers and event markers, useful event content below the grid, and a purposeful native-feeling mobile structure. Rebuild this concept accurately at the information-hierarchy and composition level, but use this repository's official identity, tokens, typography, Arabic RTL/LTR behavior, order-schedule semantics, and host-owned events. Do not copy the reference's logo, avatar, external icons, wording, sample data, exact colors, or unrelated product shell. Do not add a bottom navigation bar or profile chrome to the reusable Calendar merely because they appear in the reference.

`chart-target.png` is the target direction for compact, intelligent data visualization: radial/arc/donut-like compositions where semantically appropriate, compact KPI presentation, strong value-to-label grouping, and smart use of limited phone space. It is not a command to convert every dataset into a radial chart. Choose the most readable representation for the meaning, but replace any current chart whose concept is unsuitable, decorative, oversized, or hard to understand on a phone. Use the repository's brand and semantic tokens, not the reference palette.

The owner specifically requires that quantitative charts distinguish **no data** from **real zero**. With absent, null, or empty data, do not render a misleading empty chart, axes, rings, fake marks, or invented zero; render a compact honest no-data state in the chart slot. When the source explicitly contains real zero values, render a deliberate zero-state in the same component style with a truthful readable `0`/zero explanation; do not silently hide real zeros and do not draw geometry that implies non-zero activity. Mixed zero/non-zero datasets must preserve zero categories in the complete text/table view.

Every quantitative chart must provide an explicit, keyboard-accessible control to switch between the visual chart and a complete data table or equivalent full-data view. This is a reusable component contract, not a Showcase-only trick. The alternate view must retain every category, value, unit, period, zero state, missing state, and status meaning. The control must work in RTL/LTR, at narrow widths, with long labels, and at simulated 200% typography. Purely decorative non-data illustrations may be exempt only when the exemption is documented.

## Use focused specialist passes

Use five non-overlapping specialist sub-agents, or five equivalent internal review passes if sub-agents are not available. Do not run redundant broad audits. Each specialist must inspect only its assigned responsibility and return concrete evidence to the final integrator:

1. **Component architecture and contract specialist**
   - Map each suspected issue to the reusable component, host, fixture, or design contract.
   - Inspect source ownership, public API, specifications, examples, and existing regression tests.
   - Prevent Showcase-only problems from becoming component changes.

2. **Calendar specialist**
   - Inspect `components/order-schedule/` in isolation and in the Showcase.
   - Audit both implementation correctness and the visual/information concept on narrow phones.
   - Use the Samsung reference folder only as a concept reference, never as a copy target.

3. **Charts and data-visualization specialist**
   - Inspect every chart family in the actual components, examples, Showcase, and specifications.
   - Evaluate whether each chart helps a project owner understand the data quickly on a phone.
   - Decide KEEP, IMPROVE, OPT-IN, REPLACE-IN-SHOWCASE, or REMOVE-INAPPROPRIATE-PRESENTATION, with evidence.

4. **Mobile, RTL, accessibility, and stress specialist**
   - Reproduce narrow widths, RTL/LTR, long Arabic and English text, 200% simulated typography, keyboard focus, state combinations, and touch-target geometry where automation allows.
   - Distinguish actual failures from intentional scroll or documented trade-offs.

5. **Showcase/integration and verification specialist**
   - Determine whether visual issues come from host composition, fixture data, demo chrome, or the component.
   - Review the isolated examples versus Showcase behavior.
   - Check generated standalone determinism, documentation consistency, and test coverage.

The main agent must integrate the findings. Do not wait for a user decision unless the repository is genuinely blocked by missing access. When a design choice is required, select the strongest professional option within the constraints, record the rationale, and implement it.

## Mandatory root-cause rule

For every reported issue, perform this sequence before editing:

1. Reproduce it in the most relevant isolated component example.
2. Reproduce it in the Showcase using equivalent width, direction, state, and fixture data.
3. Compare geometry, DOM, CSS ownership, and behavior.
4. Classify it as exactly one primary cause:
   - reusable component implementation defect;
   - reusable component design-contract problem;
   - Showcase host/composition problem;
   - fixture/data problem;
   - documented intentional behavior;
   - not reproduced.
5. Fix only the responsible layer.
6. Add or update a regression test at the same layer.

If the component passes in isolation and fails only inside the Showcase, do not distort the component to compensate for the Showcase. If the component is technically valid but its information architecture or visual anatomy is unsuitable on mobile, treat that as a legitimate component design-contract problem and fix the component, its specification, examples, tests, and Showcase together.

## Calendar: required concept and implementation audit

Do not stop at “no horizontal overflow.” Assess whether the Calendar is actually understandable and professionally composed on a 320px phone.

Audit:

- month grid completeness and readable day-cell anatomy;
- fixed relationship between day number and order indicators;
- event count, status dots, overflow policy, and whether the user can identify which day owns which indicator;
- current-day versus selected-day distinction, including when both are the same;
- weekday labels in Arabic RTL and LTR;
- month/year header hierarchy and control density;
- month picker behavior, focus recovery, and whether it preserves the component contract;
- `expanded` and `agenda` presentations, their names, and whether each has a clear purpose;
- selected date versus browsed month separation;
- order rows, Add/Edit/Delete actions, and whether actions consume unreasonable width;
- empty, loading, error, retry, long-title, long-note, and many-orders states;
- 320, 360, 390, and 430px roots in RTL and LTR;
- keyboard and accessible semantics where applicable.

The current owner decision documented in the repository is that this Calendar flow must not introduce a floating thumb-zone Add button or a Bottom Sheet. Do not silently reintroduce either. If you believe that decision must change, document the conflict instead of hiding it, but implement within the current contract unless the evidence makes the current contract impossible.

If the current Calendar concept is poor, redesign the reusable Calendar concept rather than merely adjusting the Showcase. Update all affected source-of-truth files and tests. Do not preserve a poor concept solely because the current automated tests pass. Conversely, do not change the concept solely because one Showcase screenshot is dense if the isolated contract is appropriate and the density comes from invalid demo composition.

### Owner-approved Calendar target

Use `docs/zai/references/owner-visual-concepts-2026-10-25/calendar-target.png` as the authoritative visual concept reference for this pass. The target is the reference's mobile information hierarchy and composition, not a pixel clone. Implement a complete, functional equivalent only with features that belong to this reusable component. If the reference's Day/Week/Month control implies a real reusable presentation that the current contract lacks, make a proper documented contract decision and implement a functioning presentation with tests; never add a fake tab or dead control. Preserve the current order-schedule boundary and do not silently reintroduce a floating Add control or a Bottom Sheet.

The Calendar must use space intelligently: do not make the whole calendar unnecessarily tall, do not allow event markers to collide with adjacent weeks, and do not let Edit/Delete controls consume the useful order-title width without a documented reason. The event area below the month should remain readable, compact, and host-owned. If the reference concept conflicts with the repository's existing semantics, preserve the repository semantics and document the smallest coherent adaptation.

## Charts: required concept audit

Review the actual current chart families and their data semantics. For each family, decide one of:

```text
KEEP
IMPROVE
OPT-IN SPECIALIZED
REPLACE SHOWCASE PRESENTATION
REMOVE AS AN UNSUITABLE DEFAULT
```

Use these principles:

- Bars for precise category comparison and ranking.
- Line for a real ordered/time trend with an explicit time axis.
- Donut only for a small number of part-to-whole categories with a declared denominator and complete text fallback.
- Compact stat/metric rows or cards for primary values and KPIs.
- Signed bars or signed line for genuine positive/negative data with an understandable zero axis.
- Do not use Bubbles, Packed Circles, or Metric Circles as default precise-comparison tools if their area, overlap, or decoration makes values difficult to compare.
- A chart that renders correctly but is not understandable in seconds on a phone is not a successful chart concept.
- Do not change math, source data semantics, or values merely to make a screenshot look better.
- Do not remove a public component silently. If a chart remains in the library but is no longer a default Showcase presentation, document the opt-in limitation and migration impact.

For every chart decision, include before/after evidence, the same source data where possible, text/value fallback, mobile measurements, and an explanation of why the chosen representation is more useful for a project owner.

### Owner-required chart replacement and view switching

Do not leave a chart that the visual audit identifies as clearly unprofessional merely because it passes its existing renderer checks. For every current chart family, inspect the real rendered component and decide whether to keep, improve, make opt-in, replace the Showcase/default presentation, or remove it as an unsuitable default. When replacing a presentation, use the compact concept direction in `chart-target.png` where its radial/arc/donut language fits; otherwise use the most legible compact equivalent such as bars, a signed chart, stat rows, or a table. Preserve public APIs unless a contract change is necessary and documented.

Implement the chart/table switch as a reusable, explicit control for every quantitative chart. The visual chart and the table/full-data view must describe the same source data. The user must be able to switch without losing context, and the alternate view must be complete rather than a shortened legend. Cover no-data, all-zero, mixed-zero, missing, invalid-scale, long-label, RTL, LTR, and 200% typography states. Do not render an empty decorative chart when there is no data; do render and explain a real zero when zero is an actual value.

## Visual-system refinement boundary

The latest audit says the system can feel conventional because of repeated white surfaces, thin borders, and rounded rectangles. Investigate this as a coherent design-system issue, not as permission to decorate randomly.

You may improve hierarchy, surface roles, spacing rhythm, density, grouping, and component anatomy using existing tokens and identity. You may not invent a new palette, broadly recolor the system, or use terracotta everywhere. Preserve the official brand and semantic data colors.

Do not rebuild components that the evidence shows are already strong. Preserve successful button, field-label, message, contrast, and long-text behavior unless the source audit proves a regression.

## Implementation requirements

After the internal audit, implement the necessary changes directly on this same branch. Do not stop after producing a plan. Do not ask the owner to approve routine technical choices.

When a change affects a reusable component, update as needed:

- component JavaScript/HTML generation;
- component CSS;
- specification/contract;
- isolated example;
- relevant catalog or inventory;
- regression and stress tests;
- Showcase integration and fixtures;
- generated standalone only through the existing deterministic builder.

When a change affects only Showcase composition or fixture data, keep the component source unchanged and document why.

Do not weaken or delete existing tests. If a contract legitimately changes, update the specification and the affected expectation together and explain the contract change in the report.

## Verification gates

Run the current repository gates after implementation, including at minimum:

```bash
python3 tools/light-release-check.py
python3 tools/light-static-check.py
python3 tools/light-calendar-check.py
python3 tools/light-data-check.py
python3 tools/chart-mobile-check.py
python3 tools/component-mobile-check.py
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after-component-repair
python3 tools/component-catalog-build.py --check
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/preview-runtime-check.py --base <local-preview-base>
python3 tools/manifest-build.py --check
node --check components/order-schedule/order-schedule.js
python3 -m py_compile tools/light-calendar-check.py
 git diff --check
```

The release gate must finish with zero failures. Runtime verification must cover source and standalone at 320/360/390/430px in RTL and LTR with no console, page, resource, or ResizeObserver errors. Add visual evidence for the revised Calendar and Charts at the narrow widths that exposed the issue. Verify the isolated example and Showcase separately.

Do not claim real-device, Samsung Internet, Safari/WebKit, true touch, TalkBack, VoiceOver, or native OS zoom validation unless actually performed. Clearly label those as untested.

## Required final report

Create one unified report at:

```text
docs/zai/FINAL-COMPONENT-REPAIR-AND-CONCEPT-AUDIT-2026-10-25.md
```

Also place generated, relevant screenshots and measurements under:

```text
docs/zai/evidence/component-repair-2026-10-25/
```

The report must include:

1. Exact branch, starting commit, ending commit, and confirmation that `main` was untouched.
2. A one-line outcome for each finding from the latest audits.
3. A table for every issue with: ID, observed evidence, reproduction state, root-cause layer, files changed, decision, fix, regression test, and remaining limitation.
4. Separate sections for Calendar implementation defects, Calendar design-contract decisions, Showcase-only issues, and product-level UX decisions intentionally left outside this repository.
5. A chart decision table with KEEP/IMPROVE/OPT-IN/REPLACE status, rationale, source data, and migration impact.
6. Before/after visual evidence for Calendar and each changed chart presentation.
7. Exact commands and real PASS/FAIL totals. Never invent totals.
8. Any findings that were not reproduced or remain untested.
9. A concise explanation of why the final system is more reusable, readable, and professionally native-feeling on mobile.
10. A list of files intentionally not changed and why.
11. How `calendar-target.png` and `chart-target.png` were applied, including any deliberate deviations and why.
12. Exact no-data versus real-zero behavior for every changed quantitative chart.
13. The reusable chart/table view contract, affected components, and regression evidence.

Commit all implementation, tests, documentation, and evidence to the same existing feature branch. Push it. Do not merge to `main`. In your final ZAI response, state the ending commit, branch, exact gate results, unresolved limitations, and whether the branch is ready for human visual review and later merge.

## Definition of done

This task is complete only when:

- the actual reusable components are repaired where the defect is component-level;
- Showcase-only problems are not incorrectly pushed into reusable components;
- Calendar has a deliberate, readable, tested mobile concept rather than merely passing overflow tests;
- Charts are chosen by information purpose, not kept merely because they already exist;
- the owner-provided Calendar concept is reflected in the reusable component without copying external branding;
- every quantitative chart distinguishes no-data from real-zero and offers a complete accessible chart/table view;
- the official visual identity remains intact and terracotta remains limited and intentional;
- Light-only scope is respected;
- the standalone build is deterministic;
- all required gates pass with zero failures;
- evidence and documentation explain every material decision;
- the same single feature branch is pushed and ready for review, with `main` untouched.
