/**
 * SlotPicker.types.ts — props of the slot picker (BATCH2-SPECS §3.6;
 * م-خ1 items/step).
 *
 * Choosing a time from the available slots: labelled groups («صباحاً»،
 * «مساءً») of a 3-column equal grid of chips shaped like FilterChips,
 * single selection, the chip label centered with tabular digits
 * («10:30 ص»). Unavailable slots are disabled. Choosing a DATE is
 * DatePicker, NOT this.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { DataState } from '../../lib/types';

export interface SlotGroup {
  /** The group heading («صباحاً» / «مساءً»), label-strong. */
  label: string;
  /** The group's slots in order. */
  slots: readonly string[];
  /** Which slot values are unavailable (rendered disabled). */
  disabled?: readonly string[];
}

export interface SlotPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The labelled groups. */
  items: readonly SlotGroup[];
  /** The selected slot value, exactly one at most (ق2). */
  value?: string;
  /** The minute step the slots were generated with (م-خ1, informational). */
  step?: number;
  /** Fires with the newly selected slot; pressing the selected slot
   *  keeps it (single selection, no deselect). */
  onChange: (slot: string) => void;
  /** Loading renders the group headings with skeleton chips. */
  state?: DataState;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
