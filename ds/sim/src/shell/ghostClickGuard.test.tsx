/**
 * The touch ghost-click guard test (جولة الناقد): the sheet opened by a
 * press MUST STAY OPEN through the tap's compatibility click — the browser
 * dispatches the tap's `click` at the opening coordinates after the sheet
 * has mounted, so without the guard that click lands on the fresh scrim and
 * the sheet dismisses the instant it opens (reproduced with real tap() on
 * Chromium and WebKit, 390×844, hasTouch+isMobile).
 *
 * The guard is identity-based, so the test proves all six paths:
 *  1. ghost click (tap started on the trigger, click lands on the scrim) →
 *     the sheet stays open — the regression the guard exists for;
 *  2. a real close-tap (pointerdown ON the scrim, then its click) → closes
 *     (after the 350ms settle window — a human aiming at the scrim);
 *  3. a click with no pointerdown of its own (keyboard Enter) → passes →
 *     closes — the guard never blocks non-pointer paths;
 *  4. a tap started INSIDE the sheet that clicks inside the SAME sheet
 *     (e.g. a row press) still reaches the row;
 *  5. جولة المستخدم: the second tap of a double-tap on the opener — a
 *     scrim click inside the settle window — does NOT kill the fresh sheet
 *     (the owner's «تظهر لحظة ثم تختفي», reproduced on Pixel 7 profiles);
 *  6. in-panel taps (the X close button) work even inside the settle
 *     window — only the scrim dismiss is suppressed while settling.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../App';

/** The project switcher button of the owner's context bar. */
function switcher(): HTMLElement {
  return document.querySelector('.mds-context-bar .mds-project-switcher') as HTMLElement;
}

/** Opens a sheet the way a finger does: pointerdown then pointerup. */
async function pressToOpen(el: HTMLElement) {
  // The two events run OUTSIDE act — React flushes each discrete event
  // synchronously, so the press hook sees isPressed=true at pointerup.
  fireEvent.pointerDown(el);
  fireEvent.pointerUp(el);
  await act(async () => {
    await new Promise((r) => setTimeout(r, 30));
  });
}

/** A bubbling click like the browser's compatibility click after a tap. */
function compatClick(target: Element) {
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

async function enterOwner() {
  render(<App />);
  await waitFor(() => expect(document.querySelector('[data-sim-role-screen]')).toBeTruthy(), {
    timeout: 2500,
  });
  const row = screen.getByText('ورشة الياسمين للخياطة').closest('button')!;
  await pressToOpen(row);
  await waitFor(() => expect(switcher()).toBeTruthy());
}

describe('ghostClickGuard (جولة الناقد — the sheet survives the opening tap)', () => {
  afterEach(() => {
    window.localStorage.clear();
    cleanup();
  });

  it('1. the compatibility click of the OPENING tap does not close the sheet', async () => {
    await enterOwner();
    await pressToOpen(switcher());
    const sheet = () => document.querySelector('.mds-sheet');
    expect(sheet()).toBeTruthy();
    // The ghost: the tap started on the switcher (outside the sheet); the
    // browser retargets its compatibility click to the mounted scrim.
    compatClick(document.querySelector('.mds-sheet-scrim')!);
    // The sheet is still open and NOT exiting.
    expect(sheet()).toBeTruthy();
    expect(sheet()!.className).not.toContain('mds-sheet--closing');
    expect(sheet()!.getAttribute('aria-label')).toBe('تبديل المشروع');
    // And it is still open a beat later — no delayed dismissal either.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 60));
    });
    expect(sheet()).toBeTruthy();
  });

  it('2. a real close-tap on the scrim still closes the sheet (after the settle window)', async () => {
    await enterOwner();
    await pressToOpen(switcher());
    compatClick(document.querySelector('.mds-sheet-scrim')!); // the opening tap's ghost
    const scrim = document.querySelector('.mds-sheet-scrim')!;
    // A human aiming at the scrim reacts AFTER the sheet has settled in
    // (the 350ms window covers the library's 240ms entry motion) — wait
    // it out, then tap: the guard must NOT eat a deliberate close.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 420));
    });
    // The user's own tap: pointerdown ON the scrim, then its click.
    await act(async () => {
      fireEvent.pointerDown(scrim);
      compatClick(scrim);
      await new Promise((r) => setTimeout(r, 60));
    });
    await waitFor(() => expect(document.querySelector('.mds-sheet')).toBeNull());
  });

  it('5. the second tap of a double-tap does NOT close the freshly opened sheet (جولة المستخدم)', async () => {
    // The owner's report: «نافذة تظهر لحظة ثم تختفي» — two rapid taps on
    // the opener: the first opens the sheet, the second's click lands on
    // the fresh scrim INSIDE the settle window and must be swallowed.
    await enterOwner();
    await pressToOpen(switcher());
    compatClick(document.querySelector('.mds-sheet-scrim')!); // tap 1's ghost — born
    const scrim = document.querySelector('.mds-sheet-scrim')!;
    // tap 2, ~120ms later (real double-tap speed): down + up on the scrim,
    // then its compatibility click — all inside the 350ms settle window.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 120));
    });
    fireEvent.pointerDown(scrim);
    fireEvent.pointerUp(scrim);
    compatClick(scrim);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 60));
    });
    expect(document.querySelector('.mds-sheet')).toBeTruthy();
    expect(document.querySelector('.mds-sheet')!.className).not.toContain('mds-sheet--closing');
    expect(document.querySelector('.mds-sheet')!.getAttribute('aria-label')).toBe('تبديل المشروع');
    // And it holds a beat later — no delayed vanish either.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 120));
    });
    expect(document.querySelector('.mds-sheet')).toBeTruthy();
  });

  it('6. an in-panel tap (the X button) works even inside the settle window', async () => {
    // The window only suppresses the SCRIM dismiss — a tap on the panel's
    // own close button right after opening still closes immediately.
    await enterOwner();
    await pressToOpen(switcher());
    compatClick(document.querySelector('.mds-sheet-scrim')!); // the ghost
    await act(async () => {
      await new Promise((r) => setTimeout(r, 80));
    });
    const close = document.querySelector('.mds-sheet-close button') as HTMLElement;
    fireEvent.pointerDown(close);
    fireEvent.pointerUp(close);
    compatClick(close);
    await waitFor(() => expect(document.querySelector('.mds-sheet')).toBeNull());
  });

  it('3. a click with no pointerdown (keyboard path) is never blocked', async () => {
    await enterOwner();
    await pressToOpen(switcher());
    compatClick(document.querySelector('.mds-sheet-scrim')!); // the opening tap's ghost
    // This click has NO pointerdown of its own (keyboard activation) — the
    // guard passes it and the scrim's own handler closes the sheet.
    compatClick(document.querySelector('.mds-sheet-scrim')!);
    await waitFor(() => expect(document.querySelector('.mds-sheet')).toBeNull());
  });

  it('4. a tap started inside the sheet still activates rows inside it', async () => {
    await enterOwner();
    await pressToOpen(switcher());
    compatClick(document.querySelector('.mds-sheet-scrim')!); // the ghost
    // «إخفاء المبالغ» lives inside the sheet; a tap on it (down + up, then
    // the tap's own click — all inside the SAME sheet) must reach it: the
    // SelectedIcon appears at the row's end when the amounts hide.
    const row = (await screen.findByText('إخفاء المبالغ')).closest('button')!;
    expect(row.querySelector('.mds-object-row-end .mds-icon')).toBeNull();
    fireEvent.pointerDown(row);
    fireEvent.pointerUp(row);
    compatClick(row);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(row.querySelector('.mds-object-row-end .mds-icon')).not.toBeNull();
    // The sheet stays open (the row toggles the amounts; it never closes).
    expect(document.querySelector('.mds-sheet')).toBeTruthy();
  });
});
