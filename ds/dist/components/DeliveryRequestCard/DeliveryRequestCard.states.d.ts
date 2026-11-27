/**
 * DeliveryRequestCard.states.ts — the component's axis (BATCH2-SPECS
 * §4.1): new with quotes to review, assigned, plain (no decision), loading.
 */
export declare const DeliveryRequestCardStates: readonly ["needsDecision", "assigned", "plain", "loading"];
export type DeliveryRequestCardStateId = (typeof DeliveryRequestCardStates)[number];
