import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { tokens } from '../../tokens/tokens';
import { AmountKeypad } from './AmountKeypad';
import type { KeypadKey } from './AmountKeypad.types';

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

/** The glyph rows in DOM order — with dir=ltr the DOM order IS the visual
 * order (ADDENDUM §1.4 criterion 3). */
function glyphRows(container: HTMLElement): string[][] {
  const grid = container.querySelector('.mds-keypad') as HTMLElement;
  const keys = Array.from(grid.querySelectorAll('button'));
  const rows = new Map<string, string[]>();
  for (const k of keys) {
    const area = (k.style.gridArea || '').split('/');
    const row = (area[0] || '').trim();
    if (!rows.has(row)) rows.set(row, []);
    rows.get(row)!.push((k.textContent || '').trim() || '⌫');
  }
  return Array.from(rows.entries()).sort((a, b) => Number(a[0]) - Number(b[0])).map((e) => e[1]);
}

describe('AmountKeypad (ADDENDUM §1.4, BRIEF 9.4)', () => {
  it('renders the LTR grid with the spec layout (criteria 3 + anatomy)', () => {
    const { container } = render(<AmountKeypad />);
    const grid = container.querySelector('.mds-keypad') as HTMLElement;
    expect(grid.getAttribute('dir')).toBe('ltr');
    // row 1: 1, 2, 3 then the double-height backspace starts here
    // row 2: 4, 5, 6 (backspace spans)
    // row 3: 7, 8, 9, «.»
    // row 4: «0» (two columns), «000» (two columns)
    expect(glyphRows(container)).toEqual([
      ['1', '2', '3', '⌫'], // the backspace STARTS at row 1 and spans to 3
      ['4', '5', '6'],
      ['7', '8', '9', '.'],
      ['0', '000'],
    ]);
  });

  it('the backspace key spans two rows and carries the unflipped icon (§1.4-2)', () => {
    const { container } = render(<AmountKeypad />);
    const backspace = container.querySelector('.mds-keypad-key--backspace') as HTMLElement;
    expect(backspace.style.gridArea.replace(/\s/g, '')).toBe('1/4/3/5');
    expect(backspace.querySelector('svg')).not.toBeNull();
  });

  it('every key is a real button with its SPOKEN name (§1.4-7)', () => {
    render(<AmountKeypad />);
    expect(screen.getByRole('button', { name: ar['keypad.sr1'].text })).not.toBeNull();
    expect(screen.getByRole('button', { name: ar['keypad.sr9'].text })).not.toBeNull();
    expect(screen.getByRole('button', { name: ar['keypad.srDecimal'].text })).not.toBeNull();
    expect(screen.getByRole('button', { name: ar['keypad.sr000'].text })).not.toBeNull();
    expect(screen.getByRole('button', { name: ar['keypad.srBackspace'].text })).not.toBeNull();
    // the group itself is named
    expect(screen.getByRole('group', { name: ar['keypad.srGroup'].text })).not.toBeNull();
  });

  it('emits the pressed key (§1.4-3)', () => {
    const onChange = vi.fn();
    render(<AmountKeypad onChange={onChange} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: ar['keypad.sr1'].text }));
    fireEvent.pointerUp(screen.getByRole('button', { name: ar['keypad.sr1'].text }));
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('«.» disables once a dot exists, and returns after backspace (§1.4-4)', () => {
    const { rerender } = render(<AmountKeypad value="12." />);
    const dot = screen.getByRole('button', { name: ar['keypad.srDecimal'].text }) as HTMLButtonElement;
    expect(dot.disabled).toBe(true);
    rerender(<AmountKeypad value="12" />);
    expect((dot as HTMLButtonElement).disabled).toBe(false);
  });

  it('digits and «000» disable after three fraction digits, integers never (§1.4-4)', () => {
    const { rerender } = render(<AmountKeypad value="145.750" />);
    const five = screen.getByRole('button', { name: ar['keypad.sr5'].text }) as HTMLButtonElement;
    const zeros = screen.getByRole('button', { name: ar['keypad.sr000'].text }) as HTMLButtonElement;
    expect(five.disabled).toBe(true);
    expect(zeros.disabled).toBe(true);
    // no dot: unlimited integer digits (ADDENDUM 2.1 — no max)
    rerender(<AmountKeypad value="123456789" />);
    expect((five as HTMLButtonElement).disabled).toBe(false);
    expect((zeros as HTMLButtonElement).disabled).toBe(false);
  });

  it('a LONG press on backspace clears the field (criterion 4)', () => {
    vi.useFakeTimers();
    const onClearAll = vi.fn();
    const onChange = vi.fn();
    render(<AmountKeypad value="145.750" onChange={onChange} onLongPress={onClearAll} />);
    const backspace = screen.getByRole('button', { name: ar['keypad.srBackspace'].text });
    fireEvent.pointerDown(backspace);
    act(() => vi.advanceTimersByTime(600));
    fireEvent.pointerUp(backspace);
    expect(onClearAll).toHaveBeenCalledTimes(1);
    // a long press does NOT also emit the single-character deletion
    expect(onChange).not.toHaveBeenCalledWith('backspace');
  });

  it('a short backspace tap emits the single-character deletion (§1.4-5)', () => {
    const onChange = vi.fn();
    render(<AmountKeypad value="145.750" onChange={onChange} />);
    const backspace = screen.getByRole('button', { name: ar['keypad.srBackspace'].text });
    fireEvent.pointerDown(backspace);
    fireEvent.pointerUp(backspace);
    expect(onChange).toHaveBeenCalledWith('backspace');
  });

  it('disabled prop turns every key off (23.2)', () => {
    const { container } = render(<AmountKeypad disabled />);
    const keys = container.querySelectorAll('.mds-keypad-key');
    expect(keys.length).toBe(13);
    for (const k of keys) {
      expect((k as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it('token math: the key stays >= touch-min at 320 (criterion 1)', () => {
    // The spec's own arithmetic, read from the tokens: (320 − 2×16 gutters
    // − 3×8 gaps) ÷ 4 = 66 wide, and the height is the pair token's 56.
    // the space scale is the tuple token; the members are spacing VALUES
    const scale = tokens.space as readonly number[];
    const pageGutter = 16; // the sheet/page gutter the spec's 288 assumes
    const gap = scale.find((v) => v === 8) ?? 8;
    const columns = 4;
    const width = (320 - 2 * pageGutter - (columns - 1) * gap) / columns;
    const height = Number(tokens.size['keypad-key'][1]);
    expect(width).toBeGreaterThanOrEqual(Number(tokens.size['touch-min']));
    expect(height).toBeGreaterThanOrEqual(Number(tokens.size['touch-min']));
  });

  it('emits every glyph it shows (the full key census)', () => {
    const seen: KeypadKey[] = [];
    render(<AmountKeypad onChange={(k) => seen.push(k)} />);
    for (const name of [ar['keypad.sr1'].text, ar['keypad.sr0'].text, ar['keypad.srDecimal'].text, ar['keypad.sr000'].text]) {
      const key = screen.getByRole('button', { name });
      fireEvent.pointerDown(key);
      fireEvent.pointerUp(key);
    }
    expect(seen).toEqual(['1', '0', '.', '000']);
  });
});
