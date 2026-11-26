/**
 * Sheet.states.ts — applicable states from BRIEF 9.0 + 23.11 + 23.15.
 *
 * A sheet is open or closed (the caller owns the state); the motion axes
 * are drag position (following / past threshold / released back) and the
 * two stacking levels.
 */
export declare const SheetStates: readonly ["default", "open", "dragging", "pastThreshold", "stacked"];
export type SheetStateId = (typeof SheetStates)[number];
