import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';

const LINE = ar['empty.movements'].text;
import { NavTodayIcon } from '../../icons';
import { Tile } from './Tile';
import { TileStates } from './Tile.states';

const LABEL = ar['nav.today'].text;

function base() {
  return { label: LABEL, value: '1,250' };
}

describe('Tile (BRIEF 23.9)', () => {
  it('renders header label and the bottom-anchored number', () => {
    const { container } = render(<Tile {...base()} trailing={LINE} />);
    expect(container.querySelector('.mds-tile-header-label')?.textContent).toBe(LABEL);
    expect(container.querySelector('.mds-tile-value')?.textContent).toBe('1,250');
    expect(container.querySelector('.mds-tile-line')?.textContent).toBe(LINE);
    expect(TileStates).toContain('default');
  });

  it('shows «—» in the SAME number typography when the value is missing (owner decision)', () => {
    const { container } = render(<Tile label={LABEL} />);
    const value = container.querySelector('.mds-tile-value');
    expect(value?.textContent).toBe('—');
    expect(value?.className).toBe('mds-tile-value');
  });

  it('renders the attention dot with its screen-reader label (23.9, 23.17)', () => {
    const { container } = render(<Tile {...base()} state caption={ar['title.needsYou'].text} />);
    const dot = container.querySelector('.mds-tile-dot');
    expect(dot).not.toBeNull();
    expect(dot?.getAttribute('role')).toBe('img');
    expect(dot?.getAttribute('aria-label')).toBe(ar['title.needsYou'].text);
    expect(TileStates).toContain('withDot');
  });

  it('renders the sparkline above the number when provided', () => {
    const { container } = render(
      <Tile {...base()} draft={<svg data-testid="spark" viewBox="0 0 80 24" />} />,
    );
    expect(container.querySelector('.mds-tile-sparkline')).not.toBeNull();
    expect(TileStates).toContain('withSparkline');
  });

  it('applies the outer-corner tone classes (28 outer / 8 rest)', () => {
    const { container } = render(<Tile {...base()} tone="end" />);
    expect(container.querySelector('.mds-tile--end')).not.toBeNull();
  });

  it('fires onPress through the press model (opens the filtered domain)', () => {
    const onPress = vi.fn();
    render(<Tile {...base()} onPress={onPress} />);
    const tile = screen.getByRole('button');
    fireEvent.pointerDown(tile);
    fireEvent.pointerUp(tile);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses when disabled (23.24(15))', () => {
    const onPress = vi.fn();
    render(<Tile {...base()} onPress={onPress} disabled />);
    const tile = screen.getByRole('button') as HTMLButtonElement;
    expect(tile.disabled).toBe(true);
    fireEvent.pointerDown(tile);
    fireEvent.pointerUp(tile);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('carries the leading icon without a container (23.9)', () => {
    const { container } = render(<Tile {...base()} leading={<NavTodayIcon />} />);
    expect(container.querySelector('.mds-tile-header-icon')).not.toBeNull();
  });
});
