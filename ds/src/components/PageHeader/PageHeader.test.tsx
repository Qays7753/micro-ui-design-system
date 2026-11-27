import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { IconButton } from '../IconButton/index';
import { BackIcon } from '../../icons';
import { PageHeader } from './PageHeader';
import { PageHeaderStates } from './PageHeader.states';

const TITLE = ar['title.movements'].text;

afterEach(cleanup);

describe('PageHeader (BRIEF 9.1, 23.16, 23.20)', () => {
  it('renders the title at title-screen 28/36 (23.20 anatomy)', () => {
    const { container } = render(<PageHeader label={TITLE} />);
    const title = container.querySelector('.mds-page-header-title') as HTMLElement;
    expect(title.textContent).toBe(TITLE);
    expect(title.tagName).toBe('H1');
    const css = readFileSync(join(__dirname, 'PageHeader.css'), 'utf8');
    expect(css).toContain('var(--mds-type-title-screen-size)');
    expect(css).toContain('-webkit-line-clamp: 2');
    expect(PageHeaderStates).toContain('default');
  });

  it('main screen has no back button and no collapse (9.1)', () => {
    const { container } = render(<PageHeader label={TITLE} caption />);
    expect(container.querySelector('.mds-page-header-back')).toBeNull();
    expect(
      (container.querySelector('.mds-page-header-title') as HTMLElement).classList.contains(
        'mds-type-label-strong',
      ),
    ).toBe(false);
    expect(PageHeaderStates).toContain('mainScreen');
  });

  it('sub screen renders the real back IconButton through leading (23.2)', () => {
    const onBack = vi.fn();
    const { container } = render(
      <PageHeader
        label={TITLE}
        leading={<IconButton label={ar['button.back'].text} onPress={onBack}><BackIcon /></IconButton>}
      />,
    );
    const back = container.querySelector('.mds-icon-button') as HTMLElement;
    expect(back).not.toBeNull();
    expect(back.getAttribute('aria-label')).toBe(ar['button.back'].text);
    fireEvent.pointerDown(back, { pointerId: 1, clientX: 5, clientY: 5 });
    fireEvent.pointerUp(back, { pointerId: 1 });
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(PageHeaderStates).toContain('subScreenBack');
  });

  it('never renders the back control as a text link (rule 46: back is an IconButton, not a link)', () => {
    const { container } = render(
      <PageHeader
        label={TITLE}
        leading={<IconButton label={ar['button.back'].text} onPress={() => {}}><BackIcon /></IconButton>}
      />,
    );
    expect(container.querySelector('a')).toBeNull();
    // the only back control is the 48 IconButton
    expect(container.querySelector('.mds-icon-button')).not.toBeNull();
  });

  it('collapses to label-strong beside the back button when scrolled (9.1)', () => {
    const { container } = render(
      <PageHeader
        label={TITLE}
        leading={<IconButton label={ar['button.back'].text} onPress={() => {}}><BackIcon /></IconButton>}
        caption
      />,
    );
    expect(container.querySelector('.mds-page-header--collapsed')).not.toBeNull();
    const css = readFileSync(join(__dirname, 'PageHeader.css'), 'utf8');
    expect(css).toContain('var(--mds-type-label-strong-size)');
    expect(PageHeaderStates).toContain('collapsedOnScroll');
  });

  it('accepts the hide-amounts IconButton in its end slot (1.7 ت1: «مشروع اليوم»)', () => {
    const { container } = render(
      <PageHeader
        label={ar['nav.todayLong'].text}
        trailing={<IconButton label={ar['button.hideAmounts'].text}><BackIcon /></IconButton>}
      />,
    );
    const end = container.querySelector('.mds-page-header-end') as HTMLElement;
    expect(end).not.toBeNull();
    expect(end.querySelector('.mds-icon-button')).not.toBeNull();
    // the end slot centers its content on the title's line (the 48 touch
    // floor is the header's own min-height, the row never grows for it)
    const css = readFileSync(join(__dirname, 'PageHeader.css'), 'utf8');
    expect(css).toContain('min-height: var(--mds-size-touch-min)');
    expect(css).toContain('align-items: center');
    expect(PageHeaderStates).toContain('mainScreen');
  });

  it('renders the trailing slot (metric / period / creation action)', () => {
    const { container } = render(
      <PageHeader label={TITLE} trailing={<span data-testid="m">M</span>} />,
    );
    expect(container.querySelector('.mds-page-header-end')).not.toBeNull();
    expect(PageHeaderStates).toContain('withTrailing');
  });
});
