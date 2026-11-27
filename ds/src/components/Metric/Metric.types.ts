/**
 * Metric.types.ts — props of the white metric (BRIEF 9.3 table, 23.8
 * «Metric خارج السطح البطل»).
 *
 * The hero's stack on white: label + display-hero value + body-strong
 * unit + diff line + caption-strong source link — value text-primary,
 * cents text-secondary, the diff in the state color (done/problem) WITH
 * the arrow and the word. Loading is a gray skeleton, never a zero.
 * Missing value renders «—» in the value's own typography (owner
 * decision 2026-11-25). ONE caption line max under the number (owner
 * decision 2026-11-25). No comparison → no diff line (23.8). Free
 * design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface MetricProps {
  /** The label (14/20/500, text-secondary). */
  label: string;
  /** Value size: lg = display-hero 40/48 (default), sm = number-lg 28/36
   *  (the MetricSmall anatomy, 9.3). */
  size?: 'lg' | 'sm';
  /** The value; cents split like the hero (23.8). */
  value?: string;
  /** The unit («د») body-strong 16/24 on the number's baseline. */
  trailing?: string;
  /** The diff line: arrow + word; its color is the STATE color (done /
   *  problem) — render a MetricDelta node or pass your own. Omitted for
   *  numbers without a comparison. */
  direction?: ReactNode;
  /** The source link text («من 32 حركة») caption-strong. */
  debt?: string;
  /** Fires when the source link is pressed. */
  onDismiss?: () => void;
  /** Loading: a gray skeleton replaces the value — never a zero (9.3). */
  loading?: boolean;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
