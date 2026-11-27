import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { TransferRow } from './TransferRow';

describe('TransferRow (BATCH2-SPECS §2.2)', () => {
  it('renders the route with the visual arrow and NO sign on Money (ق1)', () => {
    const { container } = render(
      <TransferRow from={ar['fund.cashDrawer'].text} to={ar['fund.bankAccount'].text} value={45} time="أمس 9:15 مساءً" />,
    );
    const visual = container.querySelector('.mds-money-visual');
    expect(visual?.textContent).toBe('45د'); // gap is CSS (flex gap), not text
    expect(visual?.textContent).not.toContain('+');
    expect(visual?.textContent).not.toContain('−');
  });

  it('the arrow is aria-hidden; the label carries «من» and «إلى» (ق2)', () => {
    const { container } = render(
      <TransferRow from="درج الكاش" to="الحساب البنكي" value={45} />,
    );
    expect(container.querySelector('.mds-transfer-row-arrow')?.getAttribute('aria-hidden')).toBe('true');
    const label = screen.getByRole('button').getAttribute('aria-label') ?? '';
    expect(label).toContain('من درج الكاش');
    expect(label).toContain('إلى الحساب البنكي');
    expect(label).not.toContain('←');
  });

  it('hidden amounts render «•••• د» (§2.2 item 6)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <TransferRow from="أ" to="ب" value={45} />
      </AmountVisibilityProvider>,
    );
    const text = container.querySelector('.mds-money-visual')?.textContent ?? '';
    expect(text).toContain('••••');
    expect(text).not.toContain('45');
  });

  it('a null value renders the missing dash, never a zero', () => {
    const { container } = render(
      <TransferRow from="أ" to="ب" value={null} />,
    );
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('—');
  });

  it('loading renders the skeleton row with no amounts', () => {
    const { container } = render(
      <TransferRow from="أ" to="ب" value={45} state="loading" />,
    );
    expect(container.querySelector('.mds-transfer-row--loading')).not.toBeNull();
    expect(container.querySelector('.mds-money')).toBeNull();
    expect(container.textContent).not.toContain('45');
  });
});
