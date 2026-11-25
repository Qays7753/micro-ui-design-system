/**
 * SaveState.types.ts — props of the save-state line (BRIEF 9.4 row, 656,
 * 23.17 a11y table, 1347 width table).
 *
 * FOUR states with text + icon, decided entirely by the app — the
 * component NEVER decides on its own (656: «المكوّن يعرض الحالة التي
 * يمرّرها له التطبيق، ولا يقررها بنفسه»):
 *   draft   «مسودة · لم تُحفظ» waiting color, DraftIcon (23.23 draft)
 *   sending «يُرسل…» busy, aria-busy, no announcement
 *   saved   «حُفظ ✓» ToneDoneIcon with the check-draw draw (300ms,
 *           motion.check-draw) + polite «حُفظت الحركة» (23.17)
 *   failed  «لم يُحفظ — أعد المحاولة» ToneProblemIcon + IMMEDIATE
 *           role=alert «لم تُحفظ الحركة. الاتصال انقطع.» (23.17)
 * Width fits its content (1347), never breaks. Free design-value props
 * banned (23.18): the vocabulary's own `saveState` carries the state.
 */
import type { Ref } from 'react';
import type { SaveStateValue } from '../../tokens/tokens';

export type { SaveStateValue };

export interface SaveStateProps {
  /** The app-owned state (23.18 vocabulary: `saveState`). */
  saveState: SaveStateValue;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLSpanElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
