/**
 * EmptyState — the ghost-preview empty surface (BRIEF 23.7).
 *
 * Two static skeleton-colored ghost ObjectRows (44 mark + two lines,
 * 72% / 48% widths per 23.10), the one body sentence, at most one
 * secondary action (و-1 item 14: none when the header carries the
 * creation button). Centered inside an r-lg 24 surface; content ≤ 280.
 */
import type { EmptyStateProps } from './EmptyState.types';
import './EmptyState.css';

export function EmptyState({
  label,
  trailing,
  className,
  id,
  style,
  ref,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-empty-state', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <div className="mds-empty-state-ghosts" aria-hidden="true">
        <div className="mds-empty-state-ghost">
          <span className="mds-empty-state-ghost-mark" />
          <span className="mds-empty-state-ghost-lines">
            <span className="mds-empty-state-ghost-line mds-empty-state-ghost-line--body" />
            <span className="mds-empty-state-ghost-line mds-empty-state-ghost-line--caption" />
          </span>
        </div>
        <div className="mds-empty-state-ghost">
          <span className="mds-empty-state-ghost-mark" />
          <span className="mds-empty-state-ghost-lines">
            <span className="mds-empty-state-ghost-line mds-empty-state-ghost-line--body" />
            <span className="mds-empty-state-ghost-line mds-empty-state-ghost-line--caption" />
          </span>
        </div>
      </div>
      <p className="mds-empty-state-sentence">{label}</p>
      {trailing ? <div className="mds-empty-state-action">{trailing}</div> : null}
    </div>
  );
}
