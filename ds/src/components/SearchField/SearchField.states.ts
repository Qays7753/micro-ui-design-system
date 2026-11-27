/**
 * SearchField.states.ts — applicable states from BRIEF 9.0 + ADDENDUM §1.1.
 *
 * focused/disabled are the interaction states; withText shows the clear
 * button. NO error state (§1.1-4) — a wrong query is a result count, not a
 * red field.
 */
export const SearchFieldStates = [
  'default',
  'focused',
  'disabled',
  'withText',
] as const;

export type SearchFieldStateId = (typeof SearchFieldStates)[number];
