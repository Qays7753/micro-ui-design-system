import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { PartyPicker } from './PartyPicker';
import type { PartyOption } from './PartyPicker.types';

afterEach(() => {
  cleanup();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

const PARTIES: readonly PartyOption[] = [
  { value: 'salma', label: 'سلمى الحوراني', caption: '0790000000' },
  { value: 'abu', label: 'أبو محمد (بقالة النور)', debt: '45' },
  { value: 'rana', label: 'رنا العبادي' },
];

describe('PartyPicker (BATCH2-SPECS §1.10)', () => {
  it('the field shows the mark and the name after a choice; empty: nothing', () => {
    const { container, rerender } = render(<PartyPicker label="العميل" />);
    expect(container.querySelector('.mds-party-field-name')?.textContent).toBe('');
    expect(container.querySelector('.mds-entity-mark')).toBeNull();
    rerender(<PartyPicker label="العميل" value={PARTIES[0]} />);
    expect((container.querySelector('.mds-party-field-name') as HTMLElement).textContent).toBe('سلمى الحوراني');
    expect(container.querySelector('.mds-entity-mark')).not.toBeNull();
  });

  it('the field button is named «<التسمية>، سلمى الحوراني» or «<التسمية>، لم يُختر» (§1.10-7)', () => {
    const { rerender } = render(<PartyPicker label="العميل" value={PARTIES[0]} />);
    expect(
      screen.getByRole('button', { name: ar['party.srName'].text.replace('{label}', 'العميل').replace('{name}', 'سلمى الحوراني') }),
    ).not.toBeNull();
    rerender(<PartyPicker label="العميل" />);
    expect(
      screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }),
    ).not.toBeNull();
  });

  it('the clear button emits undefined without opening the sheet; it is the 48 IconButton (criterion 3)', () => {
    const onChange = vi.fn();
    render(<PartyPicker label="العميل" value={PARTIES[0]} onChange={onChange} />);
    const clear = screen.getByRole('button', { name: ar['sr.clear'].text });
    expect(clear.className).toContain('mds-icon-button');
    press(clear);
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('the sheet: the focused SearchField (criterion 2) and the rows (§1.10-2)', () => {
    render(<PartyPicker label="العميل" items={PARTIES} />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    const input = document.querySelector('.mds-party-sheet input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(document.activeElement).toBe(input);
    const list = screen.getByRole('listbox', { name: 'العميل' });
    // three rows + no add row (the query is empty)
    expect(list.querySelectorAll('.mds-object-row')).toHaveLength(3);
    expect(list.querySelector('.mds-party-add')).toBeNull();
  });

  it('the rows carry the second line; the selected row carries the selected icon (§1.10-2)', () => {
    render(<PartyPicker label="العميل" items={PARTIES} value={PARTIES[1]} />);
    press(screen.getByRole('button', { name: ar['party.srName'].text.replace('{label}', 'العميل').replace('{name}', 'أبو محمد (بقالة النور)') }));
    const list = screen.getByRole('listbox', { name: 'العميل' });
    const selected = list.querySelector('[aria-selected="true"]');
    expect(selected).not.toBeNull();
    expect(selected?.querySelector('.mds-party-row-selected')).not.toBeNull();
    // the debt line renders through Money (hidden-amounts aware)
    expect(list.textContent).toContain('45');
  });

  it('the search filters the rows (§1.10-2)', () => {
    render(<PartyPicker label="العميل" items={PARTIES} />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    const input = document.querySelector('.mds-party-sheet input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'رنا' } });
    const list = screen.getByRole('listbox', { name: 'العميل' });
    expect(list.querySelectorAll('.mds-object-row')).toHaveLength(1);
    expect(list.textContent).toContain('رنا العبادي');
  });

  it('criterion 1: the add row shows on no exact match, hides on an exact match', () => {
    render(<PartyPicker label="العميل" items={PARTIES} />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    const input = document.querySelector('.mds-party-sheet input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'رنا العبادي' } });
    // an exact match — no add row
    expect(screen.queryByRole('button', { name: /أضف رنا العبادي/ })).toBeNull();
    fireEvent.change(input, { target: { value: 'رنا الع' } });
    // a partial match — the add row IS first
    expect(screen.getByRole('button', { name: /أضف رنا الع/ })).not.toBeNull();
  });

  it('the add row text and sr name with the role word (§1.10-7/8)', () => {
    const { container } = render(<PartyPicker label="العميل" items={PARTIES} />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    const input = document.querySelector('.mds-party-sheet input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'خالد' } });
    const add = screen.getByRole('button', { name: ar['party.srAdd'].text.replace('{name}', 'خالد').replace('{role}', 'عميلاً') }) as HTMLElement;
    expect(add.textContent).toContain('أضف «خالد» عميلاً جديداً');
    // supplier mode swaps the word
    rerenderSupplier(container);
  });

  it('the add row reports the typed name as a new party (§1.10-2)', () => {
    const onChange = vi.fn();
    render(<PartyPicker label="العميل" items={PARTIES} onChange={onChange} />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    const input = document.querySelector('.mds-party-sheet input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'خالد الزعبي' } });
    press(screen.getByRole('button', { name: ar['party.srAdd'].text.replace('{name}', 'خالد الزعبي').replace('{role}', 'عميلاً') }));
    expect(onChange).toHaveBeenCalledWith({ value: 'خالد الزعبي', label: 'خالد الزعبي' });
  });

  it('choosing a row closes the sheet and reports the party (§1.10-5)', () => {
    const onChange = vi.fn();
    render(<PartyPicker label="العميل" items={PARTIES} onChange={onChange} />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    press(screen.getByRole('button', { name: /سلمى الحوراني/ }));
    expect(onChange).toHaveBeenCalledWith(PARTIES[0]);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('an empty list: the EmptyState sentence, no button (§1.10-4)', () => {
    render(<PartyPicker label="العميل" items={[]} />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    expect(screen.getByText(ar['party.empty'].text)).not.toBeNull();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('loading: three skeleton rows (§1.10-4)', () => {
    const { container } = render(<PartyPicker label="العميل" items={[]} loading />);
    press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'العميل') }));
    // three ROW skeletons — each a mark + two lines (§1.10-4)
    expect(container.querySelectorAll('.mds-party-skeleton-row')).toHaveLength(3);
  });

  it('the error state: the problem border and the choose line (§1.10-4)', () => {
    const { container } = render(<PartyPicker label="العميل" state="error" />);
    expect(container.querySelector('.mds-party-field-box--error')).not.toBeNull();
    expect(screen.getByText(ar['party.choose'].text)).not.toBeNull();
  });
});

/** Supplier-mode word check (a second render). */
function rerenderSupplier(_container: HTMLElement): void {
  cleanup();
  render(<PartyPicker label="المورد" items={[]} mode="supplier" />);
  press(screen.getByRole('button', { name: ar['party.srNone'].text.replace('{label}', 'المورد') }));
  const input = document.querySelector('.mds-party-sheet input') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'مؤسسة' } });
  const add = screen.getByRole('button', { name: ar['party.srAdd'].text.replace('{name}', 'مؤسسة').replace('{role}', 'مورداً') }) as HTMLElement;
  expect(add.textContent).toContain('أضف «مؤسسة» مورداً جديداً');
}
