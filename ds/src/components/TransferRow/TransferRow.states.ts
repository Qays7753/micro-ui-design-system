/**
 * TransferRow.states.ts — the component's axis (BATCH2-SPECS §2.2):
 * the default transfer, the missing caption fallback, hidden amounts,
 * and the loading skeleton.
 */
export const TransferRowStates = [
  'default',
  'noCaption',
  'hidden',
  'loading',
] as const;

export type TransferRowStateId = (typeof TransferRowStates)[number];
