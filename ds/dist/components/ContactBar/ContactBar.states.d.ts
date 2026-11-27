/**
 * ContactBar.states.ts — the component's axis (BATCH2-SPECS §4.5):
 * plain, market note, driver density, locked.
 */
export declare const ContactBarStates: readonly ["plain", "market", "driver", "locked"];
export type ContactBarStateId = (typeof ContactBarStates)[number];
