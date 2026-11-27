/**
 * PriceTierTable.states.ts — the component's axis (BATCH2-SPECS §5.3):
 * plain tiers, locked (visitor).
 */
export const PriceTierTableStates = ['plain', 'locked'] as const;

export type PriceTierTableStateId = (typeof PriceTierTableStates)[number];
