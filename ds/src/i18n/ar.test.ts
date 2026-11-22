import { describe, expect, it } from 'vitest';
import { ar, moneyTexts, pluralNouns, t, type TextKind } from './ar';

const KINDS: readonly TextKind[] = [
  'button',
  'title',
  'badge',
  'success',
  'error',
  'empty',
  'help',
  'placeholder',
  'screen-reader',
];

describe('ar dictionary (BRIEF 24)', () => {
  it('gives every entry a valid kind and non-empty text', () => {
    for (const [key, entry] of Object.entries(ar)) {
      expect(KINDS, `${key} kind ${String(entry.kind)}`).toContain(entry.kind);
      expect(entry.text.length, key).toBeGreaterThan(0);
    }
  });

  it('contains no exclamation marks anywhere (BRIEF 24.2)', () => {
    for (const [key, entry] of Object.entries(ar)) {
      expect(entry.text.includes('!'), key).toBe(false);
      expect(entry.text.includes('！'), key).toBe(false);
    }
  });

  it('contains none of the banned boilerplate (BRIEF 24.2)', () => {
    const banned = ['يرجى', 'الرجاء', 'عذراً', 'تمت العملية', 'لا توجد بيانات', 'هل أنت متأكد', 'اضغط هنا'];
    for (const [key, entry] of Object.entries(ar)) {
      for (const phrase of banned) {
        expect(entry.text.includes(phrase), `${key} contains «${phrase}»`).toBe(false);
      }
    }
  });

  it('uses Arabic punctuation (، ؛ ؟ « » …) not Western equivalents', () => {
    for (const [key, entry] of Object.entries(ar)) {
      expect(entry.text.includes(';'), key).toBe(false);
      expect(entry.text.includes('?'), key).toBe(false);
      expect(entry.text.includes('...'), key).toBe(false);
    }
  });

  it('interpolates {param} placeholders', () => {
    expect(t('confirm.deleteTitle', { amount: '12.500 د.أ' })).toBe('تحذف حركة 12.500 د.أ؟');
    expect(t('confirm.deleteResult', { fund: 'درج الكاش' })).toBe('لن تظهر في رصيد درج الكاش.');
    expect(t('metric.deltaHigher', { percent: '12%' })).toBe('12% أعلى من أمس');
    expect(t('errorState.updatedAt', { time: '10:42 ص' })).toBe('آخر تحديث 10:42 ص');
  });

  it('returns the raw text without params', () => {
    expect(t('button.saveMovement')).toBe('احفظ الحركة');
    expect(t('empty.movements')).toBe('حركات اليوم تظهر هنا.');
  });

  it('has the four SaveState texts verbatim (BRIEF 9.5)', () => {
    expect(ar['saveState.draft'].text).toBe('مسودة · لم تُحفظ');
    expect(ar['saveState.sending'].text).toBe('يُرسل…');
    expect(ar['saveState.saved'].text).toBe('حُفظ');
    expect(ar['saveState.failed'].text).toBe('لم يُحفظ — أعد المحاولة');
  });

  it('binds money aria texts from the dictionary', () => {
    expect(moneyTexts.unit).toBe('د.أ');
    expect(moneyTexts.minus).toBe('سالب');
    expect(moneyTexts.hidden).toBe('المبلغ مخفي');
    expect(moneyTexts.hiddenGlyph).toBe('••••');
  });

  it('provides plural noun forms for the counted phrases', () => {
    expect(pluralNouns.orders.many).toBe('طلب');
    expect(pluralNouns.movements.few).toBe('حركات');
    expect(pluralNouns.results.zero).toBe('لا نتائج');
  });

  it('keeps button labels at ≤ 3 words (BRIEF 24.1)', () => {
    for (const [key, entry] of Object.entries(ar)) {
      if (entry.kind !== 'button') continue;
      expect(entry.text.split(/\s+/).length, key).toBeLessThanOrEqual(3);
    }
  });
});
