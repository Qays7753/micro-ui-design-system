/**
 * App smoke test (SA1): the proof screen renders real @micro/ds components —
 * the header, the fixed simulation date, and the «يحتاجك» row with the
 * amount through Money. After the splash hands over, the screen is ready.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App (SA1 deployment proof)', () => {
  it('renders the library components on the proof screen', async () => {
    render(<App />);
    // The splash shows first, then hands over to the ready screen.
    await waitFor(
      () => {
        expect(document.querySelector('[data-sim-app]')?.getAttribute('data-sim-app')).toBe('ready');
      },
      { timeout: 2000 },
    );
    expect(screen.getByRole('heading', { name: 'مشروع اليوم' })).toBeTruthy();
    expect(screen.getByText('الجمعة 27/11/2026')).toBeTruthy();
    expect(screen.getByText('سلمى الحوراني')).toBeTruthy();
    expect(screen.getByText('فستان سهرة · طلب 1175')).toBeTruthy();
    // The amount goes through Money (BRIEF 8: never a raw «45 د» string).
    expect(document.querySelector('.mds-money')).toBeTruthy();
    expect(screen.getByText('جاهز')).toBeTruthy();
  });
});
