/**
 * AgendaList.states.ts — the component's axis (BATCH2-SPECS §3.4):
 * multi-day, single day, empty, loading.
 */
export declare const AgendaListStates: readonly ["multiDay", "singleDay", "empty", "loading"];
export type AgendaListStateId = (typeof AgendaListStates)[number];
