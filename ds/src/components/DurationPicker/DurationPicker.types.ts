/**
 * DurationPicker.types.ts — props of the duration picker (BATCH2-SPECS
 * ADDENDUM §3.3, 23.18).
 *
 * A service/appointment DURATION after its time is chosen — the field does
 * not even exist in a form before a time (criterion 2, the app's wiring).
 * NOT for a moment (TimePicker). The value is minutes, multiples of the
 * step (15), 15..720 (criterion 1).
 */
import type { Ref } from 'react';

export interface DurationPickerProps {
  /** The field's label («المدة») — also the sheet's title. */
  label: string;
  /** The chosen duration in minutes; undefined = empty (§3.3-4). */
  value?: number;
  /** The lower bound in minutes (default 15, the addendum's floor). */
  min?: number;
  /** The upper bound in minutes (default 720 — 12 hours). */
  max?: number;
  /** The minute step (م-خ1) — 15 per the addendum. */
  step?: number;
  /** Reports the applied duration (unified onChange, 23.18) — fires on the
   * sheet's «اعتمد المدة» press; the field's clear fires it undefined. */
  onChange?: (value: number | undefined) => void;
  /** Disables the field (23.2). */
  disabled?: boolean;
  /** React 19 ref-as-prop on the field root. */
  ref?: Ref<HTMLSpanElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
