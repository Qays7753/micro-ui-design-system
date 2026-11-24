import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { FilterChips } from './FilterChips';
import { FilterChipsStates } from './FilterChips.states';

// Labels come from the dictionary (no Arabic literals here — ds-copy).
const IN = ar['movement.in'].text;
const OUT = ar['movement.out'].text;
const TRANSFER = ar['movement.transfer'].text;
const ALL = ar['button.all'].text;
const GROUP = ar['title.today'].text;

function threeChips() {
  return [
    { value: 'in', label: IN },
    { value: 'out', label: OUT },
    { value: 'transfer', label: TRANSFER },
  ];
}

describe('FilterChips (BRIEF 9.1, 23.16, 23.2)', () => {
  it('renders a labelled group of chip buttons (29.1)', () => {
    render(<FilterChips leading={threeChips()} value={[]} onChange={() => {}} label={GROUP} />);
    expect(screen.getByRole('group', { name: GROUP })).not.toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(FilterChipsStates).toContain('default');
  });

  it('marks the selected chips with aria-pressed and the check icon (9.1, 23.2)', () => {
    const { container } = render(
      <FilterChips leading={threeChips()} value={['in']} onChange={() => {}} label={GROUP} />,
    );
    const inChip = screen.getByRole('button', { name: IN });
    expect(inChip.getAttribute('aria-pressed')).toBe('true');
    expect(inChip.className).toContain('mds-filter-chip--selected');
    expect(container.querySelector('.mds-filter-chip-check')).not.toBeNull();
    expect(screen.getByRole('button', { name: OUT }).getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles a chip into and out of the selection through onChange (23.18)', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <FilterChips leading={threeChips()} value={[]} onChange={onChange} label={GROUP} />,
    );
    // usePress listens to pointer events, not click (BRIEF 23.2 press model).
    fireEvent.pointerDown(screen.getByRole('button', { name: IN }));
    fireEvent.pointerUp(screen.getByRole('button', { name: IN }));
    expect(onChange).toHaveBeenCalledWith(['in']);

    rerender(
      <FilterChips leading={threeChips()} value={['in']} onChange={onChange} label={GROUP} />,
    );
    fireEvent.pointerDown(screen.getByRole('button', { name: IN }));
    fireEvent.pointerUp(screen.getByRole('button', { name: IN }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps multiple chips selected at once (multi-select)', () => {
    render(
      <FilterChips leading={threeChips()} value={['in', 'transfer']} onChange={() => {}} label={GROUP} />,
    );
    expect(screen.getByRole('button', { name: IN }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: TRANSFER }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: OUT }).getAttribute('aria-pressed')).toBe('false');
  });

  it('disables the whole row and single chips (23.24(15))', () => {
    const chips = [{ value: 'in', label: IN, disabled: true }, { value: 'out', label: OUT }];
    render(<FilterChips leading={chips} value={['in']} onChange={() => {}} label={GROUP} disabled />);
    for (const chip of screen.getAllByRole('button') as HTMLButtonElement[]) {
      expect(chip.disabled).toBe(true);
    }
    expect(FilterChipsStates).toContain('disabled');
  });

  it('ignores presses on a disabled chip (23.24(15))', () => {
    const onChange = vi.fn();
    const chips = [{ value: 'in', label: IN, disabled: true }, { value: 'out', label: OUT }];
    render(<FilterChips leading={chips} value={[]} onChange={onChange} label={GROUP} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: IN }));
    fireEvent.pointerUp(screen.getByRole('button', { name: IN }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders many chips for the horizontal scroll row (23.16)', () => {
    const chips = [
      { value: 'in', label: IN },
      { value: 'out', label: OUT },
      { value: 'transfer', label: TRANSFER },
      { value: 'all', label: ALL },
    ];
    render(<FilterChips leading={chips} value={['all']} onChange={() => {}} label={GROUP} />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(FilterChipsStates).toContain('manyChips');
  });

  it('passes data attributes through to the scroll container (lab hooks)', () => {
    const { container } = render(
      <FilterChips
        leading={threeChips()}
        value={[]}
        onChange={() => {}}
        label={GROUP}
        data-ds-check="filter-chips"
      />,
    );
    expect(container.querySelector('[data-ds-check="filter-chips"]')).not.toBeNull();
  });
});
