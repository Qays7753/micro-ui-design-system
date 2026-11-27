/**
 * IssueProposalCard — the driver's «تعذّر» proposal (BATCH2-SPECS §4.4).
 *
 * - Header: job-failed 20 in problem-fg (the ONLY coloured stroke — ق2:
 *   the surface stays plain) → 8 → «تعذّر التسليم» title-card.
 * - The reason and proposed action in a KeyValueList inside a Well.
 * - Owner: «وافق» secondary + «ارفض» text (chip-gap), then the outcome
 *   sentence caption. Driver: a waiting StatusBadge «بانتظار موافقة
 *   المالك» instead — ق1: no buttons in the driver copy.
 * - decided: the app's decision line («وافقت · 10:42 ص») replaces the
 *   buttons row.
 * - Screen reader: «تعذّر التسليم. السبب: … الإجراء المقترح: …» (§4.4
 *   item 7); arrival announced politely (23.17) by the app's live region.
 */
import { ar } from '../../i18n/ar';
import { JobFailedIcon } from '../../icons';
import { Skeleton } from '../Skeleton/index';
import { StatusBadge } from '../StatusBadge/index';
import { Surface } from '../Surface/index';
import { Well } from '../Well/index';
import type { IssueProposalCardProps } from './IssueProposalCard.types';
import './IssueProposalCard.css';

export function IssueProposalCard({
  label,
  items,
  audience = 'owner',
  accept,
  reject,
  result,
  decided,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: IssueProposalCardProps) {
  const loading = state === 'loading';
  const heading = label ?? ar['issue.title'].text;

  const ariaLabel = [
    heading,
    ...items.map((row) => `${row.key}: ${row.value}`),
    audience === 'driver' ? ar['issue.awaitingOwner'].text : '',
  ].join(ar['sr.listSeparator'].text + ' ');

  return (
    <Surface
      ref={ref}
      id={id}
      style={style}
      role="group"
      aria-label={ariaLabel}
      className={['mds-issue-proposal-card', loading ? 'mds-issue-proposal-card--loading' : '', className]
        .filter(Boolean)
        .join(' ')}
      data-ds-check="issue-proposal-card"
      {...rest}
    >
      {loading ? (
        <>
          <span><Skeleton variant="body" /></span>
          <Well><Skeleton variant="body" /><Skeleton variant="caption" /></Well>
        </>
      ) : (
        <>
          <span className="mds-issue-proposal-card-header">
            <span className="mds-issue-proposal-card-icon" aria-hidden="true">
              <JobFailedIcon size={20} />
            </span>
            <span>{heading}</span>
          </span>
          <Well>
            <dl className="mds-issue-proposal-card-list">
              {items.map((row) => (
                <div className="mds-issue-proposal-card-row" key={row.key}>
                  <dt className="mds-type-caption">{row.key}</dt>
                  <dd className="mds-type-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Well>
          {audience === 'owner' ? (
            decided !== undefined ? (
              <span className="mds-issue-proposal-card-decided mds-type-label-strong">{decided}</span>
            ) : (
              <>
                <span className="mds-issue-proposal-card-actions">
                  {accept}
                  {reject}
                </span>
                {result ? <span className="mds-issue-proposal-card-result mds-type-caption">{result}</span> : null}
              </>
            )
          ) : (
            <StatusBadge tone="waiting" label={ar['issue.awaitingOwner'].text} />
          )}
        </>
      )}
    </Surface>
  );
}
