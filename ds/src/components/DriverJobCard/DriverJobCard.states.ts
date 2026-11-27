/**
 * DriverJobCard.states.ts — the component's axis (BATCH2-SPECS §4.8):
 * quoting, active with evidence, blocked, awaiting owner, loading.
 */
export const DriverJobCardStates = [
  'quoting',
  'active',
  'blocked',
  'awaitingOwner',
  'loading',
] as const;

export type DriverJobCardStateId = (typeof DriverJobCardStates)[number];
