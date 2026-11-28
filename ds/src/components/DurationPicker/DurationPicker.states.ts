/**
 * DurationPicker.states.ts — applicable states from BRIEF 9.0 +
 * BATCH2-SPECS-ADDENDUM §3.3.
 *
 * empty (no value), chosen, the sheet open with its draft, the stepper
 * typing, and disabled (the app hides the field entirely before a time —
 * criterion 2's wiring).
 */
export const DurationPickerStates = [
  'default',
  'empty',
  'chosen',
  'pressed',
  'sheet-open',
  'stepper-typing',
  'disabled',
] as const;

export type DurationPickerStateId = (typeof DurationPickerStates)[number];
