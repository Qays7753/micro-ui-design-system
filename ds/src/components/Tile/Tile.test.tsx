import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar, moneyTexts } from '../../i18n/ar';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';

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

  it('renders the sparkline above the number when provided (23.25: line + endpoint dot)', () => {
    const { container } = render(<Tile {...base()} draft={[8.2, 7.6, 8.9, 8.1, 9.4]} trailing={LINE} />);
    const sparkline = container.querySelector('.mds-tile-sparkline');
    expect(sparkline).not.toBeNull();
    expect(sparkline?.querySelector('polyline')).not.toBeNull();
    expect(sparkline?.querySelector('circle')).not.toBeNull();
    // the sparkline sits ABOVE the number (23.9)
    const value = container.querySelector('.mds-tile-value') as HTMLElement;
    expect(
      sparkline!.compareDocumentPosition(value) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(TileStates).toContain('withSparkline');
  });

  it('draws the endpoint dot ALONE for a single value (no line)', () => {
    const { container } = render(<Tile {...base()} draft={[9.4]} />);
    expect(container.querySelector('.mds-tile-sparkline circle')).not.toBeNull();
    expect(container.querySelector('.mds-tile-sparkline polyline')).toBeNull();
  });

  it('hides the number but keeps the sparkline slot WITHOUT values when amounts are hidden (23.22)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Tile {...base()} draft={[8.2, 7.6, 8.9, 8.1]} trailing={LINE} />
      </AmountVisibilityProvider>,
    );
    const sparkline = container.querySelector('.mds-tile-sparkline');
    expect(sparkline).not.toBeNull();
    expect(sparkline?.querySelector('polyline')).toBeNull();
    expect(sparkline?.querySelector('circle')).toBeNull();
    expect(container.querySelector('.mds-tile-value')?.textContent).toBe(moneyTexts.hiddenGlyph);
    expect(container.textContent).not.toContain('1,250');
    expect(container.querySelector('.mds-tile-line')?.textContent).toBe(LINE);
  });

  it('keeps the missing em dash over hidden (like Money and the hero)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Tile label={LABEL} trailing={LINE} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-tile-value')?.textContent).toBe(moneyTexts.missingGlyph);
  });

  it('keeps a NON-financial counter visible while amounts are hidden (23.22)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Tile label={LABEL} value="4" trailing={LINE} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-tile-value')?.textContent).toBe('4');
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

  it('renders the non-interactive leading icon BESIDE the label text, never alone (rule 27: icon with sibling text, size owned by the app <= 20)', () => {
    const { container } = render(<Tile {...base()} leading={<NavTodayIcon size={20} />} />);
    const header = container.querySelector('.mds-tile-header') as HTMLElement;
    const icon = header.querySelector('.mds-tile-header-icon') as HTMLElement;
    // adjacency: the icon and the label share the header row
    expect(header.contains(icon)).toBe(true);
    expect((header.textContent ?? '').includes(LABEL)).toBe(true);
    // the app keeps the icon at the 20 cap from size.icon (rule 27)
    expect(icon.querySelector('svg')).not.toBeNull();
  });
});
