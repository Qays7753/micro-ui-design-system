import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { ContextBar } from './ContextBar';
import { ContextBarStates } from './ContextBar.states';

const NAME = ar['title.contextBar'].text;

afterEach(cleanup);

describe('ContextBar (BRIEF 9.1, 23.16)', () => {
  it('renders the two slots with role=banner', () => {
    const { container } = render(
      <ContextBar label={NAME} leading={<span>S</span>} trailing={<span>NA</span>} />,
    );
    const bar = container.querySelector('.mds-context-bar') as HTMLElement;
    expect(bar.getAttribute('role')).toBe('banner');
    expect(container.querySelector('.mds-context-bar-start')?.textContent).toBe('S');
    expect(container.querySelector('.mds-context-bar-end')?.textContent).toBe('NA');
    expect(ContextBarStates).toContain('default');
  });

  it('the bottom hairline binds to the scrolled modifier only (23.16)', () => {
    const css = readFileSync(join(__dirname, 'ContextBar.css'), 'utf8');
    expect(css).toContain('.mds-context-bar--scrolled');
    const baseBlock = css.slice(css.indexOf('.mds-context-bar {'), css.indexOf('/* 23.16'));
    expect(baseBlock.includes('border-bottom')).toBe(false);
    expect(ContextBarStates).toContain('scrolledHairline');
  });

  it('56 height from the token, canvas background, bars layer', () => {
    const css = readFileSync(join(__dirname, 'ContextBar.css'), 'utf8');
    expect(css).toContain('min-height: var(--mds-size-context-bar)');
    expect(css).toContain('background-color: var(--mds-color-canvas)');
    expect(css).toContain('z-index: var(--mds-layer-bars)');
  });

  it('the end pair never shrinks; the start may (23.20)', () => {
    const css = readFileSync(join(__dirname, 'ContextBar.css'), 'utf8');
    expect(css).toContain('flex: 0 0 auto');
    expect(css).toContain('flex: 0 1 auto');
  });

  it('children fall into the start slot', () => {
    const { container } = render(<ContextBar label={NAME}><span>C</span></ContextBar>);
    expect(container.querySelector('.mds-context-bar-start')?.textContent).toBe('C');
  });
});
