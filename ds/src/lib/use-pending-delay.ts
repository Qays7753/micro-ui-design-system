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
 * immediate); only the VISUAL indicator waits. A pending that stops and
 * restarts waits the full delay again — the effect's cleanup clears the
 * timer and drops `armed`, so the next pending period arms a fresh one.
 *
 * Lint discipline (react-hooks/refs + set-state-in-effect, plugin 7.1.1):
 * no ref is touched during render (the earlier session-counter-in-refs
 * adjustment pattern is what the new `react-hooks/refs` rule forbids), and
 * every setState runs inside a callback — the timer's own callback and the
 * effect's cleanup — never synchronously in the effect body. The RETURNED
 * value is derived from the caller's `pending`, so dropping pending hides
 * the indicator on that very render, with no reset setState to see.
 */
import { useEffect, useState } from 'react';
import { tokens } from '../tokens/tokens';

/** True only once `pending` has stayed true for motion.pending-delay. */
export function usePendingDelay(pending: boolean): boolean {
  // `armed` = the current pending period's timer has fired. Reset rides the
  // effect's cleanup (a callback), so a new period always starts disarmed.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!pending) return;
    const id = window.setTimeout(() => setArmed(true), tokens.motion['pending-delay']);
    return () => {
      window.clearTimeout(id);
      // the period is over (ended OR restarted): disarm for the next one.
      setArmed(false);
    };
  }, [pending]);

  return pending && armed;
}
