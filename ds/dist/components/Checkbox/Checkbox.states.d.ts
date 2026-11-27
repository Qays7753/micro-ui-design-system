/**
 * Checkbox.states.ts — applicable states from BRIEF 9.0 + ADDENDUM §3.1.
 *
 * selected/pressed/focused/disabled are the interaction states; error is
 * the mandatory-unticked submit state. The lab never renders a permanently
 * disabled row (ds-states presses every visible button) — the gate
 * exercises the disabled look by flipping the native property.
 */
export declare const CheckboxStates: readonly ["default", "selected", "pressed", "focused", "disabled", "error"];
export type CheckboxStateId = (typeof CheckboxStates)[number];
