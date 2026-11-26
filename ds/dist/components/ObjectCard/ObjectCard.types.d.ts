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
 * scale(.98) + surface-pressed. Free design-value props banned (23.18).
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
    /** The core value: amount-row 16/24/600 tabular; never truncated. */
    value?: string;
    /** The state: a StatusBadge node — only when it differs from the
     *  expected (23.6). */
    state?: ReactNode;
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
