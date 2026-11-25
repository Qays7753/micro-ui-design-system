import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { t, pluralNouns } from '../../i18n/ar';
import { pluralAr } from '../../i18n/plural';
import { NotificationsButton } from './NotificationsButton';
import { NotificationsButtonStates } from './NotificationsButton.states';

afterEach(cleanup);

describe('NotificationsButton (BRIEF 9.1, 23.24(2))', () => {
  it('renders the bell inside a 48 zone with no dot at 0', () => {
    const { container } = render(<NotificationsButton onPress={() => {}} />);
    const btn = container.querySelector('.mds-notifications-button') as HTMLElement;
    expect(btn.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('.mds-notifications-dot')).toBeNull();
    const css = readFileSync(join(__dirname, 'NotificationsButton.css'), 'utf8');
    expect(css).toContain('width: var(--mds-size-touch-min)');
    expect(NotificationsButtonStates).toContain('default');
  });

  it('shows the dot when unread (23.24(2))', () => {
    const { container } = render(<NotificationsButton value={3} onPress={() => {}} />);
    expect(container.querySelector('.mds-notifications-dot')).not.toBeNull();
    expect(NotificationsButtonStates).toContain('unreadDot');
  });

  it('carries the count in the accessible name (23.17)', () => {
    const { container } = render(<NotificationsButton value={3} onPress={() => {}} />);
    const btn = container.querySelector('.mds-notifications-button') as HTMLElement;
    // The expected name is built by the same plural the component uses —
    // pluralAr(3, unread) — so the test never hardcodes Arabic copy.
    expect(btn.getAttribute('aria-label')).toBe(
      t('sr.notificationsCount', { counted: pluralAr(3, pluralNouns.unread) }),
    );
  });

  it('A-critic: at zero the name stays plain — no count rides it (23.17)', () => {
    const { container } = render(<NotificationsButton onPress={() => {}} />);
    const btn = container.querySelector('.mds-notifications-button') as HTMLElement;
    expect(btn.getAttribute('aria-label')).toBe(t('sr.notifications'));
  });

  it('fires onPress on tap', () => {
    const onPress = vi.fn();
    const { container } = render(<NotificationsButton onPress={onPress} />);
    const btn = container.querySelector('.mds-notifications-button') as HTMLElement;
    fireEvent.pointerDown(btn, { pointerId: 1, clientX: 5, clientY: 5 });
    fireEvent.pointerUp(btn, { pointerId: 1 });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('the dot is dot-unread brand-anchor with a canvas ring', () => {
    const css = readFileSync(join(__dirname, 'NotificationsButton.css'), 'utf8');
    expect(css).toContain('var(--mds-size-dot-unread)');
    expect(css).toContain('inset-inline-end');
    expect(css).toContain('var(--mds-color-brand-anchor)');
    expect(css).toContain('var(--mds-color-canvas)');
  });
});
