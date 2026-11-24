/**
 * Surface.types.ts — props of the Surface container (BRIEF 9.2, 23.1(5),
 * 23.19, 23.21, 23.18).
 *
 * The library's primary container: r-lg radius, 1px surface-edge border, NO
 * shadow; padding 16 on phone and 20 on tablet (the component's media
 * query, from the breakpoint tokens). An optional header renders
 * `title-card` + one action (a text/secondary button — 23.21 bans the
 * primary inside a Surface). `list` mode switches the vertical padding to 8
 * with 0 inline padding for row lists (23.1(5): the rows carry their own
 * 16). Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface SurfaceProps {
  /** The surface's content — rows, wells, metrics, one chart (23.21). */
  children?: ReactNode;
  /** Optional header title (`title-card` 18/26/600). */
  label?: string;
  /** Optional header action — one secondary/text button max (23.21). */
  trailing?: ReactNode;
  /** List mode: vertical padding 8, inline padding 0; rows pad themselves
   *  16 (23.1(5): حين يحتوي Surface قائمة صفوف). */
  density?: 'regular' | 'list';
  /** React 19 ref-as-prop on the surface element. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
