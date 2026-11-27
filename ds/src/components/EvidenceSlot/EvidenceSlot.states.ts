/**
 * EvidenceSlot.states.ts — the component's axis (BATCH2-SPECS §4.6):
 * photo empty/taken, code (with error), owner, read-only, loading.
 */
export const EvidenceSlotStates = [
  'photoEmpty',
  'photoTaken',
  'code',
  'codeError',
  'owner',
  'readOnly',
  'loading',
] as const;

export type EvidenceSlotStateId = (typeof EvidenceSlotStates)[number];
