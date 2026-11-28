import { describe, expect, it } from 'vitest';
import { getMoneyTexts } from '../i18n/ar';
import { formatMoney, type MoneyAriaTexts } from './format-money';

/** BRIEF section 8, case by case. */
describe('formatMoney', () => {
  it('formats plain amounts with unit and grouping', () => {
    expect(formatMoney(45, { texts: getMoneyTexts() }).display).toBe('45 د');
    expect(formatMoney('1280', { texts: getMoneyTexts() }).display).toBe('1,280 د');
    expect(formatMoney('1250000.125', { texts: getMoneyTexts() }).display).toBe('1,250,000.125 د');
    expect(formatMoney(0, { texts: getMoneyTexts() }).display).toBe('0 د');
  });

  it('keeps fils at exactly three digits when non-zero, drops them when zero', () => {
    expect(formatMoney('2.250', { texts: getMoneyTexts() }).display).toBe('2.250 د');
    expect(formatMoney('12.500', { texts: getMoneyTexts() }).display).toBe('12.500 د');
    expect(formatMoney('145.750', { texts: getMoneyTexts() }).display).toBe('145.750 د');
    expect(formatMoney('150.000', { texts: getMoneyTexts() }).display).toBe('150 د');
    expect(formatMoney('12450.125', { texts: getMoneyTexts() }).frac).toBe('.125');
    expect(formatMoney('12450.100', { texts: getMoneyTexts() }).frac).toBe('.100');
  });

  it('applies flow signs: in +, out − (U+2212), transfer none', () => {
    const inResult = formatMoney(45, { flow: 'in', texts: getMoneyTexts() });
    const outResult = formatMoney(45, { flow: 'out', texts: getMoneyTexts() });
    const transfer = formatMoney(45, { flow: 'transfer', texts: getMoneyTexts() });
    expect(inResult.display).toBe('+45 د');
    expect(outResult.display).toBe('−45 د');
    expect(transfer.display).toBe('45 د');
    expect(outResult.sign.charCodeAt(0)).toBe(0x2212); // the real minus
  });

  it('renders negative values negative without a flow', () => {
    const result = formatMoney('-35', { texts: getMoneyTexts() });
    expect(result.display).toBe('−35 د');
    expect(result.aria).toBe('سالب 35 دينار');
    // Direction wins over the raw sign: out + (-35) is still −35, not +.
    expect(formatMoney('-35', { flow: 'out', texts: getMoneyTexts() }).display).toBe('−35 د');
  });

  it('formats debts as لك / عليك with no sign', () => {
    const forYou = formatMoney(45, { debt: 'forYou', texts: getMoneyTexts() });
    const againstYou = formatMoney(20, { debt: 'againstYou', texts: getMoneyTexts() });
    expect(forYou.display).toBe('لك 45 د');
    expect(forYou.aria).toBe('لك 45 دينار');
    expect(againstYou.display).toBe('عليك 20 د');
    expect(againstYou.sign).toBe('');
  });

  it('hides amounts as four bullets with unit, no sign, no fils', () => {
    const result = formatMoney('12450.125', { hidden: true, flow: 'in', texts: getMoneyTexts() });
    expect(result.display).toBe('•••• د');
    expect(result.int).toBe('');
    expect(result.frac).toBe('');
    expect(result.sign).toBe('');
    expect(result.aria).toBe('المبلغ مخفي');
    // Debt word stays visible (BRIEF 23.22: «لك •••• د»).
    expect(formatMoney(45, { debt: 'forYou', hidden: true, texts: getMoneyTexts() }).display).toBe('لك •••• د');
  });

  it('renders missing values as an em dash, never zero', () => {
    for (const input of [null, undefined]) {
      const result = formatMoney(input, { texts: getMoneyTexts() });
      expect(result.missing).toBe(true);
      expect(result.display).toBe('—');
      expect(result.unit).toBe('');
      expect(result.aria).toBe('القيمة غير متوفرة');
    }
  });

  it('produces full-word screen-reader sentences', () => {
    expect(formatMoney('-35', { texts: getMoneyTexts() }).aria).toBe('سالب 35 دينار');
    expect(formatMoney('12.500', { texts: getMoneyTexts() }).aria).toBe('12 دينار و500 فلس');
    expect(formatMoney('12450.125', { texts: getMoneyTexts() }).aria).toBe('12450 دينار و125 فلس');
    expect(formatMoney(45, { debt: 'forYou', texts: getMoneyTexts() }).aria).toBe('لك 45 دينار');
  });

  it('returns parts so the component can draw the 4px unit gap', () => {
    const result = formatMoney('-12450.125', { texts: getMoneyTexts() });
    expect(result.sign).toBe('−');
    expect(result.int).toBe('12,450');
    expect(result.frac).toBe('.125');
    expect(result.unit).toBe('د');
  });

  it('is pure: identical inputs give identical results', () => {
    const texts: MoneyAriaTexts = getMoneyTexts();
    const a = formatMoney('12.500', { flow: 'out', texts });
    const b = formatMoney('12.500', { flow: 'out', texts });
    expect(a).toEqual(b);
  });
});
