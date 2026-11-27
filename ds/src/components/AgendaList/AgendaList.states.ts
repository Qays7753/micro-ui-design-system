/**
 * AgendaList.states.ts — the component's axis (BATCH2-SPECS §3.4):
 * multi-day, single day, empty, loading.
 */
export const AgendaListStates = [
  'multiDay',
  'singleDay',
  'empty',
  'loading',
] as const;

export type AgendaListStateId = (typeof AgendaListStates)[number];
