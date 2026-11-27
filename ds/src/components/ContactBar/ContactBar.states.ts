/**
 * ContactBar.states.ts — the component's axis (BATCH2-SPECS §4.5):
 * plain, market note, driver density, locked.
 */
export const ContactBarStates = ['plain', 'market', 'driver', 'locked'] as const;

export type ContactBarStateId = (typeof ContactBarStates)[number];
