/**
 * use-count-up.ts — the number count-up (BRIEF 675: «الأرقام تعدّ (count)
 * حين تتغير بفعل المستخدم، وتظهر بقيمتها مباشرة عند التحميل الأول»;
 * addendum 1.7 ت12 wires it to the landed row's affected number).
 *
 * `from` → `to` over motion.count (400ms, ease-out) while `active` is
 * true — `active` is the CALLER's statement that THIS change came from a
 * user action (the save that just landed); data refreshes pass
 * active=false and snap straight to the value. First load shows the value
 * directly (on-first-load: false). With prefers-reduced-motion the number
 * snaps (no counting).
 *
 * The token's CSS easing curve is not callable from JS; easeOutCubic is
 * the standard reading of an "ease-out" curve (documented here — the
 * curve the token names, not a new design value).
 *
 * Lint discipline (set-state-in-effect, react-hooks/refs): every setState
 * runs inside a requestAnimationFrame callback (never synchronously in an
 * effect), no ref is touched during render, and the RETURNED value is
 * DERIVED — `to` whenever the run is not animating — so the rAF that
 * refreshes the internal mirror on a snap is invisible on screen, and the
 * first frame of a new run naturally shows `from` (the mirror still holds
 * the pre-change value, which IS the caller's `from`).
 */
import { useEffect, useRef, useState } from 'react';
import { tokens } from '../tokens/tokens';

/** ease-out as a callable curve (the token names the CSS keyword). */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** The number to display: `from` counting to `to` while `active`. */
export function useCountUp(from: number, to: number, active: boolean): number {
  // The internal mirror: the last number a frame actually drew. It starts
  // at `from` when the very first render is already mid-run, at `to`
  // otherwise (on-first-load: the value shows directly).
  const [displayed, setDisplayed] = useState(() => (active ? from : to));
  const rafRef = useRef(0);

  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced || !active || from === to) {
      // Not animating: keep the mirror fresh for the NEXT run's first
      // frame — through rAF, never a synchronous setState. The returned
      // value is derived from `to` while not animating, so this update
      // changes nothing on screen.
      const id = requestAnimationFrame(() => setDisplayed(to));
      return () => cancelAnimationFrame(id);
    }
    const started = performance.now();
    const ms = tokens.motion.count.ms;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / ms);
      setDisplayed(from + (to - from) * easeOutCubic(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, from, to, reduced]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const animating = active && !reduced && from !== to && displayed !== to;
  return animating ? displayed : to;
}
