/**
 * EvidenceSlot.states.ts — the component's axis (BATCH2-SPECS §4.6):
 * photo empty/taken, code (with error), owner, read-only, loading.
 */
export declare const EvidenceSlotStates: readonly ["photoEmpty", "photoTaken", "code", "codeError", "owner", "readOnly", "loading"];
export type EvidenceSlotStateId = (typeof EvidenceSlotStates)[number];
