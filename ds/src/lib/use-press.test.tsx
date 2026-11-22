import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePress } from './use-press';

function PressProbe({
  onPress,
  onLongPress,
  disabled,
}: {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}) {
  const { isPressed, pressProps } = usePress({ onPress, onLongPress, disabled });
  return (
    <button type="button" data-pressed={isPressed ? 'yes' : 'no'} {...pressProps}>
      press me
    </button>
  );
}

function press(element: HTMLElement, clientX: number, clientY: number) {
  fireEvent.pointerDown(element, { clientX, clientY, pointerId: 1, button: 0, pointerType: 'touch' });
}

describe('usePress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires onPress on release and tracks the pressed state', () => {
    const onPress = vi.fn();
    render(<PressProbe onPress={onPress} />);
    const button = screen.getByRole('button');

    press(button, 100, 100);
    expect(button.dataset.pressed).toBe('yes');

    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(button.dataset.pressed).toBe('no');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('cancels when the pointer moves more than 8px (motion.press-cancel-px)', () => {
    const onPress = vi.fn();
    render(<PressProbe onPress={onPress} />);
    const button = screen.getByRole('button');

    press(button, 100, 100);
    fireEvent.pointerMove(button, { clientX: 120, clientY: 104, pointerId: 1 }); // > 8px
    expect(button.dataset.pressed).toBe('no');

    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('keeps the press when the pointer moves within 8px', () => {
    const onPress = vi.fn();
    render(<PressProbe onPress={onPress} />);
    const button = screen.getByRole('button');

    press(button, 100, 100);
    fireEvent.pointerMove(button, { clientX: 105, clientY: 104, pointerId: 1 }); // ~6.4px
    expect(button.dataset.pressed).toBe('yes');

    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('cancels on pointercancel (scrolling takes over)', () => {
    const onPress = vi.fn();
    render(<PressProbe onPress={onPress} />);
    const button = screen.getByRole('button');

    press(button, 100, 100);
    fireEvent.pointerCancel(button, { pointerId: 1 });
    expect(button.dataset.pressed).toBe('no');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('fires onLongPress after 500ms and suppresses onPress', () => {
    const onPress = vi.fn();
    const onLongPress = vi.fn();
    render(<PressProbe onPress={onPress} onLongPress={onLongPress} />);
    const button = screen.getByRole('button');

    press(button, 100, 100);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);

    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(onPress).not.toHaveBeenCalled(); // the long-press already acted
  });

  it('ignores presses entirely when disabled (BRIEF 23.24(15))', () => {
    const onPress = vi.fn();
    render(<PressProbe onPress={onPress} disabled />);
    const button = screen.getByRole('button');

    press(button, 100, 100);
    expect(button.dataset.pressed).toBe('no');
    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('ignores non-primary mouse buttons', () => {
    const onPress = vi.fn();
    render(<PressProbe onPress={onPress} />);
    const button = screen.getByRole('button');

    fireEvent.pointerDown(button, { clientX: 10, clientY: 10, button: 2, pointerType: 'mouse' });
    expect(button.dataset.pressed).toBe('no');
  });
});
