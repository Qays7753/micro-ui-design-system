# UX Manager — interaction track decision report

**Track verdict:** **ACCEPT WITH CHANGES** for the tested interaction surface only.
**Finding count:** 1 new interaction finding, `INT-001` (same root cause repeated at four widths). This does not sign off the complete design system, any product, or accessibility conformance.

## Manager methodology applied

I read `_audit-resources/pixilated-ux-ui-skills-kit/ux-manager/SKILL.md` in full. Its three review lenses were applied as principles:

- **Apple craft:** preserve focus, clear control feedback, and low-friction reversible actions. The password reveal correctly keeps focus/value/selection; dialog close restores focus. Picker status recovery currently drops the user's focus, so it falls short at one transition.
- **Google system scale:** expect state and lifecycle contracts to remain predictable across families/variants. Parent finding `SYS-DS-004` already covers broad family lifecycle inconsistency; this report does not duplicate it. Picker's own declared async states still need a focus/announcement rule.
- **IBM workflow reliability:** after an error, the next action must be discoverable and operable. The picker retry works once but its preceding state update can strand keyboard focus.

These are the local kit's lenses; I did not independently inspect Apple's, Google's or IBM's external products/guidelines. No consumer, enterprise workflow, or end-user priority was assumed.

## Finding and decision

`INT-001` is **P2 / Moderate**: in a local Chromium fixture, focusing an option and invoking the supported picker error state hides the option and moves focus to `body`. The retry remains visible and dispatches once, but the state row has no live-region semantics and is a child of `role=listbox`. Reproduced at 320/360/390/430px RTL. Four failing assertions are repetitions of this one issue; runtime errors are zero.

**Recommended owner choice:** keep option/list semantics dedicated to options, render async state feedback as an adjacent persistent live status, keep retry outside the listbox, and transfer focus to the visible search control only when an update would hide the focused option. Do not steal focus from outside the picker. Use polite announcement by default for routine updates; choose alert semantics only for a clearly urgent blocking error.

**Priority:** fix the local state/focus contract before treating the picker async flow as ready for transfer. Pair this with a real supported screen-reader/browser check once the owner has selected that target. Parent sweep remains authoritative for route breadth.

## Coverage and coordination

- The live interaction probe tested carousel, quantity, password/credential states, tabs/layers, account settings and picker across four RTL widths. Latest outcome: 84 pass, 4 repeated `INT-001` fails, 0 runtime errors.
- Component harnesses: 383/383 lifecycle checks, 55/55 order-schedule adaptation/focus checks, 52/52 mobile field/selection checks passed.
- Parent's separate default route sweep: 36 routes × four widths; 144 default cases, no document-width overflow, page errors or resource errors. Its additional modes/offscreen sample bounds are not read as default document overflow.
- Calendar has no new finding. Specification root threshold `<360px`, component-root fixtures and focus/data mapping were tested, and the narrow live sample displays day mode. Do not create a source-only calendar finding.
- `SYS-DS-004` (lifecycle API) and `VISUAL-02` (carousel visual/default presentation) are cross-references, not duplicate interaction findings. Interaction controls, keyboard direction and status passed the tested carousel paths.

## Management limitations

This is an expert evaluation plus local automated behavior testing, not user research. No personas, task frequency, product journey, production conditions, analytics, real network, physical device, real touch, screen-reader behavior, Safari/WebKit, or formal WCAG conformance was established. Messages, organization and data transitions received source review only in this track.
