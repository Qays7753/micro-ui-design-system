/**
 * AmountField.types.ts — props of the amount input (ADDENDUM §1.3, 23.18).
 *
 * EVERY amount entry. NOT for quantities (QuantityStepper) and NOT for
 * DISPLAY (Money). NO max (ADDENDUM 2.1): any number of integer digits —
 * if the digits outgrow amount-input the type drops one step to number-lg
 * and then scrolls inside the field, never clipping (23.20).
 */
import type { Ref } from 'react';
import type { DataState } from '../../lib/types';

/** An amount field is idle or in error. */
export type AmountFieldState = Extract<DataState, 'idle' | 'error'>;

export interface AmountFieldProps {
  /** The label above (label 14/20/500) — the unit «د» NEVER rides it (ق5). */
  label: string;
  /** The help line below (caption); in error it carries the SOLUTION text. */
  caption?: string;
  /** The raw value (Western digits, '.' decimal, no separators — BRIEF 8). */
  value?: string;
  /** Called with the NORMALIZED value (هندية→غربية، ٫→.، لا أكثر من 3 خانات). */
  onChange?: (value: string) => void;
  /** Disabled look (23.2). */
  disabled?: boolean;
  /** idle | error — «اكتب المبلغ بالأرقام» / «اكتب مبلغاً أكبر من صفر». */
  state?: AmountFieldState;
  /** A draft flag: the field unchanged, the badge rides the form's SaveState (§1.3-4). */
  draft?: boolean;
  /** React 19 ref-as-prop on the input element. */
  ref?: Ref<HTMLInputElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
