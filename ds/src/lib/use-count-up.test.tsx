import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCountUp } from './use-count-up';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

/** motion.count = 400ms (the token the hook rides). */
const MS = 400;

function Probe({ from, to, active }: { from: number; to: number; active: boolean }) {
  const value = useCountUp(from, to, active);
  return <span data-testid="probe">{value.toFixed(3)}</span>;
}

/** Deterministic rAF: frames flush ONE step at a time, never chained on a
 *  microtask queue (a microtask-chained stub drains the whole run in one
 *  await and the intermediate values never render). */
function stubRaf() {
  // The hook timestamps its run start with performance.now(); the stub's
  // clock must share that base or every t goes negative.
  let now = performance.now();
  let queue: Array<(t: number) => void> = [];
  vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => {
    queue.push(cb);
    return queue.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => undefined);
  return {
    async frame(step: number) {
      now += step;
      const cbs = queue;
      queue = [];
      for (const cb of cbs) cb(now);
    },
  };
}

describe('useCountUp (BRIEF 675 + 1.7 ت12)', () => {
  it('shows the value directly on first load (on-first-load: false)', () => {
    const { getByTestId } = render(<Probe from={100} to={1245.75} active={false} />);
    expect(getByTestId('probe').textContent).toBe('1245.750');
  });

  it('snaps when the change is not user-driven (active false)', () => {
    const { getByTestId, rerender } = render(<Probe from={100} to={1245.75} active={false} />);
    rerender(<Probe from={1245.75} to={1290.75} active={false} />);
    expect(getByTestId('probe').textContent).toBe('1290.750');
  });

  it('counts from → to over motion.count while active (the save sequence: value + activation together)', async () => {
    const raf = stubRaf();
    // the real sequence: the row sits at 1245.750, the save lands 1290.750
    const { getByTestId, rerender } = render(<Probe from={1245.75} to={1245.75} active={false} />);
    rerender(<Probe from={1245.75} to={1290.75} active={true} />);
    // the FIRST painted frame of the run is `from` — no flash of the target
    expect(getByTestId('probe').textContent).toBe('1245.750');
    await act(async () => {
      await raf.frame(MS / 4); // 25% through
    });
    const mid = Number(getByTestId('probe').textContent);
    expect(mid).toBeGreaterThan(1245.75);
    expect(mid).toBeLessThan(1290.75);
    await act(async () => {
      await raf.frame(MS / 4);
      await raf.frame(MS / 4);
      await raf.frame(MS / 4); // done
    });
    expect(getByTestId('probe').textContent).toBe('1290.750');
  });

  it('a new run after settling counts again from the new from', async () => {
    const raf = stubRaf();
    const { getByTestId, rerender } = render(<Probe from={1245.75} to={1245.75} active={false} />);
    rerender(<Probe from={1245.75} to={1290.75} active={true} />);
    await act(async () => {
      await raf.frame(MS);
    });
    expect(getByTestId('probe').textContent).toBe('1290.750');
    // the landing ends; the NEXT save re-activates with the new pair
    rerender(<Probe from={1290.75} to={1290.75} active={false} />);
    rerender(<Probe from={1290.75} to={1335.75} active={true} />);
    expect(getByTestId('probe').textContent).toBe('1290.750'); // first frame = from
    await act(async () => {
      await raf.frame(MS);
    });
    expect(getByTestId('probe').textContent).toBe('1335.750');
  });

  it('snaps under prefers-reduced-motion (no counting)', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('prefers-reduced-motion'),
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    const { getByTestId, rerender } = render(<Probe from={1245.75} to={1245.75} active={false} />);
    rerender(<Probe from={1245.75} to={1290.75} active={true} />);
    expect(getByTestId('probe').textContent).toBe('1290.750');
  });
});
