/**
 * Formatting helpers for the simulation (app-side, not library business):
 * fils integers → the library's money input strings, and 24h clock → the
 * addendum's ص/م display.
 */

/** Integer fils → a western-digit decimal string for Money/formatMoney. */
export function filsToMoneyString(fils: number): string {
  const sign = fils < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(fils));
  const int = Math.floor(abs / 1000);
  const frac = abs % 1000;
  if (frac === 0) return `${sign}${int}`;
  return `${sign}${int}.${String(frac).padStart(3, '0')}`;
}

/** 24h 'HH:MM' → the addendum's 12-hour display with ص/م. */
export function time12(time: string | null | undefined): string | null {
  if (!time) return null;
  const [hStr, mStr] = time.split(':');
  let h = Number.parseInt(hStr, 10);
  const m = Number.parseInt(mStr, 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  const period = h < 12 ? 'ص' : 'م';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${period}`;
}

/** ISO 'YYYY-MM-DD' → 'D/M/YYYY'. */
export function dateDisplay(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return `${Number(d)}/${Number(m)}/${y}`;
}
