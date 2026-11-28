import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  ar,
  getMoneyTexts,
  overriddenText,
  overrideTexts,
  resetTextOverrides,
  t,
} from './ar';
import { StatusBadge } from '../components/StatusBadge/index';

afterEach(() => {
  resetTextOverrides();
  cleanup();
});

describe('overrideTexts — 3ج.1 host-app text overrides', () => {
  it('keeps the library text when the app passed no override', () => {
    expect(t('button.recordMovement')).toBe(ar['button.recordMovement'].text);
    expect(overriddenText('button.recordMovement')).toBeUndefined();
  });

  it('replaces the passed key and only it (any key not passed stays library text)', () => {
    overrideTexts({ 'button.recordMovement': 'دبّر الحركة' });
    expect(t('button.recordMovement')).toBe('دبّر الحركة');
    expect(t('button.recordPayment')).toBe(ar['button.recordPayment'].text);
  });

  it('is TYPED: a key outside the dictionary fails typecheck', () => {
    // @ts-expect-error — 'button.nope' is not an ArKey; the mechanism is
    // written with the dictionary's key types (3ج.1), so this line must
    // break the build, not ship a silent miss.
    overrideTexts({ 'button.nope': 'شيء' });
    expect(true).toBe(true);
  });

  it('interpolates {param} inside an overridden text', () => {
    overrideTexts({ 'metric.sourceFrom': 'من {counted} حركة' });
    expect(t('metric.sourceFrom', { counted: '32' })).toBe('من 32 حركة');
  });

  it('a later call REPLACES the whole set (not additive)', () => {
    overrideTexts({ 'button.recordMovement': 'أول' });
    overrideTexts({ 'button.recordPayment': 'ثاني' });
    expect(t('button.recordMovement')).toBe(ar['button.recordMovement'].text);
    expect(t('button.recordPayment')).toBe('ثاني');
  });

  it('resetTextOverrides drops every override', () => {
    overrideTexts({ 'button.recordMovement': 'دبّر الحركة' });
    resetTextOverrides();
    expect(t('button.recordMovement')).toBe(ar['button.recordMovement'].text);
    expect(overriddenText('button.recordMovement')).toBeUndefined();
  });

  it('flows into the money aria set (getMoneyTexts reads at call time)', () => {
    expect(getMoneyTexts().unit).toBe('د');
    overrideTexts({ 'money.unit': 'دينار أردني' });
    expect(getMoneyTexts().unit).toBe('دينار أردني');
  });

  it('flows into a component default: StatusBadge tone word changes on the next render', () => {
    const before = render(<StatusBadge tone="waiting" />);
    expect(before.container.querySelector('.mds-status-badge-label')?.textContent)
      .toBe(ar['badge.waiting'].text);
    before.unmount();

    overrideTexts({ 'badge.waiting': 'قيد الانتظار' });
    const after = render(<StatusBadge tone="waiting" />);
    expect(after.container.querySelector('.mds-status-badge-label')?.textContent)
      .toBe('قيد الانتظار');
    // a tone the app did not override keeps the library word
    const untouched = render(<StatusBadge tone="done" />);
    expect(untouched.container.querySelector('.mds-status-badge-label')?.textContent)
      .toBe(ar['badge.done'].text);
  });
});
