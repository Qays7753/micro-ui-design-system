/**
 * ghostClickGuard.ts — TEMPORARY sim-only guard for the vanishing-sheet bug
 * (جولة الناقد 2026-11-28; full evidence in REPORT-SIM «ملاحظات للجولة
 * النهائية»).
 *
 * Root cause (LIBRARY code — deliberately NOT patched here): the Sheet's
 * scrim dismisses on `click` (ds/src/components/Sheet/Sheet.tsx renders
 * `.mds-sheet-scrim` with onClick), while every opener fires `onPress` on
 * `pointerup` (ds/src/lib/use-press.ts). After a touch tap the browser
 * dispatches the tap's compatibility `click` at the same coordinates — the
 * sheet is mounted by then, so the ghost click lands on the freshly mounted
 * scrim and dismisses the sheet the instant it opens. Reproduced with real
 * tap() on Chromium AND WebKit (390×844, hasTouch+isMobile): the sheet is
 * mid-exit at 0 ms and gone by 400 ms on every opener.
 *
 * The guard swallows exactly ONE kind of click: a click that lands inside a
 * `.mds-sheet` overlay whose tap STARTED outside that same sheet. Identity,
 * not timing — no delays:
 *  - the ghost of the opening tap: pointerdown on the trigger (outside) →
 *    click retargeted to the scrim/panel (inside) → swallowed;
 *  - a real close-tap on the scrim: pointerdown ON the scrim (inside the
 *    same sheet) → passes, the sheet closes as the user asked;
 *  - a stacked sheet opened from inside another sheet: pointerdown in
 *    sheet A → click lands in sheet B (A ≠ B) → swallowed;
 *  - keyboard activation (Enter on a focused button) produces a click with
 *    no pointerdown of its own → passes untouched.
 * A canceled tap (scroll gesture → pointercancel) clears the tap identity,
 * so a stale gesture can never swallow a later legitimate click.
 *
 * This shim lives in the simulation only and must be REMOVED when the
 * library Sheet dismisses on the closing pointer instead of click.
 */

export function installGhostClickGuard(): () => void {
  // The sheet overlay the current tap STARTED in (null = outside any
  // sheet), and whether that tap is still awaiting its click.
  let downSheet: Element | null = null;
  let tapActive = false;

  const onDown = (e: Event) => {
    const t = e.target;
    downSheet = t instanceof Element ? t.closest('.mds-sheet') : null;
    tapActive = true;
  };

  const onCancel = () => {
    // A canceled tap never produces a click; drop its identity.
    downSheet = null;
    tapActive = false;
  };

  const onClick = (e: MouseEvent) => {
    if (!tapActive) return; // keyboard/synthetic click — never ours to judge
    const t = e.target;
    const clickSheet = t instanceof Element ? t.closest('.mds-sheet') : null;
    const startedOutside = downSheet !== clickSheet;
    tapActive = false;
    downSheet = null;
    if (clickSheet && startedOutside) {
      // The tap started outside the sheet it now lands in: the ghost of
      // the opening tap. Stop it before React's delegated listeners (at
      // the root) ever see it.
      e.stopPropagation();
      e.preventDefault();
    }
  };

  window.addEventListener('pointerdown', onDown, { capture: true });
  window.addEventListener('pointercancel', onCancel, { capture: true });
  window.addEventListener('click', onClick, { capture: true });
  return () => {
    window.removeEventListener('pointerdown', onDown, { capture: true });
    window.removeEventListener('pointercancel', onCancel, { capture: true });
    window.removeEventListener('click', onClick, { capture: true });
  };
}
