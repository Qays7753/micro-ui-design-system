/**
 * ListingStatusBadge.states.ts — the component's axis (BATCH2-SPECS
 * §5.7): waiting, done, rejected with reason.
 */
export const ListingStatusBadgeStates = ['waiting', 'done', 'rejected'] as const;

export type ListingStatusBadgeStateId = (typeof ListingStatusBadgeStates)[number];
