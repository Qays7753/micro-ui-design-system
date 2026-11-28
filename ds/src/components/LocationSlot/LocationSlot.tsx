/**
 * LocationSlot — one address line of a delivery (BATCH2-SPECS §4.7).
 *
 * - A plain row: map-pin 20 in text-secondary → 12 → «من»/«إلى» label
 *   and the address body (2 lines max).
 * - The «افتح في الخرائط» link at the end (label-strong + forward icon)
 *   opens https://www.google.com/maps/search/?api=1&query=<encoded
 *   address> (ق1: encodeURIComponent on the address).
 * - No address: «—» and NO link (§4.7 item 4). No reserved map area —
 *   the future map simply does not exist here yet (§4.7 item 2).
 * - Screen reader: «إلى: الزرقاء، حي معصوم»; the link reads «افتح
 *   العنوان في الخرائط، يفتح تطبيقاً آخر» (§4.7 item 7).
 */
import { t } from '../../i18n/ar';
import { ForwardIcon, MapPinIcon } from '../../icons';
import type { LocationSlotProps } from './LocationSlot.types';
import './LocationSlot.css';

export function LocationSlot({
  label,
  value,
  className,
  id,
  style,
  ref,
  ...rest
}: LocationSlotProps) {
  const hasAddress = Boolean(value && value.trim());
  const mapsUrl = hasAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value!.trim())}`
    : null;

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-location-slot', className].filter(Boolean).join(' ')}
      data-ds-check="location-slot"
      {...rest}
    >
      <span className="mds-location-slot-icon" aria-hidden="true">
        <MapPinIcon size={20} />
      </span>
      <span className="mds-object-row-text">
        <span className="mds-location-slot-key mds-type-label">{label}</span>
        <span className="mds-location-slot-address">
          {hasAddress ? value : '—'}
        </span>
      </span>
      {mapsUrl ? (
        <a
          className="mds-location-slot-link"
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={t('sr.openMaps')}
        >
          {t('location.openMaps')}
          <span aria-hidden="true"><ForwardIcon size={16} /></span>
        </a>
      ) : null}
    </div>
  );
}
