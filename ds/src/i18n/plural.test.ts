import { describe, expect, it } from 'vitest';
import { pluralAr, type PluralForms } from './plural';

/** The exact forms of BRIEF 24.8 (طلتان is the brief's own dual). */
const orders: PluralForms = {
  zero: 'لا طلبات',
  one: 'طلب واحد',
  two: 'طلتان',
  few: 'طلبات',
  many: 'طلب',
};

describe('pluralAr', () => {
  it.each([
    [0, 'لا طلبات'],
    [1, 'طلب واحد'],
    [2, 'طلتان'],
    [3, '3 طلبات'],
    [10, '10 طلبات'],
    [11, '11 طلب'],
    [100, '100 طلب'],
    [1175, '1175 طلب'],
  ])('pluralAr(%i) -> %s', (n, expected) => {
    expect(pluralAr(n, orders)).toBe(expected);
  });

  it('never produces "1 طلبات" or "2 طلب" (BRIEF 24.8)', () => {
    expect(pluralAr(1, orders)).not.toContain('1');
    expect(pluralAr(2, orders)).not.toMatch(/^2 /);
  });

  it('supports genitive dual forms for «من …» contexts', () => {
    const movements: PluralForms = {
      zero: 'لا حركات',
      one: 'حركة واحدة',
      two: 'حركتين',
      few: 'حركات',
      many: 'حركة',
    };
    expect(pluralAr(32, movements)).toBe('32 حركة');
    expect(pluralAr(2, movements)).toBe('حركتين');
  });
});
