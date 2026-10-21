# Verification report — 2026-10-21

## Identity and environment

- Fetched baseline: `91351b4a23d52c0b1e0f6e6a04c4c631ca1332bd`.
- Source implementation: `ce9fa6910df1e7d0cf5867b9cdf576c56db6626e`.
- Branch: `replit/professional-numeric-geometry-ui-polish-2026-10-21`.
- Chromium **152.0.7977.64**, Playwright with existing system browser selected
  through `tools/browser_support.py`; no browser/package installation.
- Actual IBM Plex Arabic/Latin fonts loaded; no substituted production font.
- Source preview workflow: `Micro UI preview`, port5000; root HTTP302 points to
  `/previews/ui-system-showcase/index.html`, not the historical gallery.
- Final standalone SHA256:
  `53bf5796ae5838ee9f11d1c40cd91bd6f69884881af0c24ac5e428ba1a285ac6`.
- Final documentation/delivery HEAD is recorded in the downloadable receipt
  and PR head; this committed file cannot embed its own eventual commit hash.

## Exact final commands and actual counts

Commands ran with `PYTHONDONTWRITEBYTECODE=1`. Outputs under`/tmp` and
`generated-artifacts` are scratch evidence, not promised permanent attachments.
Each row reports its final successful run, not an earlier failed attempt.

| Command | Final result |
|---|---|
| `python3 tools/component-mobile-check.py --out /tmp/final-numeric-component-mobile-check` |52 PASS /0 FAIL |
| `python3 tools/chart-mobile-check.py --out /tmp/final-numeric-chart-mobile-check` |59 PASS /0 FAIL |
| `python3 tools/professional-ui-repair-check.py --tag numeric-final` |278 PASS /0 FAIL |
| `python3 tools/ui-system-showcase-check.py` |118 PASS /0 FAIL |
| `python3 tools/ui-system-showcase-repair-check.py --tag numeric-final --widths 320,360,390,430` |176 PASS /0 FAIL; console0 |
| `python3 tools/concepts-check.py --out /tmp/final-numeric-concepts-check` |162/162 |
| `python3 tools/data-scale-state-check.py --out /tmp/final-numeric-data-scale-state-check` |23/23 |
| `python3 tools/ui-release-check.py --out /tmp/final-numeric-ui-release-check` |322/322 |
| `python3 tools/complete-repair-lifecycle-check.py --out /tmp/final-numeric-complete-repair-lifecycle-check` |383 PASS /0 FAIL |
| `python3 tools/complete-repair-chart-check.py --out /tmp/final-numeric-complete-repair-chart-check` |270 PASS /0 FAIL |
| `python3 tools/complete-repair-mobile-check.py --out /tmp/final-numeric-complete-repair-mobile-check` |55/55 |
| `python3 tools/numeric-geometry-check.py` |51/51 |
| `python3 tools/numeric-chart-geometry-check.py` |79 PASS /0 FAIL |
| `python3 tools/numeric-field-controls-check.py` |184 PASS /0 FAIL |
| `python3 tools/numeric-micro-consistency-check.py --out /tmp/micro-numeric-consistency` |97 PASS /0 FAIL |

**Total:2309 passing assertions across15 scripts; zero final failures.**
The14 checks embedded in the field example were also inspected passing by the
field specialist; they are **not** added again to the2309 total.

Other completed checks:

```sh
python3 tools/build-ui-system-showcase-standalone.py
python3 tools/build-ui-system-showcase-standalone.py --check
node --check components/fields/fields.js
node --check components/access-gateway/access-gateway.js
node --check components/data/data.js
node --check components/data/packed-circle.js
node --check components/metric-comparison/metric-comparison.js
git diff --check
git diff --quiet origin/main -- shared assets
```

Builder reported BUILD/SELF-CHECK/CHECK OK, byte-for-byte deterministic output
and23 approved icon symbols matching asset contents/fill. Changed Python
sources were compiled in memory without adding tracked bytecode. A scoped
diff credential-signature check found no private-key/GitHub/AWS/API-key
signatures; no environment-secret values were read or printed. This is a
scoped check, not a full security certification.

## Viewports, component widths and state coverage

| Check area | Actual coverage / measurements |
|---|---|
| Metric full key |320/360/390/430RTL,390LTR; example roots280/320/350/390/350px. Separated/overlap64:25:9 area ratios, signed magnitudes, all state keys, invalid scale, long labels/values |
| Line/packed |320/360/390/430RTL,390LTR. Line plots288/328/350/390/350px; packed roots256/296/326/326/326px. Sparse fit, real dense fallback, unchanged point/time positions and gaps, legend default/off, denominator/scale/density refusals |
| Field/access |RTL320/360/390/430, LTR390; source gateway shells232/272/302/342px; quantity shell186×52 with48×48 actions.200%-text at all four RTL widths;15-digit input preserved and caret-scrollable (222client/288scroll at320) |
| Keyboard/editing |Pointer and keyboard eye, backward selection direction, stable name/state, no geometry shift, focus location, clear, Up/Down only inside quantity, horizontal/outside arrows, readonly/disabled, min/max/decimal/scientific, empty/invalid/unsafe values |
| Emulated touch, both consumers |Source`index.html` and generated`standalone.html`, each320RTL/390LTR: custom clear gutter, former native-cancel region, direct clear exactly once, quantity gutter, unaffected native-only search, password range/direction/focus and invalid/partial steps |
| Cross-family micro controls |320/360/390/430RTL/390LTR,180px parent,320/200% representative text, reduced motion.48px label/action/option/tab targets,52×32 switch,24thumb/spinner,6badge dot,20counter,1divider |
| Existing regression contracts |Carousel/peek lifecycle, inert/visibility/resize/full-pause/reduced motion, schedule narrow actual-width fallback, dialog focus/close, chart raw state/denominator/time and responsive compositions |

Zero/missing/negative/invalid/unavailable are not collapsed. Chart loading is
not invented: labeled progress stays a separate component. Field state is UI
only; min/max/step on text inputs are not native validation.

## Visual inspection

Before source edits, all four roles inspected actual public routes and source.
Before measurements and context are in the audit, including separate actual
component widths. After changes, specialists inspected metric/concepts,
line/bubble/packed/refusal and field screenshots; the RTL role inspected
selection/navigation/messages/field focus/200% samples and found the search
touch defect. The independent final reviewer inspected current320px captures.

Main directly viewed the refreshed320px concepts circle key and sparse line
capture, the public390px root preview and320px gateway screenshot. The gateway
shows quiet eye inside52px shell, consistent submit and deliberate16px gap.
Focused browser assertions exercise states not visible in a static screenshot.
Temporary captures include`/tmp/numeric-audit-after`,
`/tmp/numeric-chart-geometry-check`,`/tmp/post-review` and the final check output
directories. These are not represented as committed evidence files.

## Intermediate failures and why they were corrected

1. New chart checker initially had5 assertion failures: it incorrectly expected
   a zero category label repeated in the reading text. Category and numeric0
   were already separate and correct; the assertion was corrected, final79.
2. Main's exploratory password probe first timed out because its selector was
   `input[type=password]` after type changed to text. A stable id fixed the
   probe; this was not an app failure.
3. Exploratory source probes found backward selection direction loss, unsafe
   integer rounding and extreme-decimal`NaN`. Those source bugs were repaired
   and included in permanent field assertions.
4. Legacy chart initially236 PASS/10 FAIL: its “point coordinates” were really
   category-label x positions. Intentional endpoint text movement invalidated
   that proxy. The first corrected harness then aborted on negative points,
   which use a warning marker rather than a circle/point-value node. Final
   harness measures actual circles/negative marker centers/missing slots and
   adds24 whole-label boundary assertions; final270/270. No data geometry
   expectation was relaxed.
5. RTL post-review explicitly failed the double search clear/touch gutter path.
   The original touch coordinate and adjusted click coordinate reproduced it.
   Source and emulated touch regressions now protect both consumers.
6. Independent final review explicitly failed invalid-text coercion and stale
   standalone, noted the then-unfixed negative-marker harness and a135/1 field
   result caused by sampling a fading focus shadow at150ms. Main refused
   invalid text, rebuilt output, corrected the harness and waits for actual
   settled shadow state. No independent re-approval is claimed.
7. A later field run160/2 failed because native pseudo-element computed style
   did not expose the suppressed glyph reliably. This was a test-observation
   error: actual former-cancel-region taps preserved the text. Final tests
   combine a loaded scoped CSSOM rule, actual former-region hit behavior,
   direct custom action and a native-only input that still clears.
8. Professional gate270/8 exposed a genuine live-clone regression: derived
   boundary/readonly aria-disabled was captured as a permanent consumer lock.
   Source now stores original aria ownership separately; the existing test's
   expected1→1.5→2→1 and readonly assertions were not weakened. Final278/278.

Obsolete concepts contrast assertions now measure the actual external reading
against its actual opaque ancestor surface at the unchanged4.5:1 floor and add
five uniqueness checks. Counts rose157→162. No assertion was deleted merely to
make a red result green.

## Final limits and readiness

All confirmed in-scope UI findings are FIXED with evidence. Local and remote
main are not modified; branch/PR delivery is recorded in the final receipt.
Independent reviewers' initial FAILs are preserved rather than relabeled.

Unverified: physical Android/iOS, actual touch/keyboard behavior, Safari/
WebKit/Firefox, VoiceOver/TalkBack, real safe areas, OS/native zoom, WebView/PWA.
CSS200% and Chromium emulated touch do not certify those. Safe stepping is not
arbitrary-precision math; unsupported values remain manually editable.
Zaman source was unavailable through configured access; no inspection claimed.
