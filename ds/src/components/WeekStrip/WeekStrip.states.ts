/**
 * WeekStrip.states.ts — the component's axis (BATCH2-SPECS §3.2): the
 * plain week, today+selected, the dots (1..3 and 4+), and loading.
 */
export const WeekStripStates = [
  'plain',
  'todaySelected',
  'dots',
  'loading',
] as const;

export type WeekStripStateId = (typeof WeekStripStates)[number];
