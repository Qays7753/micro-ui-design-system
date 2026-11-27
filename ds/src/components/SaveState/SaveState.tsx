/**
 * SaveState — the four-state save line (BRIEF 9.4, 656, 23.17, 23.23).
 *
 * The app decides the state; the component only renders it. Icons come
 * from the 23.23 set (draft pencil, done check, problem warning). The
 * saved check plays the check-draw (300ms ease-out, 677). The failed
 * state announces IMMEDIATELY (role=alert) — the only immediate
 * announcement in the system besides network loss during save (23.17).
 *
 * ت11 (addendum 1.7): «يُرسل…» appears only after motion.pending-delay —
 * a save that resolves inside the delay skips straight to «حُفظ» with no
 * visible intermediate state (a 100ms flash of the sending line reads as
 * a glitch, not as work). The LINE's slot is stable: while the sending
 * state waits out its delay the line renders invisible (its box, height
 * and the min-height stay — nothing jumps when it appears), and the
 * screen reader's aria-busy is immediate (the busy SEMANTICS never wait,
 * only the visual). ب2: no second spinner inside SaveState — the live
 * indicator of a pending save is the BUTTON's spinner (23.24).
 */
import { DraftIcon } from '../../icons';
import { ToneDoneIcon } from '../../icons';
import { ToneProblemIcon } from '../../icons';
import { usePendingDelay } from '../../lib/use-pending-delay';
import { t } from '../../i18n/ar';
import type { SaveStateProps, SaveStateValue } from './SaveState.types';
import './SaveState.css';

const TEXTS: Record<SaveStateValue, string> = {
  draft: t('saveState.draft'),
  sending: t('saveState.sending'),
  saved: t('saveState.saved'),
  failed: t('saveState.failed'),
};

export function SaveState({
  saveState,
  className,
  id,
  style,
  ref,
  ...rest
}: SaveStateProps) {
  // ت11: the sending LINE waits out motion.pending-delay before it shows;
  // every other state renders immediately.
  const sendingVisible = usePendingDelay(saveState === 'sending');
  const classes = [
    'mds-save-state',
    `mds-save-state--${saveState}`,
    saveState === 'sending' && !sendingVisible ? 'mds-save-state--pending-delay' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const icon =
    saveState === 'draft' ? (
      <DraftIcon size={14} />
    ) : saveState === 'saved' ? (
      <span className="mds-save-state-icon"><ToneDoneIcon size={14} /></span>
    ) : saveState === 'failed' ? (
      <ToneProblemIcon size={14} />
    ) : null;

  return (
    <span
      ref={ref}
      id={id}
      style={style}
      className={classes}
      role={saveState === 'failed' ? 'alert' : undefined}
      aria-busy={saveState === 'sending' || undefined}
      {...rest}
    >
      {icon}
      <span className="mds-save-state-text">{TEXTS[saveState]}</span>
      {saveState === 'saved' ? (
        <span className="mds-visually-hidden">{t('sr.saveSaved')}</span>
      ) : null}
      {saveState === 'failed' ? (
        <span className="mds-visually-hidden">{t('sr.saveFailed')}</span>
      ) : null}
    </span>
  );
}
