import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { PaymentProgress } from './PaymentProgress';

describe('PaymentProgress (BATCH2-SPECS §2.6)', () => {
  it('renders the paid ratio as the fill width percentage (ق1)', () => {
    const { container } = render(<PaymentProgress value={35} total={80} />);
    const fill = container.querySelector<HTMLElement>('.mds-payment-progress-fill');
    expect(fill).not.toBeNull();
    expect(fill?.style.getPropertyValue('--mds-payment-progress-share')).toBe('43.8%');
  });

  it('always renders the textual line when numbers are shown (ق2)', () => {
    const { container } = render(<PaymentProgress value={35} total={80} />);
    const line = container.querySelector('.mds-payment-progress-line');
    expect(line).not.toBeNull();
    expect(line?.textContent).toContain('35 د');
    expect(line?.textContent).toContain('45 د');
  });

  it('zero paid renders the bare track and a zero line', () => {
    const { container } = render(<PaymentProgress value={0} total={80} />);
    const fill = container.querySelector<HTMLElement>('.mds-payment-progress-fill');
    expect(fill?.style.getPropertyValue('--mds-payment-progress-share')).toBe('0%');
    expect(screen.getByRole('progressbar')).not.toBeNull();
  });

  it('a complete debt fills the bar to 100%', () => {
    const { container } = render(<PaymentProgress value={80} total={80} />);
    const fill = container.querySelector<HTMLElement>('.mds-payment-progress-fill');
    expect(fill?.style.getPropertyValue('--mds-payment-progress-share')).toBe('100%');
  });

  it('hidden amounts: no bar, no ratio line, the hidden caption instead (§2.6 item 6)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <PaymentProgress value={35} total={80} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-payment-progress-track')).toBeNull();
    expect(container.querySelector('.mds-payment-progress-line')).toBeNull();
    expect(screen.getByText(ar['money.ariaHidden'].text)).not.toBeNull();
    expect(container.textContent).not.toContain('35');
    expect(container.textContent).not.toContain('45');
  });

  it('the progressbar role carries the aria value text (§2.6 item 7)', () => {
    render(<PaymentProgress value={35} total={80} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('43.8');
    expect(bar.getAttribute('aria-label')).toContain('35');
    expect(bar.getAttribute('aria-label')).toContain('80');
  });

  it('an invalid total renders an empty bar, never a fake ratio', () => {
    const { container } = render(<PaymentProgress value={35} total={0} />);
    const fill = container.querySelector<HTMLElement>('.mds-payment-progress-fill');
    expect(fill?.style.getPropertyValue('--mds-payment-progress-share')).toBe('0%');
  });
});
