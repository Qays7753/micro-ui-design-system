/**
 * EmptyState.types.ts — props of the empty state (BRIEF 23.7, 487, 1649).
 *
 * A symmetric r-lg surface with content aligned from the START (addendum
 * 1.7 ت9 — EmptyState is removed from the 23.1(4) centering list; the
 * ghost rows are gone too: skeleton-colored rows on white read as a
 * frozen loading, not as an emptiness). NO big icon in a circle, NO
 * cartoons, NO «لا توجد بيانات» heading (23.7 bans stay). ONE body
 * sentence in text-primary saying what appears and how it starts
 * (section 24), then 16, then AT MOST one secondary button (و-1 item 14:
 * the creation button lives in PageHeader ALONE — EmptyState carries NO
 * button when the header has it; the optional one is for screens without
 * a header creation action). Content ≤ 280 wide
 * (layout.empty-state-content-max). Free design-value props banned
 * (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface EmptyStateProps {
  /** The ONE body sentence: what appears here and how it starts (24). */
  label: string;
  /** The optional ONE secondary action — at most one (و-1 item 14); omit
   *  it whenever the screen's PageHeader carries the creation button. */
  trailing?: ReactNode;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
