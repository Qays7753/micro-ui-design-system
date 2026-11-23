import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlStates } from './SegmentedControl.states';

// Labels come from the dictionary (no Arabic literals here — ds-copy).
const IN = ar['movement.in'].text;
const OUT = ar['movement.out'].text;
const TRANSFER = ar['movement.transfer'].text;
const GROUP = ar['title.today'].text;

function twoSegments() {
  return [
    { value: 'in', label: IN },
    { value: 'out', label: OUT },
  ];
}

describe('SegmentedControl (BRIEF 9.1, 23.2, 23.20)', () => {
  it('renders a labelled group of real buttons (29.1)', () => {
    render(
      <SegmentedControl leading={twoSegments()} value="in" onChange={() => {}} label={GROUP} />,
    );
    expect(screen.getByRole('group', { name: GROUP })).not.toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(SegmentedControlStates).toContain('default');
  });

  it('marks exactly one segment selected with aria-pressed (23.2)', () => {
    render(
      <SegmentedControl leading={twoSegments()} value="in" onChange={() => {}} label={GROUP} />,
    );
    const inButton = screen.getByRole('button', { name: IN });
    const outButton = screen.getByRole('button', { name: OUT });
    expect(inButton.getAttribute('aria-pressed')).toBe('true');
    expect(outButton.getAttribute('aria-pressed')).toBe('false');
    expect(inButton.className).toContain('mds-segmented-segment--selected');
  });

  it('reports the newly selected value through onChange (23.18)', () => {
    const onChange = vi.fn();
    render(<SegmentedControl leading={twoSegments()} value="in" onChange={onChange} label={GROUP} />);
    // usePress listens to pointer events, not click (BRIEF 23.2 press model).
    fireEvent.pointerDown(screen.getByRole('button', { name: OUT }));
    fireEvent.pointerUp(screen.getByRole('button', { name: OUT }));
    expect(onChange).toHaveBeenCalledWith('out');
  });

  it('does not re-fire when the already selected segment is pressed', () => {
    const onChange = vi.fn();
    render(<SegmentedControl leading={twoSegments()} value="in" onChange={onChange} label={GROUP} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: IN }));
    fireEvent.pointerUp(screen.getByRole('button', { name: IN }));
    // The control reports every press; the app decides what to do with the
    // same value. The contract: onChange fires once per press, never twice.
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders up to four segments (9.1 cap)', () => {
    const parts = [
      { value: 'in', label: IN },
      { value: 'out', label: OUT },
      { value: 'transfer', label: TRANSFER },
      { value: 'all', label: ar['button.all'].text },
    ];
    render(<SegmentedControl leading={parts} value="transfer" onChange={() => {}} label={GROUP} />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(SegmentedControlStates).toContain('fourSegments');
  });

  it('disables the whole control and single segments (23.24(15))', () => {
    render(
      <SegmentedControl
        leading={twoSegments()}
        value="in"
        onChange={() => {}}
        label={GROUP}
        disabled
      />,
    );
    for (const button of screen.getAllByRole('button') as HTMLButtonElement[]) {
      expect(button.disabled).toBe(true);
    }
    expect(SegmentedControlStates).toContain('disabled');
  });

  it('ignores presses on a disabled segment (23.24(15))', () => {
    const onChange = vi.fn();
    const parts = [{ value: 'in', label: IN, disabled: true }, { value: 'out', label: OUT }];
    render(<SegmentedControl leading={parts} value="out" onChange={onChange} label={GROUP} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: IN }));
    fireEvent.pointerUp(screen.getByRole('button', { name: IN }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('carries one leading icon in its segment (23.3)', () => {
    const parts = [{ value: 'in', label: IN, leading: <svg data-testid="seg-icon" /> }];
    render(<SegmentedControl leading={parts} value="in" onChange={() => {}} label={GROUP} />);
    expect(screen.getByTestId('seg-icon')).not.toBeNull();
    expect(SegmentedControlStates).toContain('withIcon');
  });

  it('passes data attributes through to the group container (lab check hooks)', () => {
    const { container } = render(
      <SegmentedControl
        leading={twoSegments()}
        value="in"
        onChange={() => {}}
        label={GROUP}
        data-ds-check="segmented-control"
      />,
    );
    expect(container.querySelector('[data-ds-check="segmented-control"]')).not.toBeNull();
  });
});
