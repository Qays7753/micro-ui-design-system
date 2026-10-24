# Showcase repair notes

Scope: `previews/ui-system-showcase/index.html`, `showcase.css`, and
`showcase.js` only. The standalone preview is generated and was not edited.

## Source changes

- Kept the root fixed to `data-theme="light"` and pinned it to Light when the
  showcase controller starts. Removed the Dark/System controls and all
  logo-swapping rules/references. The State Lab brand proof now displays the
  full-color Light logo variants only; logo v2 source files remain untouched.
- Reworked Overview into a responsive component-library grid. It shows real
  surfaces, buttons, fields, information cards, and the precise flat
  comparison. Review controls, state actions, implementation hints, and event
  logs remain in State Lab rather than appearing beside Overview components.
  Status/navigation links, section IDs, `#sc-canvas`, `#state-lab`, and
  component deep links continue to select the appropriate view.
- Added `m-info-card--accent` to exactly one Overview information card
  (daily requests); it uses the existing reusable accent marker and keeps the
  underlying example reading unchanged.
- Bubble, packed-circle, and metric-circle examples are labeled as optional
  specialized visualizations rather than comparison defaults. The metric
  section identifies rows/bars as the default for precise comparison. Chart
  fixture values and source rows were not changed.
- Updated the schedule preview description to describe the current selected
  date and adaptive calendar/day presentation, rather than promising a month
  title at every width.
- Repaired the showcase-owned field state flow without modifying
  `MicroFields`: the one message node is shown with `.is-visible` for error
  and success; error sets `aria-invalid="true"`; success, clear, and input
  remove that invalid state. Clear hides and empties the message but leaves
  the user-entered input value intact. The field API continues to own its
  `aria-describedby` message reference.
- Preserved the State Lab fixture selectors, control IDs, and event log IDs.

## Manual acceptance checks

Serve the repository using the project's preview server, then open
`/previews/ui-system-showcase/`. The showcase defaults to Overview. Use
**مختبر الحالات** or navigate directly to `#state-lab` to reveal review
controls and all component sections. Open `#sc-fields` to inspect the field
demo; its own message/status controls are intentionally absent in Overview.

For PREVIEW-002, on the demo field in State Lab:

1. Confirm its initial value remains present and there is one
   `[data-field-msg]` within `#sc-field-error-demo`. Confirm the input's
   `aria-describedby` includes that message's ID.
2. Activate **إظهار حالة الخطأ**: expect `.has-error`, `.is-visible`, a
   displayed correction message, and `aria-invalid="true"`.
3. Activate **إظهار حالة النجاح**: expect `.has-success`, the same single
   visible message node with success text, and no `aria-invalid="true"`.
4. Activate **مسح الحالة (الإبقاء على القيمة)**: expect no status classes,
   hidden/empty message, no `aria-invalid`, and the exact previous input
   value still present.
5. Type into the field: the input event leaves the field in its normal state
   and preserves the newly typed value.

For PREVIEW-003, check that Overview contains visible real component previews
but no visible `.sc-log` or review-control strip. Follow the State Lab link,
then verify the RTL/LTR, viewport, fixture, filter, brand proof, and per-section
event logs remain available. Load a direct section hash such as `#sc-ocal` or
`#sc-fields` in a fresh tab and confirm the State Lab view is selected and the
target is brought into view. Compare the same source values in Overview and
State Lab; the specialized circle example should remain visibly identified as
optional.

Use only Light while checking: RTL and LTR; the 320, 360, 390, and 430 review
width settings; normal and stress fixtures; keyboard focus through the links
and controls; and a narrow viewport to confirm the Overview cards collapse to
one column. Do not run Dark/System-dark tests. No browser/device, Safari,
screen-reader, or zoom assertion is made by these source changes.
