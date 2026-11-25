/**
 * SaveState.states.ts — the four states from BRIEF 9.4 row (656).
 */
export const SaveStateStates = [
  'draft',
  'sending',
  'saved',
  'failed',
] as const;

export type SaveStateStateId = (typeof SaveStateStates)[number];
