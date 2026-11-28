/**
 * MovementTypeControl.states.ts — applicable states from BRIEF 9.0 +
 * BATCH2-SPECS §1.5.
 *
 * selected is the interaction state; nothing-chosen (default) and the
 * save-time error come from the app; disabled dims the whole control.
 */
export const MovementTypeControlStates = [
  'default',
  'selected',
  'pressed',
  'disabled',
  'error',
] as const;

export type MovementTypeControlStateId = (typeof MovementTypeControlStates)[number];
