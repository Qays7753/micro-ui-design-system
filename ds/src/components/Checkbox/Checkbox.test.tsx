import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { Checkbox } from './Checkbox';
import { CheckboxStates } from './Checkbox.states';

const LABEL = ar['kv.customer'].text;

describe('Checkbox (ADDENDUM §3.1)', () => {
  it('toggles from the WHOLE row and reports the next state (ق1)', () => {
    const onChange = vi.fn();
    const { container } = render(<Checkbox label={LABEL} onChange={onChange} />);
    const row = container.querySelector('.mds-checkbox') as HTMLElement;
    fireEvent.click(row);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(CheckboxStates).toContain('default');
  });

  it('is a REAL input type=checkbox named by its label (ق2, 23.17)', () => {
    const { container } = render(<Checkbox label={LABEL} selected />);
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.checked).toBe(true);
    expect(input.labels?.length).toBeGreaterThan(0);
    const name = input.labels?.[0]?.textContent ?? '';
    expect(name).toContain(LABEL);
  });

  it('renders the box at size.checkbox with r-xs, hairline rest, brand fill selected (ADDENDUM §3.1-2)', () => {
    const css = readFileSync(join(__dirname, 'Checkbox.css'), 'utf8');
    expect(css).toContain('--mds-size-checkbox');
    expect(css).toContain('--mds-radius-xs');
    expect(css).toContain('--mds-color-brand-anchor');
    expect(css).toContain('--mds-motion-check-draw-ms');
  });

  it('shows the problem border and the fix-it line on error (ADDENDUM §3.1-4)', () => {
    const { container } = render(<Checkbox label={LABEL} state="error" />);
    expect(container.querySelector('.mds-checkbox--error')).not.toBeNull();
    expect(container.textContent).toContain(ar['checkbox.tickThis'].text);
    const css = readFileSync(join(__dirname, 'Checkbox.css'), 'utf8');
    expect(css).toContain('--mds-color-status-problem-fg');
  });

  it('disables cleanly: box border and label in disabled-fg, still readable (§3.1-4)', () => {
    const { container } = render(<Checkbox label={LABEL} disabled />);
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(container.querySelector('.mds-checkbox--disabled')).not.toBeNull();
  });
});
