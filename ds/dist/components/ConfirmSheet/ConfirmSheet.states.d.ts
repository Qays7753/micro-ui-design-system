/**
 * ConfirmSheet.states.ts — applicable states from BRIEF 9.0 + 1284.
 *
 * The alert dialog itself is momentary; the axes are focus (on رجوع per
 * 1284) and the destructive press.
 */
export declare const ConfirmSheetStates: readonly ["default", "focused", "pressed"];
export type ConfirmSheetStateId = (typeof ConfirmSheetStates)[number];
