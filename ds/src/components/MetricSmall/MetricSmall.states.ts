/**
 * MetricSmall.states.ts — same axes as Metric (BRIEF 9.3: نفس التشريح).
 */
export const MetricSmallStates = [
  'default',
  'withCents',
  'missing',
  'loading',
  'noDiff',
] as const;

export type MetricSmallStateId = (typeof MetricSmallStates)[number];
