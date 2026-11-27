import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizeAmount } from '../../lib/normalize-amount';
import { AmountField } from './AmountField';
import { AmountFieldStates } from './AmountField.states';

describe('normalizeAmount (ADDENDUM §1.3-5)', () => {
  it('converts Arabic-Indic digits and the Arabic decimal (ق3)', () => {
    expect(normalizeAmount('١٢٫٥')).toBe('12.5');
  });
  it('refuses the FOURTH fraction digit (ق4)', () => {
    expect(normalizeAmount('1.2505')).toBe('1.250');
  });
  it('drops separators and stray characters, refuses a second dot', () => {
    expect(normalizeAmount('1,280.500')).toBe('1.280');
    expect(normalizeAmount('12..5')).toBe('12.5');
    expect(normalizeAmount('-35')).toBe('35');
  });
  it('starts EMPTY and collapses leading zeros (ق2, rule 15)', () => {
    expect(normalizeAmount('')).toBe('');
    expect(normalizeAmount('00')).toBe('0');
    expect(normalizeAmount('05')).toBe('5');
  });
});

describe('AmountField (ADDENDUM §1.3)', () => {
  it('starts empty with no placeholder (ق2)', () => {
    const { container } = render(<AmountField label="المبلغ" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('');
    expect(AmountFieldStates).toContain('default');
  });

  it('the unit «د» rides the box, NEVER the label (ق5)', () => {
    const { container } = render(<AmountField label="المبلغ" />);
    expect(container.querySelector('.mds-amount-field-label')?.textContent).not.toContain('د');
    expect(container.querySelector('.mds-amount-field-unit')?.textContent).toBe('د');
  });

  it('blurs to the Money grouping without the unit (ADDENDUM §1.4)', () => {
    const { container, rerender } = render(<AmountField label="المبلغ" />);
    rerender(<AmountField label="المبلغ" value="1280.500" />);
    const input = container.querySelector('input') as HTMLInputElement;
    // not focused → the grouped display «1,280.500»
    expect(input.value).toBe('1,280.500');
  });

  it('drops to number-lg in ONE step past 13 rendered chars (ADDENDUM 2.1)', () => {
    const { container } = render(<AmountField label="المبلغ" value="12500000.125" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('data-long')).toBe('true');
  });

  it('keeps the digits visible while typing even when the context hides amounts (23.22)', () => {
    // the component never reads the hidden context — the writer's digits stay
    const css = readFileSync(join(__dirname, 'AmountField.tsx'), 'utf8');
    expect(css).not.toContain('useAmountVisibility');
  });
});
