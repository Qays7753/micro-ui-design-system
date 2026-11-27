import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { StatusBadge } from '../StatusBadge/index';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ObjectRow } from './ObjectRow';
import { SelectedIcon } from '../../icons';
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

  it('keeps one-line rows at the mark height: no 56 variant class (addendum hw-1)', () => {
    const { container } = render(<ObjectRow label={TITLE} value="1,250" />);
    expect(container.querySelector('.mds-object-row--one-line')).toBeNull();
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

  it('renders NOTHING at the row end when the value is missing (ت5, 1.7)', () => {
    const { container } = render(<ObjectRow label={TITLE} caption={CAPTION} trailing={TIME} />);
    // «—» belongs to a LABELED value cell (KeyValueList, Metric) — never an
    // object row; the time still rides the end column alone.
    expect(container.querySelector('.mds-object-row-value')).toBeNull();
    expect(container.querySelector('.mds-object-row-time')?.textContent).toBe(TIME);
  });

  it('icon rows (ت4, 1.7): a ReactNode leading rides 20 text-secondary, no mark box, row-plain height', () => {
    const css = readFileSync(join(__dirname, 'ObjectRow.css'), 'utf8');
    expect(css).toContain('.mds-object-row--icon');
    expect(css).toContain('var(--mds-size-row-plain)');
    expect(css).toContain('var(--mds-size-icon-20)');
    expect(css).toContain('var(--mds-color-text-secondary)');
    const { container } = render(
      <ObjectRow label={TITLE} leading={<SelectedIcon size={20} />} onPress={() => {}} />,
    );
    expect(container.querySelector('.mds-object-row-icon')).not.toBeNull();
    expect(container.querySelector('.mds-entity-mark')).toBeNull();
  });

  it('hides the end column entirely when both value and trailing are absent', () => {
    const { container } = render(<ObjectRow label={TITLE} />);
    expect(container.querySelector('.mds-object-row-end')).toBeNull();
  });

  it('pressed rides the r-sm corner and the floating 8 inset with the content unmoved (1.7 ت13)', () => {
    const css = readFileSync(join(__dirname, 'ObjectRow.css'), 'utf8');
    expect(css).toContain('border-radius: var(--mds-radius-sm)');
    expect(css).toContain('margin-inline: var(--mds-layout-pressed-row-inset)');
    expect(css).toContain('padding-inline: calc(var(--mds-layout-row-padding-inline) - var(--mds-layout-pressed-row-inset))');
    // the inset is absorbed, never added: the padding cut matches the margin
    expect(css).not.toContain('padding-inline: var(--mds-layout-row-padding-inline)');
  });

  it('landed plays motion.landed once and goes quiet under reduced motion (1.7 ت12)', () => {
    const { container } = render(
      <ObjectRow label={ar['row.sampleTitle'].text} landed />,
    );
    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toContain('mds-object-row--landed');
    const css = readFileSync(join(__dirname, 'ObjectRow.css'), 'utf8');
    expect(css).toContain('animation: mds-row-landed var(--mds-motion-landed-ms) var(--mds-motion-landed-ease) 1 both');
    expect(css).toContain('@keyframes mds-row-landed');
    expect(css).toContain('var(--mds-color-brand-selected-bg)');
    expect(css.match(/animation: none/g)?.length).toBeGreaterThanOrEqual(1);
    expect(ObjectRowStates).toContain('landed');
  });

  it('landed defaults to off and stays off without the prop', () => {
    const { container } = render(<ObjectRow label={ar['row.sampleTitle'].text} />);
    expect((container.firstElementChild as HTMLElement).className).not.toContain('mds-object-row--landed');
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

  it('carries the OBJECT in the row accessible name (rule 61: name per instance)', () => {
    render(<ObjectRow label={TITLE} caption={CAPTION} value="1,245.750" trailing={TIME} onPress={() => {}} />);
    const row = screen.getByRole('button', { name: new RegExp(TITLE) });
    expect(row).not.toBeNull();
  });
});
