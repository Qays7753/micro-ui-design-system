/**
 * OrderCard.states.ts — the component's axis (BATCH2-SPECS §3.1): a
 * moment order, a duration appointment, cancelled, hidden and loading.
 */
export const OrderCardStates = [
  'moment',
  'duration',
  'cancelled',
  'hidden',
  'loading',
] as const;

export type OrderCardStateId = (typeof OrderCardStates)[number];
