import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { Button } from '../Button/index';
import { DriverJobCard } from './DriverJobCard';

const BASE = {
  label: 'الزرقاء، حي معصوم',
  origin: 'طبربور',
  destination: 'الزرقاء، حي معصوم',
  owner: 'ورشة الياسمين للخياطة',
  phone: '079 123 4567',
  items: [{ label: 'أُنشئ' }, { label: 'قيد التنفيذ' }, { label: 'تمّ' }],
  value: 1,
};

describe('DriverJobCard (BATCH2-SPECS §4.8)', () => {
  it('renders the heading, both locations, contact and the track', () => {
    render(<DriverJobCard {...BASE} />);
    expect(screen.getByRole('heading', { name: `${ar['delivery.to'].text} الزرقاء، حي معصوم` })).not.toBeNull();
    expect(screen.getByText('طبربور')).not.toBeNull();
    expect(screen.getByText(ar['contact.whatsapp'].text)).not.toBeNull();
    expect(screen.getByText('قيد التنفيذ')).not.toBeNull();
  });

  it('quoting: the quote slot + ONE primary action (ق2)', () => {
    const { container } = render(
      <DriverJobCard {...BASE} stage="quoting"
        quote={<input aria-label={ar['job.priceLabel'].text} />}
        action={<Button variant="primary">{ar['job.sendQuote'].text}</Button>} />,
    );
    expect(container.querySelectorAll('.mds-button--primary').length).toBe(1);
  });

  it('awaiting-owner: the proposal replaces the action area (§4.8 item 4)', () => {
    const { container } = render(
      <DriverJobCard {...BASE} stage="awaiting-owner"
        proposal={<div data-proposal>بانتظار موافقة المالك</div>}
        action={<Button variant="primary">لن يظهر</Button>} />,
    );
    expect(container.querySelector('[data-proposal]')).not.toBeNull();
    expect(container.querySelector('.mds-button--primary')).toBeNull();
  });

  it('loading renders the skeleton, no real data', () => {
    const { container } = render(<DriverJobCard {...BASE} state="loading" />);
    expect(container.querySelector('.mds-driver-job--loading')).not.toBeNull();
    expect(container.querySelector('.mds-location-slot')).toBeNull();
  });

  it('the contact bar rides driver density (class contract)', () => {
    const { container } = render(<DriverJobCard {...BASE} />);
    expect(container.querySelector('.mds-contact-bar--large')).not.toBeNull();
  });
});
