/**
 * JobTrack.states.ts — the component's axis (BATCH2-SPECS §4.3): the
 * running stage, and a «تعذّر» problem stage.
 */
export declare const JobTrackStates: readonly ["running", "problem"];
export type JobTrackStateId = (typeof JobTrackStates)[number];
