import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { Button } from './Button';

// Labels come from the dictionary (no Arabic literals here — ds-copy).
const LABEL = ar['button.all'].text;
const SAVING = ar['saveState.sending'].text;
import { ButtonStates } from './Button.states';

describe('Button (BRIEF 9.3, 23.2, 23.3)', () => {
  it('renders the primary 52 button with radius and min-width classes', () => {
    const { container } = render(<Button>{LABEL}</Button>);
    const button = screen.getByRole('button');
    expect(button).toBe(container.querySelector('.mds-button--primary'));
    expect(container.querySelector('.mds-button--md')).not.toBeNull();
  });

  it('carries the four variants with one class each (23.18)', () => {
    for (const variant of ['primary', 'secondary', 'text', 'danger'] as const) {
      const { container, unmount } = render(<Button variant={variant}>{LABEL}</Button>);
      expect(container.querySelector(`.mds-button--${variant}`)).not.toBeNull();
      unmount();
    }
    expect(ButtonStates).toContain('danger');
  });

  it('supports the sm size with the compact classes (23.3)', () => {
    const { container } = render(<Button size="sm">{LABEL}</Button>);
    expect(container.querySelector('.mds-button--sm')).not.toBeNull();
  });

  it('fires onPress on click and supports onLongPress wiring', () => {
    const onPress = vi.fn();
    const onLongPress = vi.fn();
    render(<Button onPress={onPress} onLongPress={onLongPress}>{LABEL}</Button>);
    const button = screen.getByRole('button');
    // usePress listens to pointer events, not click (BRIEF 23.2 press model).
    fireEvent.pointerDown(button);
    fireEvent.pointerUp(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('shows the spinner and aria-busy while loading, no icon slot (23.3)', () => {
    const { container } = render(<Button loading>{SAVING}</Button>);
    expect(container.querySelector('.mds-button-spinner')).not.toBeNull();
    expect(container.querySelector('.mds-button-icon')).toBeNull();
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true');
  });

  it('renders one leading icon and one trailing icon max (23.3)', () => {
    const { container } = render(
      <Button leading={<svg data-testid="lead" />} trailing={<svg data-testid="trail" />}>
        {LABEL}
      </Button>,
    );
    expect(container.querySelector('[data-testid="lead"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="trail"]')).not.toBeNull();
  });

  it('disables natively and keeps the label legible (23.2)', () => {
    render(<Button disabled>{LABEL}</Button>);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).not.toBe('');
  });

  it('ignores presses while disabled or loading (23.24(15))', () => {
    const onPress = vi.fn();
    const { rerender } = render(<Button disabled onPress={onPress}>{LABEL}</Button>);
    const press = () => {
      const button = screen.getByRole('button');
      fireEvent.pointerDown(button);
      fireEvent.pointerUp(button);
    };
    press();
    expect(onPress).not.toHaveBeenCalled();
    rerender(<Button loading onPress={onPress}>{SAVING}</Button>);
    press();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('passes data attributes through to the button (the lab check hooks)', () => {
    const { container } = render(<Button data-ds-check="button-md">{LABEL}</Button>);
    expect(container.querySelector('[data-ds-check="button-md"]')).not.toBeNull();
  });

  it('exposes its state list for the lab and the gates (BRIEF 9.0)', () => {
    expect(ButtonStates).toContain('loading');
    expect(ButtonStates).toContain('pressed');
    expect(ButtonStates).toContain('sm');
  });
});
