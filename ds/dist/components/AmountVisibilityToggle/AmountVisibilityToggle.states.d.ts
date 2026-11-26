/**
 * AmountVisibilityToggle.states.ts — applicable states from BRIEF 9.0 + 23.22.
 *
 * The visibility pair (amountsShown / amountsHidden) is the component's own
 * axis; pressed/focused/disabled are the interaction states of 9.0. A
 * permanently disabled instance is not rendered by the lab (a disabled
 * control shows no pressed feedback by definition — 23.24(15)); the ds-states
 * gate exercises the disabled look by toggling the native property.
 */
export declare const AmountVisibilityToggleStates: readonly ["default", "pressed", "focused", "disabled", "amountsShown", "amountsHidden"];
export type AmountVisibilityToggleStateId = (typeof AmountVisibilityToggleStates)[number];
