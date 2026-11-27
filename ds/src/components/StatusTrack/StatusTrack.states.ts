/**
 * StatusTrack.states.ts — the component's axis (BATCH2-SPECS §1.17):
 * early, mid, last, and a problem current step.
 */
export const StatusTrackStates = ['early', 'mid', 'last', 'problem'] as const;

export type StatusTrackStateId = (typeof StatusTrackStates)[number];
