/**
 * Metric — the hero's stack on white (BRIEF 9.3, 23.8 «خارج السطح
 * البطل»).
 *
 * - Order: label 14/20/500 text-secondary → 4 → value display-hero
 *   40/48/500 text-primary tabular −0.01em (cents text-secondary, unit
 *   body-strong on the baseline 4 away) → 8 → diff line (arrow + word in
 *   the STATE color done/problem — with the arrow AND the word) → 12 →
 *   source link caption-strong text-primary.
 * - ONE caption line max under the number (owner decision 2026-11-25):
 *   the single source line IS that line.
 * - «—» keeps the value typography (owner decision 2026-11-25).
 * - Loading: the gray skeleton bar replaces the value — never a zero.
 * - No comparison → no diff line (23.8).
 */
import { usePress } from '../../lib/use-press';
import type { MetricProps } from './Metric.types';
import './Metric.css';

function splitValue(value: string): { whole: string; cents: string } {
  const dot = value.indexOf('.');
  if (dot === -1) return { whole: value, cents: '' };
  return { whole: value.slice(0, dot), cents: value.slice(dot) };
}

export function Metric({
  label,
  size = 'lg',
  value,
  trailing,
  direction,
  debt,
  onDismiss,
  loading = false,
  className,
  id,
  style,
  ref,
  ...rest
}: MetricProps) {
  const { isPressed, pressProps } = usePress({ onPress: () => onDismiss?.() });
  const { whole, cents } = splitValue(value ?? '—');
  const classes = ['mds-metric', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} id={id} style={style} className={classes} {...rest}>
      <span className="mds-metric-label mds-type-label">{label}</span>
      <p className="mds-metric-amount">
        {loading ? (
          <span className="mds-metric-skeleton" aria-busy="true" />
        ) : (
          <>
            <span
              className={[
                'mds-metric-value mds-metric-value--hero',
                size === 'sm' ? 'mds-number-lg' : 'mds-type-display-hero',
              ].join(' ')}
            >
              {/* LTR isolation like Money: the full number keeps its
                  logical digit order in the RTL line (A1). */}
              <bdi dir="ltr">
                <span className="mds-metric-value-whole">{whole}</span>
                {cents ? <span className="mds-metric-value-cents">{cents}</span> : null}
              </bdi>
            </span>
            {trailing ? <span className="mds-metric-unit">{trailing}</span> : null}
          </>
        )}
      </p>
      {direction && !loading ? <p className="mds-metric-diff">{direction}</p> : null}
      {debt && !loading ? (
        <button
          type="button"
          className={['mds-metric-source', isPressed ? 'mds-metric-source--pressed' : '']
            .filter(Boolean)
            .join(' ')}
          data-ds-exempt=""
          {...pressProps}
        >
          {debt}
        </button>
      ) : null}
    </div>
  );
}
