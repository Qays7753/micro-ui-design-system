/**
 * ContextBar — the top context bar (BRIEF 9.1, 23.16, 27.3).
 *
 * - 56 (size.context-bar), `canvas` background; a 1px `surface-edge`
 *   BOTTOM hairline appears ONLY while content scrolled under it
 *   (23.16 — the host passes the signal through `caption`).
 * - Composition slots: leading = ProjectSwitcher (main screens) or a
 *   back IconButton (sub screens); trailing = NotificationsButton
 *   then AskButton — Ask is the LAST element in the corner and the
 *   bell sits just inside it [confirmed order in 9.1].
 * - layer.bars (23.15); the top safe area rides the padding (27.3).
 */
import type { ContextBarProps } from './ContextBar.types';
import './ContextBar.css';
export declare function ContextBar({ leading, trailing, caption, label, className, id, style, ref, children, ...rest }: ContextBarProps): import("react").JSX.Element;
