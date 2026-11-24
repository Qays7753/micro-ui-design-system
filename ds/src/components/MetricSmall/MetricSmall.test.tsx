import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { MetricSmall } from './MetricSmall';
import { MetricSmallStates } from './MetricSmall.states';

const LABEL = ar['nav.finance'].text;

describe('MetricSmall (BRIEF 9.3: Metric anatomy at number-lg)', () => {
  it('renders the Metric anatomy with the small value class', () => {
    const { container } = render(<MetricSmall label={LABEL} value="1,245" />);
    expect(container.querySelector('.mds-metric-small')).not.toBeNull();
    expect(container.querySelector('.mds-metric-label')?.textContent).toBe(LABEL);
    expect(container.querySelector('.mds-metric-value-whole')?.textContent).toBe('1,245');
    expect(MetricSmallStates).toContain('default');
  });

  it('renders «—» in the small value typography when missing (owner decision)', () => {
    const { container } = render(<MetricSmall label={LABEL} />);
    expect(container.querySelector('.mds-metric-value')?.textContent).toContain('—');
    expect(MetricSmallStates).toContain('missing');
  });

  it('shows the small skeleton when loading (9.3)', () => {
    const { container } = render(<MetricSmall label={LABEL} loading />);
    expect(container.querySelector('.mds-metric-skeleton')).not.toBeNull();
    expect(MetricSmallStates).toContain('loading');
  });
});
