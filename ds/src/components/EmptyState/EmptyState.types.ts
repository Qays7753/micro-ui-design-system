/**
 * EmptyState.types.ts — props of the empty state (BRIEF 23.7, 487, 1649).
 *
 * A symmetric r-lg 24 surface with CENTERED content (23.1 allows
 * centering here). NO big icon in a circle, NO cartoons, NO «لا توجد
 * بيانات» heading (23.7 bans). Instead: two GHOST rows shaped like the
 * real ObjectRow (44 mark + two lines) in the skeleton color with NO
 * motion — the user sees the shape of what will appear here — then 16,
 * ONE body sentence saying what appears and how it starts (section 24),
 * then 16, then ONE secondary button (the creation action, 9.1: the
 * creation button also lives in EmptyState). Content ≤ 280 wide
 * (layout.empty-state-content-max). Free design-value props banned
 * (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface EmptyStateProps {
  /** The ONE body sentence: what appears here and how it starts (24). */
  label: string;
  /** The ONE secondary action (e.g. the creation button, 9.1). */
  trailing?: ReactNode;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
