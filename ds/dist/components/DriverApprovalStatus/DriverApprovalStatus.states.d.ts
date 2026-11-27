/**
 * DriverApprovalStatus.states.ts — the component's axis (BATCH2-SPECS
 * §4.9): waiting, approved, rejected with reason.
 */
export declare const DriverApprovalStatusStates: readonly ["waiting", "approved", "rejected"];
export type DriverApprovalStatusStateId = (typeof DriverApprovalStatusStates)[number];
