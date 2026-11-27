/**
 * OrderCard.states.ts — the component's axis (BATCH2-SPECS §3.1): a
 * moment order, a duration appointment, cancelled, hidden and loading.
 */
export declare const OrderCardStates: readonly ["moment", "duration", "cancelled", "hidden", "loading"];
export type OrderCardStateId = (typeof OrderCardStates)[number];
