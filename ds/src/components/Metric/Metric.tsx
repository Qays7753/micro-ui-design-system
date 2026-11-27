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
 * - Hidden amounts (batch-2 1.3, 23.22): the component READS the app-owned
 *   context itself — the value element renders exactly «•••• د» (bullets
 *   + the passed unit), carries NO digit and NO real value in the DOM (not
 *   even in aria — the visually-hidden span says «المبلغ مخفي»), and is
 *   tagged data-ds-check="amount-hidden" so ds-hidden-amounts verifies it
 *   on both engines and both views. The diff line stays arrow + word —
 *   the app passes the percent-free node when hidden (23.22 row 2).
 */
import { moneyTexts } from '../../i18n/ar';
import { useAmountVisibility } from '../../lib/amount-visibility';
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
  const { hidden: contextHidden } = useAmountVisibility();
  // 23.22 (batch-2 1.3): the metric reads the context itself. Missing
  // values («—») are NOT hidden — they carry no amount to hide.
  const hidden = contextHidden && value !== undefined && value !== null && !loading;
  const { whole, cents } = splitValue(hidden ? '—' : (value ?? '—'));
  const classes = ['mds-metric', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} id={id} style={style} className={classes} {...rest}>
      <span className="mds-metric-label mds-type-label">{label}</span>
      <p className="mds-metric-amount">
        {loading ? (
          <span className="mds-metric-skeleton" aria-busy="true" />
        ) : hidden ? (
          <>
            {/* 23.22: exactly «•••• د» inside ONE element (the gate reads
                the element's own text) — no digit, no real value anywhere
                in the DOM; ds-hidden-amounts verifies this node. */}
            <span
              className={[
                'mds-metric-value mds-metric-value--hero mds-metric-value--hidden',
                size === 'sm' ? 'mds-number-lg' : 'mds-type-display-hero',
              ].join(' ')}
              data-ds-check="amount-hidden"
              aria-hidden="true"
            >
              <bdi dir="ltr">
                <span className="mds-metric-value-whole">{moneyTexts.hiddenGlyph}</span>
              </bdi>
              {trailing ? <span className="mds-metric-unit">{trailing}</span> : null}
            </span>
            <span className="mds-visually-hidden">{moneyTexts.hidden}</span>
          </>
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
