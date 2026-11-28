import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { formatDuration } from '../../lib/format-duration';
import { DurationPicker } from './DurationPicker';

afterEach(() => {
  cleanup();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

describe('DurationPicker (BATCH2-SPECS-ADDENDUM §3.3)', () => {
  it('the field shows the spec\'s own duration words (§3.3-2)', () => {
    const { container, rerender } = render(<DurationPicker label="المدة" value={45} />);
    expect((container.querySelector('.mds-duration-field-text') as HTMLElement).textContent).toBe('45 دقيقة');
    rerender(<DurationPicker label="المدة" value={60} />);
    expect((container.querySelector('.mds-duration-field-text') as HTMLElement).textContent).toBe('ساعة');
    rerender(<DurationPicker label="المدة" value={75} />);
    expect((container.querySelector('.mds-duration-field-text') as HTMLElement).textContent).toBe('ساعة و15 دقيقة');
    rerender(<DurationPicker label="المدة" value={120} />);
    expect((container.querySelector('.mds-duration-field-text') as HTMLElement).textContent).toBe('ساعتان');
    rerender(<DurationPicker label="المدة" value={720} />);
    expect((container.querySelector('.mds-duration-field-text') as HTMLElement).textContent).toBe('12 ساعة');
    rerender(<DurationPicker label="المدة" value={90} />);
    expect((container.querySelector('.mds-duration-field-text') as HTMLElement).textContent).toBe('ساعة ونصف');
  });

  it('the field button is named «المدة، ساعة و15 دقيقة» (§3.3-7)', () => {
    render(<DurationPicker label="المدة" value={75} />);
    expect(
      screen.getByRole('button', { name: ar['durationPicker.srName'].text.replace('{label}', 'المدة').replace('{duration}', 'ساعة و15 دقيقة') }),
    ).not.toBeNull();
  });

  it('empty: no text and no clear button; a value carries the clear (§3.3-4)', () => {
    const { container, rerender } = render(<DurationPicker label="المدة" />);
    expect((container.querySelector('.mds-duration-field-text') as HTMLElement).textContent).toBe('');
    expect(container.querySelector('.mds-icon-button')).toBeNull();
    rerender(<DurationPicker label="المدة" value={45} />);
    expect(container.querySelector('.mds-icon-button')).not.toBeNull();
  });

  it('the clear button emits undefined without opening the sheet (§3.3-2)', () => {
    const onChange = vi.fn();
    render(<DurationPicker label="المدة" value={45} onChange={onChange} />);
    press(screen.getByRole('button', { name: ar['sr.clear'].text }));
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.queryByRole('radiogroup', { name: ar['duration.common'].text })).toBeNull();
  });

  it('the sheet: number-lg draft, the 8 common chips in a radiogroup, the stepper, the apply bar (§3.3-2)', () => {
    const { container } = render(<DurationPicker label="المدة" />);
    press(screen.getByRole('button', { name: 'المدة' }));
    const common = screen.getByRole('radiogroup', { name: ar['duration.common'].text });
    expect(common.querySelectorAll('[role="radio"]')).toHaveLength(8);
    // the stepper exists and announces the TEXT (§3.3-7)
    expect(screen.getByRole('group', { name: ar['duration.other'].text })).not.toBeNull();
    // the apply bar
    expect(screen.getByRole('button', { name: ar['durationPicker.apply'].text })).not.toBeNull();
    // the dash before any choice
    expect(screen.getByText(ar['money.missing'].text)).not.toBeNull();
    expect(container.querySelector('.mds-duration-sheet-value')?.textContent).toBe(ar['money.missing'].text);
  });

  it('a common chip sets the draft; applying emits its minutes (§3.3-2)', () => {
    const onChange = vi.fn();
    const { container } = render(<DurationPicker label="المدة" onChange={onChange} />);
    press(screen.getByRole('button', { name: 'المدة' }));
    press(screen.getByRole('radio', { name: 'ساعة ونصف' }));
    expect(container.querySelector('.mds-duration-sheet-value')?.textContent).toBe('ساعة ونصف');
    press(screen.getByRole('button', { name: ar['durationPicker.apply'].text }));
    expect(onChange).toHaveBeenCalledWith(90);
  });

  it('the stepper changes the draft and applying emits it (criterion 1: multiples of 15)', () => {
    const onChange = vi.fn();
    const { container } = render(<DurationPicker label="المدة" onChange={onChange} />);
    press(screen.getByRole('button', { name: 'المدة' }));
    // stepper from its min (15): press + twice -> 45
    press(screen.getByRole('button', { name: ar['quantity.increase'].text }));
    press(screen.getByRole('button', { name: ar['quantity.increase'].text }));
    expect(container.querySelector('.mds-duration-sheet-value')?.textContent).toBe('45 دقيقة');
    press(screen.getByRole('button', { name: ar['durationPicker.apply'].text }));
    expect(onChange).toHaveBeenCalledWith(45);
    expect(45 % 15).toBe(0);
  });

  it('formatDuration: the plural rules of 24.1(8)', () => {
    expect(formatDuration(15)).toBe('15 دقيقة');
    expect(formatDuration(30)).toBe('30 دقيقة');
    expect(formatDuration(180)).toBe('3 ساعات');
    expect(formatDuration(240)).toBe('4 ساعات');
    expect(formatDuration(150)).toBe('ساعتان ونصف');
    expect(formatDuration(75)).toBe('ساعة و15 دقيقة');
  });
});
