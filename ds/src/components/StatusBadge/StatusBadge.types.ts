/**
 * StatusBadge.types.ts — props of the status badge (BRIEF 9.3, 23.6, 23.18).
 *
 * `tone` carries the color meaning (the five tones of 5.2 / 23.18) and picks
 * the generated Tone* icon (23.23: `tone-done`, `tone-waiting`, `tone-problem`,
 * `tone-info`; the neutral tone has no icon). The word comes from the copy
 * dictionary — passed in as `label` or defaulted from ar.ts `badge.*`.
 */
import type { HTMLAttributes } from 'react';
import type { Ref } from 'react';
import type { Tone } from '../../tokens/tokens';

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The status meaning: neutral · info · done · waiting · problem (23.18). */
  tone: Tone;
  /** Badge word (≤ 2 words, plan 8-و); defaults to the dictionary word for the tone. */
  label?: string;
  /** React 19 ref-as-prop on the root span. */
  ref?: Ref<HTMLSpanElement>;
}
