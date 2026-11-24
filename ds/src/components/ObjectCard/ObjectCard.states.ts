/**
 * ObjectCard.states.ts — applicable states from BRIEF 9.0 + 23.24.
 *
 * The card is pressable (scale .98 + surface-pressed, 23.24 press table)
 * with a badge axis and a next-step-button axis.
 */
export const ObjectCardStates = [
  'default',
  'withBadge',
  'withButton',
  'pressed',
  'focused',
  'disabled',
] as const;

export type ObjectCardStateId = (typeof ObjectCardStates)[number];
