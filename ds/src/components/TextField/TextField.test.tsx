import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { TextField } from './TextField';
import { TextFieldStates } from './TextField.states';

const LABEL = ar['button.all'].text;
const HINT = ar['placeholder.phone'].text;

describe('TextField (BRIEF 9.3, 23.24(10))', () => {
  it('pairs the label with the input via htmlFor (29.1-m4)', () => {
    render(<TextField id="name" label={LABEL} />);
    const input = screen.getByLabelText(LABEL);
    expect(input).toBe(document.querySelector('#name-input'));
    expect(TextFieldStates).toContain('default');
  });

  it('is 56 high with radius classes and 16+ body text (9.3, plan S4)', () => {
    const { container } = render(<TextField label={LABEL} />);
    expect(container.querySelector('.mds-text-field-input')).not.toBeNull();
  });

  it('reports the new text through onChange (23.18)', () => {
    const onChange = vi.fn();
    render(<TextField label={LABEL} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(LABEL), { target: { value: '123' } });
    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('shows the format-only placeholder (23.24(10))', () => {
    render(<TextField label={LABEL} placeholder={HINT} />);
    expect(screen.getByPlaceholderText(HINT)).not.toBeNull();
    expect(TextFieldStates).toContain('withPlaceholder');
  });

  it('error state marks aria-invalid and shows the solution caption with an icon (9.3)', () => {
    const { container } = render(<TextField label={LABEL} state="error" caption={LABEL} />);
    expect(screen.getByLabelText(LABEL).getAttribute('aria-invalid')).toBe('true');
    expect(container.querySelector('.mds-text-field-caption--error')).not.toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();
    expect(TextFieldStates).toContain('error');
  });

  it('disables natively with the dim look (23.2)', () => {
    render(<TextField label={LABEL} disabled />);
    expect((screen.getByLabelText(LABEL) as HTMLInputElement).disabled).toBe(true);
    expect(TextFieldStates).toContain('disabled');
  });

  it('passes data attributes through to the root (the lab check hooks)', () => {
    const { container } = render(<TextField label={LABEL} data-ds-check="text-field" />);
    expect(container.querySelector('[data-ds-check="text-field"]')).not.toBeNull();
  });

  it('marks ONLY the optional field with the dictionary word after the label in caption type (rule 67)', () => {
    const { container } = render(<TextField label={LABEL} optional />);
    const marks = container.querySelectorAll('.mds-text-field-optional');
    expect(marks.length).toBe(1);
    expect(marks[0].textContent).toBe(ar['field.optional'].text);
  });

  it('never marks the required field (rule 67: no mark without the optional prop)', () => {
    const { container } = render(<TextField label={LABEL} />);
    expect(container.querySelector('.mds-text-field-optional')).toBeNull();
    expect(container.textContent).not.toContain(ar['field.optional'].text);
  });

  it('starts EMPTY when the app passes no value (rule 15: amount fields open blank)', () => {
    render(<TextField label={LABEL} />);
    expect((screen.getByLabelText(LABEL) as HTMLInputElement).value).toBe('');
  });
});
