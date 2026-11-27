/**
 * JobTrack — the delivery stages (BATCH2-SPECS §4.3).
 *
 * StatusTrack in the delivery vocabulary: the app passes the stages it
 * shows; «تعذّر (بانتظار موافقة المالك)» = tone="problem" on the current
 * step. Everything else — anatomy, states, motion, 200%/320 — IS
 * StatusTrack's (§4.3 items 3-6). Used in the request ObjectSheet and
 * DriverJobCard; the ORDER's own progress is not this.
 */
import { StatusTrack } from '../StatusTrack/index';
import type { StatusTrackProps, StatusTrackStep } from '../StatusTrack/index';
import './JobTrack.css';

export type JobTrackProps = Omit<StatusTrackProps, 'items'> & {
  /** The delivery stages from the app. */
  items: readonly StatusTrackStep[];
};

export function JobTrack({ className, ...rest }: JobTrackProps) {
  return (
    <StatusTrack
      className={['mds-job-track', className].filter(Boolean).join(' ')}
      data-ds-check="job-track"
      {...rest}
    />
  );
}
