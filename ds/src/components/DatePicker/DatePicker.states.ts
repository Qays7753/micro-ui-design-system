/**
 * DatePicker.states.ts — applicable states from BRIEF 9.0 + ADDENDUM
 * §3.4.
 *
 * empty (no text, the icon stays), chosen, the optional clear, the sheet
 * open with its month grid, the month stepped, days disabled at the
 * bounds, the error line, and disabled.
 */
export const DatePickerStates = [
  'default',
  'empty',
  'chosen',
  'optional-clear',
  'sheet-open',
  'month-stepped',
  'day-disabled',
  'error',
  'disabled',
] as const;

export type DatePickerStateId = (typeof DatePickerStates)[number];
