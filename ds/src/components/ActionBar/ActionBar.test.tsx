import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { ActionBar } from './ActionBar';
import { ActionBarStates } from './ActionBar.states';

const PRIMARY = ar['button.saveMovement'].text;
const SECONDARY = ar['button.recordPayment'].text;

afterEach(cleanup);

describe('ActionBar (BRIEF 9.2, 23.16, 27.3/27.4)', () => {
  it('renders one primary button and an optional secondary text action', () => {
    const { container } = render(
      <ActionBar label={PRIMARY} onPress={() => {}} caption={SECONDARY} onRetry={() => {}} />,
    );
    const buttons = container.querySelectorAll('.mds-button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].className).toContain('mds-button--text');
    expect(buttons[1].className).toContain('mds-button--primary');
    expect(buttons[1].textContent).toBe(PRIMARY);
    expect(ActionBarStates).toContain('default');
  });

  it('renders exactly ONE primary button and no secondary when caption is absent', () => {
    const { container } = render(<ActionBar label={PRIMARY} onPress={() => {}} />);
    const primaries = container.querySelectorAll('.mds-button--primary');
    expect(primaries.length).toBe(1);
    expect(container.querySelectorAll('.mds-button').length).toBe(1);
  });

  it('shows the top hairline only while content remains (23.16)', () => {
    const css = readFileSync(join(__dirname, 'ActionBar.css'), 'utf8');
    // The hairline is bound to the --more modifier ONLY: the base class
    // block carries no border-top declaration.
    expect(css).toContain('.mds-action-bar--more');
    const baseBlock = css.slice(css.indexOf('.mds-action-bar {'), css.indexOf('/* 23.16'));
    expect(baseBlock.includes('border-top')).toBe(false);
    expect(ActionBarStates).toContain('contentMore');
    expect(ActionBarStates).toContain('scrolledToEnd');
  });

  it('uses the bars layer and the safe-area padding (23.15, 27.3)', () => {
    const css = readFileSync(join(__dirname, 'ActionBar.css'), 'utf8');
    expect(css).toContain('z-index: var(--mds-layer-bars)');
    expect(css).toContain('env(safe-area-inset-bottom)');
  });

  it('the primary fills the remaining width and the secondary does not (23.20)', () => {
    const css = readFileSync(join(__dirname, 'ActionBar.css'), 'utf8');
    expect(css).toContain('flex: 1 1 auto');
    expect(css).toContain('flex: 0 0 auto');
  });

  it('presses route to their handlers', () => {
    const onPress = vi.fn();
    const onRetry = vi.fn();
    const { container } = render(
      <ActionBar label={PRIMARY} onPress={onPress} caption={SECONDARY} onRetry={onRetry} />,
    );
    const buttons = container.querySelectorAll('.mds-button');
    fireEvent.pointerDown(buttons[0]);
    fireEvent.pointerUp(buttons[0]);
    fireEvent.pointerDown(buttons[1]);
    fireEvent.pointerUp(buttons[1]);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('carries role=group with the primary label as its name', () => {
    const { container } = render(<ActionBar label={PRIMARY} onPress={() => {}} />);
    const bar = container.querySelector('.mds-action-bar') as HTMLElement;
    expect(bar.getAttribute('role')).toBe('group');
    expect(bar.getAttribute('aria-label')).toBe(PRIMARY);
  });

  it('passes loading and disabled through to the primary button', () => {
    const { container } = render(
      <ActionBar label={PRIMARY} onPress={() => {}} loading disabled />,
    );
    const primary = container.querySelector('.mds-action-bar-primary') as HTMLElement;
    expect(primary).not.toBeNull();
    expect(primary.getAttribute('aria-busy')).toBe('true');
    expect((primary as HTMLButtonElement).disabled).toBe(true);
    expect(ActionBarStates).toContain('loading');
    expect(ActionBarStates).toContain('disabled');
  });
});
