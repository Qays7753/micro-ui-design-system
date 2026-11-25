/**
 * ContextBar.types.ts — props of the top context bar (BRIEF 9.1, 23.16,
 * 23.20 width table, 27.3).
 *
 * 56 high (size.context-bar), `canvas` background, a 1px
 * `surface-edge` BOTTOM hairline that appears ONLY while content
 * scrolled under it (the host passes the signal). Start:
 * ProjectSwitcher (main screens) or a back IconButton (sub screens).
 * End [confirmed]: NotificationsButton then AskButton — Ask is the
 * LAST element in the corner, the bell just inside it. layer.bars
 * (23.15). Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface ContextBarProps {
  /** Start slot: ProjectSwitcher (main screens) or a back IconButton
   *  (sub screens); children fall here when leading is absent. */
  leading?: ReactNode;
  /** End slot content: NotificationsButton then AskButton (the
   *  confirmed order — Ask last in the corner, bell just inside). */
  trailing?: ReactNode;
  /** True while content scrolled under the bar: the bottom hairline
   *  shows ONLY then (23.16). */
  caption?: boolean;
  /** The bar's accessible name. */
  label: string;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}
