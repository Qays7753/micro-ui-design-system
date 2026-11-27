/**
 * ListingEditor.states.ts — the component's axis (BATCH2-SPECS §5.6):
 * new, editing, single price, tiers, send errors.
 */
export const ListingEditorStates = ['new', 'editing', 'tiers', 'errors'] as const;

export type ListingEditorStateId = (typeof ListingEditorStates)[number];
