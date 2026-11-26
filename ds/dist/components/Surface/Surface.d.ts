/**
 * Surface — the primary container (BRIEF 9.2).
 *
 * - r-lg radius (24), 1px surface-edge border, NO shadow (9.2: بلا ظل —
 *   the separation is the border + spacing, never elevation).
 * - Padding 16 on phone, 20 on tablet (breakpoint.tablet-min media query).
 * - Optional header: `title-card` title + one trailing action (23.21: a
 *   secondary/text button; the primary button never lives inside a Surface).
 * - List mode (density="list"): vertical padding 8, inline padding 0 — the
 *   rows carry their own 16 (23.1(5)).
 * - Not interactive by itself; a pressable Surface is the app's choice and
 *   gets the 23.2 press (scale .98 + surface-pressed) through the CSS
 *   classes the lab applies. The base component stays a plain container.
 * - Min content width 320 (23.20: size.surface-min-width).
 */
import type { SurfaceProps } from './Surface.types';
import './Surface.css';
export declare function Surface({ children, label, trailing, density, className, id, style, ref, ...rest }: SurfaceProps): import("react").JSX.Element;
