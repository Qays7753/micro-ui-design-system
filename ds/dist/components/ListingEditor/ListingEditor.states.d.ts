/**
 * ListingEditor.states.ts — the component's axis (BATCH2-SPECS §5.6):
 * new, editing, single price, tiers, send errors.
 */
export declare const ListingEditorStates: readonly ["new", "editing", "tiers", "errors"];
export type ListingEditorStateId = (typeof ListingEditorStates)[number];
