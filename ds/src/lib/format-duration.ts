/**
 * format-duration.ts — the Arabic duration words (BATCH2-SPECS-ADDENDUM
 * §3.3).
 *
 * The picker's value is MINUTES (multiples of 15, 15..720). The visible
 * form follows the spec's own examples — «45 دقيقة»، «ساعة»،
 * «ساعة و15 دقيقة»، «ساعتان»، «12 ساعة» — riding the Arabic plural rules
 * of 24.1(8) through the dictionary words (one/two bare, 3–10 counted
 * plural, 11+ counted singular) and «ونصف» for the half hour after an
 * hour. Every word reads through t() so a host-app override flows in
 * (3ج.1).
 */
import { t } from '../i18n/ar';

/** «ساعة» / «ساعتان» / «3 ساعات» / «11 ساعة» — the hours phrase. */
function hoursPhrase(hours: number): string {
  if (hours === 1) return t('duration.hourOne');
  if (hours === 2) return t('duration.hourTwo');
  return `${hours} ${hours >= 3 && hours <= 10 ? t('duration.hourFew') : t('duration.hourMany')}`;
}

/** «دقيقة» / «دقيقتان» / «15 دقيقة» — the minutes phrase. */
function minutesPhrase(minutes: number): string {
  if (minutes === 1) return t('duration.minuteOne');
  if (minutes === 2) return t('duration.minuteTwo');
  return `${minutes} ${minutes >= 3 && minutes <= 10 ? t('duration.minuteFew') : t('duration.minuteMany')}`;
}

/** Format minutes into the spec's duration words (§3.3-2). */
export function formatDuration(minutes: number): string {
  const safe = Math.max(0, Math.min(24 * 60, Math.round(minutes)));
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(hoursPhrase(hours));
  if (mins === 30 && hours > 0) {
    // «ساعة ونصف» — the half hour rides the hour word
    parts.push(t('duration.half'));
  } else if (mins > 0) {
    // «و15 دقيقة» after an hour, «30 دقيقة» alone
    parts.push(`${hours > 0 ? t('duration.and') : ''}${minutesPhrase(mins)}`);
  }
  return parts.join(' ');
}
