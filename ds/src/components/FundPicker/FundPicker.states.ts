/**
 * FundPicker.states.ts — applicable states from BRIEF 9.0 + ADDENDUM
 * §3.5.
 *
 * the single-fund row, the 2-4 chips (selected, disabled transfer chip),
 * the 5+ field with its sheet, the negative balance, the no-choice
 * error, and disabled.
 */
export const FundPickerStates = [
  'default',
  'single-fund',
  'chips-selected',
  'chips-disabled-transfer',
  'field-open-sheet',
  'negative-balance',
  'no-choice-error',
  'disabled',
] as const;

export type FundPickerStateId = (typeof FundPickerStates)[number];
