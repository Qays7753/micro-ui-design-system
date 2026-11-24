/**
 * FilterChips.types.ts — props of the FilterChips row (BRIEF 9.1, 23.16,
 * 23.18).
 *
 * A horizontally scrolling row of filter chips: `leading` carries the chips
 * (each `{ value, label, disabled? }` — dictionary text, BRIEF 24), `value`
 * is the array of selected values — controlled by the app (BRIEF 11), and
 * the change arrives as the unified `onChange(values)`. Multi-select by
 * nature (non-exclusive filters). Free design-value props banned (23.18).
 */
import type { Ref } from 'react';

export interface ChipOption {
  /** The chip's stable identity — a value inside the selected array. */
  value: string;
  /** The visible label (`label`/`label-strong` type); dictionary text (24). */
  label: string;
  /** Disables one chip only (23.24(15): no motion, no color). */
  disabled?: boolean;
}

export interface FilterChipsProps {
  /** The chips in display order — the app defines it. */
  leading: readonly ChipOption[];
  /** The selected values; the app owns them (BRIEF 11). */
  value: readonly string[];
  /** Reports the next selected-value array (unified onChange, 23.18). */
  onChange: (values: string[]) => void;
  /** Disables the whole row (23.2). */
  disabled?: boolean;
  /** The row's accessible name (23.17: natural Arabic words). */
  label: string;
  /** React 19 ref-as-prop on the scroll container. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
