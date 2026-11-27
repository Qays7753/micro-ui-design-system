import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { LocationSlot } from './LocationSlot';

describe('LocationSlot (BATCH2-SPECS §4.7)', () => {
  it('renders the key, the address and the maps link', () => {
    render(<LocationSlot label="إلى" value="الزرقاء، حي معصوم" />);
    expect(screen.getByText('إلى')).not.toBeNull();
    expect(screen.getByText('الزرقاء، حي معصوم')).not.toBeNull();
    const link = screen.getByRole('link');
    expect(link.getAttribute('aria-label')).toBe(ar['sr.openMaps'].text);
  });

  it('the address is URL-encoded in the link (ق1)', () => {
    render(<LocationSlot label="إلى" value="الزرقاء، حي معصوم" />);
    const href = screen.getByRole('link').getAttribute('href') ?? '';
    expect(href).toContain('https://www.google.com/maps/search/?api=1&query=');
    expect(href).toContain(encodeURIComponent('الزرقاء، حي معصوم'));
  });

  it('no address: «—» and NO link (§4.7 item 4)', () => {
    const { container } = render(<LocationSlot label="من" value="" />);
    expect(screen.getByText('—')).not.toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });

  it('the aria key+address read together (§4.7 item 7)', () => {
    const { container } = render(<LocationSlot label="من" value="طبربور" />);
    expect(container.querySelector('.mds-location-slot-key')?.textContent).toBe('من');
    expect(container.querySelector('.mds-location-slot-address')?.textContent).toBe('طبربور');
  });
});
