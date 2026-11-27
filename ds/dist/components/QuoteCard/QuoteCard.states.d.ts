/**
 * QuoteCard.states.ts — the component's axis (BATCH2-SPECS §4.2): in a
 * list, alone in the sheet, accepting, rejected.
 */
export declare const QuoteCardStates: readonly ["inList", "inSheet", "accepting", "rejected"];
export type QuoteCardStateId = (typeof QuoteCardStates)[number];
