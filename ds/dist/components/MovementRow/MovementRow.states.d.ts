/**
 * MovementRow.states.ts — the component's axis (BATCH2-SPECS §2.1):
 * both directions, the draft badge, the hidden-amounts view and the
 * loading skeleton.
 */
export declare const MovementRowStates: readonly ["in", "out", "draft", "hidden", "loading"];
export type MovementRowStateId = (typeof MovementRowStates)[number];
