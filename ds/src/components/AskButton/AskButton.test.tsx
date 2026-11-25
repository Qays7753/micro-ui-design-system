import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { AskButton } from './AskButton';
import { AskButtonStates } from './AskButton.states';

afterEach(cleanup);

describe('AskButton (BRIEF 9.1, 4.2, 23.24(2))', () => {
  it('renders the Micro symbol inside a 48 zone with no rest background', () => {
    const { container } = render(<AskButton onPress={() => {}} />);
    const btn = container.querySelector('.mds-ask-button') as HTMLElement;
    expect(btn.querySelector('svg')).not.toBeNull();
    const css = readFileSync(join(__dirname, 'AskButton.css'), 'utf8');
    expect(css).toContain('width: var(--mds-size-touch-min)');
    expect(css).toContain('background-color: transparent');
    expect(AskButtonStates).toContain('default');
  });

  it('shows the center dot only when unread (4.2)', () => {
    const first = render(<AskButton onPress={() => {}} />);
    expect(first.container.querySelector('.mds-ask-dot')).toBeNull();
    first.unmount();
    const second = render(<AskButton onPress={() => {}} selected />);
    expect(second.container.querySelector('.mds-ask-dot')).not.toBeNull();
    expect(AskButtonStates).toContain('unreadDot');
  });

  it('carries the screen-reader name with the unread note (23.17)', () => {
    const first = render(<AskButton onPress={() => {}} />);
    expect(
      first.container.querySelector('.mds-ask-button')?.getAttribute('aria-label'),
    ).toBe(ar['sr.ask'].text);
    first.unmount();
    const second = render(<AskButton onPress={() => {}} selected />);
    expect(
      second.container.querySelector('.mds-ask-button')?.getAttribute('aria-label'),
    ).toBe(ar['sr.askUnread'].text);
  });

  it('fires onLongPress after the hold (9.1)', () => {
    vi.useFakeTimers();
    const onLongPress = vi.fn();
    const { container } = render(
      <AskButton onPress={() => {}} onLongPress={onLongPress} />,
    );
    const btn = container.querySelector('.mds-ask-button') as HTMLElement;
    fireEvent.pointerDown(btn, { pointerId: 1, clientX: 10, clientY: 10 });
    vi.advanceTimersByTime(600);
    fireEvent.pointerUp(btn, { pointerId: 1 });
    expect(onLongPress).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
    expect(AskButtonStates).toContain('longPressRecording');
  });

  it('the dot is dot-ask brand-anchor in the center', () => {
    render(<AskButton onPress={() => {}} selected />);
    const css = readFileSync(join(__dirname, 'AskButton.css'), 'utf8');
    expect(css).toContain('var(--mds-size-dot-ask)');
    expect(css).toContain('var(--mds-color-brand-anchor)');
    expect(css).toContain('calc((var(--mds-size-touch-min) - var(--mds-size-dot-ask)) / 2)');
  });
});
