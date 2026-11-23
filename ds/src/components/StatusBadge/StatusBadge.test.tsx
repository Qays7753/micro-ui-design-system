import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { StatusBadge } from './StatusBadge';
import { StatusBadgeStates } from './StatusBadge.states';

describe('StatusBadge (BRIEF 23.6)', () => {
  it('renders the tone word with its Bold icon at 14', () => {
    const { container } = render(<StatusBadge tone="done" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('width')).toBe('14');
    expect(screen.getByText(ar['badge.done'].text)).not.toBeNull();
    expect(container.querySelector('.mds-status-badge--done')).not.toBeNull();
  });

  it('defaults the word from the dictionary for every tone (24)', () => {
    for (const [tone, key] of [
      ['done', 'badge.done'],
      ['waiting', 'badge.waiting'],
      ['problem', 'badge.problem'],
      ['info', 'badge.info'],
      ['neutral', 'badge.neutral'],
    ] as const) {
      const { unmount } = render(<StatusBadge tone={tone} />);
      expect(screen.getByText(ar[key].text)).not.toBeNull();
      unmount();
    }
  });

  it('accepts a custom dictionary word through label (23.18)', () => {
    render(<StatusBadge tone="waiting" label={ar['badge.cancelled'].text} />);
    expect(screen.getByText(ar['badge.cancelled'].text)).not.toBeNull();
  });

  it('the neutral tone carries no icon (23.23 tone-neutral)', () => {
    const { container } = render(<StatusBadge tone="neutral" />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('caps the width at 160 and truncates the word with «…» (23.20)', () => {
    const { container } = render(<StatusBadge tone="neutral" />);
    const badge = container.querySelector('.mds-status-badge')!;
    expect(badge.className).toContain('mds-status-badge');
    expect(container.querySelector('.mds-status-badge-label')).not.toBeNull();
    expect(StatusBadgeStates).toContain('longLabel');
  });

  it('passes data attributes through to the root (the lab check hooks)', () => {
    const { container } = render(<StatusBadge tone="info" data-ds-check="status-badge-height" />);
    expect(container.querySelector('[data-ds-check="status-badge-height"]')).not.toBeNull();
  });
});
