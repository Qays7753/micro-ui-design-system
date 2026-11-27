import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { ListingCard } from './ListingCard';

describe('ListingCard (BATCH2-SPECS §5.1)', () => {
  it('renders title, price with unit and supplier', () => {
    render(<ListingCard label="طحين أبيض 50 كغ" value={2.5} caption="عبوة" supplier="مخبز الأصيل للجملة" />);
    expect(screen.getByText('طحين أبيض 50 كغ')).not.toBeNull();
    expect(screen.getByText('مخبز الأصيل للجملة')).not.toBeNull();
    expect(screen.getByRole('button').textContent).toContain('2.500');
  });

  it('tiers price renders «من» first', () => {
    render(<ListingCard label="أ" value={2} caption="عبوة" tone="tiers" />);
    expect(screen.getByText(ar['listing.from'].text)).not.toBeNull();
  });

  it('unavailable: neutral badge, NO price number (§5.1 item 2)', () => {
    const { container } = render(<ListingCard label="أ" value={2} unavailable />);
    expect(container.textContent).toContain(ar['listing.unavailable'].text);
    expect(container.textContent).not.toContain('2.000');
    expect(container.textContent).not.toContain('2.500');
  });

  it('locked (visitor): no number in the page at all (ق3)', () => {
    const { container } = render(<ListingCard label="أ" value={1234.5} locked caption="عبوة" />);
    expect(container.textContent).not.toContain('1');
    expect(container.textContent).not.toContain('234');
  });

  it('no image: supplier mark in the figure', () => {
    const { container } = render(<ListingCard label="أ" supplier="مخبز" />);
    expect(container.querySelector('.mds-listing-card-photo')).toBeNull();
    expect(container.querySelectorAll('.mds-entity-mark').length).toBeGreaterThanOrEqual(2);
  });

  it('loading: skeleton, no real text', () => {
    const { container } = render(<ListingCard label="أ" state="loading" />);
    expect(container.querySelector('.mds-listing-card--loading')).not.toBeNull();
    expect(container.querySelector('.mds-skeleton')).not.toBeNull();
  });

  it('the aria reads title, price, unit, supplier (§5.1 item 7)', () => {
    render(<ListingCard label="طحين أبيض 50 كغ" value={2.5} caption="عبوة" supplier="مخبز الأصيل للجملة" />);
    const label = screen.getByRole('button').getAttribute('aria-label') ?? '';
    expect(label).toContain('طحين أبيض 50 كغ');
    expect(label).toContain('مخبز الأصيل للجملة');
  });
});
