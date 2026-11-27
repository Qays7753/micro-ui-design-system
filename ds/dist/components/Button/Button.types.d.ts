/**
 * Button.types.ts — props of the Button (BRIEF 9.3, 23.2, 23.3, 23.18).
 *
 * Unified names only: `variant` (primary · secondary · text · danger),
 * `size` (md = 52, sm = 44 inside a 48 touch zone), `loading`, `disabled`,
 * `leading`/`trailing` (one icon each, 23.3), `onPress`/`onLongPress`.
 * The label arrives as children — always dictionary text from the app
 * (BRIEF 24: verb + object, ≤ 3 words). Free design-value props are banned.
 */
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { ButtonVariant, Size } from '../../lib/types';
/** md = 52 with radius 16; sm = 44 visual inside a 48 touch zone (23.3). */
export type ButtonSize = Extract<Size, 'md' | 'sm'>;
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress'> {
    /** Visual weight: primary · secondary · text · danger (23.18). */
    /** WHERE the button rides (1.7 ت3): `surface` (default — on a white
     *  surface/card) or `canvas` — a SECONDARY on the canvas floor takes the
     *  surface background + a hairline surface-edge border, because
     *  brand-selected-bg is 1.02:1 against canvas and reads as nothing. */
    mode?: 'surface' | 'canvas';
    variant?: ButtonVariant;
    /** md (default, 52) · sm (44 inside the 48 touch zone) (23.3). */
    size?: ButtonSize;
    /** True while the action runs: spinner 20 replaces the icon, width fixed,
     *  aria-busy on (23.3, 23.24(1)); the caller swaps the label to the
     *  ongoing verb form («يحفظ…»). */
    loading?: boolean;
    /** One leading icon (20, at the start) — most buttons have none (23.3). */
    leading?: ReactNode;
    /** One trailing direction icon (20, at the end) (23.3). */
    trailing?: ReactNode;
    /** Fired on release unless the press was cancelled (moved > 8px). */
    onPress?: () => void;
    /** Fired after the 500ms long-press while still held (lib/use-press). */
    onLongPress?: () => void;
    /** Disabled look of 23.2: disabled-bg + disabled-fg. */
    disabled?: boolean;
    /** React 19 ref-as-prop on the button element. */
    ref?: Ref<HTMLButtonElement>;
}
