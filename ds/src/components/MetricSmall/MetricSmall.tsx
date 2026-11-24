/**
 * MetricSmall — the Metric anatomy at number-lg 28/36 (BRIEF 9.3).
 *
 * Used inside FundCard, DebtSummary («لك»/«عليك») and AskComputedResult.
 * Everything else matches Metric: label 14/20/500, unit body-strong on
 * the baseline, diff with arrow and word in the state color, one source
 * line, skeleton when loading (the small 120×24 shape), «—» in the
 * value's own typography.
 */
import type { MetricSmallProps } from './MetricSmall.types';
import { Metric } from '../Metric/index';
import './MetricSmall.css';

export function MetricSmall({ size: _size, ...props }: MetricSmallProps) {
  return <Metric {...props} size="sm" className={['mds-metric-small', props.className].filter(Boolean).join(' ')} />;
}
