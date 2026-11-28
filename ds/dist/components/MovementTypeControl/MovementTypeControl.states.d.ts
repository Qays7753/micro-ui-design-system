/**
 * MovementTypeControl.states.ts — applicable states from BRIEF 9.0 +
 * BATCH2-SPECS §1.5.
 *
 * selected is the interaction state; nothing-chosen (default) and the
 * save-time error come from the app; disabled dims the whole control.
 */
export declare const MovementTypeControlStates: readonly ["default", "selected", "pressed", "disabled", "error"];
export type MovementTypeControlStateId = (typeof MovementTypeControlStates)[number];
