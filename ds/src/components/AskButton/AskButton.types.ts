/**
 * AskButton.types.ts — props of the Ask Micro button (BRIEF 9.1, 4.2(1),
 * 23.23 ask row, 23.24(2)).
 *
 * The Micro symbol itself at 28 (size.ask-symbol) inside a 48 touch
 * zone — no container at rest, the symbol IS the button (4.2: «زر Ask
 * Micro = الرمز نفسه»). A 6px dot (size.dot-ask) in the symbol's
 * empty CENTER marks an unread answer — the dot's ONLY mark use (4.2).
 * Long-press = direct voice recording (9.1; the recording itself is
 * the host app's). Free design-value props banned (23.18).
 */
import type { Ref } from 'react';

export interface AskButtonProps {
  /** True when an Ask answer is unread: the 6px center dot shows. */
  selected?: boolean;
  /** The press (opens the Ask panel — a sheet the host owns). */
  onPress: () => void;
  /** Long-press: direct voice recording (9.1). */
  onLongPress?: () => void;
  /** React 19 ref-as-prop on the button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
