import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { offersCountWord, SupplierHeader } from './SupplierHeader';

describe('SupplierHeader (BATCH2-SPECS §5.4)', () => {
  it('renders the h1 name and the area/count caption', () => {
    render(<SupplierHeader label="مخبز الأصيل للجملة" caption="إربد" items={12} />);
    expect(screen.getByRole('heading', { level: 1, name: 'مخبز الأصيل للجملة' })).not.toBeNull();
    expect(screen.getByText(/إربد/).textContent).toContain('12');
  });

  it('the count wording follows 24.1(8) (ق1)', () => {
    expect(offersCountWord(0)).toContain('0');
    expect(offersCountWord(1)).toBe('عرض واحد');
    expect(offersCountWord(2)).toBe('عرضان');
    expect(offersCountWord(3)).toBe('3 عروض');
    expect(offersCountWord(11)).toBe('11 عرضاً');
  });

  it('approved: the aria reads «معتمد» (§5.4 item 7)', () => {
    render(<SupplierHeader label="مخبز" approved caption="إربد" items={12} />);
    expect(screen.getByText(/مخبز/).closest('div')?.getAttribute('aria-label')).toContain('معتمد');
  });

  it('loading: skeletons, no name', () => {
    const { container } = render(<SupplierHeader label="مخبز" state="loading" />);
    expect(container.querySelector('h1')).toBeNull();
    expect(container.querySelector('.mds-skeleton')).not.toBeNull();
  });
});
