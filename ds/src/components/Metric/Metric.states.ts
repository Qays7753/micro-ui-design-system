/**
 * Metric.states.ts — applicable states from BRIEF 9.0 + 9.3 + 23.8.
 *
 * Value shape (plain / cents / missing) and loading (skeleton, never
 * zero); the diff line exists only with a comparison.
 */
export const MetricStates = [
  'default',
  'withCents',
  'missing',
  'loading',
  'noDiff',
] as const;

export type MetricStateId = (typeof MetricStates)[number];
