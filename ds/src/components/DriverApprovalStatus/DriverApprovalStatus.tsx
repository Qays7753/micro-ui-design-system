/**
 * DriverApprovalStatus — the driver's approval banner (BATCH2-SPECS
 * §4.9).
 *
 * - waiting: «بانتظار الاعتماد» badge + «طلبك قيد المراجعة. ستصلك
 *   الطلبات بعد الاعتماد.». rejected: «مرفوض» + the reason in a Well
 *   (ق1: the reason ALWAYS renders with a rejection). approved: shows
 *   once after approval, then the app drops it.
 * - Screen reader: the state change is announced politely by the app's
 *   live region (23.17); the group itself carries the composed label.
 */
import { t } from '../../i18n/ar';
import { StatusBadge } from '../StatusBadge/index';
import { Well } from '../Well/index';
import type { DriverApprovalStatusProps } from './DriverApprovalStatus.types';
import './DriverApprovalStatus.css';

const TONE_TO_KEY = {
  waiting: 'driver.pending',
  approved: 'driver.approved',
  rejected: 'driver.rejected',
} as const;

const TONE_TO_BADGE = {
  waiting: 'waiting',
  approved: 'done',
  rejected: 'problem',
} as const;

export function DriverApprovalStatus({
  tone,
  caption,
  children,
  className,
  id,
  style,
  ref,
  ...rest
}: DriverApprovalStatusProps) {
  const badgeWord = t(TONE_TO_KEY[tone]);
  const sentence = children ?? (tone === 'waiting' ? t('driver.pendingSentence') : null);

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      role="group"
      aria-label={[badgeWord, sentence ?? '', tone === 'rejected' ? caption ?? '' : '']
        .filter(Boolean)
        .join(t('sr.listSeparator'))}
      className={['mds-driver-approval', className].filter(Boolean).join(' ')}
      data-ds-check="driver-approval-status"
      {...rest}
    >
      <StatusBadge tone={TONE_TO_BADGE[tone]} label={badgeWord} />
      {sentence ? <p className="mds-driver-approval-sentence mds-type-body">{sentence}</p> : null}
      {tone === 'rejected' ? <Well><span className="mds-type-body">{caption}</span></Well> : null}
    </div>
  );
}
