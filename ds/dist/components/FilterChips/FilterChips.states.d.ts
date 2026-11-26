/**
 * FilterChips.states.ts — applicable states from BRIEF 9.0 + 9.1.
 *
 * selected/pressed/focused/disabled are the interaction states; manyChips
 * shows the horizontal-scroll behavior (the 24px peek of the next chip,
 * 23.16). The lab never renders a permanently disabled chip row (ds-states
 * presses every visible button) — the gate exercises the disabled look by
 * flipping the native property.
 */
export declare const FilterChipsStates: readonly ["default", "selected", "pressed", "focused", "disabled", "manyChips"];
export type FilterChipsStateId = (typeof FilterChipsStates)[number];
