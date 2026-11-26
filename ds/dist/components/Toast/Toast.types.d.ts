/**
 * Toast.types.ts — props of the toast (BRIEF 23.12, 23.17, 1348).
 *
 * Bottom of the screen ABOVE the bars with toast-offset 12; width =
 * screen − 32, 480 max on tablet, centered; layer.toast (70). Text
 * white 14/20/500 on toast-bg, radius 16, padding 12/16, TWO lines max.
 * ONE toast at a time — the app renders a single instance and the new
 * message replaces the old. Timer: 3000ms, 5000ms when it carries an
 * action («تراجع», the trailing slot); the timer PAUSES while focus is
 * inside (23.12). role=status polite (23.17). Free design-value props
 * banned (23.18).
 */
import type { ReactNode, Ref } from 'react';
export interface ToastProps {
    /** The message (14/20/500 white, two lines max). */
    label: string;
    /** The action slot — «تراجع» Button; its presence extends the timer
     *  to 5000ms (23.12). */
    trailing?: ReactNode;
    /** Fires when the timer ends (the host hides the toast). */
    onDismiss?: () => void;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
