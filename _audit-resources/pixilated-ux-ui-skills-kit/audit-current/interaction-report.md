# Interaction audit — current design-system behaviors

**Track:** Interaction design, bounded UX-research application, and interaction management.  
**Finding prefix:** `INT` (one independent finding: `INT-001`).  
**Scope:** The independent repository's UI-system components and demo fixtures only. No future Micro product, customer application, external site, real user, or production data was inspected. No product/component/source/spec/showcase/configuration files were edited.

## Bounded verdict

The tested interaction paths are generally coherent: RTL keyboard traversal, navigation tabs, layer focus containment/restoration, password visibility, validation feedback, quantity control, carousel navigation/disclosure, and narrow calendar adaptation all behaved as intended in the tested Chromium fixtures. The single current interaction defect observed is a keyboard focus and status-announcement gap when the picker changes asynchronously from a focused option into a non-ready state. It reproduced at all four tested viewport widths.

This is a finding about the component's declared async state API—not evidence that a real network, product, or user has this workflow. The picker can still visibly show and activate its retry control; browser interaction showed that focus falls to `body`, while the state row has no live-region semantics and is inserted within its `role=listbox`. Actual assistive-technology output was not tested.

**No calendar defect is reported.** The current specification explicitly adapts the month grid when the *component root* is narrower than 360px, and the bounded component-width/mobile test exercised 320/360/390/430px roots, selected-state/focus mapping through resize, and preserved data. The 360px showcase screenshot displayed its narrow day-mode layout. These checks passed; a source-only claim that the narrow calendar is broken would be false.

The separate parent-owned default route sweep is recorded as 36 routes × 4 widths (144 default cases) with zero document-width overflow and zero page/resource errors. Its wider edge artifact also contains non-default modes and intentionally offscreen carousel/device specimens; their element bounding boxes are not the same as page-level overflow. The interaction audit does not replace that sweep.

## Main Job hypothesis — design-system context, not product users

**Hypothesis (low confidence, repo/task-derived):** When a design-system author reviews or composes a component fixture, they need its keyboard, pointer, state-feedback, recovery, and lifecycle behavior to remain understandable so they can judge whether the component is reusable.

This is a useful audit frame for the current repository, not a validated JTBD. The repository identifies a UI component library and local deterministic fixtures; it does not identify a consumer, production task, user segment, frequency, time budget, consequence, or observed behavior. Emotional/social forces, real-device context, and the moment at which an external adopter would choose a component are **NOT PROVABLE** here.

Moment tests applied as questions, not user evidence:

1. **Arrival:** Can the fixture communicate its component and current state? Usually yes through visible names, selected states, and position/status strings.
2. **Time budget:** Is the tested behavior faster or preferred by people? **NOT PROVABLE**; no timing or human study.
3. **State:** Does a status-changing action leave a clear state and usable focus? Picker async error is the exception (`INT-001`).
4. **Next step:** Does recovery stay actionable? The retry button is visible and emits once, but focus is lost when the options disappear.
5. **Forces:** What real-world alternatives, anxieties, habits, or adoption pressures exist? **NOT PROVABLE**.

## Coverage and results

| Scope | Evidence and result | Boundary |
|---|---|---|
| Live showcase: carousel, quantity, password reveal/validation, tabs, modal, account settings, picker | `interaction-browser-audit.py`: latest run 84 checks passed, 4 failed; all four failures are the same picker focus/live-region defect at 320/360/390/430px RTL. 0 page/runtime errors. | Chromium on the already-running local showcase, not a real device or screen reader. Pointer path is browser-emulated; no claim of physical touch. |
| Carousel and fields state/lifecycle harness | `tools/complete-repair-lifecycle-check.py`: 383/383 passed, 320/360/390/430 RTL and 390 LTR. Included RTL/LTR controls, focus outside inactive slides, empty/single/multiple cards, editing/caret protections, disconnect/re-init and duplicate-init checks for supported APIs. | Scripted component fixture; it does not prove human usability or real touch. |
| Order schedule responsive mode and focus mapping | `tools/complete-repair-mobile-check.py`: 55/55 passed. It exercises *component root widths*, including 320, 360, 390 and 430px; day/month fallback, preserved preference/date/data/order identity, focus remapping at 360-adjacent transitions, and resize/disposal behavior. | Chromium component fixture; no calendar finding. |
| Fields, selection, quantity, switch and mobile geometry | `tools/component-mobile-check.py`: 52/52 passed at 320/360/390/430px with touch emulation and simulated enlarged text. Viewed field, quantity and selection screenshots. | Browser emulation is not physical touch or screen-reader testing. |
| Main-agent viewport evidence consulted for coordination | `generated-artifacts/pixilated-audit/edge/edge-results.json`: separate default subset is 144 cases across 36 routes/four widths, with document width equal to viewport and no page/resource errors. | Parent-owned sweep. Other edge modes include internal offscreen specimens; this does not certify all interaction states. |

The custom browser evidence is in `audit-current/interaction-browser-results.json` and screenshots are under `generated-artifacts/pixilated-audit/interaction-*.png`. The current component-width calendar result is `audit-current/interaction-calendar-mobile-results/results.json`. Screenshots actually viewed included carousel, quantity, tabs, calendar/day mode, credential validation, modal/account layers, picker error/retry, plus 320–430px field/selection samples.

### Families reviewed

| Family | Interaction review |
|---|---|
| Buttons, fields, access gateway | Source review; quantity/mobile fixture checks; password reveal preserves focus/value/selection, repeat-remasks; invalid credential submit focuses the first invalid field and exposes a linked error in the live fixture. |
| Selection and picker | Checkbox/switch fixture behavior checked; picker no-results recovery, arrow roving, selection summary and retry event exercised. **`INT-001`:** async non-ready state hides the focused option without moving focus; state lacks live semantics. |
| Navigation and account settings | Live fixture verified RTL tab selection/focus/one visible panel; dialog modal naming, inert background, focus wrap, Escape and restore; two-view account dialog naming/focus and close restoration. |
| Carousel and info strip | Source/spec review and lifecycle harness. Carousel keyboard, RTL direction, controls, dot mode, expansion, mouse-pointer drag, disconnect/re-init were exercised. No autoplay assumption. |
| Order schedule | Root-width/focus/data-equivalence component fixture checks above; no defect claimed. |
| Messages, organization, data, metric comparison | Source/spec review only for this interaction workstream; no direct state injection or assistive-technology test claimed. |

## Finding

### `INT-001` — Picker async state hides the focused option without a stable focus or announcement target

- **Skill:** `interaction-designer-agent`, informed by `ux-researcher-agent` state/next-step checks.
- **Category / severity / status:** Asynchronous selection state; keyboard continuity and status feedback / **P2 (moderate)** / **CONFIRMED** for the reproduced focus loss and DOM structure. Downstream screen-reader impact is likely but not tested.
- **Source:** `components/selection/picker.js:93-114,126-149,243-260`; component contract `components/selection/specification.md:23-30`.
- **Evidence:** On the live local fixture, focus a visible `[role=option]`, then call the documented public API `MicroPicker.setStatus(picker, 'error', message)`. `applyState()` hides the options; Chromium moves `document.activeElement` to `body`. The visible retry button still works and dispatches one `micro-picker:retry`, so this is a continuity/announcement defect rather than a broken retry handler. The generated `.m-picker__state` is a generic node inside `[role=listbox]`, with no `role=status`, `role=alert`, or `aria-live`. The result repeated at 320, 360, 390 and 430px; browser runtime errors were zero. Evidence: `interaction-browser-results.json` and the actually viewed `interaction-360-picker-error-layer.png`.
- **Root cause:** The status transition hides the currently focused option and returns without transferring focus. The shared state row is inserted as a child of the listbox and has no live announcement semantics.
- **Impact:** A keyboard user can lose their place during a declared loading/error/empty transition and receive no reliable announcement of the new state. They may need to restart navigation before reaching the retry action. This is conditional on an adopter using the documented asynchronous picker API; no production consumer or actual user consequence is known.
- **Current patch:** None; audit-only. Existing status messages, stale-option hiding, visible retry control, and one-event retry behavior are valuable and should be retained.
- **Future state:** Keep the listbox subtree for options/option groups. Put loading/empty/error feedback in an adjacent persistent live-status region, and put the retry button outside the listbox. When a transition would hide the focused option, move focus to a visible, stable control inside the picker (normally its search field); do not steal focus if it is outside the picker or already on a visible control. Keep selected value/query consistency and the consumer-owned data/network contract.
- **Recommendation / change type:** Targeted component behavior/markup patch with a small status/focus policy decision; not a broad picker redesign.
- **Risk:** Moving focus on every async response could be disruptive. Transfer focus only when the currently focused target is about to become hidden. Use polite announcements for routine loading/empty states; select a more assertive error announcement only if the owner considers the failure urgent.
- **Acceptance tests:** (1) Starting on an option, each loading/error/empty transition leaves focus on a visible picker control rather than body/hidden content. (2) An update initiated while focus is outside the picker does not steal focus. (3) Status text is exposed by a live region; listbox descendants are valid option/group content. (4) Retry remains keyboard reachable and Enter/Space emits exactly one event. (5) Ready recovery preserves current query/valid selection and announces no stale options. (6) Repeat under RTL at 320/360/390/430px and inside the real layer. Add a manual screen-reader pass for the owner-selected supported browser/AT pair before any conformance claim.
- **Owner decision:** What announcement urgency should async picker errors use—polite status (recommended unless the error blocks the immediate task), alert semantics, or a caller-configurable mode? This does not block the local behavior fix, but it blocks the final message-priority contract.

## Future direction and prioritization

1. **Patch the picker state transition** with the bounded focus/live-region policy above (P2).
2. **Keep lifecycle API standardization with `SYS-DS-004`** rather than making a duplicate interaction finding. This workstream exercised disconnect/re-init where supported; an across-family lifecycle decision remains a design-system question, not a proven failure of the tested static fixtures.
3. **Keep the calendar behavior as currently specified/tested.** The 360px *root* threshold and focus-preserving day fallback pass; do not weaken target rules or report a calendar bug based only on source arithmetic.
4. **Coordinate carousel default with `VISUAL-02`.** Interaction checks show working arrows/status/keyboard and non-autoplay behavior; they do not resolve whether focused or browse/peek presentation should be the default. That is a visual/component product-direction decision, not an interaction failure found here.

## Method, skill ledger and limitations

- **Interaction Designer:** Applied trigger → rule → feedback loops, choices, navigation, recovery, and repeated-state behavior; Saffer-style feedback/state thinking and NN/g consistency, visibility/status, user control and recovery heuristics. Source and browser behavior were inspected; no UX metric claim is made.
- **UX Researcher:** Applied the Main Job / Moment frame, heuristic evaluation, and evidence-level boundaries. The only job is a low-confidence design-system-author hypothesis; no personas, interviews, survey, analytics, workflow frequency, or product-success claim is present.
- **UX Manager:** Applied Apple craft, Google scale/consistency, and IBM workflow/recovery lenses as described in the kit skill—not as a claim that external vendor guidelines or their products were independently researched. The local interaction track verdict is **ACCEPT WITH CHANGES** for `INT-001`; it is not product readiness or accessibility certification.
- **Not tested:** Physical devices/real touch; Safari/WebKit; actual screen readers/AT; formal WCAG audit; human usability or task time; production, real user, persona or analytics data; consumer integrations; untested family-specific toast/organization/data transitions. Keyboard and focus checks are Chromium-only.
- **External references:** None. External URLs and consumer repositories were out of scope. The additional local JTBD reference read for the Researcher skill is listed in its individual report.

## Evidence paths and skill reports

- Browser results/script: `audit-current/interaction-browser-results.json`, `audit-current/interaction-browser-audit.py`.
- Lifecycle, mobile, and schedule outputs: `audit-current/interaction-lifecycle-results/results.json`, `audit-current/interaction-calendar-mobile-results/results.json`, `generated-artifacts/pixilated-audit/interaction-mobile-fixture/verification.json`.
- **Picker evidence:** `generated-artifacts/pixilated-audit/interaction-360-picker-error-layer.png` (viewed); broader crops are listed in the browser script/results.
- Skill-specific records: `audit-current/skill-reports/interaction-designer-agent.md`, `audit-current/skill-reports/ux-researcher-agent.md`, and `audit-current/skill-reports/ux-manager.md`.
