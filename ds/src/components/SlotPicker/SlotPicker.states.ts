/**
 * SlotPicker.states.ts — the component's axis (BATCH2-SPECS §3.6): the
 * two groups, a selection, unavailable slots, empty, loading.
 */
export const SlotPickerStates = [
  'groups',
  'selected',
  'unavailable',
  'empty',
  'loading',
] as const;

export type SlotPickerStateId = (typeof SlotPickerStates)[number];
