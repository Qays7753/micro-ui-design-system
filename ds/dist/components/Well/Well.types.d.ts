/**
 * Well.types.ts — props of the Well inset container (BRIEF 9.2, 23.1(1),
 * 23.21, 23.18).
 *
 * A quiet inset that lives INSIDE a Surface only (9.2): radius 8 — the
 * nested radius rule 23.1(1) (surface 24 − padding 16), padding 12, and
 * the surface-well background. Content per 23.21: text, KeyValueList,
 * Money and a text link — never another container, a button or a
 * pressable row. Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';
export interface WellProps {
    /** Text, KeyValueList, Money, a text link — the 23.21 allow-list. */
    children?: ReactNode;
    /** React 19 ref-as-prop on the well element. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
