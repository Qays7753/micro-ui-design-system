/**
 * DriverApprovalStatus.states.ts — the component's axis (BATCH2-SPECS
 * §4.9): waiting, approved, rejected with reason.
 */
export const DriverApprovalStatusStates = ['waiting', 'approved', 'rejected'] as const;

export type DriverApprovalStatusStateId = (typeof DriverApprovalStatusStates)[number];
