import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { formatPeriod } from '../../lib/format-period';
import { DatePicker } from './DatePicker';
import { MonthSheet } from './MonthSheet';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

/** The spec's fixed clock: الجمعة 27/11/2026 (§3.4-10's data sits in it). */
function pinToday(): void {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 27, 12, 0, 0));
}

describe('DatePicker (ADDENDUM §3.4 — the composition)', () => {
  it('the field shows DD/MM/YYYY with the calendar icon; no input anywhere (criterion 1)', () => {
    pinToday();
    const { container } = render(<DatePicker label="تاريخ الاستحقاق" value="30/11/2026" />);
    expect((container.querySelector('.mds-date-field-text') as HTMLElement).textContent).toBe('30/11/2026');
    expect(container.querySelector('svg.mds-date-field-icon')).not.toBeNull();
    expect(container.querySelector('input')).toBeNull();
  });

  it('the field button is named «<التسمية>، 30 تشرين الثاني 2026» (§3.4-7)', () => {
    pinToday();
    render(<DatePicker label="تاريخ الاستحقاق" value="30/11/2026" />);
    const spoken = formatPeriod({ size: 'day', start: '30/11/2026' }, 0).spoken;
    expect(spoken).toBe('30 تشرين الثاني 2026');
    expect(
      screen.getByRole('button', {
        name: ar['datePicker.srName'].text.replace('{label}', 'تاريخ الاستحقاق').replace('{date}', spoken),
      }),
    ).not.toBeNull();
  });

  it('empty: no text and the icon stays; the clear needs optional + value (§3.4-2/4)', () => {
    pinToday();
    const { container, rerender } = render(<DatePicker label="تاريخ الاستحقاق" />);
    expect((container.querySelector('.mds-date-field-text') as HTMLElement).textContent).toBe('');
    expect(container.querySelector('.mds-icon-button')).toBeNull();
    // optional + value → the clear button
    rerender(<DatePicker label="تاريخ الاستحقاق" value="30/11/2026" optional />);
    expect(container.querySelector('.mds-icon-button')).not.toBeNull();
    // a value WITHOUT optional → no clear
    rerender(<DatePicker label="تاريخ الاستحقاق" value="30/11/2026" />);
    expect(container.querySelector('.mds-icon-button')).toBeNull();
  });

  it('the clear button emits undefined without opening the sheet (§3.4-2)', () => {
    pinToday();
    const onChange = vi.fn();
    render(<DatePicker label="تاريخ الاستحقاق" value="30/11/2026" optional onChange={onChange} />);
    press(screen.getByRole('button', { name: ar['sr.clear'].text }));
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('the sheet: PeriodSwitcher month-only (no label button) + MonthGrid single; no ActionBar (§3.4-2)', () => {
    pinToday();
    const { container } = render(<DatePicker label="تاريخ الاستحقاق" value="30/11/2026" />);
    press(screen.getByRole('button', { name: /تاريخ الاستحقاق/ }));
    // the sheet's grid, named by the month
    expect(screen.getByRole('grid', { name: 'تشرين الثاني 2026' })).not.toBeNull();
    // month-only: the period label is NOT a button
    expect(container.querySelector('.mds-period-label--button')).toBeNull();
    // NO ActionBar in this sheet (§3.4-2)
    expect(container.querySelector('.mds-action-bar')).toBeNull();
  });

  it('criterion 2: choosing a day closes the sheet and writes DD/MM/YYYY', () => {
    pinToday();
    const onChange = vi.fn();
    render(<DatePicker label="تاريخ الاستحقاق" onChange={onChange} />);
    press(screen.getByRole('button', { name: /تاريخ الاستحقاق/ }));
    press(screen.getByRole('button', { name: /30 تشرين الثاني، اثنين/ }));
    expect(onChange).toHaveBeenCalledWith('30/11/2026');
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('the default month at open: the value\'s month, else the current month (§3.4-4)', () => {
    pinToday();
    render(<DatePicker label="تاريخ الاستحقاق" value="15/12/2026" />);
    press(screen.getByRole('button', { name: /تاريخ الاستحقاق/ }));
    expect(screen.getByRole('grid', { name: 'كانون الأول 2026' })).not.toBeNull();
    cleanup();
    render(<DatePicker label="تاريخ الاستحقاق" />);
    press(screen.getByRole('button', { name: /تاريخ الاستحقاق/ }));
    expect(screen.getByRole('grid', { name: 'تشرين الثاني 2026' })).not.toBeNull();
  });

  it('the arrows step the month and the grid follows (the sheet stays open)', () => {
    pinToday();
    render(<DatePicker label="تاريخ الاستحقاق" />);
    press(screen.getByRole('button', { name: /تاريخ الاستحقاق/ }));
    press(screen.getByRole('button', { name: ar['period.srMonthPrev'].text }));
    expect(screen.getByRole('grid', { name: 'تشرين الأول 2026' })).not.toBeNull();
    // the sheet is still open — no pick happened yet
    expect(screen.getByRole('grid')).not.toBeNull();
  });

  it('min/max disable the sheet\'s days (§3.4-3)', () => {
    pinToday();
    const { container } = render(
      <DatePicker label="تاريخ الاستحقاق" min="20/11/2026" max="28/11/2026" />,
    );
    press(screen.getByRole('button', { name: /تاريخ الاستحقاق/ }));
    const before = container.querySelector('[data-day="19/11/2026"]') as HTMLButtonElement;
    const inside = container.querySelector('[data-day="27/11/2026"]') as HTMLButtonElement;
    expect(before.disabled).toBe(true);
    expect(inside.disabled).toBe(false);
  });

  it('the value selects its day only inside the displayed month', () => {
    pinToday();
    const { container } = render(<DatePicker label="تاريخ الاستحقاق" value="15/12/2026" />);
    press(screen.getByRole('button', { name: /تاريخ الاستحقاق/ }));
    // the displayed month is 12/2026 (the value's) — the 15th is selected
    const day15 = container.querySelector('[data-day="15/12/2026"]') as HTMLElement;
    expect(day15.className).toContain('mds-month-cell-button--selected');
  });

  it('the error state: the problem border and the choose line (§3.4-4)', () => {
    pinToday();
    const { container } = render(<DatePicker label="تاريخ الاستحقاق" state="error" />);
    expect(container.querySelector('.mds-date-field-box--error')).not.toBeNull();
    expect(screen.getByText(ar['dateQuick.choose'].text)).not.toBeNull();
  });
});

describe('MonthSheet (the shared sheet — ADDENDUM §3.4-2)', () => {
  it('DateQuickChips\' own title rides the same composition', () => {
    pinToday();
    render(
      <MonthSheet
        label={ar['dateQuick.other'].text}
        value="27/11/2026"
        onChange={() => undefined}
        onDismiss={() => undefined}
      />,
    );
    expect(screen.getByRole('grid', { name: 'تشرين الثاني 2026' })).not.toBeNull();
    expect(screen.getByRole('button', { name: ar['period.srMonthPrev'].text })).not.toBeNull();
  });
});
