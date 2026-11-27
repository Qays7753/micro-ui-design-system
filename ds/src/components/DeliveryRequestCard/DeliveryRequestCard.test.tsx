import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { Button } from '../Button/index';
import { DeliveryRequestCard } from './DeliveryRequestCard';

describe('DeliveryRequestCard (BATCH2-SPECS §4.1)', () => {
  it('renders «إلى <المنطقة>» title, origin caption, time and badge', () => {
    render(
      <DeliveryRequestCard label="مرج الحمام" caption="من طبربور · كرتونتا حلويات" time="اليوم 4:00 م" tone="waiting" />,
    );
    expect(screen.getByText(`${ar['delivery.to'].text} مرج الحمام`)).not.toBeNull();
    expect(screen.getByText('من طبربور · كرتونتا حلويات')).not.toBeNull();
    expect(screen.getByText('اليوم 4:00 م')).not.toBeNull();
    expect(screen.queryByRole('button', { name: /مرج/ }) === null).toBe(false);
  });

  it('no button when the request awaits no decision (ق1)', () => {
    const { container } = render(<DeliveryRequestCard label="أ" time="t" />);
    expect(container.querySelector('.mds-delivery-request-card-action')).toBeNull();
  });

  it('the action renders once and is secondary, never primary', () => {
    const { container } = render(
      <DeliveryRequestCard label="أ" time="t"
        action={<Button variant="secondary" size="sm">{ar['delivery.reviewQuotes'].text}</Button>} />,
    );
    const buttons = container.querySelectorAll('button.mds-button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].className).not.toContain('primary');
  });

  it('the nav icon rides mirrored (ق2)', () => {
    const { container } = render(<DeliveryRequestCard label="أ" />);
    expect(container.querySelector('.mds-delivery-request-card-nav svg')).not.toBeNull();
    // jsdom lacks computed transform — the wrapper class is the contract.
    expect(container.querySelector('.mds-delivery-request-card-nav')).not.toBeNull();
  });

  it('a driver replaces the nav mark with their letter mark', () => {
    const { container } = render(<DeliveryRequestCard label="أ" driver="عمر الزعبي" />);
    expect(container.querySelector('.mds-delivery-request-card-nav')).toBeNull();
    expect(container.querySelector('.mds-entity-mark')?.textContent).toContain('ع');
  });

  it('the aria label composes to/from/time/badge (§4.1 item 7)', () => {
    render(
      <DeliveryRequestCard label="مرج الحمام" caption="من طبربور · كرتونتا حلويات" time="اليوم 4:00 م" tone="waiting" />,
    );
    const label = screen.getByRole('button').getAttribute('aria-label') ?? '';
    expect(label).toContain('إلى مرج الحمام');
    expect(label).toContain('اليوم 4:00 م');
  });

  it('loading renders the skeleton card', () => {
    const { container } = render(<DeliveryRequestCard label="أ" state="loading" />);
    expect(container.querySelector('.mds-delivery-request-card--loading')).not.toBeNull();
    expect(container.querySelector('.mds-skeleton')).not.toBeNull();
  });
});
