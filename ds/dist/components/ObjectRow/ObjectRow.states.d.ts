/**
 * ObjectRow.states.ts — applicable states from BRIEF 9.0 + 23.4.
 *
 * The row is pressable with the row-inset press treatment (23.2 pressed
 * inset 8); the visual axes are line count (one vs two) and the end
 * column's second line (time vs badge).
 */
export declare const ObjectRowStates: readonly ["default", "oneLine", "withBadge", "pressed", "landed", "focused", "disabled"];
export type ObjectRowStateId = (typeof ObjectRowStates)[number];
