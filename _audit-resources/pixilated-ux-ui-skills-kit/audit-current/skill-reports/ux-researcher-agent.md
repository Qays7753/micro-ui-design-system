# UX Researcher — skill application report

**Audit finding:** `INT-001` (one confirmed component-state finding).  
**Research verdict:** This repo supports a bounded expert inspection and automated behavior probe, not claims about a product user, consumer audience, or real workflow.

## Skill methodology and references read

I read `_audit-resources/pixilated-ux-ui-skills-kit/ux-researcher-agent/SKILL.md` in full and read `_audit-resources/pixilated-ux-ui-skills-kit/ux-researcher-agent/references/jtbd.md`. The skill's Main Job / Moment frame, heuristic evaluation, evidence-strength labeling, and explicit separation of observed behavior from hypotheses guided the audit. The interaction issue comes from a documented component API plus browser reproduction; it is not user-research evidence.

## Main Job / Moment — repository-grounded hypothesis only

**Hypothesis:** When a design-system author reviews or composes a local component fixture, they need keyboard behavior, state feedback, and recovery to remain predictable so they can judge the reusable contract.

This is scoped to the repo's design-system work and audit task. It is **not validated** by user interviews, surveys, sessions, analytics, or a known future consumer application. The showcase footer itself identifies it as a component demo with local deterministic fixture data (`previews/ui-system-showcase/index.html:1152-1155`). No person or production audience is inferred.

| Moment test | Evidence-bounded answer |
|---|---|
| Arrival | The fixture provides labeled tabs, components and visible state controls; whether this matches a real adopter's first-use need is unknown. |
| Time | Task time, frequency, and efficiency are **NOT PROVABLE**; no timing study or representative task was supplied. |
| State | Most tested actions expose focus or visible state. On the picker async error transition, a focused option is hidden and browser focus falls to body. This is a measured component behavior, not proof of a person's consequence. |
| Next step | The retry remains visible and emits its consumer event once, but the lost focus and lack of live-region semantics can make it harder to find. No actual consumer retry loop or network was tested. |
| Forces | Real-world alternatives, habits, push/pull forces, emotional stakes, device contexts and adoption criteria are **NOT PROVABLE**. |

**Functional job candidate:** maintain a usable component interaction while state changes.  
**Emotional/social job:** unknown.  
**Desired outcomes (research hypotheses only):** keep the current focus discoverable during state changes; expose the updated status without requiring visual inference; make the recovery action findable and operable. These are measurable acceptance criteria, not reported user preferences.

### Hypothetical job map (design-system author, not external users)

1. Select a candidate component or pattern in a local inventory.
2. Prepare a representative state fixture.
3. Check the current value and available action before interaction.
4. Trigger with keyboard or pointer.
5. Observe focus, selection, disabled/loading/error and result feedback.
6. Recover from an empty or error state.
7. Compare RTL/LTR and narrow/wide component behavior.
8. Decide whether the contract is reusable or needs revision.

This is an analyst's test sequence; actual author/consumer behavior is not established.

## Research methods, evidence and finding

- **Method:** expert heuristic inspection informed by the skill's NN/g guidance, plus a local Playwright/Chromium component-state probe. The tests cover visibility/status, user control, consistency, focus, and recovery. This is not a formal WCAG audit.
- **Observed finding:** `INT-001` reproduces at four widths: focusing a picker option, then invoking its supported non-ready error state hides the option and puts focus on `body`. The error text/retry are visible; retry emits one event. DOM inspection shows a generic state child inside the listbox and no `role=status`, `role=alert`, or `aria-live`.
- **Other evidence:** password reveal retains selection and focus; invalid credential feedback is linked and focuses first invalid; dialog/account close paths restore focus; picker search/selection updates its summary. 84 live-showcase assertions passed and the 4 failures repeat the one picker issue. Other bounded component checks passed: 383 lifecycle, 55 order-schedule, and 52 mobile assertions.
- **Researcher's confidence:** high for the reproduced browser focus transition; medium for likely assistive-technology consequences; very low/no evidence for importance or real-world frequency.

## Sources, outputs and limitations

Relevant product-local sources: `components/selection/picker.js:93-114,126-149,243-260`; `components/selection/specification.md:23-30`; showcase fixture `previews/ui-system-showcase/index.html:1152-1155`. Full output is `audit-current/interaction-browser-results.json`; viewed local image: `generated-artifacts/pixilated-audit/interaction-360-picker-error-layer.png`.

No user, persona, analytics, production data, external consumer, external URL, or competitive product was contacted or used. No preference or task-time claim was made. No real device/touch, AT/screen-reader, Safari/WebKit, or full WCAG conformance was tested. Calendar behavior is not a finding: root-width mode, focus mapping and data preservation passed the dedicated 55-check component test; do not infer a failure from source-only arithmetic.
