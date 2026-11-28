/**
 * TimePicker.states.ts — applicable states from BRIEF 9.0 + BATCH2-SPECS
 * §1.9 + ADDENDUM §2.4.
 *
 * empty (no value — the field carries the icon alone), chosen, the sheet
 * open with its draft, and the disabled/error states from the app.
 */
export declare const TimePickerStates: readonly ["default", "empty", "chosen", "pressed", "sheet-open", "disabled", "error"];
export type TimePickerStateId = (typeof TimePickerStates)[number];
