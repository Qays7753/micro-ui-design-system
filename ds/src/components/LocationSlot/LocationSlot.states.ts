/**
 * LocationSlot.states.ts — the component's axis (BATCH2-SPECS §4.7):
 * origin, destination, empty.
 */
export const LocationSlotStates = ['origin', 'destination', 'empty'] as const;

export type LocationSlotStateId = (typeof LocationSlotStates)[number];
