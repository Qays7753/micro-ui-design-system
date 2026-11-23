/**
 * StatusBadge.states.ts — the badge's axis: its five tones (BRIEF 23.6, 5.2)
 * plus the tight-space case of 23.20 (a long word truncates at 160).
 *
 * The badge appears only when the state needs attention or differs from the
 * expected one (23.6) — the lab renders all five tones and the truncation.
 */
export const StatusBadgeStates = [
  'neutral',
  'info',
  'done',
  'waiting',
  'problem',
  'longLabel',
] as const;

export type StatusBadgeStateId = (typeof StatusBadgeStates)[number];
