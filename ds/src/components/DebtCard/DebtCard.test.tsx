import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { Button } from '../Button/index';
import { DebtCard } from './DebtCard';

describe('DebtCard (BATCH2-SPECS §2.4)', () => {
  it('renders the remaining amount in the debt form «لك 45 د»', () => {
    const { container } = render(
      <DebtCard label="سلمى الحوراني" value={45} debt="owed-to-you" caption="يستحق 30/11/2026" paid={35} total={80} />,
    );
    const visual = container.querySelector('.mds-money-visual');
    expect(visual?.textContent).toContain('لك');
    expect(visual?.textContent).toContain('45');
  });

  it('you-owe renders «عليك»', () => {
    const { container } = render(
      <DebtCard label="مؤسسة الخطيب للأقمشة" value={1280} debt="you-owe" />,
    );
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('عليك');
  });

  it('the overdue badge appears only with tone="overdue" (ق3)', () => {
    const open = render(<DebtCard label="أ" value={5} debt="owed-to-you" />);
    expect(open.container.querySelector('.mds-status-badge')).toBeNull();
    open.unmount();
    const overdue = render(<DebtCard label="أ" value={5} debt="owed-to-you" tone="overdue" />);
    expect(overdue.container.querySelector('.mds-status-badge')?.textContent).toContain(ar['debt.overdue'].text);
  });

  it('settled: the done badge shows and the button is gone (ق1-compatible)', () => {
    const { container } = render(
      <DebtCard label="رنا العبادي" value={0} debt="owed-to-you" tone="done"
        action={<Button variant="secondary" size="sm">{ar['button.recordPayment'].text}</Button>} />,
    );
    expect(container.querySelector('.mds-status-badge')?.textContent).toContain(ar['debt.settled'].text);
    expect(container.querySelector('.mds-debt-card-action')).toBeNull();
    expect(container.querySelector('.mds-debt-card-progress')).toBeNull();
  });

  it('at most one button: the action renders once (ق1)', () => {
    const { container } = render(
      <DebtCard label="أ" value={5} debt="owed-to-you" paid={1} total={5}
        action={<Button variant="secondary" size="sm">{ar['button.recordPayment'].text}</Button>} />,
    );
    expect(container.querySelectorAll('button.mds-button').length).toBe(1);
  });

  it('no «قرض» anywhere (ق2)', () => {
    const { container } = render(
      <DebtCard label="أ" value={5} debt="owed-to-you" paid={1} total={5}
        action={<Button variant="secondary" size="sm">{ar['button.recordPayment'].text}</Button>} />,
    );
    expect(container.textContent).not.toContain('قرض');
  });

  it('hidden amounts hide the remaining AND the progress (§2.4 item 6)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <DebtCard label="أ" value={5} debt="owed-to-you" paid={1} total={5} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('••••');
    expect(container.querySelector('.mds-debt-card-progress')).toBeNull();
  });

  it('the aria label carries the debt words and progress', () => {
    render(
      <DebtCard label="سلمى الحوراني" value={45} debt="owed-to-you" caption="يستحق 30/11/2026" paid={35} total={80} />,
    );
    const label = screen.getByRole('button').getAttribute('aria-label') ?? '';
    expect(label).toContain('لك');
    expect(label).toContain('دُفع');
  });
});
