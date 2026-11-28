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

/** جولة المستخدم: the temporary time input for the order form until the
 *  real TimePicker mounts — accepts «16:00» (24h) or «4:00 م»/«4:00 ص»
 *  (12h with the period). Returns the ISO 'HH:MM' or null when unparseable
 *  (the form then keeps the field and its help line). */
export function parseTimeInput(raw: string): string | null {
  const text = raw.trim().replace(/\u0660/g, '0');
  const m = text.match(/^(\d{1,2})[:٫.](\d{2})\s*(ص|م)?$/) ?? text.match(/^(\d{1,2})\s*(ص|م)$/);
  if (!m) return null;
  const hRaw = Number.parseInt(m[1]!, 10);
  const min = m[2] && /^\d{2}$/.test(m[2]) ? Number.parseInt(m[2], 10) : 0;
  const period = m[3];
  if (!Number.isFinite(hRaw) || !Number.isFinite(min)) return null;
  if (min > 59) return null;
  let h = hRaw;
  if (period === 'ص') {
    if (hRaw < 1 || hRaw > 12) return null;
    h = hRaw % 12;
  } else if (period === 'م') {
    if (hRaw < 1 || hRaw > 12) return null;
    h = (hRaw % 12) + 12;
  } else {
    // بلا ص/م: وقت 24 ساعة حرفيًا (0–23).
    if (hRaw > 23) return null;
  }
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}
