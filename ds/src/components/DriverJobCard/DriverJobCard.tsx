/**
 * DriverJobCard — one task at the driver (BATCH2-SPECS §4.8).
 *
 * - The «إلى <المنطقة>» title-section heading, then 8: LocationSlot
 *   «من» and «إلى», then surface-to-surface: the ContactBar to the
 *   owner (driver density), then 16: JobTrack, then 16: the stage area —
 *   quoting: the app's AmountField «سعرك» + its ONE primary «أرسل
 *   العرض»; active: EvidenceSlot (if required) then the app's
 *   slide-to-confirm; blocked: the secondary «لم أستطع التسليم»;
 *   awaiting-owner: the IssueProposalCard driver copy instead (§4.8
 *   item 4). ق2: at most one primary-or-slide element shows.
 * - ق1: every touch target ≥ touch-driver (CSS floors).
 * - Screen reader: the title is a real heading; stage changes announce
 *   politely (the app's live region, 23.17).
 */
import { ar } from '../../i18n/ar';
import { ContactBar } from '../ContactBar/index';
import { JobTrack } from '../JobTrack/index';
import { LocationSlot } from '../LocationSlot/index';
import { Skeleton } from '../Skeleton/index';
import type { DriverJobCardProps } from './DriverJobCard.types';
import './DriverJobCard.css';

export function DriverJobCard({
  label,
  origin,
  destination,
  owner,
  phone,
  items,
  value,
  stage = 'active',
  evidence = false,
  action,
  quote,
  proposal,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: DriverJobCardProps) {
  const loading = state === 'loading';

  if (loading) {
    return (
      <div className="mds-driver-job mds-driver-job--loading" aria-busy="true" id={id} style={style} ref={ref} {...rest}>
        <span><Skeleton variant="body" /></span>
        <span><Skeleton variant="caption" /></span>
        <span><Skeleton variant="body" /></span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-driver-job', className].filter(Boolean).join(' ')}
      data-ds-check="driver-job-card"
      {...rest}
    >
      <h3 className="mds-driver-job-title">{`${ar['delivery.to'].text} ${label}`}</h3>
      <LocationSlot label={ar['delivery.fromWord'].text} value={origin} />
      <LocationSlot label={ar['delivery.to'].text} value={destination} />
      <ContactBar value={phone} label={owner} density="large" />
      <JobTrack items={items} value={value} />
      {stage === 'awaiting-owner' && proposal ? (
        <div className="mds-driver-job-action">{proposal}</div>
      ) : (
        <div className="mds-driver-job-action">
          {stage === 'quoting' ? quote : null}
          {action /* active: evidence slot + slide; blocked: report button — the app's nodes */}
        </div>
      )}
    </div>
  );
}
