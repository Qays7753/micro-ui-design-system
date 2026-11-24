import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { Section } from './Section';
import { SectionStates } from './Section.states';

const TITLE = ar['title.needsYou'].text;
const ALL = ar['button.all'].text;
const BODY = ar['empty.movements'].text;

describe('Section (BRIEF 9.2, 23.24(16), owner decision 2026-11-25)', () => {
  it('renders the title-section header with a body', () => {
    const { container } = render(
      <Section label={TITLE}>
        <p>{BODY}</p>
      </Section>,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(TITLE);
    expect(container.querySelector('.mds-section-see-all')).toBeNull();
    expect(SectionStates).toContain('default');
  });

  it('renders the count after the title (caption-strong, 8 away)', () => {
    const { container } = render(
      <Section label={TITLE} caption={12}>
        <p>{BODY}</p>
      </Section>,
    );
    const count = container.querySelector('.mds-section-count');
    expect(count?.textContent).toBe('12');
    expect(SectionStates).toContain('withCount');
  });

  it('renders the see-all link with the forward icon in a 48 zone (23.24(16))', () => {
    const onSeeAll = vi.fn();
    const { container } = render(
      <Section label={TITLE} caption={3} onPress={onSeeAll}>
        <p>{BODY}</p>
      </Section>,
    );
    const link = screen.getByRole('button', { name: ALL });
    expect(link).not.toBeNull();
    expect(container.querySelector('.mds-section-see-all-icon')).not.toBeNull();
    fireEvent.pointerDown(link);
    fireEvent.pointerUp(link);
    expect(onSeeAll).toHaveBeenCalledTimes(1);
    expect(SectionStates).toContain('withSeeAll');
  });

  it('hides the see-all link for an empty section (owner decision)', () => {
    const onSeeAll = vi.fn();
    render(<Section label={TITLE} onPress={onSeeAll} />);
    expect(screen.queryByRole('button', { name: ALL })).toBeNull();
    expect(SectionStates).toContain('empty');
  });

  it('keeps the three header texts on one baseline (23.24(16))', () => {
    const { container } = render(
      <Section label={TITLE} caption={3} onPress={() => {}}>
        <p>{BODY}</p>
      </Section>,
    );
    const header = container.querySelector('.mds-section-header');
    expect(header).not.toBeNull();
    // Baseline alignment is asserted in CSS (align-items: baseline); the
    // structural assertion here is that all three live in the same header.
    expect(header?.querySelectorAll('.mds-section-title, .mds-section-count, .mds-section-see-all').length).toBe(3);
  });

  it('passes data attributes through (lab hooks)', () => {
    const { container } = render(
      <Section label={TITLE} data-ds-check="section">
        <p>{BODY}</p>
      </Section>,
    );
    expect(container.querySelector('[data-ds-check="section"]')).not.toBeNull();
  });
});
