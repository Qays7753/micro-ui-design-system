import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { NavTodayIcon, NavFinanceIcon } from '../../icons';
import { TabBar, TabBarTab } from './TabBar';
import { TabBarStates } from './TabBar.states';

const L1 = ar['nav.todayLong'].text;
const L2 = ar['nav.finance'].text;

afterEach(cleanup);

describe('TabBar (BRIEF 9.1, 23.16, 23.17)', () => {
  it('renders 2-5 TabBarTab children as role=tablist with role=tab buttons', () => {
    const { container } = render(
      <TabBar>
        <TabBarTab label={L1} leading={<NavTodayIcon />} onPress={() => {}} />
        <TabBarTab label={L2} leading={<NavFinanceIcon />} onPress={() => {}} />
      </TabBar>,
    );
    expect(container.querySelector('.mds-tab-bar')?.getAttribute('role')).toBe('tablist');
    expect(container.querySelectorAll('.mds-tab').length).toBe(2);
    expect(container.querySelector('.mds-tab-icon svg')).not.toBeNull();
    expect(TabBarStates).toContain('twoTabs');
  });

  it('the selected tab carries aria-current=page and aria-selected (23.17)', () => {
    const { container } = render(
      <TabBar>
        <TabBarTab label={L1} onPress={() => {}} />
        <TabBarTab label={L2} selected onPress={() => {}} />
      </TabBar>,
    );
    const tabs = container.querySelectorAll('.mds-tab');
    expect((tabs[1] as HTMLElement).getAttribute('aria-current')).toBe('page');
    expect((tabs[0] as HTMLElement).getAttribute('aria-current')).toBeNull();
    expect((tabs[1] as HTMLElement).getAttribute('aria-selected')).toBe('true');
  });

  it('value drives the default selected tab', () => {
    const { container } = render(
      <TabBar value={1}>
        <TabBarTab label={L1} onPress={() => {}} />
        <TabBarTab label={L2} onPress={() => {}} />
      </TabBar>,
    );
    expect(container.querySelectorAll('.mds-tab--active').length).toBe(1);
    expect((container.querySelectorAll('.mds-tab')[1] as HTMLElement).getAttribute('aria-current')).toBe('page');
  });

  it('the top hairline is permanent (23.16, unlike ContextBar)', () => {
    const css = readFileSync(join(__dirname, 'TabBar.css'), 'utf8');
    expect(css).toContain('border-top: var(--mds-border-hairline) solid var(--mds-color-surface-edge)');
  });

  it('the active item has NO background behind it (9.1)', () => {
    const css = readFileSync(join(__dirname, 'TabBar.css'), 'utf8');
    expect(css).toContain('.mds-tab--active {\n  color: var(--mds-color-brand-logo);\n  background-color: transparent;');
  });

  it('64 height + safe area + max item width 120 (23.20, 27.3)', () => {
    const css = readFileSync(join(__dirname, 'TabBar.css'), 'utf8');
    expect(css).toContain('min-height: var(--mds-size-tab-bar)');
    expect(css).toContain('env(safe-area-inset-bottom)');
    expect(css).toContain('max-width: var(--mds-size-tab-item-max-width)');
  });

  it('tabs are equal width (flex 1 1 0) per 23.20', () => {
    const css = readFileSync(join(__dirname, 'TabBar.css'), 'utf8');
    expect(css).toContain('flex: 1 1 0');
  });

  it('selects a tab on tap', () => {
    const onPress = vi.fn();
    const { container } = render(
      <TabBar>
        <TabBarTab label={L1} onPress={() => {}} />
        <TabBarTab label={L2} onPress={onPress} />
      </TabBar>,
    );
    const tabs = container.querySelectorAll('.mds-tab');
    fireEvent.pointerDown(tabs[1], { pointerId: 1, clientX: 5, clientY: 5 });
    fireEvent.pointerUp(tabs[1], { pointerId: 1 });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
