/**
 * DebtCard.states.ts — the component's axis (BATCH2-SPECS §2.4): owed to
 * you vs you owe, overdue, settled, partial progress, hidden and loading.
 */
export declare const DebtCardStates: readonly ["forYou", "againstYou", "overdue", "settled", "hidden", "loading"];
export type DebtCardStateId = (typeof DebtCardStates)[number];
