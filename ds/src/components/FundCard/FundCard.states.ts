/**
 * FundCard.states.ts — the component's axis (BATCH2-SPECS §2.3): the
 * three fund types, the negative balance, the draft dot and loading.
 */
export const FundCardStates = [
  'cash',
  'bank',
  'wallet',
  'negative',
  'draft',
  'loading',
] as const;

export type FundCardStateId = (typeof FundCardStates)[number];
