import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { DateQuickChips } from './DateQuickChips';
import type { DateQuickChipOption } from './DateQuickChips.types';

afterEach(() => {
  cleanup();
});

const QUICK: DateQuickChipOption[] = [
  { value: '27/11/2026', label: 'اليوم' },
  { value: '26/11/2026', label: 'أمس' },
  { value: '28/11/2026', label: 'غداً' },
];

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

describe('DateQuickChips (BATCH2-SPECS §1.8)', () => {
  it('renders the quick chips plus «تاريخ آخر» with the calendar icon', () => {
    const { container } = render(<DateQuickChips label="تاريخ البيع" items={QUICK} value="27/11/2026" />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    // the trailing chip carries the calendar icon (§1.8-2)
    const other = screen.getByRole('radio', { name: ar['dateQuick.other'].text });
    expect(other.querySelector('svg')).not.toBeNull();
    // criterion 3 (rule 11): no native date field anywhere — the row
    // renders buttons only, zero inputs of ANY type.
    expect(container.querySelector('input')).toBeNull();
  });

  it('is a radiogroup named by the label, chips named «اليوم، 27/11/2026» (§1.8-7)', () => {
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} />);
    expect(screen.getByRole('radiogroup', { name: 'تاريخ البيع' })).not.toBeNull();
    expect(screen.getByRole('radio', { name: 'اليوم، 27/11/2026' })).not.toBeNull();
    expect(screen.getByRole('radio', { name: 'غداً، 28/11/2026' })).not.toBeNull();
  });

  it('ONE selected chip at most — the matching quick chip (criterion 1)', () => {
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} value="27/11/2026" />);
    const checked = screen.getAllByRole('radio').filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0].getAttribute('aria-label')).toBe('اليوم، 27/11/2026');
  });

  it('a custom date becomes the trailing chip itself, selected, DD/MM/YYYY (§1.8-2, criterion 2)', () => {
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} value="14/07/2026" />);
    const checked = screen.getAllByRole('radio').filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0].textContent).toBe('14/07/2026');
    expect(checked[0].getAttribute('aria-label')).toBe('14/07/2026');
    // criterion 4: the date never repeats as a text under the component
    expect(screen.getAllByText('14/07/2026')).toHaveLength(1);
  });

  it('nothing chosen = no chip selected (§1.8-4)', () => {
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} />);
    expect(screen.getAllByRole('radio').every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('pressing a quick chip emits its date (§1.8-3)', () => {
    const onChange = vi.fn();
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} onChange={onChange} />);
    press(screen.getByRole('radio', { name: 'غداً، 28/11/2026' }));
    expect(onChange).toHaveBeenCalledWith('28/11/2026');
  });

  it('«تاريخ آخر» with no custom date opens THE composition month sheet (§3.4-2)', () => {
    const onChange = vi.fn();
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} onChange={onChange} />);
    press(screen.getByRole('radio', { name: ar['dateQuick.other'].text }));
    // the REAL month sheet: the grid + the month-only PeriodSwitcher
    expect(screen.getByRole('grid')).not.toBeNull();
    expect(screen.getByRole('button', { name: ar['period.srMonthPrev'].text })).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    // picking a day reports it and closes the sheet (criterion 2)
    press(screen.getByRole('button', { name: /30 تشرين الثاني، اثنين/ }));
    expect(onChange).toHaveBeenCalledWith('30/11/2026');
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('the sheet the chip opens respects the chips min and max (§1.8-3)', () => {
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} min="27/11/2026" />);
    press(screen.getByRole('radio', { name: ar['dateQuick.other'].text }));
    const before = screen.getByRole('button', { name: /26 تشرين الثاني، خميس/ }) as HTMLButtonElement;
    const today = screen.getByRole('button', { name: /27 تشرين الثاني، جمعة/ }) as HTMLButtonElement;
    expect(before.disabled).toBe(true);
    expect(today.disabled).toBe(false);
  });

  it('a quick chip outside [min, max] disables (§1.8-3)', () => {
    render(<DateQuickChips label="تاريخ البيع" items={QUICK} min="27/11/2026" max="27/11/2026" />);
    const yesterday = screen.getByRole('radio', { name: 'أمس، 26/11/2026' }) as HTMLButtonElement;
    expect(yesterday.disabled).toBe(true);
    const today = screen.getByRole('radio', { name: 'اليوم، 27/11/2026' }) as HTMLButtonElement;
    expect(today.disabled).toBe(false);
  });

  it('the save-time error shows «اختر التاريخ» under the row (§1.8-4)', () => {
    const { rerender } = render(<DateQuickChips label="تاريخ البيع" items={QUICK} />);
    expect(screen.queryByText(ar['dateQuick.choose'].text)).toBeNull();
    rerender(<DateQuickChips label="تاريخ البيع" items={QUICK} state="error" />);
    expect(screen.getByText(ar['dateQuick.choose'].text)).not.toBeNull();
  });
});
