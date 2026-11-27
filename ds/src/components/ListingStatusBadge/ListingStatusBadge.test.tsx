import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { ListingStatusBadge } from './ListingStatusBadge';

describe('ListingStatusBadge (BATCH2-SPECS §5.7)', () => {
  it('waiting and done render their badge words', () => {
    const w = render(<ListingStatusBadge tone="waiting" />);
    expect(w.getByText(ar['listing.reviewPending'].text)).not.toBeNull();
    w.unmount();
    const d = render(<ListingStatusBadge tone="done" />);
    expect(d.getByText(ar['listing.approved'].text)).not.toBeNull();
  });

  it('rejected ALWAYS carries its reason (ق1)', () => {
    const { container } = render(<ListingStatusBadge tone="rejected" caption="الصور غير واضحة" />);
    expect(container.textContent).toContain(ar['listing.rejected'].text);
    expect(container.textContent).toContain('الصور غير واضحة');
  });

  it('rejected without a reason throws in dev (ق1 guard)', () => {
    expect(() => render(<ListingStatusBadge tone="rejected" />)).toThrow();
  });

  it('the aria reads «مرفوض: السبب» (§5.7 item 7)', () => {
    render(<ListingStatusBadge tone="rejected" caption="الصور غير واضحة" />);
    expect(screen.getByRole('status').getAttribute('aria-label')).toContain('الصور غير واضحة');
  });
});
