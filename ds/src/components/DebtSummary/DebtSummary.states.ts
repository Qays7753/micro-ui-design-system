/**
 * DebtSummary.states.ts — the component's axis (BATCH2-SPECS §2.5): the
 * two-column view, the zero case, the wrapped rows for a long number,
 * hidden amounts and loading.
 */
export const DebtSummaryStates = [
  'columns',
  'zero',
  'wrapped',
  'hidden',
  'loading',
] as const;

export type DebtSummaryStateId = (typeof DebtSummaryStates)[number];
