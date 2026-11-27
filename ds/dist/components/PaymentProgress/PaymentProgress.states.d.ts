/**
 * PaymentProgress.states.ts — the component's axis (BATCH2-SPECS §2.6):
 * the partial payment, the zero-paid start, the complete debt, and the
 * hidden-amounts view where bar and line give way to the hidden caption.
 */
export declare const PaymentProgressStates: readonly ["partial", "zero", "complete", "hidden"];
export type PaymentProgressStateId = (typeof PaymentProgressStates)[number];
