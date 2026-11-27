/**
 * The simulation's own clock anchors (§5: the date is pinned, the clock is
 * the device's; some §5.2 facts — ت1's valid quote — count from the moment
 * the simulation opened).
 */

/** The moment this simulation was opened in this tab. */
export const SIM_OPENED_AT = Date.now();

/** Minutes since the simulation opened. */
export function minutesSinceOpen(): number {
  return (Date.now() - SIM_OPENED_AT) / 60000;
}
