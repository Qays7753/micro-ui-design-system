/**
 * DebtCard.states.ts — the component's axis (BATCH2-SPECS §2.4): owed to
 * you vs you owe, overdue, settled, partial progress, hidden and loading.
 */
export const DebtCardStates = [
  'forYou',
  'againstYou',
  'overdue',
  'settled',
  'hidden',
  'loading',
] as const;

export type DebtCardStateId = (typeof DebtCardStates)[number];
