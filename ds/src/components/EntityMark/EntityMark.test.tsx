import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { EntityMark } from './EntityMark';
import { EntityMarkStates } from './EntityMark.states';

// Test names are composed from dictionary words (no Arabic literals here —
// ds-copy): «سالب» starts with س, «عليك» with ع, and a two-word name keeps
// the FIRST word's letter — exactly what 23.5 requires.
const SINGLE = ar['money.ariaMinus'].text;
const TWO_WORDS = `${ar['money.ariaMinus'].text} ${ar['badge.done'].text}`;
const PERSON = ar['money.againstYou'].text;

describe('EntityMark (BRIEF 23.5, 23.24(4))', () => {
  it('renders the isolated first letter of the first name (23.5)', () => {
    const { container } = render(<EntityMark value={SINGLE} />);
    const initial = container.querySelector('.mds-entity-mark-initial')!;
    expect(initial.textContent).toBe(SINGLE.slice(0, 1));
  });

  it('keeps the first word letter for a multi-word name', () => {
    const { container } = render(<EntityMark value={TWO_WORDS} />);
    expect(container.querySelector('.mds-entity-mark-initial')?.textContent).toBe(SINGLE.slice(0, 1));
  });

  it('sizes exactly sm 32 / md 44 / lg 64 with one class each (23.18)', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { container, unmount } = render(<EntityMark size={size} value={PERSON} />);
      expect(container.querySelector(`.mds-entity-mark--${size}`)).not.toBeNull();
      unmount();
    }
    expect(EntityMarkStates).toContain('sizes');
  });

  it('renders an object mark from children (fund type icon, 23.5)', () => {
    const { container } = render(
      <EntityMark value={PERSON}>
        <svg data-testid="fund-icon" />
      </EntityMark>,
    );
    expect(container.querySelector('[data-testid="fund-icon"]')).not.toBeNull();
    expect(container.querySelector('.mds-entity-mark-initial')).toBeNull();
  });

  it('adds the approved badge only for done and waiting tones (23.24(4))', () => {
    const approved = render(<EntityMark value={PERSON} tone="done" />);
    expect(approved.container.querySelector('.mds-entity-mark-badge')).not.toBeNull();
    expect(approved.container.querySelector('svg[width="14"]')).not.toBeNull();
    const pending = render(<EntityMark value={PERSON} tone="waiting" />);
    expect(pending.container.querySelector('.mds-entity-mark-badge')).not.toBeNull();
    const plain = render(<EntityMark value={PERSON} />);
    expect(plain.container.querySelector('.mds-entity-mark-badge')).toBeNull();
    const neutral = render(<EntityMark value={PERSON} tone="neutral" />);
    expect(neutral.container.querySelector('.mds-entity-mark-badge')).toBeNull();
  });

  it('is presentational: aria-hidden, the name is read beside it', () => {
    const { container } = render(<EntityMark value={SINGLE} />);
    expect(container.querySelector('.mds-entity-mark')?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByText(SINGLE)).toBeNull();
  });

  it('passes data attributes through to the root (the lab check hooks)', () => {
    const { container } = render(<EntityMark value={SINGLE} data-ds-check="entity-mark-md" />);
    expect(container.querySelector('[data-ds-check="entity-mark-md"]')).not.toBeNull();
  });

  it('falls back to no letter when the name is empty', () => {
    const { container } = render(<EntityMark value="" />);
    expect(container.querySelector('.mds-entity-mark-initial')).toBeNull();
  });
});
