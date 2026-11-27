/**
 * use-pending-delay.ts — the pending indicator delay (addendum 1.7 ت11,
 * token motion.pending-delay 300).
 *
 * «يُرسل…» and the button's spinner appear ONLY after motion.pending-delay:
 * a pending that resolves inside the delay never shows an indicator at
 * all — the state jumps straight to its result («حُفظ»), which is the
 * whole point of the delay (a 100ms flash of a spinner reads as a glitch,
 * not as work). The hook is the single owner of that timing so SaveState,
 * Button (and any future pending surface) cannot drift apart.
 *
 * The hook is a presentation rule, not a data rule: the caller's own
 * `pending` flag is the truth (aria-busy, disabled-while-pending are
 * immediate); only the VISUAL indicator waits. A pending that flips
 * false→true again starts a NEW session and waits the full delay again —
 * the output is derived per session (shown = the CURRENT session's timer
 * fired), so no synchronous setState runs inside the effect (lint:
 * set-state-in-effect).
 */
import { useEffect, useRef, useState } from 'react';
import { tokens } from '../tokens/tokens';

/** True only once `pending` has stayed true for motion.pending-delay. */
export function usePendingDelay(pending: boolean): boolean {
  // The pending session counter: every false→true transition starts a new
  // session. Tracked in refs written during render — the React-documented
  // adjustment pattern for values tied to the current render (no effect,
  // no state, nothing to cascade).
  const sessionRef = useRef(0);
  const wasPending = useRef(false);
  if (pending !== wasPending.current) {
    wasPending.current = pending;
    if (pending) sessionRef.current += 1;
  }
  const session = sessionRef.current;

  // `shownSession` = the session whose timer already fired — the ONLY
  // setState, and it runs inside the timeout, never synchronously in the
  // effect.
  const [shownSession, setShownSession] = useState(-1);

  useEffect(() => {
    if (!pending) return;
    const started = session;
    const id = window.setTimeout(() => setShownSession(started), tokens.motion['pending-delay']);
    return () => window.clearTimeout(id);
  }, [pending, session]);

  return pending && shownSession === session;
}
