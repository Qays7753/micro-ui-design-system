/**
 * ObjectRow.types.ts — props of the object row (BRIEF 23.4, 23.18).
 *
 * The list row: EntityMark 44 → 12 → the text column (body-strong title
 * one line ellipsized + 4 + caption 13/20 one line, min-width: 0) → 12 →
 * the end column (amount-row 16/24/600 tabular, + 4 + second line 13/20:
 * the time or a StatusBadge; never truncated). Baselines: title with the
 * value, second line with the time. The amount NEVER truncates — the
 * title does when space runs out. No trailing «›». The badge appears
 * only when the state differs from the expected (23.6). Heights (و-1
 * هـ1): 72 for every row — the mark starts it — one line or two, the
 * one-line row centers vertically. Free design-value props banned
 * (23.18).
 */
import type { ReactNode, Ref } from 'react';

export interface ObjectRowProps {
  /** The EntityMark content: pass a fund icon, or a name for the letter
   *  mark — rendered at 44 (23.4 item 1). */
  leading?: ReactNode;
  /** The mark's verification tone when it carries one (23.24(4)). */
  tone?: 'done' | 'waiting';
  /** The title: body-strong 16/24 text-primary, one line, ellipsized. */
  label: string;
  /** The second line: caption 13/20 text-secondary, one line; must NOT
   *  repeat the title (23.4). Omit for a one-line row (still 72 — the
   *  mark starts it — text centered vertically, و-1 هـ1). */
  caption?: string;
  /** The end value: amount-row 16/24/600 tabular; never truncated. */
  value?: string;
  /** The second line of the end column: the time text or a StatusBadge
   *  node — only when the state differs from the expected (23.6). */
  trailing?: ReactNode;
  /** Fires when the row is pressed. */
  onPress?: () => void;
  /** Disables the row (23.24(15)). */
  disabled?: boolean;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
