import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { Button } from '../Button/index';
import { StatusBadge } from '../StatusBadge/index';
import { ObjectCard } from './ObjectCard';
import { ObjectCardStates } from './ObjectCard.states';

const TITLE = ar['row.sampleTitle'].text;
const CAPTION = ar['row.sampleCaption'].text;

describe('ObjectCard (BRIEF 4.1, 23.24)', () => {
  it('renders mark, two-line title, caption, value and one next-step button', () => {
    const { container } = render(
      <ObjectCard
        label={TITLE}
        caption={CAPTION}
        value="1,245.750"
      >
        <Button variant="secondary" size="sm">{ar['button.recordPayment'].text}</Button>
      </ObjectCard>,
    );
    expect(container.querySelector('.mds-object-card-title')?.textContent).toBe(TITLE);
    expect(container.querySelector('.mds-object-card-caption')?.textContent).toBe(CAPTION);
    expect(container.querySelector('.mds-object-card-value')?.textContent).toBe('1,245.750');
    expect(container.querySelector('.mds-object-card-action .mds-button')).not.toBeNull();
    expect(ObjectCardStates).toContain('withButton');
  });

  it('renders a passive div when not interactive', () => {
    const { container } = render(<ObjectCard label={TITLE} value="1,250" />);
    expect(container.querySelector('button')).toBeNull();
  });

  it('fires onPress when the card is pressed (AskNavResult pattern)', () => {
    const onPress = vi.fn();
    const { container } = render(<ObjectCard label={TITLE} value="1,250" onPress={onPress} />);
    const card = container.querySelector('button') as HTMLElement;
    fireEvent.pointerDown(card);
    fireEvent.pointerUp(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('carries the StatusBadge node beside the mark (23.6)', () => {
    const { container } = render(
      <ObjectCard label={TITLE} value="1,250" state={<StatusBadge tone="problem" />} />,
    );
    expect(container.querySelector('.mds-object-card-state .mds-status-badge')).not.toBeNull();
    expect(ObjectCardStates).toContain('withBadge');
  });

  it('ignores presses when disabled (23.24(15))', () => {
    const onPress = vi.fn();
    const { container } = render(<ObjectCard label={TITLE} value="1,250" onPress={onPress} disabled />);
    const card = container.querySelector('button') as HTMLButtonElement;
    expect(card.disabled).toBe(true);
    fireEvent.pointerDown(card);
    fireEvent.pointerUp(card);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('A4: the mark shows the ONE 23.5 initial from the label, never an empty square', () => {
    const { container } = render(
      <ObjectCard label={TITLE} caption={CAPTION} />,
    );
    const initial = container.querySelector('.mds-entity-mark-initial');
    expect(initial).not.toBeNull();
    const letters = Array.from((initial as HTMLElement).textContent ?? '');
    expect(letters).toHaveLength(1);
  });
});
