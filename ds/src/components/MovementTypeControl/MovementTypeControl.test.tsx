import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { MovementTypeControl } from './MovementTypeControl';

afterEach(() => {
  cleanup();
});

describe('MovementTypeControl (BATCH2-SPECS §1.5)', () => {
  it('renders the three segments in the spec order (criterion 1)', () => {
    const { container } = render(<MovementTypeControl value="out" />);
    const labels = Array.from(
      container.querySelectorAll('.mds-movement-type-segment-label'),
    ).map((el) => el.textContent);
    expect(labels).toEqual([
      ar['movement.in'].text,
      ar['movement.out'].text,
      ar['movement.transfer'].text,
    ]);
    // no icons anywhere in the control (§1.5-2)
    expect(container.querySelector('svg')).toBeNull();
  });

  it('is a radiogroup named «نوع الحركة» with aria-checked segments (§1.5-7)', () => {
    render(<MovementTypeControl value="out" />);
    const group = screen.getByRole('radiogroup', { name: ar['movementType.srGroup'].text });
    expect(group).not.toBeNull();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
    expect(radios[0].getAttribute('aria-checked')).toBe('false');
    expect(radios[2].getAttribute('aria-checked')).toBe('false');
  });

  it('nothing chosen when the app passes no value (§1.5-4)', () => {
    render(<MovementTypeControl />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio.getAttribute('aria-checked')).toBe('false');
    }
  });

  it('emits the pressed direction (§1.5-3)', () => {
    const onChange = vi.fn();
    render(<MovementTypeControl value="in" onChange={onChange} />);
    fireEvent.pointerDown(screen.getByRole('radio', { name: ar['movement.transfer'].text }));
    fireEvent.pointerUp(screen.getByRole('radio', { name: ar['movement.transfer'].text }));
    expect(onChange).toHaveBeenCalledWith('transfer');
  });

  it('the save-time error shows «اختر نوع الحركة» under the control (§1.5-4)', () => {
    const { rerender } = render(<MovementTypeControl />);
    expect(screen.queryByText(ar['movementType.choose'].text)).toBeNull();
    rerender(<MovementTypeControl state="error" />);
    expect(screen.getByText(ar['movementType.choose'].text)).not.toBeNull();
  });

  it('the arrows walk the segments and fire the walked-to value (§1.5-7)', () => {
    const onChange = vi.fn();
    render(<MovementTypeControl value="in" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('radio', { name: ar['movement.in'].text }), {
      key: 'ArrowLeft',
    });
    expect(onChange).toHaveBeenCalledWith('out');
    fireEvent.keyDown(screen.getByRole('radio', { name: ar['movement.in'].text }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith('transfer');
  });

  it('disabled segments never fire (23.2)', () => {
    const onChange = vi.fn();
    render(<MovementTypeControl value="in" onChange={onChange} disabled />);
    const out = screen.getByRole('radio', { name: ar['movement.out'].text }) as HTMLButtonElement;
    expect(out.disabled).toBe(true);
    fireEvent.click(out);
    expect(onChange).not.toHaveBeenCalled();
  });
});
