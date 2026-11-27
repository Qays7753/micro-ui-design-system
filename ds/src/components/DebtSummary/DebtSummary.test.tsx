import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { DebtSummary } from './DebtSummary';

describe('DebtSummary (BATCH2-SPECS §2.5)', () => {
  it('renders both columns with lg totals and their counts', () => {
    const { container } = render(
      <DebtSummary forYou={{ value: 45, counted: 'من عميل واحد' }} againstYou={{ value: '12,450.125', counted: 'من مورد واحد' }} />,
    );
    expect(screen.getByText(ar['debt.forYou'].text)).not.toBeNull();
    expect(screen.getByText(ar['debt.againstYou'].text)).not.toBeNull();
    const monies = container.querySelectorAll('.mds-money');
    expect(monies.length).toBe(2);
    expect(monies[0].className).toContain('mds-number-lg');
    expect(container.textContent).toContain('12,450.125');
  });

  it('zero renders a real zero, never the missing dash (§2.5 item 4)', () => {
    const { container } = render(
      <DebtSummary forYou={{ value: 0, counted: 'لا شيء' }} againstYou={{ value: 0, counted: 'لا شيء' }} />,
    );
    expect(container.querySelector('.mds-money-missing')).toBeNull();
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('0');
  });

  it('hidden amounts: bullets; the counts stay visible (§2.5 item 6)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <DebtSummary forYou={{ value: 45, counted: 'من عميل واحد' }} againstYou={{ value: 1280, counted: 'من مورد واحد' }} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelectorAll('.mds-money-visual')[0].textContent).toContain('••••');
    expect(container.textContent).toContain('من عميل واحد');
    expect(container.textContent).not.toContain('45 د');
  });

  it('loading renders skeletons with no amounts', () => {
    const { container } = render(
      <DebtSummary forYou={{ value: 45, counted: 'x' }} againstYou={{ value: 5, counted: 'y' }} state="loading" />,
    );
    expect(container.querySelector('.mds-debt-summary--loading')).not.toBeNull();
    expect(container.querySelector('.mds-money')).toBeNull();
    expect(container.textContent).not.toContain('45');
  });

  it('the group aria reads both sentences', () => {
    render(
      <DebtSummary forYou={{ value: 45, counted: 'من عميل واحد' }} againstYou={{ value: 1280, counted: 'من مورد واحد' }} />,
    );
    const label = screen.getByRole('group').getAttribute('aria-label') ?? '';
    expect(label).toContain('لك');
    expect(label).toContain('عليك');
    expect(label).toContain('45');
    expect(label).toContain('1280'); // aria words carry ungrouped digits (23.17)
  });

  it('no divider element between the columns (ق2)', () => {
    const { container } = render(
      <DebtSummary forYou={{ value: 1, counted: 'x' }} againstYou={{ value: 2, counted: 'y' }} />,
    );
    const second = container.querySelector('.mds-debt-summary-col + .mds-debt-summary-col');
    expect(second?.previousElementSibling?.tagName).not.toBe('HR');
  });
});
