/**
 * AmountField.states.ts — applicable states from BRIEF 9.0 + ADDENDUM §1.3.
 *
 * focused/disabled are the interaction states; error carries the two
 * solution texts; long shows the one-step number-lg drop (ADDENDUM 2.1);
 * hidden is NOT applicable — the writer's own digits stay visible while
 * typing (23.22).
 */
export const AmountFieldStates = [
  'default',
  'focused',
  'error',
  'disabled',
  'long',
] as const;

export type AmountFieldStateId = (typeof AmountFieldStates)[number];
