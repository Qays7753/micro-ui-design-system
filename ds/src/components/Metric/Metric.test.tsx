import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { Metric } from './Metric';
import { MetricStates } from './Metric.states';

const LABEL = ar['nav.finance'].text;
const UNIT = ar['money.unit'].text;
const SOURCE = ar['metric.sourceFrom'].text.replace('{counted}', ar['movement.counted'].text);

describe('Metric (BRIEF 9.3, 23.8 on white)', () => {
  it('renders label, value, cents, unit, diff and source in order', () => {
    const { container } = render(
      <Metric
        label={LABEL}
        value="1,245.750"
        trailing={UNIT}
        direction={<span>↑ 12% أعلى من أمس</span>}
        debt={SOURCE}
      />,
    );
    expect(container.querySelector('.mds-metric-label')?.textContent).toBe(LABEL);
    expect(container.querySelector('.mds-metric-value-whole')?.textContent).toBe('1,245');
    expect(container.querySelector('.mds-metric-value-cents')?.textContent).toBe('.750');
    expect(container.querySelector('.mds-metric-unit')?.textContent).toBe(UNIT);
    expect(container.querySelector('.mds-metric-diff')).not.toBeNull();
    expect(container.querySelector('.mds-metric-source')?.textContent).toBe(SOURCE);
    expect(MetricStates).toContain('withCents');
  });

  it('renders «—» in the value typography when missing (owner decision)', () => {
    const { container } = render(<Metric label={LABEL} />);
    const value = container.querySelector('.mds-metric-value') as HTMLElement;
    expect(value.textContent).toContain('—');
    expect(container.querySelector('.mds-metric-value--hero')).not.toBeNull();
    expect(MetricStates).toContain('missing');
  });

  it('omits the diff line without a comparison (23.8)', () => {
    const { container } = render(<Metric label={LABEL} value="1,245" />);
    expect(container.querySelector('.mds-metric-diff')).toBeNull();
    expect(MetricStates).toContain('noDiff');
  });

  it('shows the gray skeleton when loading — never a zero (9.3)', () => {
    const { container } = render(
      <Metric label={LABEL} value="0" loading debt={SOURCE} />,
    );
    expect(container.querySelector('.mds-metric-skeleton')).not.toBeNull();
    expect(container.querySelector('.mds-metric-value')).toBeNull();
    expect(container.querySelector('.mds-metric-diff')).toBeNull();
    expect(container.querySelector('.mds-metric-source')).toBeNull();
    expect(MetricStates).toContain('loading');
  });

  it('fires onDismiss when the source link is pressed', () => {
    const onDismiss = vi.fn();
    const { container } = render(<Metric label={LABEL} value="1,245" debt={SOURCE} onDismiss={onDismiss} />);
    const link = container.querySelector('.mds-metric-source') as HTMLElement;
    fireEvent.pointerDown(link);
    fireEvent.pointerUp(link);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('keeps ONE caption line under the number: the source only (owner decision)', () => {
    const { container } = render(<Metric label={LABEL} value="1,245" debt={SOURCE} />);
    const lines = container.querySelectorAll('.mds-metric-diff, .mds-metric-source');
    expect(lines.length).toBe(1);
  });

  it('uses no brand-signal-text (owner terracotta decision)', () => {
    const css = readFileSync(join(__dirname, 'Metric.css'), 'utf8');
    expect(css).not.toContain('brand-signal-text');
  });
});
