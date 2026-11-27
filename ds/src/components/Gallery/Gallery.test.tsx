import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { Gallery } from './Gallery';

const FOUR = [
  { value: 'a.jpg', caption: 'طحين' },
  { value: 'b.jpg', caption: 'طحين' },
  { value: 'c.jpg', caption: 'طحين' },
  { value: 'd.jpg', caption: 'طحين' },
];

describe('Gallery (BATCH2-SPECS §5.2)', () => {
  it('dots count equals photos count (ق1)', () => {
    const { container } = render(<Gallery items={FOUR} value={0} />);
    expect(container.querySelectorAll('.mds-gallery-dot').length).toBe(4);
  });

  it('single photo: no dots, no nav', () => {
    const { container } = render(<Gallery items={[{ value: 'a.jpg' }]} value={0} />);
    expect(container.querySelector('.mds-gallery-dots')).toBeNull();
    expect(container.querySelector('.mds-gallery-nav')).toBeNull();
  });

  it('the region carries the roledescription (§5.2 item 7)', () => {
    render(<Gallery items={FOUR} value={0} />);
    expect(screen.getByRole('region').getAttribute('aria-roledescription')).toBe(ar['sr.galleryRegion'].text);
  });

  it('each photo reads «صورة n من m» + the alt word', () => {
    render(<Gallery items={FOUR} value={0} />);
    const first = screen.getAllByRole('img')[0];
    expect(first.getAttribute('aria-label')).toContain('صورة 1 من 4');
    expect(first.getAttribute('aria-label')).toContain('طحين');
  });

  it('the hidden prev/next buttons exist for keyboard users', () => {
    const { container } = render(<Gallery items={FOUR} value={1} onChange={() => {}} />);
    expect(container.querySelectorAll('.mds-gallery-nav').length).toBe(2);
  });
});
