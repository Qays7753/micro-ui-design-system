import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { ProjectSwitcher } from './ProjectSwitcher';
import { ProjectSwitcherStates } from './ProjectSwitcher.states';

// Lab data words (BRIEF 25) would trip ds-copy's hardcoded-Arabic scan
// in tests; the switcher itself takes any string — non-Arabic ids here.
const NAME = 'P1';
const ROLE = ar['role.owner'].text;

afterEach(cleanup);

describe('ProjectSwitcher (BRIEF 9.1, 23.20)', () => {
  it('renders mark + name + role + caret', () => {
    const { container } = render(
      <ProjectSwitcher label={NAME} caption={ROLE} onPress={() => {}} />,
    );
    expect(container.querySelector('.mds-entity-mark')).not.toBeNull();
    expect(container.querySelector('.mds-project-switcher-name')?.textContent).toBe(NAME);
    expect(container.querySelector('.mds-project-switcher-role')?.textContent).toBe(ROLE);
    expect(container.querySelector('.mds-project-switcher-caret')).not.toBeNull();
    expect(ProjectSwitcherStates).toContain('withCaret');
  });

  it('hides the caret for a single project and role (9.1)', () => {
    const { container } = render(
      <ProjectSwitcher label={NAME} caption={ROLE} locked onPress={() => {}} />,
    );
    expect(container.querySelector('.mds-project-switcher-caret')).toBeNull();
    expect(ProjectSwitcherStates).toContain('singleRoleNoCaret');
  });

  it('the name ellipsizes and never pushes (23.20)', () => {
    const css = readFileSync(join(__dirname, 'ProjectSwitcher.css'), 'utf8');
    expect(css).toContain('text-overflow: ellipsis');
    expect(css).toContain('min-width: 0');
    expect(css).toContain('min-width: var(--mds-size-switcher-min-width)');
  });

  it('the touch target is 48 high (ds-small-screen floor)', () => {
    const css = readFileSync(join(__dirname, 'ProjectSwitcher.css'), 'utf8');
    expect(css).toContain('min-height: var(--mds-size-touch-min)');
  });

  it('fires onPress on tap', () => {
    const onPress = vi.fn();
    const { container } = render(<ProjectSwitcher label={NAME} onPress={onPress} />);
    const btn = container.querySelector('.mds-project-switcher') as HTMLElement;
    fireEvent.pointerDown(btn, { pointerId: 1, clientX: 5, clientY: 5 });
    fireEvent.pointerUp(btn, { pointerId: 1 });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
