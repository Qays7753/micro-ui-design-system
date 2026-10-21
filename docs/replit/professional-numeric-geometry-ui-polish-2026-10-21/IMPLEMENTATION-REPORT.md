# Implementation report

## Delivery identity

- Actual fetched main baseline: `91351b4a23d52c0b1e0f6e6a04c4c631ca1332bd`.
- Single feature branch: `replit/professional-numeric-geometry-ui-polish-2026-10-21`.
- Local main preserved: `25fed21790f2c1e78b25e925edc62e9b76825d2e`.
- Verified implementation commit: `ce9fa6910df1e7d0cf5867b9cdf576c56db6626e`.
- Exact source/final commit SHAs and PR are recorded in the final downloadable
  delivery receipt and GitHub PR head. This file is itself part of the final
  documentation commit; it cannot truthfully embed its own eventual hash.

## File-by-file source and usage changes

| File | Change / reason |
|---|---|
| `components/metric-comparison/metric-comparison.js` | Remove diameter-dependent embedded reading placement; every source item has one complete key row, artwork aria-hidden; ratios/state behavior preserved |
| `components/metric-comparison/metric-comparison.css` | Persistent aligned external key; remove obsolete inside-reading styles; long labels/readings wrap |
| `components/metric-comparison/specification.md` | Exact key vs relative area, all-state presentation contract |
| `components/metric-comparison/example-usage.html` | Honest exact-reading key accessible label |
| `previews/concepts/index.html` | Matching full-key description; retain distinct primary/bar example |
| `components/data/data.js` | Measured protected endpoint labels nudged inward; line points, chronology and scale untouched; canonical raw/display contract clarified |
| `components/data/packed-circle.js` | Default inside value aria-hidden when full key owns reading |
| `components/data/packed-circle.css` | Hide default inside numeral; legend-off mode preserves alternate reading path |
| `components/data/PACKED-PATTERN.md` | Reconcile single-reading default and explicit no-key variant; canonical source/display language |
| `components/data/specification.md` | Endpoint fit, fallback and raw-value contract |
| `previews/data/index.html` | User-facing donut refusal summary and correct tiny-bubble radius/diameter arithmetic |
| `components/fields/fields.css` | Quiet clear/step chrome,48px targets, one localized inset focus, unavailable hover safeguards; suppress duplicate UA cancel only with custom clear |
| `components/fields/fields.js` | Full-step arithmetic and focused vertical arrows; safe scaled integers; blocked empty/invalid/unsafe text preserved. Original touch-position guard prevents destructive retargeted gutter actions; separate original/derived aria lock makes reinitialized clones work |
| `components/fields/specification.md` | Document embedded focus, touch guard, raw complete-number stepping, boundary recovery, unavailable precision and consumer validation ownership |
| `previews/fields/example-usage.html` | Correct readonly wrapper plus14 live source checks including boundary and arrow behavior |
| `components/access-gateway/access-gateway.css` |16px form-group gap, full-width action treatment, quiet48px eye and localized focus |
| `components/access-gateway/access-gateway.js` | Pointer range/direction/caret/inputfocus and keyboard buttonfocus; stable pressed-toggle name; disabled guard/remask; ignore stale pointer selection for keyboard clicks |
| `components/access-gateway/specification.md` | Explicit toggle, editing/focus, readonly/disabled and composition contracts |
| `components/selection/selection.css` | Remove second focus-within outline without changing keyboard/static token shadow |
| `components/selection/specification.md` | Keyboard/static vs pointer focus distinction and verification command |
| `previews/ui-system-showcase/index.html` | Visible metric variant captions, full-key label, native disabled/readonly wrapper classes and gateway action group |
| `previews/ui-system-showcase/showcase.css` | Remove40px tool-button override; inherit actual B01 minimum |
| `tools/preview-server.py` | Carry previously authorized root-entry fix to current source showcase, not old gallery index |
| `previews/ui-system-showcase/standalone.html` | Builder-generated mirror only; no manual edits |

## Every test and current-context document changed

| File | Purpose |
|---|---|
| `tools/numeric-geometry-check.py` | New full-key, area-ratio, state, label/value overflow checks |
| `tools/numeric-chart-geometry-check.py` | New sparse/dense endpoint fit, point geometry, packed default/off uniqueness and corrected examples |
| `tools/numeric-field-controls-check.py` | New editing/focus, exact-step/unsafe/invalid/empty/locked states, direction, long text, touch-gutter and direct-action regression checks |
| `tools/numeric-micro-consistency-check.py` | New measured cross-family geometry/focus/180px parent/200% representative/reduced-motion check |
| `tools/concepts-check.py` | Replace obsolete in-circle text contrast assertion with actual external-key contrast; add5 single-reading assertions, retain4.5:1 floor |
| `tools/complete-repair-chart-check.py` | Measure actual positive circle/negative marker/missing-slot position instead of movable text; add24 whole-visible-label boundary assertions |
| `tools/README.md` | Four new focused commands and scope/limits |
| `README.md` | Current repair-report pointer |
| `docs/CURRENT-STATE.md` | Fresh main SHA, branch and current report links; old reports historical |
| `docs/UI-FINAL-HANDOFF.md` | Current verification pointer |
| `docs/UI-RELEASE.md` | Current verification pointer |
| `.agents/memory/MEMORY.md` | Index the non-obvious browser-evidence lesson |
| `.agents/memory/native-touch-evidence.md` | Preserve original-touch vs adjusted-click and unreliable native-pseudo computed-style caveats, without user data |
| `NUMERIC-GEOMETRY-AUDIT.md` in this directory | Before measurements, all-family and cross-component matrix, findings/nonissues/references |
| `REPAIR-TRACKER.md` in this directory | Evidence/status for every finding and limitation |
| `IMPLEMENTATION-REPORT.md` in this directory | This file-by-file delivery manifest |
| `VERIFICATION-REPORT.md` in this directory | Exact final commands/counts, intermediate failures and limits |
| `DECISION-LOG.md` in this directory | Chosen/rejected alternatives, architecture and reference lessons |
| `FINAL-SELF-REVIEW.md` in this directory | Five reviewer roles, repairs after FAIL, professional judgment and merge limits |

The two agent-memory files are repository-ignored local continuity notes, not
part of the GitHub source PR. The versioned delivery has34 source/spec/test/
context files plus standalone and the six reports:41 changed paths.

## Visual and interaction decisions

- **Circle/line/bar/list:** circles encode optional relative magnitude; all exact
  values use one complete key. Bars/list remain precision-first. Hero circle
  is an explicitly chosen primary reading, not a trend or shared scale.
- **Stepper:**48px actions remain, but no competing bordered circles; exact
  complete increments within bounds, unavailable instead of unsafe arithmetic.
  Manually typed out-of-range data can safely recover toward a declared bound;
  this is documented separately from full in-range stepping.
- **Password eye:** logical inline-end, original approved eye, stable name/
  pressed state, no layout shift; pointer resumes editing and keyboard stays
  on the action. Range **and direction** are preserved.
- **Adornments:** units/search glyph remain noninteractive; custom clear owns
  one visible affordance/event path. Whole-shell focus is preserved, including
  touch retargeted outside-button taps.
- **Small controls:** consistent48px actions and one focus language; preserve
  semantic differences among check/radio/switch/segments/tabs/metadata.
- **Density:** one justified field/card shell; complete readings rather than
  nested ornamental frames, repeated in-circle values or unnecessary fallback.

## Compatibility and preserved identity

No shared token, IBM Plex font or icon asset bytes changed. Existing semantic
colors/statuses, source order/values/units, scale refusals, signed/unknown/
unavailable states, full reading fallbacks and lifecycle APIs remain.
Carousel/order-schedule stay DRAFT; packed stays PROPOSED. No external library,
product screen, backend, financial rule, authentication or global parser
migration was added.

Intentional UI contract changes: exact metric readings now always external;
packed default has one full-key reading; invalid/unsupported step arithmetic
refuses rather than coerces; full steps do not partially clamp inside bounds.
Consumers that depended on removed inside-text DOM must use the documented
key, not scrape an illustrative circle.
