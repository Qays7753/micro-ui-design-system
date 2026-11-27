/**
 * ObjectCard.types.ts — props of the object card (BRIEF 4.1, 23.24
 * composition table, width table 1339, line-count rule 1435).
 *
 * The card size of the unified object anatomy (mark → title → value →
 * state → next step): EntityMark 64, title `title-card` 18/26 TWO lines
 * (ellipsized beyond), value, StatusBadge, a second line, and ONE
 * compact secondary Button for the next step. Allowed: exactly this
 * list. Banned: a Surface inside, a primary button, more than one button
 * (23.24). Radius 24, width 280 in horizontal lists (720 max). Press:
 * scale(.98) + surface-pressed. Press surface (و-2 item 19): the whole
 * card is ONE press element and the next-step Button is a SIBLING above
 * it — never an interactive inside another. Free design-value props
 * banned (23.18). Values (batch-2 1.2): a FINANCIAL value arrives as a
 * <Money> node (md size — 23.4 fixes the size, not the shape) so the sign
 * and the unit «د» ride on Money and the hidden-amounts context applies
 * (23.22); a plain string stays text (non-financial numbers).
 */
import type { ReactNode, Ref } from 'react';
export interface ObjectCardProps {
    /** The EntityMark content at 64: a name (letter mark) or a type icon. */
    leading?: ReactNode;
    /** The mark's verification tone when it carries one (23.24(4)). */
    tone?: 'done' | 'waiting';
    /** The title: title-card 18/26, TWO lines max, ellipsized beyond. */
    label: string;
    /** The second line: caption 13/20 text-secondary. */
    caption?: string;
    /** The core value: amount-row 16/24/600 tabular; never truncated. A
     *  FINANCIAL value arrives as a <Money> node (md size, batch-2 1.2);
     *  a plain string stays text (non-financial numbers). */
    value?: ReactNode;
    /** The state: a StatusBadge node — only when it differs from the
     *  expected (23.6). */
    state?: ReactNode;
    /** The card's destination (و-2 item 19): when given, the whole card
     *  is one stretched `<a>` — a navigational card. Pair it with the
     *  next-step Button; never with `disabled`. */
    href?: string;
    /** The next-step compact secondary button (exactly one; 23.24). */
    children?: ReactNode;
    /** Fires when the card itself is pressed (AskNavResult pattern). */
    onPress?: () => void;
    /** Disables the card (23.24(15)). */
    disabled?: boolean;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
