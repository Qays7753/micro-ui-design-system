/**
 * SA3 — the provider: ONE store above the app, hydrated from the device on
 * mount, saved on every change (owner decision 2).
 */
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { SimProvider, useSim, useSimDispatch } from './store';

function Probe() {
  const state = useSim();
  const dispatch = useSimDispatch();
  return (
    <div>
      <output data-testid="role">{state.role ?? 'none'}</output>
      <output data-testid="movements">{state.movements.length}</output>
      <button type="button" onClick={() => dispatch({ type: 'role/enter', role: 'owner' })}>
        enter
      </button>
      <button type="button" onClick={() => dispatch({ type: 'movement/save', input: { type: 'in', fund: 'cash', amount: 25_000, party: 'رنا العبادي', note: 'بيع' } })}>
        save
      </button>
      <button type="button" onClick={() => dispatch({ type: 'data/reset' })}>
        reset
      </button>
    </div>
  );
}

function renderProbe() {
  const ui: ReactNode = (
    <SimProvider>
      <Probe />
    </SimProvider>
  );
  return render(ui);
}

describe('SA3 · the store provider', () => {
  it('starts from the trial data and records into the store', async () => {
    window.localStorage.clear();
    renderProbe();
    expect(screen.getByTestId('role').textContent).toBe('none');
    expect(screen.getByTestId('movements').textContent).toBe('22');
    await act(async () => {
      screen.getByText('enter').click();
    });
    expect(screen.getByTestId('role').textContent).toBe('owner');
    await act(async () => {
      screen.getByText('save').click();
    });
    expect(screen.getByTestId('movements').textContent).toBe('23');
  });

  it('persists on change and rehydrates on the next mount, then resets', async () => {
    window.localStorage.clear();
    const { unmount } = renderProbe();
    await act(async () => {
      screen.getByText('enter').click();
      screen.getByText('save').click();
    });
    unmount();

    const second = renderProbe();
    // The device state came back: the recorded movement is still there.
    expect(screen.getByTestId('movements').textContent).toBe('23');
    await act(async () => {
      screen.getByText('reset').click();
    });
    expect(screen.getByTestId('movements').textContent).toBe('22');
    second.unmount();
    const third = renderProbe();
    expect(screen.getByTestId('movements').textContent).toBe('22');
    third.unmount();
  });
});
