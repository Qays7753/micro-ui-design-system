/**
 * Radio.states.ts — applicable states from BRIEF 9.0 + ADDENDUM §3.2.
 *
 * selected/pressed/focused/disabled are the interaction states; error is
 * the nothing-chosen submit state. The availability triple (§2.5) rides the
 * lab garden.
 */
export const RadioStates = [
  'default',
  'selected',
  'pressed',
  'focused',
  'disabled',
  'error',
] as const;

export type RadioStateId = (typeof RadioStates)[number];
