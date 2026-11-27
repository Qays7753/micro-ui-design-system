/**
 * StatusTrack.types.ts — props of the status track (BATCH2-SPECS §1.17,
 * needed by JobTrack §4.3; BRIEF 23.18 unified vocabulary; م-خ1 items).
 *
 * A horizontal multi-step progress: one row of dots connected by lines
 * (done segments brand-data, the rest track), the CURRENT step's dot
 * bigger with its label under it (label-strong), past steps' labels
 * micro in text-secondary. The app passes the stages; a «تعذّر» stage
 * carries tone="problem" on the current step.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { Tone } from '../../tokens/tokens';

export interface StatusTrackStep {
  /** The stage name from the app («قيد التنفيذ»). */
  label: string;
  /** problem only on the CURRENT step (§4.3 item 2). */
  tone?: Tone;
}

export interface StatusTrackProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The stages in order; the app marks the current one. */
  items: readonly StatusTrackStep[];
  /** The current stage's index (0-based). */
  value: number;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
