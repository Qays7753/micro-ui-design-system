import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { Metric } from './Metric';
import { MetricSmall } from '../MetricSmall/index';
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

  it('renders the source link in the SOURCE form only: caption-strong underlined text, never a forward icon (rule 52 per the review item 20)', () => {
    const { container } = render(<Metric label={LABEL} value="1,245" debt={SOURCE} />);
    const source = container.querySelector('.mds-metric-source') as HTMLElement;
    expect(source.textContent).toBe(SOURCE);
    expect(source.querySelector('svg')).toBeNull();
  });

  it('uses no brand-signal-text (owner terracotta decision)', () => {
    const css = readFileSync(join(__dirname, 'Metric.css'), 'utf8');
    expect(css).not.toContain('brand-signal-text');
  });

  it('hides the amount through the app context (batch-2 1.3, 23.22): bullets + unit in ONE element, no digit anywhere, aria says the hidden phrase', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Metric label={LABEL} value="1,245.750" trailing={UNIT} debt={SOURCE} />
      </AmountVisibilityProvider>,
    );
    const hiddenEl = container.querySelector('[data-ds-check="amount-hidden"]');
    expect(hiddenEl).not.toBeNull();
    const text = hiddenEl?.textContent ?? '';
    expect((text.match(/\u2022/g) || []).length).toBe(4);
    expect(text).toContain(UNIT);
    expect(/[0-9\u0660-\u0669]/.test(text)).toBe(false);
    // «1,245» never renders anywhere while hidden.
    expect(container.textContent).not.toContain('1,245');
    expect(container.textContent).toContain(ar['money.ariaHidden'].text);
    // MetricSmall rides the same path (it is Metric at size sm).
    const small = render(
      <AmountVisibilityProvider hidden>
        <MetricSmall label={LABEL} value="4,820" trailing={UNIT} />
      </AmountVisibilityProvider>,
    );
    expect(small.container.querySelector('[data-ds-check="amount-hidden"]')).not.toBeNull();
    expect(/[0-9]/.test(small.container.querySelector('[data-ds-check="amount-hidden"]')?.textContent ?? '')).toBe(false);
  });

  it('does not hide a missing «—» (nothing to hide) and keeps the value path when the context is visible', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Metric label={LABEL} debt={SOURCE} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('[data-ds-check="amount-hidden"]')).toBeNull();
    expect(container.querySelector('.mds-metric-value-whole')?.textContent).toBe('—');
  });
});
