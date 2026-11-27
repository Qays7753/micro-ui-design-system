import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { Radio } from './Radio';
import { RadioStates } from './Radio.states';

describe('Radio (ADDENDUM §3.2)', () => {
  const items = [
    { value: 'available', label: ar['avail.available'].text },
    { value: 'onRequest', label: ar['avail.onRequest'].text },
    { value: 'unavailable', label: ar['avail.unavailable'].text },
  ];

  it('picks ONE: pressing a row selects it and fires its value (ق1)', () => {
    const onChange = vi.fn();
    const { container } = render(<Radio label="التوافر" items={items} onChange={onChange} />);
    const rows = container.querySelectorAll('.mds-radio-row');
    fireEvent.click(rows[1]);
    expect(onChange).toHaveBeenCalledWith('onRequest');
    expect(RadioStates).toContain('selected');
  });

  it('is a REAL radiogroup of named radios (23.17) with 2-5 options (ق2)', () => {
    const { container } = render(<Radio label="التوافر" items={items} value="available" />);
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).not.toBeNull();
    expect(group?.getAttribute('aria-label')).toBe('التوافر');
    const inputs = container.querySelectorAll('input[type="radio"]');
    expect(inputs.length).toBe(3);
    const checked = container.querySelector('input[type="radio"]:checked') as HTMLInputElement;
    expect(checked.labels?.[0]?.textContent).toContain(ar['avail.available'].text);
  });

  it('styles the circle 20 r-full with the brand dot (§3.2-2)', () => {
    const css = readFileSync(join(__dirname, 'Radio.css'), 'utf8');
    expect(css).toContain('--mds-size-checkbox');
    expect(css).toContain('--mds-radius-full');
    expect(css).toContain('--mds-color-brand-anchor');
    expect(css).toContain('--mds-motion-quick-ms');
  });

  it('shows «اختر التسمية» under the surface on error (§3.2-4)', () => {
    const { container } = render(<Radio label="التوافر" items={items} state="error" />);
    expect(container.textContent).toContain('اختر التوافر');
  });

  it('disables the group and single options (§3.2-4)', () => {
    const { container } = render(
      <Radio
        label="التوافر"
        items={[...items.slice(0, 1), { value: 'x', label: 'معطّل', disabled: true }]}
        disabled
      />,
    );
    const inputs = container.querySelectorAll('input[type="radio"]');
    for (const input of Array.from(inputs)) expect((input as HTMLInputElement).disabled).toBe(true);
  });
});
