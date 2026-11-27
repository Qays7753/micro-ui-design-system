import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useEffect } from 'react';
import { usePendingDelay } from './use-pending-delay';

afterEach(cleanup);

/** The delay token the hook rides (1.7 ت11: motion.pending-delay = 300). */
const DELAY = 300;

function Probe({ pending }: { pending: boolean }) {
  const show = usePendingDelay(pending);
  return <span data-testid="probe">{show ? 'shown' : 'hidden'}</span>;
}

describe('usePendingDelay (addendum 1.7 ت11)', () => {
  it('stays hidden while pending has not reached motion.pending-delay', () => {
    vi.useFakeTimers();
    const { getByTestId } = render(<Probe pending />);
    expect(getByTestId('probe').textContent).toBe('hidden');
    act(() => vi.advanceTimersByTime(DELAY - 1));
    expect(getByTestId('probe').textContent).toBe('hidden');
    vi.useRealTimers();
  });

  it('shows once pending held for the full delay', () => {
    vi.useFakeTimers();
    const { getByTestId } = render(<Probe pending />);
    act(() => vi.advanceTimersByTime(DELAY));
    expect(getByTestId('probe').textContent).toBe('shown');
    vi.useRealTimers();
  });

  it('never shows when the response arrives inside the delay (ت11: straight to the result)', () => {
    vi.useFakeTimers();
    const { getByTestId, rerender } = render(<Probe pending />);
    act(() => vi.advanceTimersByTime(DELAY - 100));
    rerender(<Probe pending={false} />);
    act(() => vi.advanceTimersByTime(DELAY * 2));
    expect(getByTestId('probe').textContent).toBe('hidden');
    vi.useRealTimers();
  });

  it('hides again when pending ends after showing', () => {
    vi.useFakeTimers();
    const { getByTestId, rerender } = render(<Probe pending />);
    act(() => vi.advanceTimersByTime(DELAY));
    expect(getByTestId('probe').textContent).toBe('shown');
    rerender(<Probe pending={false} />);
    expect(getByTestId('probe').textContent).toBe('hidden');
    vi.useRealTimers();
  });

  it('restarts the delay when pending flips false then true again', () => {
    vi.useFakeTimers();
    const { getByTestId, rerender } = render(<Probe pending />);
    act(() => vi.advanceTimersByTime(DELAY - 100));
    rerender(<Probe pending={false} />);
    rerender(<Probe pending />);
    act(() => vi.advanceTimersByTime(DELAY - 100));
    expect(getByTestId('probe').textContent).toBe('hidden');
    act(() => vi.advanceTimersByTime(100));
    expect(getByTestId('probe').textContent).toBe('shown');
    vi.useRealTimers();
  });

  it('unmounting inside the delay leaves no timer behind', () => {
    vi.useFakeTimers();
    const effect = vi.fn();
    function Once() {
      useEffect(effect, []);
      usePendingDelay(true);
      return null;
    }
    const { unmount } = render(<Once />);
    unmount();
    act(() => vi.advanceTimersByTime(DELAY * 2));
    expect(effect).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
