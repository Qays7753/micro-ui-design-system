# Edge Case Hunter — independent skill application report

**Status:** LOADED + APPLIED
**Parent audit:** `../edge-report.md`
**Machine-readable source finding:** `../edge-findings.json`
**Coverage matrix:** `../edge-state-coverage.json`
**Finding IDs:** EDGE-001 (one finding)
**Reconciled output:** `../FINAL-REGISTER.json`
**Product/source edits:** None

## Method applied

Read the archived `edge-case-hunter/SKILL.md` and used its 14-family state inventory, trigger-boundary-risk-recovery review, viewport/preference matrix, accessibility/device caution and false-positive triage. Ran `edge-sweep.py` for 36 HTML routes × 8 modes (288 browser cases), and reviewed its measurements/screenshots alongside state coverage across 14 families and 31 grouped state rows. Separately referenced latest interaction, lifecycle, calendar, mobile component, numeric controls, chart mobile and data-scale checks. All browser evidence is Chromium fixture/source-based.

## Finding and current evidence

`EDGE-001` is the only current finding: fixed preview-heading/footer line-height and unbroken path references collide under the **font-size-only DOM 200% simulation**. At 320px messages footer `scrollWidth` is 408px against a 320px client width; similar preview-only footer behavior appears on several routes. It is low priority and not proof of native browser zoom, OS text scaling, consumer-component overflow or accessibility conformance.

The 144 default route/viewport captures (36 × 320/360/390/430) recorded no document overflow, page errors or resource failures. The full sweep has 288 cases; 31 grouped state rows span all 14 families. Results distinguish observed, dynamically exercised, source-inspected, not applicable and not provable; a status in one cell is not blanket verification of a family.

The latest bounded suites include lifecycle 383/383, calendar root-width adaptation 55/55, component mobile 52/52, numeric controls 184/184, chart mobile 59/59, and corrected `tools/data-scale-state-check.py --out ...` 23/23. Interaction browser evidence is 84 pass / 4 fail / 0 runtime errors, with all four repeated failures belonging to INT-001; edge cross-references rather than duplicates that finding.

## Execution and limits

`edge-sweep.py` and the original data-scale checker were run to output-only artifact destinations. The corrected data-scale run used `--out` and passed 23 checks; do not treat an earlier checker/output assumption as a skip. The parent report lists precise commands, output paths, false positives and per-state treatment proposals.

No real iOS/Android device, real touch sensor, screen reader, Safari/WebKit, native zoom, OS contrast mode, backend/session/auth/network integration, product user, or physical safe-area behavior was tested. Forced-colors/reduced-motion are Chromium emulations; 200% text is a DOM font-only simulation.
