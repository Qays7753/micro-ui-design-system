/**
 * App smoke test (SA6): the splash hands over to the ROLE screen (§5.8)
 * with its five rows and the version; entering the owner role shows the
 * shell — the sim bar (§5.4.1 with decisions 3+4: no note button, panels
 * hidden) above the screen area, and the SA7 screen placeholder underneath.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { SIM_VERSION } from './version';

describe('App (the SA6 shell)', () => {
  afterEach(() => {
    window.localStorage.clear();
    cleanup();
  });

  it('shows the role screen after the splash, with the five roles and the version', async () => {
    render(<App />);
    await waitFor(
      () => {
        expect(document.querySelector('[data-sim-role-screen]')).toBeTruthy();
      },
      { timeout: 2500 },
    );
    // §5.8: the five rows — name and role only, no explanation text.
    expect(screen.getByText('ورشة الياسمين للخياطة')).toBeTruthy();
    expect(screen.getByText('عمر الزعبي')).toBeTruthy();
    expect(screen.getByText('مخبز الأصيل للجملة')).toBeTruthy();
    expect(screen.getByText('مراجعة المنصة')).toBeTruthy();
    expect(screen.getByText('بلا حساب')).toBeTruthy();
    // §5.9: the version at the bottom, LTR-isolated.
    expect(document.querySelector('[data-sim-version]')?.getAttribute('data-sim-version')).toBe(SIM_VERSION);
  });

  it('entering the owner role shows the shell: the sim bar with version + task, no note/sliders buttons', async () => {
    render(<App />);
    await waitFor(
      () => expect(document.querySelector('[data-sim-role-screen]')).toBeTruthy(),
      { timeout: 2500 },
    );
    const row = screen.getByText('ورشة الياسمين للخياطة').closest('button')!;
    fireEvent.pointerDown(row);
    fireEvent.pointerUp(row);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 60));
    });
    // The shell: the sim bar and the screen area placeholder (SA7 fills).
    expect(document.querySelector('[data-sim-bar]')).toBeTruthy();
    expect(document.querySelector('[data-sim-role-screen]')).toBeNull();
    expect(document.querySelector('[data-sim-screen]')?.getAttribute('data-sim-screen')).toBe('today');
    // The task label before any task.
    expect(document.querySelector('.sim-bar__task')?.textContent).toBe('المهام');
  });

  it('the version badge opens the panel on a long press (decision 4)', async () => {
    render(<App />);
    await waitFor(
      () => expect(document.querySelector('[data-sim-role-screen]')).toBeTruthy(),
      { timeout: 2500 },
    );
    const row = screen.getByText('ورشة الياسمين للخياطة').closest('button')!;
    fireEvent.pointerDown(row);
    fireEvent.pointerUp(row);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 60));
    });
    const badge = document.querySelector('[data-sim-version]')!;
    await act(async () => {
      fireEvent.pointerDown(badge, { pointerId: 1 });
      await new Promise((r) => setTimeout(r, 600));
      fireEvent.pointerUp(badge, { pointerId: 1 });
    });
    // لوحة المحاكاة opened with its sections (§5.7).
    expect(document.querySelector('.sim-panel')).toBeTruthy();
    expect(screen.getByText('بلا اتصال')).toBeTruthy();
    expect(screen.getByText('إخفاء المبالغ')).toBeTruthy();
    expect(screen.getByText('غيّر الدور')).toBeTruthy();
    expect(screen.getByText('أعد البيانات')).toBeTruthy();
  });

  it('خط 200% marks the shell (data-sim-font) — the tiles stack hook (جولة الناقد)', async () => {
    // jsdom lacks the label→checkbox activation (the real toggle is proven
    // in the touch audit: computed 200%), so this drives the REAL hydration
    // path: a stored identity with fontScale 200 comes back from the device.
    window.localStorage.setItem(
      'micro-sim:v1',
      JSON.stringify({
        version: 1,
        state: { identity: { fontScale: 200 }, movements: [], orders: [], deliveries: [], listings: [], debts: [], drivers: [], notifications: [], reviewQueue: [], reportsQueue: [], driversQueue: [] },
      }),
    );
    render(<App />);
    await waitFor(
      () => expect(document.querySelector('[data-sim-role-screen]')).toBeTruthy(),
      { timeout: 2500 },
    );
    const row = screen.getByText('ورشة الياسمين للخياطة').closest('button')!;
    fireEvent.pointerDown(row);
    fireEvent.pointerUp(row);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 60));
    });
    expect(document.documentElement.style.fontSize).toBe('200%');
    expect(document.querySelector('[data-sim-app="ready"]')?.getAttribute('data-sim-font')).toBe('200');
    window.localStorage.clear();
  });
});
