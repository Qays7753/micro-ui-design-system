import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { SearchField } from './SearchField';
import { SearchFieldStates } from './SearchField.states';

describe('SearchField (ADDENDUM §1.1)', () => {
  it('is a role=searchbox named by label with the section placeholder (§1.1-7,8)', () => {
    const { container } = render(
      <SearchField label="ابحث في الطلبات" placeholder="ابحث في الطلبات" />,
    );
    const box = container.querySelector('[role="searchbox"]') as HTMLElement;
    expect(box).not.toBeNull();
    expect(box.getAttribute('aria-label')).toBe('ابحث في الطلبات');
    expect((box as HTMLInputElement).placeholder).toBe('ابحث في الطلبات');
    expect(box.getAttribute('enterkeyhint')).toBe('search');
    expect(SearchFieldStates).toContain('default');
  });

  it('height size.search, r-full, the 16px input against iOS zoom (ق1, ق4, 27.5)', () => {
    const css = readFileSync(join(__dirname, 'SearchField.css'), 'utf8');
    expect(css).toContain('--mds-size-search');
    expect(css).toContain('--mds-radius-full');
    expect(css).toContain('--mds-type-body-size');
  });

  it('the clear button exists ONLY with text and carries «امسح البحث» (ق2, §1.1-7)', () => {
    const { container, rerender } = render(
      <SearchField label="ابحث في الطلبات" value="" onChange={() => {}} />,
    );
    expect(container.querySelector('.mds-search-field-clear')).toBeNull();
    rerender(<SearchField label="ابحث في الطلبات" value="سلمى" onChange={() => {}} />);
    const clear = container.querySelector('.mds-search-field-clear') as HTMLElement;
    expect(clear).not.toBeNull();
    expect(clear.getAttribute('aria-label')).toBe(ar['sr.clearSearch'].text);
  });

  it('clearing resets the query through onChange (§1.1-2)', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SearchField label="ابحث في الطلبات" value="سلمى" onChange={onChange} />,
    );
    const clear = container.querySelector('.mds-search-field-clear') as HTMLElement;
    fireEvent.pointerDown(clear);
    fireEvent.pointerUp(clear);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('no error state exists (§1.1-4) — the disabled form keeps text readable', () => {
    const { container } = render(<SearchField label="ابحث في الطلبات" disabled />);
    expect(container.querySelector('.mds-search-field--disabled')).not.toBeNull();
    const css = readFileSync(join(__dirname, 'SearchField.css'), 'utf8');
    expect(css).toContain('--mds-color-disabled-fg');
  });
});
