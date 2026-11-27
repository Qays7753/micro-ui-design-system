/**
 * SlotPicker.states.ts — the component's axis (BATCH2-SPECS §3.6): the
 * two groups, a selection, unavailable slots, empty, loading.
 */
export declare const SlotPickerStates: readonly ["groups", "selected", "unavailable", "empty", "loading"];
export type SlotPickerStateId = (typeof SlotPickerStates)[number];
