/**
 * DateQuickChips.states.ts — applicable states from BRIEF 9.0 +
 * BATCH2-SPECS §1.8.
 *
 * selected is the interaction state; nothing-chosen (default) and the
 * save-time error come from the app; custom-date is the trailing chip
 * carrying a picked date; disabled dims the whole row.
 */
export declare const DateQuickChipsStates: readonly ["default", "selected", "custom-date", "pressed", "disabled", "error"];
export type DateQuickChipsStateId = (typeof DateQuickChipsStates)[number];
