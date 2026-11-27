import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { ContactBar, toInternational } from './ContactBar';

describe('ContactBar (BATCH2-SPECS §4.5)', () => {
  it('renders call and whatsapp links with icons and labels', () => {
    render(<ContactBar value="079 123 4567" label="عمر الزعبي" />);
    expect(screen.getByText(ar['contact.call'].text)).not.toBeNull();
    expect(screen.getByText(ar['contact.whatsapp'].text)).not.toBeNull();
    expect(screen.getByLabelText('اتصل بـعمر الزعبي')).not.toBeNull();
  });

  it('international form in the links (ق1): 079… → +96279…', () => {
    render(<ContactBar value="079 123 4567" label="أ" />);
    const call = screen.getByLabelText(/اتصل بـ/);
    expect(call.getAttribute('href')).toBe('tel:+962791234567');
    const wa = screen.getByLabelText(/واتساب/);
    expect(wa.getAttribute('href')).toBe('https://wa.me/962791234567');
  });

  it('market adds the outside-Micro caption', () => {
    render(<ContactBar value="0791234567" label="أ" market />);
    expect(screen.getByText(ar['contact.marketNote'].text)).not.toBeNull();
  });

  it('locked shows placeholders, never a number (ق2)', () => {
    const { container } = render(<ContactBar value="0791234567" label="أ" locked />);
    expect(container.textContent).not.toContain('079');
    expect(container.textContent).not.toContain('962');
  });

  it('driver density grows the targets (class contract)', () => {
    const { container } = render(<ContactBar value="0791234567" label="أ" density="large" />);
    expect(container.querySelector('.mds-contact-bar--large')).not.toBeNull();
  });

  it('toInternational strips spaces and the leading zero', () => {
    expect(toInternational('079 123 4567')).toBe('+962791234567');
  });
});
