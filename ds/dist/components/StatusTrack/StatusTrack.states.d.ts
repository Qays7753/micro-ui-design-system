/**
 * StatusTrack.states.ts — the component's axis (BATCH2-SPECS §1.17):
 * early, mid, last, and a problem current step.
 */
export declare const StatusTrackStates: readonly ["early", "mid", "last", "problem"];
export type StatusTrackStateId = (typeof StatusTrackStates)[number];
