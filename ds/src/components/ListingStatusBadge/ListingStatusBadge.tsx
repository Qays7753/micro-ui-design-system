/**
 * ListingStatusBadge — a listing's moderation status (BATCH2-SPECS §5.7).
 *
 * - StatusBadge in the three moderation tones; a rejection always
 *   renders its reason caption under the row/card (ق1).
 * - Screen reader: «مرفوض: الصور غير واضحة» (the group's aria composes
 *   the badge word + reason).
 */
import { t } from '../../i18n/ar';
import { StatusBadge } from '../StatusBadge/index';
import type { ListingStatusBadgeProps, ListingStatus } from './ListingStatusBadge.types';
import './ListingStatusBadge.css';

const WORD: Record<ListingStatus, 'listing.reviewPending' | 'listing.approved' | 'listing.rejected'> = {
  waiting: 'listing.reviewPending',
  done: 'listing.approved',
  rejected: 'listing.rejected',
};

const TONE: Record<ListingStatus, 'waiting' | 'done' | 'problem'> = {
  waiting: 'waiting',
  done: 'done',
  rejected: 'problem',
};

export function ListingStatusBadge({
  tone,
  caption,
  className,
  id,
  style,
  ref,
  ...rest
}: ListingStatusBadgeProps) {
  // ق1: a rejection without its reason is a caller bug — the test
  // asserts the guard; keep it env-free so no node types leak in.
  if (tone === 'rejected' && !caption) {
    throw new Error('ListingStatusBadge: rejected requires its reason caption (rule Q1)');
  }
  const word = t(WORD[tone]);
  return (
    <div
      ref={ref}
      id={id}
      style={style}
      role="status"
      aria-label={[word, tone === 'rejected' ? caption ?? '' : '']
        .filter(Boolean)
        .join(t('sr.listSeparator'))}
      className={['mds-listing-status', className].filter(Boolean).join(' ')}
      data-ds-check="listing-status-badge"
      {...rest}
    >
      <StatusBadge tone={TONE[tone]} label={word} />
      {tone === 'rejected' && caption ? (
        <span className="mds-listing-status-reason mds-type-caption">{caption}</span>
      ) : null}
    </div>
  );
}
