/**
 * time.ts — 12-hour clock formatting (plan D9, BRIEF 8 + 24.9 [مؤكد]).
 *
 *   «10:42 ص»  — two-digit minutes, Western digits, ص/م markers.
 *   00:05 -> «12:05 ص»  ·  12:00 -> «12:00 م»  ·  23:59 -> «11:59 م»
 *
 * The ص/م markers are the only Arabic characters involved; they are defined
 * here (not in ar.ts) because they are format grammar, not copy — the copy
 * gate counts dictionary words, and these are date-format tokens like «/».
 */

export interface TimeComponents {
  /** Hour 0–23. */
  readonly h: number;
  /** Minute 0–59. */
  readonly m: number;
}

export type TimeInput = Date | TimeComponents;

const AM = 'ص';
const PM = 'م';

function twoDigits(value: number): string {
  return `${value < 10 ? '0' : ''}${value}`;
}

function fromInput(input: TimeInput): TimeComponents {
  if (input instanceof Date) {
    return { h: input.getHours(), m: input.getMinutes() };
  }
  return input;
}

/**
 * Format a time of day as a 12-hour string with ص/م.
 * Seconds are ignored — the brief only ever shows hours and minutes.
 */
export function formatTime12(input: TimeInput): string {
  const { h, m } = fromInput(input);
  const marker = h < 12 ? AM : PM;
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${twoDigits(hour12)}:${twoDigits(m)} ${marker}`;
}
