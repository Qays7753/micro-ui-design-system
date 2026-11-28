import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { QuantityStepper } from './QuantityStepper';

/** A controlled harness — the app owns the value (BRIEF 11). */
function StatefulStepper({ initial = 2, ...props }: { initial?: number; min?: number; max?: number }) {
  const [value, setValue] = useState(initial);
  return <QuantityStepper label="الكمية" value={value} onChange={setValue} {...props} />;
}

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

describe('QuantityStepper (BATCH2-SPECS §1.6)', () => {
  it('renders the LTR group: minus, field, plus (criterion 1)', () => {
    const { container } = render(<QuantityStepper label="الكمية" value={2} />);
    const group = container.querySelector('.mds-quantity-stepper') as HTMLElement;
    expect(group.getAttribute('dir')).toBe('ltr');
    const order = Array.from(group.children).map((el) => el.tagName.toLowerCase());
    expect(order).toEqual(['button', 'input', 'button']);
    // criterion 1: with dir=ltr the DOM order IS the visual order —
    // «+» (the LAST child) sits visually to the right of «−» (the first).
    expect(group.querySelector('button')).toBe(screen.getByRole('button', { name: ar['quantity.decrease'].text }));
    expect(group.querySelector('button:last-of-type')).toBe(screen.getByRole('button', { name: ar['quantity.increase'].text }));
  });

  it('is a group named by the label with the field named too (§1.6-7)', () => {
    const { container } = render(<QuantityStepper label="الكمية" value={2} />);
    expect(screen.getByRole('group', { name: 'الكمية' })).not.toBeNull();
    const input = container.querySelector('.mds-quantity-stepper-input') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('الكمية');
  });

  it('starts at min when the app passes no value (§1.6-4)', () => {
    const { container } = render(<QuantityStepper label="الكمية" min={1} />);
    expect((container.querySelector('.mds-quantity-stepper-input') as HTMLInputElement).value).toBe('1');
  });

  it('«−» carries aria-disabled at min, «+» at max (criterion 2, §1.6-4)', () => {
    const { rerender } = render(<QuantityStepper label="الكمية" value={0} min={0} max={2} />);
    const minus = screen.getByRole('button', { name: ar['quantity.decrease'].text });
    expect(minus.getAttribute('aria-disabled')).toBe('true');
    rerender(<QuantityStepper label="الكمية" value={2} min={0} max={2} />);
    const plus = screen.getByRole('button', { name: ar['quantity.increase'].text });
    expect(plus.getAttribute('aria-disabled')).toBe('true');
  });

  it('a quick tap steps once and emits the change (§1.6-5)', () => {
    const onChange = vi.fn();
    render(<QuantityStepper label="الكمية" value={2} min={0} max={10} onChange={onChange} />);
    press(screen.getByRole('button', { name: ar['quantity.increase'].text }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    press(screen.getByRole('button', { name: ar['quantity.decrease'].text }));
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('the held button repeats the step every 100ms (§1.6-5)', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<QuantityStepper label="الكمية" value={2} min={0} max={99} onChange={onChange} />);
    const plus = screen.getByRole('button', { name: ar['quantity.increase'].text });
    fireEvent.pointerDown(plus);
    // the long-press threshold fires the first repeat step + the cadence
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledTimes(5);
    // release stops the cadence
    fireEvent.pointerUp(plus);
    vi.advanceTimersByTime(1000);
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it('typing accepts in-range values live, out-of-range returns on blur (§1.6-5)', () => {
    const { container } = render(<StatefulStepper initial={2} min={0} max={10} />);
    const input = container.querySelector('.mds-quantity-stepper-input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '5' } });
    // an in-range typed value commits live (the controlled value follows)
    expect(input.value).toBe('5');
    fireEvent.change(input, { target: { value: '99' } });
    // an out-of-range draft is held in the field but never committed
    expect(input.value).toBe('99');
    fireEvent.blur(input);
    // the blur returns to the bound and the CONTROLLED display follows
    expect(input.value).toBe('10');
  });

  it('disabled never steps (23.2)', () => {
    const onChange = vi.fn();
    render(<QuantityStepper label="الكمية" value={2} min={0} max={10} onChange={onChange} disabled />);
    const plus = screen.getByRole('button', { name: ar['quantity.increase'].text }) as HTMLButtonElement;
    expect(plus.disabled).toBe(true);
    press(plus);
    expect(onChange).not.toHaveBeenCalled();
  });
});
