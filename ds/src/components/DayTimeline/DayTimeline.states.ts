/**
 * DayTimeline.states.ts — the component's axis (BATCH2-SPECS §3.3): a
 * duration block, a moment chip, overlaps, the now line, empty, loading.
 */
export const DayTimelineStates = [
  'duration',
  'moment',
  'overlap',
  'nowLine',
  'empty',
  'loading',
] as const;

export type DayTimelineStateId = (typeof DayTimelineStates)[number];
