/**
 * format-time.ts — the 12-hour Arabic time words (BATCH2-SPECS §1.9).
 *
 * The picker's value is MINUTES SINCE MIDNIGHT (0..1439, step 15 —
 * ADDENDUM §2.4). The visible form is the 12-hour «4:00 م» (criterion 1)
 * with Western tabular digits; the SPOKEN form replaces «ص»/«م» with
 * «صباحاً»/«مساءً» (§1.9-7). Both read through t() so a host-app text
 * override flows into them (3ج.1).
 */
import { t } from '../i18n/ar';

/** The two words of a formatted time: what it shows and what it speaks. */
export interface FormattedTime {
  /** «4:00 م» — the visible 12-hour form (Western digits, LTR run). */
  text: string;
  /** «4:00 مساءً» — the spoken form for names and announcements. */
  spoken: string;
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** Format minutes-since-midnight into the 12-hour pair (§1.9). */
export function formatTimeValue(minutes: number): FormattedTime {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(minutes)));
  const hours24 = Math.floor(clamped / 60);
  const mins = clamped % 60;
  const isAm = hours24 < 12;
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const clock = `${hours12}:${pad2(mins)}`;
  return {
    text: `${clock} ${t(isAm ? 'time.am' : 'time.pm')}`,
    spoken: `${clock} ${t(isAm ? 'time.amSpoken' : 'time.pmSpoken')}`,
  };
}
