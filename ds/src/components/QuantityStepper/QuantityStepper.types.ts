/**
 * QuantityStepper.types.ts — props of the quantity stepper (BATCH2-SPECS
 * §1.6, 23.18).
 *
 * Integer quantities ONLY (piece counts, packages): NOT for money
 * (AmountField) and NOT for fractional quantities. A dir="ltr" group —
 * minus at the left, the number in the middle, plus at the right — because
 * the stepper reads as a number line. The long press repeats the step every
 * motion.response-max-ms (§1.6-5); the field accepts typing and an
 * out-of-range value returns to the bound on blur.
 */
import type { Ref } from 'react';

export interface QuantityStepperProps {
  /** The group's accessible name («الكمية») — also the field's name. */
  label: string;
  /** The current integer quantity (controlled). Undefined = min (§1.6-4). */
  value?: number;
  /** Reports the next quantity (unified onChange, 23.18). */
  onChange?: (value: number) => void;
  /** The lower bound; «−» disables here (م-خ1). Default 0. */
  min?: number;
  /** The upper bound; «+» disables here (م-خ1). Undefined = no ceiling. */
  max?: number;
  /** Disables the whole group (23.2). */
  disabled?: boolean;
  /** React 19 ref-as-prop on the group root. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
