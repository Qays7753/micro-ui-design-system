/**
 * AmountVisibilityToggle.types.ts — props of the amounts toggle (BRIEF 23.22).
 *
 * The component displays the app-owned visibility state (from the context,
 * never a prop) and reports the requested change back through the unified
 * `onChange` (23.18). The library never stores the state (BRIEF 11, 16.20).
 */
import type { ButtonHTMLAttributes } from 'react';
import type { Ref } from 'react';
import type { Density } from '../../lib/types';

export interface AmountVisibilityToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Called with the requested visibility after a press; the app applies it to AmountVisibilityProvider. */
  onChange?: (visible: boolean) => void;
  /** Disabled look: icon in disabled-fg (BRIEF 23.2). */
  disabled?: boolean;
  /** regular = 48 touch; large = driver mode 56 (BRIEF 23.18, 7). */
  density?: Density;
  /** React 19 ref-as-prop on the button. */
  ref?: Ref<HTMLButtonElement>;
}
