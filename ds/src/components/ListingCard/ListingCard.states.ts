/**
 * ListingCard.states.ts — the component's axis (BATCH2-SPECS §5.1):
 * photo, small photo, no photo, tiers, unavailable, locked, loading.
 */
export const ListingCardStates = [
  'photo',
  'smallPhoto',
  'noPhoto',
  'tiers',
  'unavailable',
  'locked',
  'loading',
] as const;

export type ListingCardStateId = (typeof ListingCardStates)[number];
