/**
 * TabBar.types.ts — props of the bottom tab bar (BRIEF 9.1, 23.20
 * width table, 27.3, 23.17 aria-current).
 *
 * 64 (size.tab-bar) + the safe area, 2 to 5 items, white background
 * with an ALWAYS-present 1px `surface-edge` top hairline (23.16 —
 * TabBar's border is permanent, unlike ContextBar/ActionBar).
 * Inactive icon Regular in `text-secondary`, active Fill in
 * `brand-logo` with its label `text-primary`, NO background behind
 * the active item. Label `micro`. «مشروع اليوم» fits one line with
 * 5 items on 360 (23.20). The app passes the order — the component
 * forces no tab position. The tabs arrive as children (one TabBarTab
 * element each; `items` would be an outside-vocabulary prop — 23.18
 * offers `children` for composition). Free design-value props banned
 * (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface TabBarProps {
  /** The tabs — TabBarTab children, in the app's own order (9.1:
   *  «الترتيب يمرّره التطبيق»؛ 2 to 5). */
  children: ReactNode;
  /** The selected tab (the TabBarTab carrying `selected` styles it). */
  value?: number;
  /** Fires with the newly selected index. */
  onChange?: (index: number) => void;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

/** One tab element rendered inside the bar. */
export interface TabBarTabProps {
  /** The tab label (`micro`, one line, never clipped at 5 on 360). */
  label: string;
  /** True for the active tab: Fill icon, text-primary label,
   *  aria-current="page", NO background. */
  selected?: boolean;
  /** The icon node; the call site passes weight Fill when selected
   *  (Regular otherwise) — the drawing belongs to the icon element. */
  leading?: ReactNode;
  /** Fires when the tab is selected. */
  onPress: () => void;
  /** React 19 ref-as-prop on the button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Standard pass-through. */
  className?: string;
}
