/**
 * SA7هـ — the visitor's market (§5.1 الزائر / §5.8): the GuestShell and
 * GoogleSignInSlot places carry their markers (no TabBar, no AskButton
 * before the login), the shared market body shows the prices LOCKED, and
 * «دخول تجريبي» rides the slot in part B (ر5.1's flow completes then).
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { App } from '../../App';

afterEach(cleanup);

async function press(el: Element) {
  const target = el.closest('button') ?? el;
  fireEvent.pointerDown(target, { pointerId: 1 });
  fireEvent.pointerUp(target, { pointerId: 1 });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
}

function renderApp() {
  // App carries its own SimProvider (the store the guestLogin flip uses).
  return render(<App />);
}

/** Renders and enters the guest role → السوق. */
async function enterGuest() {
  renderApp();
  await press(screen.getByText('بلا حساب'));
}

describe('SA7هـ — the visitor market (§5.1)', () => {
  test('the market shows 5 listings with the prices LOCKED for the visitor', async () => {
    await enterGuest();
    expect(screen.getAllByText('يُركَّب لاحقًا: ListingCard').length).toBe(5);
    // 10.2 (9): no price anywhere in the page for the visitor.
    expect(screen.getAllByText('السعر مقفل — يُركَّب لاحقًا: LockedDetails').length).toBe(5);
    expect(screen.queryByText('22 د / كيسان')).toBeNull();
    expect(screen.getByPlaceholderText('ابحث في السوق')).toBeTruthy();
  });

  test('no TabBar, no ContextBar and no AskButton before the login', async () => {
    await enterGuest();
    expect(screen.queryByRole('tablist')).toBeNull();
    // The shell's marker states it (م1 §1.24).
    expect(screen.getByText(/بلا TabBar ولا AskButton قبل الدخول/)).toBeTruthy();
    expect(screen.getByText('يُركَّب لاحقًا: GuestShell')).toBeTruthy();
    expect(screen.getByText('يُركَّب لاحقًا: GoogleSignInSlot')).toBeTruthy();
    // ر5.1's demo sign-in: a REAL secondary button rides the slot (جولة
    // الناقد — the journey was a dead end without it).
    expect(screen.getByRole('button', { name: 'دخول تجريبي' })).toBeTruthy();
  });

  test('«دخول تجريبي» flips the market to the registered buyer state (ر5.1)', async () => {
    await enterGuest();
    // The REAL button in the slot: pressing it flips the market — prices
    // show, the LockedDetails notes drop, and the slot notes the login.
    await press(screen.getByRole('button', { name: 'دخول تجريبي' }));
    expect(screen.queryByText('السعر مقفل — يُركَّب لاحقًا: LockedDetails')).toBeNull();
    expect(screen.getAllByText(/22 د \/ كيسان/).length).toBe(1);
    expect(screen.getByText(/الأسعار والتواصل ظاهرة/)).toBeTruthy();
  });
});
