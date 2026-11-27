/**
 * DeliveryRequestCard.states.ts — the component's axis (BATCH2-SPECS
 * §4.1): new with quotes to review, assigned, plain (no decision), loading.
 */
export const DeliveryRequestCardStates = [
  'needsDecision',
  'assigned',
  'plain',
  'loading',
] as const;

export type DeliveryRequestCardStateId = (typeof DeliveryRequestCardStates)[number];
