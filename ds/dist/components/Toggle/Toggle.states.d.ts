/**
 * Toggle.states.ts — applicable states from BRIEF 9.0 + ADDENDUM §1.7.
 *
 * selected/pressed/focused/disabled are the interaction states. The
 * grayscale-readability of the state rides the thumb position + the check
 * mark (ق3 — judged by eye in the audit).
 */
export declare const ToggleStates: readonly ["default", "selected", "pressed", "focused", "disabled"];
export type ToggleStateId = (typeof ToggleStates)[number];
