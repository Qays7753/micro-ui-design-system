/**
 * Well.states.ts — applicable states from BRIEF 9.0 + 9.2.
 *
 * The Well is a passive inset: no interaction states of its own (23.21
 * bans buttons and pressable rows inside it), no selection, no data
 * states. The only lab axis is the composition with its parent Surface.
 */
export const WellStates = [
  'default',
  'inSurface',
] as const;

export type WellStateId = (typeof WellStates)[number];
