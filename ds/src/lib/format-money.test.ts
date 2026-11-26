import { describe, expect, it } from 'vitest';
import { moneyTexts } from '../i18n/ar';
import { formatMoney, type MoneyAriaTexts } from './format-money';

/** BRIEF section 8, case by case. */
describe('formatMoney', () => {
  it('formats plain amounts with unit and grouping', () => {
    expect(formatMoney(45, { texts: moneyTexts }).display).toBe('45 د.أ');
    expect(formatMoney('1280', { texts: moneyTexts }).display).toBe('1,280 د.أ');
    expect(formatMoney('1250000.125', { texts: moneyTexts }).display).toBe('1,250,000.125 د.أ');
    expect(formatMoney(0, { texts: moneyTexts }).display).toBe('0 د.أ');
  });

  it('keeps fils at exactly three digits when non-zero, drops them when zero', () => {
    expect(formatMoney('2.250', { texts: moneyTexts }).display).toBe('2.250 د.أ');
    expect(formatMoney('12.500', { texts: moneyTexts }).display).toBe('12.500 د.أ');
    expect(formatMoney('145.750', { texts: moneyTexts }).display).toBe('145.750 د.أ');
    expect(formatMoney('150.000', { texts: moneyTexts }).display).toBe('150 د.أ');
    expect(formatMoney('12450.125', { texts: moneyTexts }).frac).toBe('.125');
    expect(formatMoney('12450.100', { texts: moneyTexts }).frac).toBe('.100');
  });

  it('applies flow signs: in +, out − (U+2212), transfer none', () => {
    const inResult = formatMoney(45, { flow: 'in', texts: moneyTexts });
    const outResult = formatMoney(45, { flow: 'out', texts: moneyTexts });
    const transfer = formatMoney(45, { flow: 'transfer', texts: moneyTexts });
    expect(inResult.display).toBe('+45 د.أ');
    expect(outResult.display).toBe('−45 د.أ');
    expect(transfer.display).toBe('45 د.أ');
    expect(outResult.sign.charCodeAt(0)).toBe(0x2212); // the real minus
  });

  it('renders negative values negative without a flow', () => {
    const result = formatMoney('-35', { texts: moneyTexts });
    expect(result.display).toBe('−35 د.أ');
    expect(result.aria).toBe('سالب 35 دينار');
    // Direction wins over the raw sign: out + (-35) is still −35, not +.
    expect(formatMoney('-35', { flow: 'out', texts: moneyTexts }).display).toBe('−35 د.أ');
  });

  it('formats debts as لك / عليك with no sign', () => {
    const forYou = formatMoney(45, { debt: 'forYou', texts: moneyTexts });
    const againstYou = formatMoney(20, { debt: 'againstYou', texts: moneyTexts });
    expect(forYou.display).toBe('لك 45 د.أ');
    expect(forYou.aria).toBe('لك 45 دينار');
    expect(againstYou.display).toBe('عليك 20 د.أ');
    expect(againstYou.sign).toBe('');
  });

  it('hides amounts as four bullets with unit, no sign, no fils', () => {
    const result = formatMoney('12450.125', { hidden: true, flow: 'in', texts: moneyTexts });
    expect(result.display).toBe('•••• د.أ');
    expect(result.int).toBe('');
    expect(result.frac).toBe('');
    expect(result.sign).toBe('');
    expect(result.aria).toBe('المبلغ مخفي');
    // Debt word stays visible (BRIEF 23.22: «لك •••• د.أ»).
    expect(formatMoney(45, { debt: 'forYou', hidden: true, texts: moneyTexts }).display).toBe('لك •••• د.أ');
  });

  it('renders missing values as an em dash, never zero', () => {
    for (const input of [null, undefined]) {
      const result = formatMoney(input, { texts: moneyTexts });
      expect(result.missing).toBe(true);
      expect(result.display).toBe('—');
      expect(result.unit).toBe('');
      expect(result.aria).toBe('القيمة غير متوفرة');
    }
  });

  it('produces full-word screen-reader sentences', () => {
    expect(formatMoney('-35', { texts: moneyTexts }).aria).toBe('سالب 35 دينار');
    expect(formatMoney('12.500', { texts: moneyTexts }).aria).toBe('12 دينار و500 فلس');
    expect(formatMoney('12450.125', { texts: moneyTexts }).aria).toBe('12450 دينار و125 فلس');
    expect(formatMoney(45, { debt: 'forYou', texts: moneyTexts }).aria).toBe('لك 45 دينار');
  });

  it('returns parts so the component can draw the 4px unit gap', () => {
    const result = formatMoney('-12450.125', { texts: moneyTexts });
    expect(result.sign).toBe('−');
    expect(result.int).toBe('12,450');
    expect(result.frac).toBe('.125');
    expect(result.unit).toBe('د.أ');
  });

  it('is pure: identical inputs give identical results', () => {
    const texts: MoneyAriaTexts = moneyTexts;
    const a = formatMoney('12.500', { flow: 'out', texts });
    const b = formatMoney('12.500', { flow: 'out', texts });
    expect(a).toEqual(b);
  });
});
