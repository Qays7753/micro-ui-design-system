/**
 * ReportSheet.states.ts — the component's axis (BATCH2-SPECS §5.5):
 * idle, a reason chosen, the no-reason error.
 */
export declare const ReportSheetStates: readonly ["idle", "chosen", "error"];
export type ReportSheetStateId = (typeof ReportSheetStates)[number];
