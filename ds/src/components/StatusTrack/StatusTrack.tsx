/**
 * StatusTrack — a horizontal multi-step status (BATCH2-SPECS §1.17).
 *
 * - One row of equal steps: a dot per stage connected by lines; done
 *   stages fill brand-data with their labels micro in text-secondary;
 *   the CURRENT stage's dot grows to dot-attention with its label under
 *   it in label-strong (ق1: exactly one current).
 * - A «تعذّر» current stage carries tone="problem": its dot and label go
 *   problem-fg (§4.3 item 2).
 * - Screen reader: «مراحل التوصيل: المرحلة 4 من 6، قيد التنفيذ» — an
 *   aria-label composed from value/items, the row itself aria-hidden.
 */
import { t } from '../../i18n/ar';
import type { StatusTrackProps } from './StatusTrack.types';
import './StatusTrack.css';

export function StatusTrack({
  items,
  value,
  className,
  id,
  style,
  ref,
  ...rest
}: StatusTrackProps) {
  const current = Math.max(0, Math.min(value, items.length - 1));
  const currentLabel = items[current]?.label ?? '';
  const ariaLabel = [
    t('sr.statusTrackStages'),
    t('sr.statusTrackStep', { n: current + 1 }).replace('{m}', String(items.length)),
    currentLabel,
  ].join(t('sr.listSeparator'));

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      role="group"
      aria-label={ariaLabel}
      className={['mds-status-track', className].filter(Boolean).join(' ')}
      data-ds-check="status-track"
      {...rest}
    >
      <div className="mds-status-track-row" aria-hidden="true">
        {items.map((step, i) => {
          const state =
            i === current ? 'current' : i < current ? 'done' : '';
          const problem = i === current && step.tone === 'problem';
          return (
            <div
              key={`${step.label}-${i}`}
              className={[
                'mds-status-track-step',
                state ? `mds-status-track-step--${state}` : '',
                problem ? 'mds-status-track-step--problem' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="mds-status-track-dot-row">
                <span className="mds-status-track-dot" />
              </span>
              <span className="mds-status-track-label mds-type-micro">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
