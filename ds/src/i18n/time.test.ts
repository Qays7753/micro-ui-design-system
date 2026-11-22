import { describe, expect, it } from 'vitest';
import { formatTime12 } from './time';

describe('formatTime12', () => {
  it.each([
    [{ h: 0, m: 5 }, '12:05 ص'],
    [{ h: 12, m: 0 }, '12:00 م'],
    [{ h: 23, m: 59 }, '11:59 م'],
    [{ h: 10, m: 42 }, '10:42 ص'],
    [{ h: 13, m: 7 }, '01:07 م'],
    [{ h: 11, m: 59 }, '11:59 ص'],
  ])('formatTime12(%j) -> %s', (components, expected) => {
    expect(formatTime12(components)).toBe(expected);
  });

  it('accepts Date objects using local hours and minutes', () => {
    const date = new Date(2026, 10, 22, 10, 42);
    expect(formatTime12(date)).toBe('10:42 ص');
    const evening = new Date(2026, 10, 22, 18, 30);
    expect(formatTime12(evening)).toBe('06:30 م');
  });

  it('uses Western digits and two-digit minutes', () => {
    const result = formatTime12({ h: 9, m: 3 });
    expect(result).toBe('09:03 ص');
    expect(result).toMatch(/^[0-9]{2}:[0-9]{2} [صم]$/);
  });
});
