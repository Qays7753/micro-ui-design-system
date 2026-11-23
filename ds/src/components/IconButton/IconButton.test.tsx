import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';
import { IconButtonStates } from './IconButton.states';

describe('IconButton (BRIEF 23.2, 23.3)', () => {
  it('is a 48 circle that names itself for the screen reader (29.1-m4)', () => {
    const { container } = render(
      <IconButton label={LABEL}>
        <svg data-testid="icon" />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: LABEL });
    expect(button).toBe(container.querySelector('.mds-icon-button'));
    expect(container.querySelector('.mds-icon-button--large')).toBeNull();
    expect(container.querySelector('[data-testid="icon"]')).not.toBeNull();
  });

  it('fires onPress on release through pointer events (23.2)', () => {
    const onPress = vi.fn();
    render(
      <IconButton label={LABEL} onPress={onPress}>
        <svg />
      </IconButton>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerDown(button);
    fireEvent.pointerUp(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses while disabled or without a handler', () => {
    const onPress = vi.fn();
    render(
      <IconButton label={LABEL} disabled onPress={onPress}>
        <svg />
      </IconButton>,
    );
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.pointerDown(button);
    fireEvent.pointerUp(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports the driver density of 56 (23.18, BRIEF 7)', () => {
    const { container } = render(
      <IconButton label={LABEL} density="large">
        <svg />
      </IconButton>,
    );
    expect(container.querySelector('.mds-icon-button--large')).not.toBeNull();
    expect(IconButtonStates).toContain('large');
  });

  it('passes data attributes through to the button (the lab check hooks)', () => {
    const { container } = render(
      <IconButton label={LABEL} data-ds-check="icon-button">
        <svg />
      </IconButton>,
    );
    expect(container.querySelector('[data-ds-check="icon-button"]')).not.toBeNull();
  });

  it('exposes its state list for the lab and the gates (BRIEF 9.0)', () => {
    expect(IconButtonStates).toContain('pressed');
    expect(IconButtonStates).toContain('disabled');
  });
});

import { ar } from '../../i18n/ar';
const LABEL = ar['button.back'].text;
