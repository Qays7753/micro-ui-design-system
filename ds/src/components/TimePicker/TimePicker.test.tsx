import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { formatTimeValue } from '../../lib/format-time';
import { TimePicker } from './TimePicker';

afterEach(() => {
  cleanup();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

describe('TimePicker (BATCH2-SPECS §1.9 + ADDENDUM §2.4)', () => {
  it('the field shows the 12-hour form with ص/م, Western tabular digits (criterion 1)', () => {
    const { container } = render(<TimePicker label="وقت التسليم" value={960} />);
    // 960 = 16:00 = 4:00 م
    const text = container.querySelector('.mds-time-field-text') as HTMLElement;
    expect(text.textContent).toBe('4:00 م');
    // criterion 2: no native time input anywhere
    expect(container.querySelector('input')).toBeNull();
  });

  it('the field button is named «<التسمية>، 4:00 مساءً» (§1.9-7)', () => {
    render(<TimePicker label="وقت التسليم" value={960} />);
    expect(
      screen.getByRole('button', { name: ar['timePicker.srName'].text.replace('{label}', 'وقت التسليم').replace('{time}', '4:00 مساءً') }),
    ).not.toBeNull();
  });

  it('empty: the field carries the icon alone, no clear button (§1.9-4)', () => {
    const { container } = render(<TimePicker label="وقت التسليم" />);
    expect(container.querySelector('.mds-time-field-text')?.textContent).toBe('');
    expect(container.querySelector('.mds-icon-button')).toBeNull();
    expect(container.querySelector('svg.mds-time-field-icon')).not.toBeNull();
  });

  it('pressing the field opens the 92% sheet with the §2.4 anatomy', () => {
    const { container } = render(<TimePicker label="وقت التسليم" value={975} />);
    press(screen.getByRole('button', { name: /وقت التسليم/ }));
    // the number-lg draft «4:15 م» centered (the sheet's own value node —
    // the field text carries the same string)
    expect(container.querySelector('.mds-time-sheet-value')?.textContent).toBe('4:15 م');
    // the ص/م segments
    expect(screen.getByRole('button', { name: ar['time.am'].text })).not.toBeNull();
    expect(screen.getByRole('button', { name: ar['time.pm'].text })).not.toBeNull();
    // the hour radiogroup: 12 chips
    const hourGroup = screen.getByRole('radiogroup', { name: ar['time.hour'].text });
    expect(hourGroup.querySelectorAll('[role="radio"]')).toHaveLength(12);
    // the minute radiogroup: 4 chips at step 15
    const minuteGroup = screen.getByRole('radiogroup', { name: ar['time.minutes'].text });
    expect(minuteGroup.querySelectorAll('[role="radio"]')).toHaveLength(4);
    // the apply bar
    expect(screen.getByRole('button', { name: ar['timePicker.apply'].text })).not.toBeNull();
    // no ActionBar with no draft: the draft EXISTS here (from the value)
    expect(container.querySelector('.mds-action-bar')).not.toBeNull();
  });

  it('«—» before any choice, and the apply bar is disabled until one (§2.4)', () => {
    render(<TimePicker label="وقت التسليم" />);
    press(screen.getByRole('button', { name: 'وقت التسليم' }));
    expect(screen.getByText(ar['money.missing'].text)).not.toBeNull();
    const apply = screen.getByRole('button', { name: ar['timePicker.apply'].text }) as HTMLButtonElement;
    expect(apply.disabled).toBe(true);
    // pick an hour and a minute — the draft completes
    press(screen.getByRole('radio', { name: '4' }));
    expect(screen.getByText('4:00 ص')).not.toBeNull();
    press(screen.getByRole('radio', { name: '30' }));
    expect(screen.getByText('4:30 ص')).not.toBeNull();
    expect(apply.disabled).toBe(false);
  });

  it('picking hour + minute + period then applying emits the minutes value (§2.4)', () => {
    const onChange = vi.fn();
    render(<TimePicker label="وقت التسليم" onChange={onChange} />);
    press(screen.getByRole('button', { name: 'وقت التسليم' }));
    press(screen.getByRole('button', { name: ar['time.pm'].text }));
    press(screen.getByRole('radio', { name: '4' }));
    press(screen.getByRole('radio', { name: '30' }));
    press(screen.getByRole('button', { name: ar['timePicker.apply'].text }));
    // 4:30 م = 16:30 = 990 minutes
    expect(onChange).toHaveBeenCalledWith(990);
  });

  it('the clear button emits undefined without opening the sheet (§2.4)', () => {
    const onChange = vi.fn();
    render(<TimePicker label="وقت التسليم" value={960} onChange={onChange} />);
    press(screen.getByRole('button', { name: ar['sr.clear'].text }));
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.queryByRole('radiogroup', { name: ar['time.hour'].text })).toBeNull();
  });

  it('chips outside [min, max] disable — no valid completion exists with them', () => {
    render(<TimePicker label="وقت التسليم" min={540} max={720} />);
    press(screen.getByRole('button', { name: 'وقت التسليم' }));
    // 5:00 ص..12:00 م (540..720): in ص the hour 1 is impossible (1 ص < 540),
    // hour 5 is possible (5:00 ص = 300? NO — 5:00 ص = 300 < 540!). In ص
    // only 9..11 work (9 ص = 540). Hour 12 ص = 0 — impossible.
    const oneAm = screen.getByRole('radio', { name: '1' }) as HTMLButtonElement;
    expect(oneAm.disabled).toBe(true);
    const nine = screen.getByRole('radio', { name: '9' }) as HTMLButtonElement;
    expect(nine.disabled).toBe(false);
  });

  it('the save-time error shows «اختر الوقت» under the field (§1.9-4)', () => {
    const { rerender } = render(<TimePicker label="وقت التسليم" />);
    expect(screen.queryByText(ar['timePicker.choose'].text)).toBeNull();
    rerender(<TimePicker label="وقت التسليم" state="error" />);
    expect(screen.getByText(ar['timePicker.choose'].text)).not.toBeNull();
  });

  it('formatTimeValue: the spoken form expands ص/م (§1.9-7)', () => {
    expect(formatTimeValue(0).text).toBe('12:00 ص');
    expect(formatTimeValue(0).spoken).toBe('12:00 صباحاً');
    expect(formatTimeValue(720).text).toBe('12:00 م');
    expect(formatTimeValue(720).spoken).toBe('12:00 مساءً');
    expect(formatTimeValue(975).text).toBe('4:15 م');
  });
});
