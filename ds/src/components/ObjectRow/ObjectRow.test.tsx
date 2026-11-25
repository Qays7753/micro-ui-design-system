import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { StatusBadge } from '../StatusBadge/index';
import { ObjectRow } from './ObjectRow';
import { ObjectRowStates } from './ObjectRow.states';

const TITLE = ar['row.sampleTitle'].text;
const CAPTION = ar['row.sampleCaption'].text;
const TIME = ar['row.sampleTime'].text;

describe('ObjectRow (BRIEF 23.4)', () => {
  it('renders mark, two-line text column and the end column', () => {
    const { container } = render(
      <ObjectRow label={TITLE} caption={CAPTION} value="1,245.750" trailing={TIME} />,
    );
    expect(container.querySelector('.mds-object-row-title')?.textContent).toBe(TITLE);
    expect(container.querySelector('.mds-object-row-caption')?.textContent).toBe(CAPTION);
    expect(container.querySelector('.mds-object-row-value')?.textContent).toBe('1,245.750');
    expect(container.querySelector('.mds-object-row-time')?.textContent).toBe(TIME);
    expect(ObjectRowStates).toContain('default');
  });

  it('renders a passive div when no onPress is given (no fake buttons)', () => {
    const { container } = render(<ObjectRow label={TITLE} caption={CAPTION} value="1,250" />);
    expect(container.querySelector('button')).toBeNull();
  });

  it('becomes a button that fires onPress when interactive', () => {
    const onPress = vi.fn();
    const { container } = render(<ObjectRow label={TITLE} value="1,250" onPress={onPress} />);
    const row = container.querySelector('button') as HTMLElement;
    fireEvent.pointerDown(row);
    fireEvent.pointerUp(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('marks a one-line row (height 56 class) when caption and trailing are absent', () => {
    const { container } = render(<ObjectRow label={TITLE} value="1,250" />);
    expect(container.querySelector('.mds-object-row--one-line')).not.toBeNull();
    expect(ObjectRowStates).toContain('oneLine');
  });

  it('renders the end second line as a StatusBadge node when provided (23.6)', () => {
    const { container } = render(
      <ObjectRow
        label={TITLE}
        caption={CAPTION}
        value="1,250"
        trailing={<StatusBadge tone="waiting" />}
      />,
    );
    expect(container.querySelector('.mds-object-row-time .mds-status-badge')).not.toBeNull();
    expect(ObjectRowStates).toContain('withBadge');
  });

  it('renders «—» for a missing value beside a present time', () => {
    const { container } = render(<ObjectRow label={TITLE} caption={CAPTION} trailing={TIME} />);
    expect(container.querySelector('.mds-object-row-value')?.textContent).toBe('—');
  });

  it('hides the end column entirely when both value and trailing are absent', () => {
    const { container } = render(<ObjectRow label={TITLE} />);
    expect(container.querySelector('.mds-object-row-end')).toBeNull();
  });

  it('ignores presses when disabled (23.24(15))', () => {
    const onPress = vi.fn();
    const { container } = render(
      <ObjectRow label={TITLE} value="1,250" onPress={onPress} disabled />,
    );
    const row = container.querySelector('button') as HTMLButtonElement;
    expect(row.disabled).toBe(true);
    fireEvent.pointerDown(row);
    fireEvent.pointerUp(row);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('carries no trailing chevron (23.24)', () => {
    const { container } = render(<ObjectRow label={TITLE} value="1,250" onPress={() => {}} />);
    expect(container.textContent).not.toContain('›');
  });

  it('A4: the mark shows the ONE 23.5 initial from the label, never an empty square', () => {
    const { container } = render(
      <ObjectRow label={TITLE} value="1,245.750" onPress={() => {}} />,
    );
    const initial = container.querySelector('.mds-entity-mark-initial');
    expect(initial).not.toBeNull();
    const letters = Array.from((initial as HTMLElement).textContent ?? '');
    expect(letters).toHaveLength(1);
  });
});
