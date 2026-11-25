/**
 * SaveState — the four-state save line (BRIEF 9.4, 656, 23.17, 23.23).
 *
 * The app decides the state; the component only renders it. Icons come
 * from the 23.23 set (draft pencil, done check, problem warning). The
 * saved check plays the check-draw (300ms ease-out, 677). The failed
 * state announces IMMEDIATELY (role=alert) — the only immediate
 * announcement in the system besides network loss during save (23.17).
 */
import { DraftIcon } from '../../icons';
import { ToneDoneIcon } from '../../icons';
import { ToneProblemIcon } from '../../icons';
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
  const classes = [
    'mds-save-state',
    `mds-save-state--${saveState}`,
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
