/**
 * ActionBar.types.ts — props of the fixed bottom action bar (BRIEF 9.2,
 * 23.15, 23.16, 23.20 width table, 27.3/27.4).
 *
 * Fixed at the bottom of the screen (or the sheet that owns it): white
 * with a 1px `surface-edge` top border that appears ONLY while the
 * content above has not scrolled to its end (23.16), ONE primary
 * full-width button, an optional text secondary action, the safe area
 * inset, and it rides above the on-screen keyboard by following
 * visualViewport (27.4). The layer is `layer.bars` (20) for the
 * screen's own bar; a sheet-owned ActionBar lives inside the sheet's
 * layer (23.15: «ActionBar الورقة داخل طبقتها») — the component takes
 * no layer prop (the closed 23.18 vocabulary has none); it renders at
 * layer.bars by default and the sheet overrides it through its own
 * stacking context. Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';
export interface ActionBarProps {
    /** The primary action's label (the ONE primary button). */
    label: string;
    /** Fires when the primary button is pressed. */
    onPress: () => void;
    /** The primary button is loading (aria-busy + spinner, 23.24(1)). */
    loading?: boolean;
    /** The primary button is disabled (23.2). */
    disabled?: boolean;
    /** The secondary action's text — rendered as a text Button to the
     *  START of the primary (RTL) when present; omitted entirely when
     *  not passed (the optional «ثانوي نصي اختياري», 9.2). */
    caption?: string;
    /** Fires when the secondary action is pressed. */
    onRetry?: () => void;
    /** True while the content above has NOT scrolled to its end: the
     *  1px top border shows ONLY in that state (23.16). Defaults to
     *  true (content pending) — the host app owns the scroll signal. */
    leading?: boolean;
    /** The primary button's optional leading icon (Button's 20 slot). */
    trailing?: ReactNode;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
