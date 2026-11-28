/**
 * AgendaList — items grouped by day (BATCH2-SPECS §3.4).
 *
 * - Per day WITH items: the pinned heading (23.24 (5)) «اليوم · خميس
 *   27/11» with the count at its end, then a Surface of ObjectRow rows
 *   (row-with-mark 72): the customer mark, name, content, and at the end
 *   the time (amount-row digits) with the StatusBadge under it.
 * - Days without items never render (ق1: no heading without rows — the
 *   caller omits them; the component also guards).
 * - Rows keep the app's time order (ق2 asserts the passed order).
 * - Screen reader: the heading is a real heading; each row reads the
 *   shared row pattern (§3.4 item 7).
 * - Empty (no days at all): EmptyState with NO button (§0.2 item 1).
 */
import { t } from '../../i18n/ar';
import { EmptyState } from '../EmptyState/index';
import { ObjectRow } from '../ObjectRow/index';
import { Skeleton } from '../Skeleton/index';
import { StatusBadge } from '../StatusBadge/index';
import { Surface } from '../Surface/index';
import type { AgendaDay, AgendaListProps } from './AgendaList.types';
import './AgendaList.css';

export function AgendaList({
  items,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: AgendaListProps) {
  const loading = state === 'loading';
  const days = items.filter((day: AgendaDay) => day.rows.length > 0);

  if (loading) {
    return (
      <div className="mds-agenda-list mds-agenda-list--loading" aria-busy="true" id={id} style={style} ref={ref} {...rest}>
        {[0, 1].map((i) => (
          <div className="mds-agenda-list-group" key={i}>
            <span><Skeleton variant="caption" /></span>
            <Surface>
              <ObjectRow label="…" leading={<Skeleton variant="mark" />} value={<Skeleton variant="caption" />} />
              <ObjectRow label="…" leading={<Skeleton variant="mark" />} value={<Skeleton variant="caption" />} />
            </Surface>
          </div>
        ))}
      </div>
    );
  }

  if (days.length === 0) {
    return <EmptyState label={t('agenda.emptyAll')} />;
  }

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-agenda-list', className].filter(Boolean).join(' ')}
      data-ds-check="agenda-list"
      {...rest}
    >
      {days.map((day) => (
        <div className="mds-agenda-list-group" key={day.label}>
          <h4 className="mds-agenda-list-heading">
            <span>{day.label}</span>
            <span className="mds-agenda-list-count">
              {t('sr.listSeparator')}{day.rows.length}
            </span>
          </h4>
          <Surface>
            {day.rows.map((row) => (
              <ObjectRow
                key={`${row.label}-${row.time}`}
                label={row.label}
                caption={row.caption}
                value={<bdi dir="ltr">{row.time}</bdi>}
                trailing={row.badge ?? (row.tone ? <StatusBadge tone={row.tone} /> : undefined)}
                onPress={row.onPress}
              />
            ))}
          </Surface>
        </div>
      ))}
    </div>
  );
}
