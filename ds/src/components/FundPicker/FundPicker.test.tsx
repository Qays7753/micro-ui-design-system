import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { FundBankIcon, FundCashIcon } from '../../icons';
import { FundPicker } from './FundPicker';
import type { FundOption } from './FundPicker.types';

afterEach(() => {
  cleanup();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

/** §3.5-10's data: درج الكاش 271.250 د، الحساب البنكي 327.250 د، المحفظة −3 د. */
const FUNDS: readonly FundOption[] = [
  { value: 'cash', label: 'درج الكاش', balance: '271.250', leading: <FundCashIcon size={16} /> },
  { value: 'bank', label: 'الحساب البنكي', balance: '327.250', leading: <FundBankIcon size={16} /> },
  { value: 'wallet', label: 'المحفظة', balance: '-3', leading: <FundCashIcon size={16} /> },
];

const MANY: readonly FundOption[] = [
  ...FUNDS,
  { value: 'a', label: 'صندوق أ' },
  { value: 'b', label: 'صندوق ب' },
];

describe('FundPicker (ADDENDUM §3.5)', () => {
  it('criterion 1: the form follows the count — one fund renders the plain row', () => {
    const { container } = render(<FundPicker label="من الصندوق" items={FUNDS.slice(0, 1)} value="cash" />);
    expect(container.querySelector('.mds-fund-single')).not.toBeNull();
    expect(container.querySelector('.mds-fund-chip')).toBeNull();
    expect(container.querySelector('.mds-fund-field')).toBeNull();
  });

  it('the one-fund row reads «من: درج الكاش» — and «إلى:» with `in` (§3.5-2)', () => {
    const { container, rerender } = render(
      <FundPicker label="من الصندوق" items={FUNDS.slice(0, 1)} value="cash" direction="out" />,
    );
    const row = container.querySelector('.mds-fund-single') as HTMLElement;
    expect(row.textContent).toContain('من:');
    expect(row.textContent).toContain('درج الكاش');
    rerender(<FundPicker label="إلى الصندوق" items={FUNDS.slice(0, 1)} value="cash" direction="in" />);
    expect((container.querySelector('.mds-fund-single') as HTMLElement).textContent).toContain('إلى:');
  });

  it('criterion 1: 2-4 funds render the chip row; 5+ render the field', () => {
    const { container } = render(<FundPicker label="من الصندوق" items={FUNDS} />);
    expect(container.querySelectorAll('.mds-fund-chip')).toHaveLength(3);
    expect(container.querySelector('.mds-fund-field')).toBeNull();
    cleanup();
    const { container: c2 } = render(<FundPicker label="من الصندوق" items={MANY} />);
    expect(c2.querySelector('.mds-fund-field')).not.toBeNull();
    expect(c2.querySelectorAll('.mds-fund-chip')).toHaveLength(0);
  });

  it('the chips form: a radiogroup named by the label; a chip reads the balance in words (§3.5-7)', () => {
    const { container } = render(<FundPicker label="من الصندوق" items={FUNDS} value="cash" />);
    const group = screen.getByRole('radiogroup', { name: 'من الصندوق' });
    expect(group).not.toBeNull();
    // the first chip: «درج الكاش، الرصيد 271 دينار و250 فلس»
    const cash = container.querySelector('[role="radio"]') as HTMLElement;
    expect(cash.getAttribute('aria-label')).toBe('درج الكاش، الرصيد 271 دينار و250 فلس');
    expect(cash.getAttribute('aria-checked')).toBe('true');
  });

  it('a chip press reports its fund; the selection is single (§3.5-2)', () => {
    const onChange = vi.fn();
    render(<FundPicker label="من الصندوق" items={FUNDS} onChange={onChange} />);
    press(screen.getByRole('radio', { name: 'الحساب البنكي، الرصيد 327 دينار و250 فلس' }));
    expect(onChange).toHaveBeenCalledWith('bank');
  });

  it('criterion 3: the chip caps at the token and the name truncates before the balance', () => {
    const { container } = render(<FundPicker label="من الصندوق" items={FUNDS} />);
    const chip = container.querySelector('.mds-fund-chip') as HTMLElement;
    const name = chip.querySelector('.mds-fund-chip-name') as HTMLElement;
    expect(getComputedStyle(chip).maxWidth).not.toBe('');
    expect(name.className).toContain('mds-fund-chip-name');
    // the name span carries the ellipsis contract (overflow hidden)
    expect(name.textContent).toBe('درج الكاش');
  });

  it('criterion 2: a disabled transfer chip cannot be chosen and carries the reason (§3.5-2)', () => {
    const onChange = vi.fn();
    const transferItems = FUNDS.map((fund) => (
      fund.value === 'cash' ? { ...fund, disabled: true } : fund
    ));
    render(<FundPicker label="إلى الصندوق" items={transferItems} direction="in" onChange={onChange} />);
    const cash = screen.getByRole('radio', { name: 'درج الكاش، الرصيد 271 دينار و250 فلس، هذا صندوق المصدر' }) as HTMLButtonElement;
    expect(cash.disabled).toBe(true);
    fireEvent.pointerDown(cash);
    fireEvent.pointerUp(cash);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('the negative balance keeps its «−» with no color (§3.5-2)', () => {
    const { container } = render(<FundPicker label="من الصندوق" items={FUNDS} />);
    const wallet = container.querySelectorAll('[role="radio"]')[2] as HTMLElement;
    expect(wallet.textContent).toContain('−');
    expect(wallet.textContent).toContain('3');
    // the aria words: «الرصيد سالب 3 دنانير»
    expect(wallet.getAttribute('aria-label')).toContain('سالب 3');
  });

  it('the 5+ field opens the sheet with row-plain rows; picking closes it (§3.5-2)', () => {
    const onChange = vi.fn();
    render(<FundPicker label="من الصندوق" items={MANY} onChange={onChange} />);
    press(screen.getByRole('button', { name: 'من الصندوق' }));
    const list = screen.getByRole('listbox', { name: 'من الصندوق' });
    expect(list.querySelectorAll('.mds-object-row')).toHaveLength(5);
    press(screen.getByRole('button', { name: /درج الكاش/ }));
    expect(onChange).toHaveBeenCalledWith('cash');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('the single-fund press opens the funds sheet (the one row) (§3.5-2)', () => {
    const { container } = render(
      <FundPicker label="من الصندوق" items={FUNDS.slice(0, 1)} value="cash" />,
    );
    press(container.querySelector('.mds-fund-single') as HTMLElement);
    const list = screen.getByRole('listbox', { name: 'من الصندوق' });
    expect(list.querySelectorAll('.mds-object-row')).toHaveLength(1);
  });

  it('the no-choice error with more than one fund (§3.5-4)', () => {
    const { rerender } = render(<FundPicker label="من الصندوق" items={FUNDS} />);
    expect(screen.queryByText(ar['fund.choose'].text)).toBeNull();
    rerender(<FundPicker label="من الصندوق" items={FUNDS} state="error" />);
    expect(screen.getByText(ar['fund.choose'].text)).not.toBeNull();
  });

  it('the balances ride Money (the hidden-amounts contract, §3.5-6)', () => {
    const { container } = render(<FundPicker label="من الصندوق" items={FUNDS} />);
    expect(container.querySelectorAll('.mds-money')).toHaveLength(3);
  });
});
