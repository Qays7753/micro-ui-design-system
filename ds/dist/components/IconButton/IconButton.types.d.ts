/**
 * IconButton.types.ts — props of the IconButton (BRIEF 23.2, 23.3, 23.18).
 *
 * An icon-only control: it MUST name itself for the screen reader (`label`,
 * 29.1-م4) — there is no visible text to read. The icon arrives as children
 * (one icon, 24). Press/long-press via lib/use-press; `density` large is the
 * driver's 56 touch target (23.18, BRIEF 7). Free design-value props banned.
 */
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { Density } from '../../lib/types';
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress'> {
    /** The accessible name (29.1-م4): icon-only buttons carry no visible text. */
    label: string;
    /** The icon — exactly one, rendered at 24 (23.3). */
    children?: ReactNode;
    /** Fired on release unless the press was cancelled (moved > 8px). */
    onPress?: () => void;
    /** Fired after the 500ms long-press while still held (lib/use-press). */
    onLongPress?: () => void;
    /** Disabled look: icon in disabled-fg (23.2). */
    disabled?: boolean;
    /** regular = 48 circle; large = driver mode 56 (23.18, BRIEF 7). */
    density?: Density;
    /** React 19 ref-as-prop on the button element. */
    ref?: Ref<HTMLButtonElement>;
}
