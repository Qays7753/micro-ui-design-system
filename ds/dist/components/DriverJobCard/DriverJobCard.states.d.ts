/**
 * DriverJobCard.states.ts — the component's axis (BATCH2-SPECS §4.8):
 * quoting, active with evidence, blocked, awaiting owner, loading.
 */
export declare const DriverJobCardStates: readonly ["quoting", "active", "blocked", "awaitingOwner", "loading"];
export type DriverJobCardStateId = (typeof DriverJobCardStates)[number];
