import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { TextArea } from './TextArea';
import { TextAreaStates } from './TextArea.states';

describe('TextArea (ADDENDUM §1.2)', () => {
  it('is a real multiline textarea with aria-multiline (§1.2-7)', () => {
    const { container } = render(<TextArea label="ملاحظة" />);
    const area = container.querySelector('textarea');
    expect(area).not.toBeNull();
    expect(area?.getAttribute('aria-multiline')).toBe('true');
    expect(TextAreaStates).toContain('default');
  });

  it('min-height size.field and a 6-line ceiling with internal scroll (ق1, ق2, §1.2-2)', () => {
    const css = readFileSync(join(__dirname, 'TextArea.css'), 'utf8');
    expect(css).toContain('--mds-size-field');
    expect(css).toContain('--mds-size-textarea-max-lines');
    expect(css).toContain('overflow-y: auto');
    expect(css).toContain('--mds-space-16');
  });

  it('the vertical padding 16 keeps the first line with TextField (§1.2-2)', () => {
    const css = readFileSync(join(__dirname, 'TextArea.css'), 'utf8');
    expect(css).toContain('padding-block: var(--mds-space-16)');
  });

  it('error: the problem border, the field-error icon, the solution bound by aria-describedby (§1.2-4,7)', () => {
    const { container } = render(
      <TextArea label="ملاحظة" state="error" caption="اكتب نصاً هنا." />,
    );
    expect(container.querySelector('.mds-text-area--error')).not.toBeNull();
    const area = container.querySelector('textarea') as HTMLElement;
    expect(area.getAttribute('aria-invalid')).toBe('true');
    const described = area.getAttribute('aria-describedby');
    expect(described).not.toBeNull();
    expect(document.getElementById(described as string)?.textContent).toContain('اكتب نصاً هنا.');
    expect(container.querySelector('.mds-text-area-help svg')).not.toBeNull();
  });

  it('the optional mark rides the label (rule 67)', () => {
    const { container } = render(<TextArea label="ملاحظة" optional />);
    expect(container.textContent).toContain(ar['field.optional'].text);
  });

  it('fires onChange per keystroke (BRIEF 11: the app owns the text)', () => {
    const onChange = vi.fn();
    const { container } = render(<TextArea label="ملاحظة" onChange={onChange} />);
    fireEvent.change(container.querySelector('textarea') as HTMLElement, {
      target: { value: 'سطر جديد' },
    });
    expect(onChange).toHaveBeenCalledWith('سطر جديد');
  });
});
