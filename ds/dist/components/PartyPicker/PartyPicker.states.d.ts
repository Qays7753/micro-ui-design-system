/**
 * PartyPicker.states.ts — applicable states from BRIEF 9.0 + BATCH2-SPECS
 * §1.10.
 *
 * empty (nothing chosen), chosen, the sheet open with its focused
 * search, the rows list, the add row (no exact match), the selected row,
 * the empty list, the loading skeletons, the error line, and disabled.
 */
export declare const PartyPickerStates: readonly ["default", "empty", "chosen", "sheet-open", "search-filtering", "add-row", "row-selected", "list-empty", "loading", "error", "disabled"];
export type PartyPickerStateId = (typeof PartyPickerStates)[number];
