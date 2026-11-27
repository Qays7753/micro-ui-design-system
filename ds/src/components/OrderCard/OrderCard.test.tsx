import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { Button } from '../Button/index';
import { OrderCard } from './OrderCard';

describe('OrderCard (BATCH2-SPECS §3.1)', () => {
  it('renders the customer, content, value and the appointment line', () => {
    const { container } = render(
      <OrderCard label="سلمى الحوراني" caption="فستان سهرة × 2" value={45} time="التسليم اليوم 4:00 م" tone="done" />,
    );
    expect(screen.getByText('سلمى الحوراني')).not.toBeNull();
    expect(screen.getByText('فستان سهرة × 2')).not.toBeNull();
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('45');
    expect(screen.getByText('التسليم اليوم 4:00 م')).not.toBeNull();
    expect(container.querySelector('.mds-status-badge')).not.toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('at most one button, never primary (ق1)', () => {
    const { container } = render(
      <OrderCard label="أ" value={5} time="t"
        action={<Button variant="secondary" size="sm">{ar['button.recordPayment'].text}</Button>} />,
    );
    const buttons = container.querySelectorAll('button.mds-button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].className).not.toContain('primary');
  });

  it('no button inside the card link tree (ق2): the action is a sibling slot', () => {
    const { container } = render(
      <OrderCard label="أ" value={5}
        action={<Button variant="secondary" size="sm">x</Button>} />,
    );
    const cardRoot = container.querySelector('.mds-order-card');
    expect(cardRoot?.querySelector('.mds-order-card-action .mds-button')).not.toBeNull();
    expect(cardRoot?.querySelector('.mds-order-card-action .mds-button')?.closest('a')).toBeNull();
  });

  it('cancelled: secondary text, struck value, no button', () => {
    const { container } = render(
      <OrderCard label="أبو محمد" caption="ستائر محل" value={60} cancelled
        action={<Button variant="secondary" size="sm">x</Button>} />,
    );
    expect(container.querySelector('.mds-order-card--cancelled')).not.toBeNull();
    expect(container.querySelector('.mds-order-card--cancelled .mds-money-visual')).not.toBeNull(); // line-through via CSS (browser gates verify)
    expect(container.querySelector('.mds-order-card-action')).toBeNull();
  });

  it('hidden amounts hide the value only (§3.1 item 6)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <OrderCard label="أ" caption="س" value={45} time="t" />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('••••');
    expect(screen.getByText('س')).not.toBeNull();
  });

  it('the aria label composes all the fields', () => {
    render(
      <OrderCard label="سلمى الحوراني" caption="فستان سهرة × 2" value={45} time="التسليم اليوم 4:00 م" tone="done" />,
    );
    const label = screen.getByRole('button').getAttribute('aria-label') ?? '';
    expect(label).toContain('سلمى الحوراني');
    expect(label).toContain('45');
    expect(label).toContain('التسليم اليوم 4:00 م');
  });

  it('loading renders the skeleton with no real data', () => {
    const { container } = render(<OrderCard label="أ" value={5} state="loading" />);
    expect(container.querySelector('.mds-order-card--loading')).not.toBeNull();
    expect(container.querySelector('.mds-money')).toBeNull();
  });
});
