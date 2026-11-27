/**
 * Checkbox.types.ts — props of the checkbox row (ADDENDUM §3.1, 23.18).
 *
 * Independent tickable items where MORE THAN ONE may be selected (the
 * decision-card check items). NOT for an instant setting (Toggle) and NOT
 * for picking one of a few (Radio). The WHOLE row is the press zone.
 */
import type { Ref } from 'react';
import type { DataState } from '../../lib/types';

export interface CheckboxProps {
  /** The tickable label: body 16/26 text-primary, wraps at 200%. */
  label: string;
  /** The optional second line: caption 13/20 text-secondary. */
  caption?: string;
  /** Ticked state (controlled). */
  selected?: boolean;
  /** Fires with the NEXT state; the whole row is the press zone. */
  onChange?: (selected: boolean) => void;
  /** Disables the row (23.24(15)): box border and label in disabled-fg. */
  disabled?: boolean;
  /** error = a mandatory unticked box at submit: problem border + the
   *  fix-it line under the row («أشّر على هذا البند.», ADDENDUM §3.1-4). */
  state?: Extract<DataState, 'idle' | 'error'>;
  /** React 19 ref-as-prop on the root row element. */
  ref?: Ref<HTMLLabelElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** aria-label carry for contexts that need a specific name (61). */
  'aria-label'?: string;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
