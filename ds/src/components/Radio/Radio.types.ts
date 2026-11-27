/**
 * Radio.types.ts — props of the radio group (ADDENDUM §3.2, 23.18).
 *
 * Picking ONE of 2-5 options whose labels are long (availability, payment).
 * NOT for instant settings (Toggle) and NOT for many options (a picker
 * sheet). The WHOLE row is the press zone; arrow keys walk the options.
 */
import type { Ref } from 'react';
import type { DataState } from '../../lib/types';

export interface RadioOption {
  /** The option's value passed to onChange. */
  value: string;
  /** The option's label: body 16/26. */
  label: string;
  /** The optional second line: caption 13/20. */
  caption?: string;
  /** Disables this option alone. */
  disabled?: boolean;
}

export interface RadioProps {
  /** The group's label above the surface (label → field 8, 23.1). */
  label: string;
  /** The 2-5 options (م-خ1). */
  items: RadioOption[];
  /** The selected value (controlled; undefined = nothing chosen yet). */
  value?: string;
  /** Fires with the chosen option's value; the whole row presses. */
  onChange?: (value: string) => void;
  /** Disables the whole group. */
  disabled?: boolean;
  /** error = nothing chosen at submit: «اختر <التسمية>» under the surface. */
  state?: Extract<DataState, 'idle' | 'error'>;
  /** React 19 ref-as-prop on the group wrapper. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
