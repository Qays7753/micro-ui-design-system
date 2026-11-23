/**
 * SegmentedControl.types.ts — props of the SegmentedControl (BRIEF 9.1, 23.18,
 * 23.20).
 *
 * A 2–4 segment mutually exclusive switcher: `leading` carries the segments
 * (each `{ value, label, leading?, disabled? }` — dictionary text, BRIEF 24) and
 * `value` is the selected segment's value — controlled by the app, like
 * every input in this library (BRIEF 11). The change arrives through the
 * unified `onChange(value)`. Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface SegmentOption {
  /** The segment's stable identity — the `value` handed to onChange. */
  value: string;
  /** The visible label (`label`/`label-strong` type); dictionary text (24). */
  label: string;
  /** Optional leading icon (20, at the start) — most segments have none (23.3). */
  leading?: ReactNode;
  /** Disables one segment only (23.24(15): no motion, no color). */
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** 2–4 segments (9.1: 4 أجزاء كحد أقصى) — the app defines the order. */
  leading: readonly SegmentOption[];
  /** The selected segment's value; the app owns it (BRIEF 11). */
  value: string;
  /** Reports the newly selected value (unified onChange, 23.18). */
  onChange: (value: string) => void;
  /** Disables the whole control (23.2). */
  disabled?: boolean;
  /** The group's accessible name (23.17: natural Arabic words). */
  label: string;
  /** React 19 ref-as-prop on the group container. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
