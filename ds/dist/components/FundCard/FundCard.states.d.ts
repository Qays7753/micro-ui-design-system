/**
 * FundCard.states.ts — the component's axis (BATCH2-SPECS §2.3): the
 * three fund types, the negative balance, the draft dot and loading.
 */
export declare const FundCardStates: readonly ["cash", "bank", "wallet", "negative", "draft", "loading"];
export type FundCardStateId = (typeof FundCardStates)[number];
