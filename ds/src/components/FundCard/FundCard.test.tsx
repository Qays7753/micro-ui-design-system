import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { FundCard } from './FundCard';

describe('FundCard (BATCH2-SPECS §2.3)', () => {
  it('renders the fund name with its lg balance', () => {
    const { container } = render(<FundCard label={ar['fund.cashDrawer'].text} variant="cash" value="1,280" />);
    expect(screen.getByText(ar['fund.cashDrawer'].text)).not.toBeNull();
    const money = container.querySelector('.mds-money');
    expect(money?.className).toContain('mds-number-lg');
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('1,280');
  });

  it('the attention dot exists ONLY with a draft (ق2)', () => {
    const plain = render(<FundCard label="أ" value={5} />);
    expect(plain.container.querySelector('.mds-fund-card-dot')).toBeNull();
    plain.unmount();
    const draft = render(<FundCard label="أ" value={5} draft />);
    expect(draft.container.querySelector('.mds-fund-card-dot')).not.toBeNull();
  });

  it('a negative balance keeps its minus with no extra colour class', () => {
    const { container } = render(<FundCard label="المحفظة" value={-3} />);
    const visual = container.querySelector('.mds-money-visual');
    expect(visual?.textContent).toContain('−3');
    expect(visual?.className).not.toContain('problem');
  });

  it('hidden amounts hide the balance AND the last-movement line (§2.3 item 6)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <FundCard label="أ" value={5} caption="آخر حركة: 3 د" />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('••••');
    expect(container.querySelector('.mds-fund-card-last')).toBeNull();
  });

  it('loading renders the skeleton card with no amounts', () => {
    const { container } = render(<FundCard label="أ" value={5} state="loading" />);
    expect(container.querySelector('.mds-fund-card--loading')).not.toBeNull();
    expect(container.querySelector('.mds-money')).toBeNull();
    expect(container.textContent).not.toContain('5');
  });

  it('the screen-reader label names the fund, the balance word and the draft', () => {
    render(<FundCard label={ar['fund.cashDrawer'].text} value={5} draft />);
    const label = screen.getByRole('button').getAttribute('aria-label') ?? '';
    expect(label).toContain(ar['fund.cashDrawer'].text);
    expect(label).toContain(ar['fund.balanceWord'].text);
    expect(label).toContain(ar['sr.fundHasDraft'].text);
  });
});
