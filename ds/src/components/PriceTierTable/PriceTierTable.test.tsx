import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { PriceTierTable } from './PriceTierTable';

const TIERS = [
  { from: 1, to: 10, price: 2.5 },
  { from: 11, to: 50, price: 2.25 },
  { from: 51, price: 2 },
];

describe('PriceTierTable (BATCH2-SPECS §5.3)', () => {
  it('renders the three column headers and every tier row', () => {
    render(<PriceTierTable items={TIERS} />);
    expect(screen.getByRole('columnheader', { name: ar['tier.from'].text })).not.toBeNull();
    expect(screen.getByRole('columnheader', { name: ar['tier.to'].text })).not.toBeNull();
    expect(screen.getByRole('columnheader', { name: ar['tier.pricePerUnit'].text })).not.toBeNull();
    expect(screen.getAllByRole('row').length).toBe(4); // header + 3 tiers
  });

  it('the LAST tier reads «فما فوق» in the إلى column', () => {
    render(<PriceTierTable items={TIERS} />);
    expect(screen.getByText(ar['tier.andAbove'].text)).not.toBeNull();
  });

  it('the table is named «شرائح السعر» (§5.3 item 7)', () => {
    render(<PriceTierTable items={TIERS} />);
    expect(screen.getByRole('table', { name: ar['tier.tableName'].text })).not.toBeNull();
  });

  it('locked: three well rows, NO number in the page (ق1)', () => {
    const { container } = render(<PriceTierTable items={TIERS} locked />);
    expect(container.querySelectorAll('.mds-price-tier-table-locked-row').length).toBe(3);
    expect(container.textContent).not.toContain('2.5');
    expect(container.textContent).not.toContain('51');
  });
});
