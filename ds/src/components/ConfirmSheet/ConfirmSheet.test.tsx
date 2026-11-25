import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { ConfirmSheet } from './ConfirmSheet';
import { ConfirmSheetStates } from './ConfirmSheet.states';

const TITLE = ar['confirm.sampleTitle'].text;
const SENTENCE = ar['confirm.sampleSentence'].text;
const ACTION = ar['button.deleteMovement'].text;
const BACK = ar['button.back'].text;

describe('ConfirmSheet (BRIEF 9.3, 23.24, 1284)', () => {
  it('renders the centered icon, title, sentence and exactly two buttons', () => {
    const { container } = render(
      <ConfirmSheet label={TITLE} caption={SENTENCE} value={ACTION} onPress={() => {}} onDismiss={() => {}} />,
    );
    expect(container.querySelector('.mds-confirm-sheet-icon svg')).not.toBeNull();
    expect(container.querySelector('.mds-confirm-sheet-title')?.textContent).toBe(TITLE);
    expect(container.querySelector('.mds-confirm-sheet-sentence')?.textContent).toBe(SENTENCE);
    const buttons = container.querySelectorAll('.mds-confirm-sheet-actions .mds-button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe(BACK);
    expect(buttons[1].textContent).toBe(ACTION);
    expect(ConfirmSheetStates).toContain('default');
  });

  it('carries role=alertdialog (1284)', () => {
    const { container } = render(
      <ConfirmSheet label={TITLE} caption={SENTENCE} value={ACTION} onPress={() => {}} onDismiss={() => {}} />,
    );
    expect(container.querySelector('[role="alertdialog"]')).not.toBeNull();
  });

  it('focuses the back button on mount, never the destructive one (1284)', () => {
    const { container } = render(
      <ConfirmSheet label={TITLE} caption={SENTENCE} value={ACTION} onPress={() => {}} onDismiss={() => {}} />,
    );
    const back = container.querySelector('.mds-confirm-sheet-back') as HTMLButtonElement;
    expect(document.activeElement).toBe(back);
    expect(ConfirmSheetStates).toContain('focused');
  });

  it('fires onPress for the destructive button and onDismiss for back', () => {
    const onPress = vi.fn();
    const onDismiss = vi.fn();
    const { container } = render(
      <ConfirmSheet label={TITLE} caption={SENTENCE} value={ACTION} onPress={onPress} onDismiss={onDismiss} />,
    );
    const confirm = container.querySelector('.mds-confirm-sheet-confirm') as HTMLElement;
    fireEvent.pointerDown(confirm);
    fireEvent.pointerUp(confirm);
    expect(onPress).toHaveBeenCalledTimes(1);
    const back = container.querySelector('.mds-confirm-sheet-back') as HTMLElement;
    fireEvent.pointerDown(back);
    fireEvent.pointerUp(back);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('fills the destructive button red inside the sheet only (9.3)', () => {
    const css = readFileSync(join(__dirname, 'ConfirmSheet.css'), 'utf8');
    expect(css).toContain('.mds-confirm-sheet-confirm.mds-button--danger');
    expect(css).not.toContain('brand-signal-text');
  });
});
