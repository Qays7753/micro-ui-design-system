/**
 * MonthGrid.states.ts — applicable states from BRIEF 9.0 + BATCH2-SPECS
 * §3.5.
 *
 * the spec's data (11/2026, today 27, selected 30), a day with items,
 * the today ring, min/max-disabled days, the range draft's three stages
 * (start, growing, complete), the view mode, and the month swap.
 */
export const MonthGridStates = [
  'default',
  'month-data',
  'today-ring',
  'items-dots',
  'day-disabled',
  'range-start',
  'range-growing',
  'range-complete',
  'view-mode',
  'month-swap',
] as const;

export type MonthGridStateId = (typeof MonthGridStates)[number];
