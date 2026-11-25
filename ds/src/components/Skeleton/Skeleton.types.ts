/**
 * Skeleton.types.ts — props of the skeleton primitive (BRIEF 23.10,
 * 1650).
 *
 * Skeleton color on a SURFACE only — never directly on the ground
 * (23.10). Shapes size to the REAL content: body line (12 in 26,
 * radius 4, width 72%), caption line (10, width 48%), hero number
 * (160×32, radius 8), EntityMark (its own 44 shape). Motion: the
 * opacity pulse 1 → 0.55 → 1 over 1400ms ease-in-out, never stopping;
 * NO shimmer (gradients are banned system-wide); static under
 * reduced-motion. The 300ms-appear / 500ms-minimum timing discipline
 * is the HOST's mount decision — the component pulses while mounted.
 * Free design-value props banned (23.18): `variant` is vocabulary.
 */
import type { Ref } from 'react';

export type SkeletonVariant = 'body' | 'caption' | 'hero' | 'mark';

export interface SkeletonProps {
  /** The real-content shape this skeleton stands in for (23.10). */
  variant: SkeletonVariant;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLSpanElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
