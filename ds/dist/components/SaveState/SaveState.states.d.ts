/**
 * SaveState.states.ts — the four states from BRIEF 9.4 row (656).
 */
export declare const SaveStateStates: readonly ["draft", "sending", "saved", "failed"];
export type SaveStateStateId = (typeof SaveStateStates)[number];
