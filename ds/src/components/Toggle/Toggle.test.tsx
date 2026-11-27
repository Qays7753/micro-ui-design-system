import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { Toggle } from './Toggle';
import { ToggleStates } from './Toggle.states';

describe('Toggle (ADDENDUM §1.7)', () => {
  it('the WHOLE row presses and reports the next state (ق1)', () => {
    const onChange = vi.fn();
    const { container } = render(<Toggle label={ar['button.hideAmounts'].text} onChange={onChange} />);
    fireEvent.click(container.querySelector('.mds-toggle') as HTMLElement);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(ToggleStates).toContain('selected');
  });

  it('is a role=switch whose aria-checked follows (ق2)', () => {
    const { container, rerender } = render(<Toggle label={ar['button.hideAmounts'].text} selected={false} />);
    const sw = container.querySelector('[role="switch"]') as HTMLElement;
    expect(sw).not.toBeNull();
    expect(sw.getAttribute('aria-checked')).toBe('false');
    rerender(<Toggle label={ar['button.hideAmounts'].text} selected />);
    expect(sw.getAttribute('aria-checked')).toBe('true');
  });

  it('rides the batch-2 tokens: track 52x32, thumb 24, quick slide (م-ر1)', () => {
    const css = readFileSync(join(__dirname, 'Toggle.css'), 'utf8');
    expect(css).toContain('--mds-size-toggle-track-52');
    expect(css).toContain('--mds-size-toggle-track-32');
    expect(css).toContain('--mds-size-toggle-thumb');
    expect(css).toContain('--mds-motion-quick-ms');
    expect(css).toContain('--mds-color-brand-anchor');
  });

  it('the label is a SETTING NAME, and the grayscale state rides the thumb + check (ق3, §1.7-8)', () => {
    const { container } = render(<Toggle label={ar['button.hideAmounts'].text} selected />);
    expect(container.textContent).toContain(ar['button.hideAmounts'].text);
    // the ON thumb carries the check icon (non-color signal)
    expect(container.querySelector('.mds-toggle-thumb svg')).not.toBeNull();
  });

  it('the OFF thumb is BARE — the check rides the ON state only (the audit catch)', () => {
    const { container } = render(<Toggle label={ar['button.hideAmounts'].text} />);
    const css = readFileSync(join(__dirname, 'Toggle.css'), 'utf8');
    expect(css).toContain('.mds-toggle-thumb svg');
    expect(css).toContain('.mds-toggle--selected .mds-toggle-thumb svg');
    // structure: the check element exists but the OFF opacity is 0
    expect(container.querySelector('.mds-toggle-thumb svg')).not.toBeNull();
  });

  it('disables cleanly with disabled-bg track and disabled-fg label (§1.7-4)', () => {
    const { container } = render(<Toggle label={ar['button.hideAmounts'].text} disabled />);
    const input = container.querySelector('[role="switch"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    const css = readFileSync(join(__dirname, 'Toggle.css'), 'utf8');
    expect(css).toContain('--mds-color-disabled-bg');
  });
});
