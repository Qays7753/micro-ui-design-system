# Verification report — complete Micro UI repair

Date: 2026-10-21. Baseline: `25fed21790f2c1e78b25e925edc62e9b76825d2e`.
Source commit: `09ff0140ad85f703a57d97da50660d597a38ceaf`.
Final review-fix source commit: `ab2b9f00f5ba3f03f2982130606409a125580bd8`.
Browser: system Chromium `152.0.7977.64`, Playwright; local IBM Plex fonts.
Tests execute source, not a stale screenshot or a hand-edited generated file.

## Exact commands and observed results

| Command from repository root | Result | Evidence scope |
|---|---|---|
| `python3 tools/component-mobile-check.py --out /tmp/micro-complete-suite/component` | 52 PASS / 0 FAIL | Source fields/selection, 320/360/390/430, enlarged text |
| `python3 tools/chart-mobile-check.py --out /tmp/micro-complete-suite/chart` | 59 PASS / 0 FAIL | Source SVG geometry/readings/states/resize |
| `python3 tools/professional-ui-repair-check.py --tag complete-final` | 278 PASS / 0 FAIL | Existing focused source/composition regressions; RTL/LTR at four widths |
| `python3 tools/ui-system-showcase-check.py` | 118 PASS / 0 FAIL | Editable source and generated standalone, interactions/assets |
| `python3 tools/ui-system-showcase-repair-check.py --tag complete-final --widths 320,360,390,430` | 176 PASS / 0 FAIL | Current showcase acceptance at four RTL widths |
| `python3 tools/concepts-check.py --out /tmp/micro-complete-final/concepts` | 157 PASS / 0 FAIL | Existing concept families, states, interaction and resources |
| `python3 tools/data-scale-state-check.py --out /tmp/micro-complete-final/data-scale` | 23 PASS / 0 FAIL | Existing scale/refusal/lifecycle behavior |
| `python3 tools/ui-release-check.py` | 322 PASS / 0 FAIL | Existing source pages, RTL, overflow, 200% CSS text, assets |
| `python3 tools/complete-repair-lifecycle-check.py --out /tmp/micro-complete-final/lifecycle` | 383 PASS / 0 FAIL | New focus/editing/full-pause/count policies; fixed-width root/inherited direction changes in both bare engines |
| `python3 tools/complete-repair-chart-check.py --out /tmp/micro-complete-final/charts` | 246 PASS / 0 FAIL | New density/time-axis/value-truth/packed limits |
| `python3 tools/complete-repair-mobile-check.py --out /tmp/micro-complete-final/mobile` | 55 PASS / 0 FAIL | Composition/data-equivalence/responsive-calendar/focus/direction; exact second-order identity and Enter after resize |
| `python3 tools/build-ui-system-showcase-standalone.py` | PASS | Rebuild only through builder; 23 icon symbols validated |
| `python3 tools/build-ui-system-showcase-standalone.py --check` | PASS | Byte-for-byte deterministic reproduction and 23-icon check |
| `node --check` on each changed JS source listed below | PASS | Syntax, not runtime behavior |
| `git diff --check` and staged equivalent | PASS | No whitespace errors |

Changed JavaScript syntax targets: `components/carousel/carousel.js`,
`components/data/data.js`, `components/data/packed-circle.js`,
`components/info-strip/info-strip.js`, `components/info-strip/info-strip-peek.js`,
`components/order-schedule/order-schedule.js`,
`previews/ui-system-showcase/showcase.js`.

The eight pre-existing checks plus three new focused checks total **1,869
passing assertions, zero failures**; this is not a count of devices or user
journeys. Repeated runs and builder/icon checks are not added twice.

## Browser matrix and visual evidence

- Lifecycle: 320/360/390/430 RTL, 390 LTR, reduced-motion contexts. Actual
  browser input caret keys plus synthetic event checks; hidden/reveal, resize,
  two simultaneous instances, late font-ready callback and re-init.
- Charts: 320/390 component widths × 3/7/14/30 points × short/long Arabic/
  irregular-date fixtures. Actual rendered SVG label rectangles have no
  accepted collisions or misleading single-character fragments. First/last
  labels and source boundaries remain visible or move to complete visible rows.
  Source point groups, gaps, exact tables and time coordinates remain intact.
- Time-axis review added impossible day/leap-day/invalid time/offset checks and
  epoch bounds ±8.64e15; invalid sources show explicit refusal and complete
  readings, valid sources produce finite coordinates.
- Composition: same dataset in compact/standard cards and default/compact/flat
  metrics; normal/stress showcase datasets remain identical across variants.
- Order Schedule: actual root widths, not just device viewport; below
  `7 × 48 + 6 × gap`, day fallback. No overlapping or undersized targets in
  accepted fixtures; selected date, preferred mode and user events preserved;
  focused date/control has a safe visible destination across responsive modes.
- Visual QA actually inspected temporary source screenshots at all five
  width/direction combinations: fields and focused error, compact information,
  metrics, charts/readings, expanded carousel, narrow day and wide month, list
  and empty schedule states. It found an LTR stale-transform issue, now repaired
  and covered by repeated direction-switch assertions before any Next action.
- Separate rendered 320/390 field-border comparisons retained the existing
  boundary: 3.829:1 against white, versus 1.284:1 for the lighter existing
  divider token. Geometry stayed 52px. This is a contextual comparison, not a
  complete contrast/accessibility audit.

## Independent review and resolved findings

1. Chart reviewer: malformed/overflow times were accepted by `Date.parse`/
   numeric finite-only checks. Fixed strict calendar/offset/epoch validation;
   endpoint assertions added. Final C suite 246/246.
2. Lifecycle reviewer: unconditional `dragstart` still prevented native dragging
   after disconnect. Guarded in both Carousel and Peek, tested while paused.
3. Native/RTL reviewer: responsive calendar lost keyboard focus. Added date-first
   matching, equivalent previous/next navigation and safe mode-control fallback;
  selected date/events unchanged, covered in M. Final review additionally
  identified action-only matching of same-day order rows; focus now matches
  exact order ID, with two-order/resize/Enter regression assertions.
4. Visual QA: initialized RTL carousel became clipped after LTR switch at the
  same width. The initial showcase-only correction was insufficient. Final
  review required reusable engines to observe direction changes on the root
  and current ancestors, independently of width. Both now do so, remove those
  observers at disconnect, retain index and emit no extra navigation event.
  Forty bare-engine root/inherited direction assertions and M cover the repair.
5. Final reviewer returned FAIL before finalization for those two remaining
   bugs and untracked reports. The two source bugs were corrected in `ab2b9f0`,
   affected suites rerun, and all five reports included in the final docs commit.
   No second independent review was requested or claimed.

## Failed intermediate checks — not hidden

- Initial lifecycle fixture had RTL numeric caret expectations and required an
  outline on buttons whose intentional focus uses a box-shadow. Fixed the test
  fixture to isolate numeric LTR and assert actual visible component focus,
  not one styling mechanism. The source editing guard was retained.
- Old professional check required positive peek margins at all widths; replaced
  with explicit full-width-below-336/centered-peek-otherwise geometry acceptance.
- Old calendar check required a month grid with ≥37px cells. It now requires
  ≥48px month cells when wide, or the approved automatic day alternative,
  actual ≥48px targets, no overlap and retained DRAFT status when narrow.
- No failed check was replaced by a grep-only “pass.” Focused browser assertions
  were added for new behavior and independent-review reproductions.
- The new direction fixture left the independent-instance target at index 1;
  its later check still assumed index 0, causing ten fixture-state failures.
  Explicitly reset both fixture instances before the independence check. All
  forty direction assertions had already passed; final L result is 383/383.

## Git, identity, secrets and artifacts

- Fresh fetch confirmed actual `origin/main` equals the historical baseline.
  The one required branch starts at that SHA. Local `main` was not switched to
  for editing, committed to, reset, force-pushed, merged or deleted.
- `shared/` and `assets/` have no changes against baseline; no package/runtime
  replacement. Generated standalone was rebuilt, never hand-edited.
- Changed/new files and the new commit diff were checked for common credential
  signatures, private-key headers, authenticated GitHub URLs and literal
  authorization values. No match was found. This is a scoped signature check,
  not a claim of exhaustive secret/security scanning of all historical commits.
- No credential value was read, printed, written or committed for this task.
  Native Git dry-run failed authentication without changing any remote ref.
  GitHub delivery uses the existing configured connection and Git Data API,
  preserving and verifying local blob/tree/commit SHAs; no token extraction.
- Temporary screenshots and generated browser outputs are excluded from Git.
  They are not durable report links; remove them before final commit/delivery.

## Not run / limitations

Physical Android/iOS, Safari/WebKit, actual touch/pointer capture on a device,
TalkBack/VoiceOver/other screen readers, native zoom, safe-area/keyboard layout
and performance on very large real business datasets were **not verified**.
Synthetic pointer checks exercise cleanup state but do not prove a physical
pointer capture lifecycle. No full WCAG, security or production certification.
These are declared platform-validation limits, not failed Chromium checks.
