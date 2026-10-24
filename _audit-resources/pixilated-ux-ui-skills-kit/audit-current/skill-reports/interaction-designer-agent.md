# Interaction Designer — skill application report

**Audit finding:** `INT-001` (one finding; four viewport repetitions of the same behavior, not four findings).  
**Verdict:** Interaction pathways exercised in the current UI-system fixtures are mostly coherent. Fix the picker asynchronous state transition before claiming a complete keyboard-recovery contract. This is not a product-readiness verdict.

## Skill methodology applied

I read `_audit-resources/pixilated-ux-ui-skills-kit/interaction-designer-agent/SKILL.md` in full. The skill's **flow integrity, clear choices, interaction loops, feedback, navigation patterns, states, forms, error recovery, keyboard behavior, and motion/state** thinking was applied directly to source and a local live fixture. I framed interaction changes as trigger → rule → feedback: keyboard, pointer, or state API triggers; explicit component rules; then observable focus/selected/status/retry feedback. I used the skill's microinteraction, gesture and navigation guidance; I did not infer a product journey or use outside research.

No separate reference files were read for this skill. Relevant local source/specification paths:

- `components/selection/picker.js`, `components/selection/specification.md`
- `components/selection/selection.js`
- `components/fields/fields.js`
- `components/access-gateway/access-gateway.js`
- `components/buttons/buttons.js`
- `components/navigation/navigation.js`
- `components/account-settings/account-settings.js`
- `components/carousel/carousel.js`, `components/carousel/carousel.css`, `components/carousel/specification.md`
- `components/info-strip/info-strip.js`, `components/info-strip/info-strip-peek.js`, `components/info-strip/specification.md`
- `components/order-schedule/order-schedule.js`, `components/order-schedule/specification.md`
- `components/messages/messages.js`, `components/organization/organization.js`, `components/data/data.js`
- `previews/ui-system-showcase/index.html`, `previews/ui-system-showcase/showcase.js`

## Applied interaction lenses

- **Choices:** Tabs keep selected/focus/visible panel aligned; picker supports query, no-results recovery, selection summary and option roving; access form reports invalid credentials to the first invalid input. I did not infer the desired product choices beyond the fixture.
- **Feedback:** Layer and account view transitions update focus and dialog names; password reveal retains input focus/value/selection and repeat-remasks; picker retry remains visible and emits once. The async picker error is the exception: it removes the currently focused option from the visible set, drops focus to `body`, and provides no explicit live status semantics.
- **Navigation:** RTL tab keys, carousel direction, page controls, modal focus containment/Escape/restore, account settings view-switch focus, and picker arrow movement were exercised.
- **Gestures and motion:** Carousel keyboard and mouse-pointer path were checked; documentation/source supports explicit pointer gestures and reduced motion. No physical touch/sensor or real device was used.
- **State coverage:** Active, empty/no-results, selected, error, disabled, password reveal/hide, validation, dialog open/close, and calendar narrow/wide states were checked where listed below. No untested family is represented as fully verified.

## Tests and evidence

- `audit-current/interaction-browser-audit.py` on the already-running local `previews/ui-system-showcase/index.html`: 84 assertions passed; 4 failed; zero runtime errors. The 4 failures are one repeated `INT-001` at widths 320/360/390/430px, RTL. Exercised carousel arrow/keyboard/dots/disclosure/RTL pointer drag, quantity, password reveal/validation, tabs, modal focus/inert/restore, account view changes, picker search/recovery/selection and retry.
- `tools/complete-repair-lifecycle-check.py`: 383/383 pass. Bounded Chromium fixture, including RTL/LTR, editing targets, inactive-slide focus, resize, disconnect and re-init cases in the checked families.
- `tools/complete-repair-mobile-check.py`: 55/55 pass. Order-schedule component-root adaptation and preservation checks; see no-calendar-finding calibration below.
- `tools/component-mobile-check.py`: 52/52 pass for mobile fields, quantity, selection, switch and simulated text-size/geometry cases.
- Viewed evidence: picker error layer, credential error state, account application layer, central dialog, carousel, tabs, quantity, narrow calendar/day mode and 320/360/390/430 field/selection samples under `generated-artifacts/pixilated-audit/`.

**Calendar calibration:** `components/order-schedule/specification.md:101` makes the behavior depend on actual root inline size `<360px`; `tools/complete-repair-mobile-check.py:190-288` sets root widths and checks day/month choice, focus/date/order identity and resize transitions. All 55 checks passed. The live showcase at 360px renders the narrow day-mode calendar because its component root is narrower than the viewport. There is **no calendar finding** in this report.

## Finding count and limitations

**New interaction findings: 1 — `INT-001`.** Four failed browser assertions repeat the same focus/feedback defect; they do not represent four root causes. Broad lifecycle consistency is already tracked by parent finding `SYS-DS-004`; it is cross-referenced rather than duplicated here. The visual carousel default/peek question in `VISUAL-02` is likewise not duplicated; navigation controls/keyboard worked in my tests.

`INT-001` is a confirmed Chromium focus loss after a supported `MicroPicker.setStatus(..., 'error', ...)` call. The retry stays visible and dispatches once. The status row is inside the listbox and has no status/live role; screen-reader behavior is a likely risk, not a tested result.

No physical mobile devices, real touch, screen reader, Safari/WebKit, formal WCAG assessment, real-world interactions or consumer integration was tested. Some families are source-only for this skill (messages, organization, data). All content/network inputs were fixture-controlled. No external URL or external design guidelines were consulted.
