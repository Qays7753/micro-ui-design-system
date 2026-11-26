/**
 * ConfirmSheet.types.ts — props of the destructive-confirm sheet (BRIEF
 * 9.3 table, 23.24 composition, 1284 a11y row, 1424 icon table).
 *
 * The confirmation for a destructive action (12.x: لا إجراء هدام بلا
 * ConfirmSheet): centered header (the ONLY centered place besides
 * EmptyState/TabBar/AmountKeypad — 1096) with a danger icon
 * (WarningCircle 24) and a title 22, the result sentence, and exactly
 * TWO buttons: a FILLED red danger action and «رجوع». role=alertdialog
 * with focus on «رجوع» (1284). Allowed: icon, title, result sentence,
 * two buttons. Banned: fields, lists, more than two buttons (23.24).
 * Free design-value props banned (23.18).
 */
import type { Ref } from 'react';
export interface ConfirmSheetProps {
    /** The title (22/30/600), centered (23.24 ConfirmSheet header). */
    label: string;
    /** The result sentence (`body` 16/24 text-secondary, centered). */
    caption: string;
    /** The destructive action's text (the filled red button, e.g.
     *  «احذف الحركة»). */
    value: string;
    /** Fires when the destructive button is pressed. */
    onPress: () => void;
    /** Fires when «رجوع» (or dismissal: scrim/Escape) is chosen. */
    onDismiss: () => void;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
