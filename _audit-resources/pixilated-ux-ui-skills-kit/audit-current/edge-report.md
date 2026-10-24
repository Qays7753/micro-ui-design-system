# Edge-case audit — current repository

## Scope and verdict

This is a read-only edge-case review of the UI/UX design-system repository open in this workspace. It is a reusable UI kit with specimen pages and fixture/demo data, not a consumer product. I did not access, connect to, or compare against any Micro repository/application or any external application. I did not modify source, documentation, showcase, configuration, fixtures, or branches.

The current tree has **one confirmed, low-priority, preview-shell-only finding** under the explicit font-size-only 200% stress simulation. I found **no default-state document overflow** in the sweep’s 144 route/viewport captures (36 HTML routes × 320/360/390/430), and the sweep recorded zero JavaScript page errors and zero failed resources. This is not a broad assertion that every production context is complete: the kit has no backend, identity/session service, network state, real user context, or real-device evidence.

**State coverage:** the taxonomy-to-family status matrix is in `edge-state-coverage.json`; the one finding and deliberately excluded false positives are in `edge-findings.json`. The matrix includes all 14 component directories, separates observed/exercised states from source-only inspection, and identifies states that cannot be proved without a future product contract.

## Current-state evidence and triage

The only finding is `EDGE-001` (LOW / P3, Should-design): `previews/board-base.css` has fixed pixel line heights for preview headings/footer copy and long path-like footer references without a deliberate wrap policy. Under the exact font-only simulation, `footer.board-footer` on the messages preview is 408 px wide in scroll terms against a 320 px client width; the rendered footer text overlaps its fixed 22 px line boxes. Similar footer scroll widths appear on the data (344), navigation (412), organization (434), and selection (398) pages. The actual offending shell selector, source rule, evidence, limits, risks, and acceptance criteria are fully recorded in the finding JSON.

The simulator doubles each computed `font-size` inline while leaving line-height, padding, control geometry, and script-measured layout untouched. It is **not** native browser zoom, OS dynamic type, or proof of consumer-component breakage. Other reported document widths in the run (buttons 388, carousel 471, data 344, messages 408, navigation 412, organization 434, selection 421, surfaces 386, showcase 467 px at 320 px) include preview-only references and intentional horizontal carousel/segmented/phone-lab/showcase content. The source and screenshots were triaged rather than treating all scroll-width increases as user-visible component failures. A hidden carousel slide outside `.m-carousel__viewport`’s clipping boundary, a scrollable segmented control, and showcase controls are not independently findings.

The generated 200% full-page captures were inspected, then targeted viewport captures were captured and viewed. Evidence includes:

- `generated-artifacts/pixilated-audit/edge/edge-results.json` — 288 browser cases: 36 routes × 8 modes (four default widths, reduced-motion, forced-colors, landscape, and font-size-200%-simulation).
- `generated-artifacts/pixilated-audit/edge/edge-text-simulation-attribution.json` — selector-level attribution for the wider 320 px simulation cases.
- `generated-artifacts/pixilated-audit/edge/previews--messages--font200-footer.png` — the inspected footer collision/overflow at the precise selector.
- `generated-artifacts/pixilated-audit/edge/previews--messages--index-font200-viewport.png`, `previews--data--index-font200-viewport.png`, `previews--carousel--index-font200-viewport.png`, `previews--organization--index-font200-viewport.png`, and `previews--selection--index-font200-viewport.png` — viewed viewport evidence showing why the text-only simulation must not be confused with a component/default-state screenshot.
- `generated-artifacts/pixilated-audit/edge/previews--ui-system-showcase--forced-colors.png` — viewed Chromium forced-colors emulation; text and controls remain visible in the capture.
- `generated-artifacts/pixilated-audit/edge/previews--messages--reduced-motion.png` and `previews--data--reduced-motion.png` — viewed reduced-motion examples.
- `generated-artifacts/pixilated-audit/edge/edge-dynamic-probes.json` — runtime-only injected long-content measurements, label-wrapper target measurements, and device-mode computed styles.

### Current state vs future state

The useful current-state conclusion is narrow: normal 320–430 px previews render without document overflow; tested interaction routes and the focused component suites pass their declared Chromium checks. The stress run is useful for locating preview-shell typography fragility, but its font-size mutation cannot establish real zoom conformance. Large internal scroll dimensions are expected for carousels and segmented controls and were not reported as clipping unless visible content was actually affected.

The recommended future is **80% system resilience, 20% defect description**:

1. Treat specimen chrome as a real part of the system’s handoff tooling. Let line boxes grow with text and let full source references wrap at deliberate break opportunities; never satisfy a narrow viewport by clipping, truncating, or shrinking the information.
2. Distinguish shell/preview geometry from reusable component geometry in automated audits. Report a clipped document only after attributing the visible element and checking its overflow/clip ancestor; a carousel’s hidden track scrollWidth is not the document’s visible width.
3. Keep reusable data/selection/message components content-first. The additional transient long-value probes showed that 72-digit values in `.m-stat__num`, a 1,500-character message body, a 672-character organization title, a 792-character carousel heading, and a 672-character selection label expanded vertically without horizontal overflow at 320 px. This is fixture-DOM stress evidence, not an endorsement of those values as realistic consumer copy.
4. Preserve explicit state boundaries: backend-owned loading, network, stale, authorization, and session states remain product integration decisions, not fabricated “missing” kit services.
5. Treat native input controls according to their actual associated target. The selection sweep flags visually hidden native inputs as 1×1 px, but the measured label wrapper is at least 48 px high in all 12 inspected examples; this is not a touch-target defect.

## Coverage and recommended state treatments

The companion JSON matrix is the handoff checklist. It contains 31 grouped rows across all 14 families. For each taxonomy state/group, every family cell has one of the five requested statuses: `INSPECTED SOURCE`, `DEFAULT OBSERVED`, `DYNAMICALLY EXERCISED`, `NOT APPLICABLE`, or `NOT PROVABLE`. “Observed” does not mean every variant or all possible content was visually approved. “Dynamically exercised” means the state was actually attempted in a named browser check; the outcome can pass or fail and is recorded as such, never implied approved by that status.

| State family | Trigger | Future treatment | Priority |
|---|---|---|---|
| Initial/steady, loading, partial/slow | Enter a screen, await content, receive a delayed/partial response | Preserve stable layout; for real async consumers use an announced loading/skeleton state and keep already usable content; never imply network behavior in this static kit | Should-design |
| Empty: first-time, after deletion/filter, no results | Zero items or zero matches | Explain why the region is empty, offer a relevant recovery action, and distinguish no data from zero; keep empty-list and no-search-results semantics separate | Should-design |
| Error: validation, server, network, permission, expired session | Invalid input or a failed service/session | Link inline validation to its field and focus it; retain user-entered content; reserve concise retry/recovery copy for consumer-owned service failures and explicit sign-in recovery for session failures | Must-design for future integration; not provable here |
| Success and disabled | A committed action succeeds, or a prerequisite/boundary is unavailable | Provide concise, non-duplicated status feedback; expose disabled reason where actionable and retain keyboard/touch boundary behavior | Should-design |
| Content skeleton, partial boundary, truncation, maximum and stale | Deferred content, page boundary, long labels/numbers, cached older value | Keep complete content readable; use bounded, named pagination/loading only where the consumer supplies it; label stale values with last-update/retry policy only when real freshness data exists | Should-design |
| Input default/hover/focus/active/filled/valid/error/disabled; inline timing/help | Focus, editing, submit, validation, or lock state | Keep labels stable and errors associated; choose validation timing per form contract; expose help/placeholder/character limits as distinct content, not as a replacement label | Must-design |
| Authentication/permission/suspension/2FA | Identity/session/role changes | Define consumer-owned authorization outcomes, safe return paths, and recovery; the kit’s credential specimen demonstrates presentation only | Must-design before a consumer flow; NOT PROVABLE in this repository |
| Offline/cache/slow/reconnect/conflict | Lost/slow connectivity or competing writes | Define whether a consumer supports cached reads, queued writes, conflict resolution, and sync messaging; do not imply those services exist in this UI kit | Must-design before a consumer flow; NOT PROVABLE here |
| 320 px, wide, landscape, reduced motion, forced colors | Viewport/preference changes | Preserve reflow and operability; ensure movement is removed without deleting state feedback; keep visible focus and contrast. Forced-colors screenshots are emulation only, not OS validation | Must-design |
| Dark theme, first/returning user, power-user shortcuts, locale/timezone | Consumer context, theme preference, or regional data policy | Decide theme contract and date/currency/shortcut ownership before promising variants; local fixture strings and RTL examples are not locale-aware production formatters | Should-design / owner decision |
| RTL and Arabic | `dir=rtl`, Arabic copy, mixed script/amount | Keep direction logical, numbers isolated where needed, and long Arabic/Latin content wrap-safe; validate actual locale-sensitive formatting separately | Must-design |

## Families in scope

All 14 current component directories were included in the matrix: `access-gateway`, `account-settings`, `buttons`, `carousel`, `data`, `fields`, `info-strip`, `metric-comparison`, `navigation`, `order-schedule` (calendar), `organization`, `selection`, `surfaces`, and `messages`. The route inventory is in the existing edge-results artifact; it covers both component example pages and preview indices, compositions, system, and showcase/standalone routes. The audit did not infer real users, user journeys, analytics, live data, roles, or backend services from the demo content.

Important bounded evidence:

- Latest interaction browser evidence records 88 checks: 84 pass, 4 fail, zero runtime errors, across 320/360/390/430 RTL. The four failures are one repeated picker async-error focus/announcement failure (`INT-001`), not four edge findings. The separate picker no-results-recovery check passes. I cross-reference the interaction finding rather than duplicating it in this edge report.
- Lifecycle evidence records 383/383 passing Chromium checks, including carousel/info-peek count/resize/disconnect lifecycle, focus/inert transitions, and no overflow in those generated fixtures.
- Calendar/mobile evidence records 55/55 passing component-width/data-equivalence checks. This closes the previous **source-only calendar suspicion** for the tested contract; it does not prove timezone policy, real dates/services, or all devices.
- `tools/component-mobile-check.py` records 52/52; `tools/chart-mobile-check.py` records 59/59; `tools/numeric-field-controls-check.py` records 184/184; and `tools/data-scale-state-check.py` records 23/23, including repeated invalid/over/rescaled → valid transitions with current diagnostic cleanup. Exact commands, output destinations, and limits appear below.
- No audit finding is based on the `1px` screen-reader-only `.m-info-strip__status`/`.m-live-region` geometries.

## Accessibility/device mode checks and limits

- **Reduced motion:** browser media emulation returned `prefers-reduced-motion: reduce`; direct representative screenshots show the message skeleton and determinate progress example remain visible. The direct probes measured zero running animations on the messages and data pages. The broad sweep also rendered every route in the emulated mode. This is not a physical preference/device test.
- **Forced colors:** Chromium reported `(forced-colors: active)` and the representative showcase capture shows legible foreground text and controls; computed visibility remained visible. All routes were also loaded in emulated forced-colors mode by the broad sweep. This does not substitute for OS high-contrast/browser combinations or an accessibility audit of every semantic color pairing.
- **Large/landscape:** the broad sweep set 844×390 and recorded layout/control metrics on all 36 routes. This is browser geometry, not a device safe-area or rotation test.
- **Small targets:** selection inputs were checked as label-wrapper unions; tested wrappers meet 48 px height. The measured 1×1 native input is intentionally visually hidden.
- No screen readers, physical devices, WebKit/Firefox, native zoom, safe areas, actual operating-system contrast settings, service latency, authentication, or consumer-product flows were tested.

## State gaps, decisions, and owner questions

1. **Text enlargement contract:** decide whether the font-only 200% simulation is itself an acceptance condition for specimen chrome or a diagnostic-only stress probe. Recommendation: make preview shell copy/paths robust to it, while requiring actual browser zoom/OS text-scale evidence for any user-facing accessibility verdict. This is not a blocker to component work.
2. **Dark/reversed theme:** decide whether this kit must ship a dark/reversed token context before transfer. Current source demonstrates a single appearance; the audit does not invent an unrequested dark theme. If approved, define semantic surface/text/border/state tokens and test the component matrix under the theme.
3. **Network and authorization contract:** when a future consumer exists, its owner must decide offline cache/write policy, stale refresh semantics, sync conflict handling, session expiry, permission denial, suspension, and 2FA behavior. These are not repairable as a “missing backend” inside this standalone UI kit.
4. **Locale formatting:** decide whether consumer code or a shared primitive owns dates, currency, numbering, and time zones. Current fixture strings only show examples; they do not establish a formatter contract.

## Commands and exact bounded results

The output-only commands below wrote their results/screenshots under `generated-artifacts/pixilated-audit/edge-tests/`:

| Command | Result | Scope limit |
|---|---:|---|
| `python3 _audit-resources/pixilated-ux-ui-skills-kit/audit-current/edge-sweep.py` | 288 cases: 36 routes × 8 modes; 144 default route/viewport captures; no default document overflow, page errors, or resource errors | Chromium route sweep. Font-size-200% is a DOM simulation. Forced colors/reduced motion are browser media emulations. |
| `python3 tools/component-mobile-check.py --out generated-artifacts/pixilated-audit/edge-tests/component-mobile` | 52 PASS / 0 FAIL | Source-based Chromium/touch emulation; not a real device. |
| `python3 tools/chart-mobile-check.py --out generated-artifacts/pixilated-audit/edge-tests/chart-mobile` | 59 PASS / 0 FAIL | Source-based Chromium chart/navigation/segmented geometry; simulated text enlargement. |
| `python3 tools/numeric-field-controls-check.py` | 184 PASS / 0 FAIL | Console-only suite against the already running local preview; Chromium, listed widths, simulated touch/keyboard; no native device claim. |
| `python3 tools/data-scale-state-check.py --out generated-artifacts/pixilated-audit/edge-tests/data-scale` | 23 PASS / 0 FAIL | Original test logic; isolated output override. Chromium fixture/source test for chart-scale diagnostics and same-node state transitions; not real service data or a screen-reader/device check. |

The existing local artifacts were reviewed separately, not represented as commands rerun in this pass: latest interaction browser 84 pass/4 fail across 88 checks (four repetitions of `INT-001`), lifecycle 383 pass/0 fail, and calendar/mobile 55 pass/0 fail. The interaction outcome is in `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/interaction-browser-results.json`; the owning interaction finding is `INT-001` in `interaction-findings.json` and `interaction-report.md`. System inventory’s standalone check is reported by the main audit.

## Handoff recommendation

Approve a **preview-shell-only** typography/wrapping patch for `EDGE-001` if font-only 200% is a desired developer-preview acceptance condition. Otherwise label this mode simulation-only and add actual zoom evidence before interpreting it as accessibility conformance. Keep the rest of the kit’s future work behind explicit product-owner choices: dark/reversed appearance, real service/auth states, and locale/timezone ownership. No source or documentation change was made in this audit.
