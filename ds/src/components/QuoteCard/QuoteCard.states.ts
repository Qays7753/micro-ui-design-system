/**
 * QuoteCard.states.ts — the component's axis (BATCH2-SPECS §4.2): in a
 * list, alone in the sheet, accepting, rejected.
 */
export const QuoteCardStates = ['inList', 'inSheet', 'accepting', 'rejected'] as const;

export type QuoteCardStateId = (typeof QuoteCardStates)[number];
