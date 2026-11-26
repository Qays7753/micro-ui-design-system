import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { SaveState } from './SaveState';
import { SaveStateStates } from './SaveState.states';

afterEach(cleanup);

describe('SaveState (BRIEF 9.4, 656, 23.17)', () => {
  it('renders the four app-owned states with text + icon (519)', () => {
    const draft = render(<SaveState saveState="draft" />);
    expect(draft.container.querySelector('.mds-save-state-text')?.textContent).toBe(
      ar['saveState.draft'].text,
    );
    expect(draft.container.querySelector('svg')).not.toBeNull();
    draft.unmount();

    const saved = render(<SaveState saveState="saved" />);
    expect(saved.container.querySelector('.mds-save-state-text')?.textContent).toBe(
      ar['saveState.saved'].text,
    );
    saved.unmount();

    const failed = render(<SaveState saveState="failed" />);
    expect(failed.container.querySelector('.mds-save-state-text')?.textContent).toBe(
      ar['saveState.failed'].text,
    );
    expect(SaveStateStates).toHaveLength(4);
  });

  it('failed announces IMMEDIATELY via role=alert (23.17)', () => {
    const { container } = render(<SaveState saveState="failed" />);
    expect((container.firstElementChild as HTMLElement).getAttribute('role')).toBe('alert');
    expect(container.textContent).toContain(ar['sr.saveFailed'].text);
  });

  it('saved announces politely, draft is silent (23.17)', () => {
    const saved = render(<SaveState saveState="saved" />);
    const root = saved.container.firstElementChild as HTMLElement;
    expect(root.getAttribute('role')).toBeNull();
    expect(saved.container.textContent).toContain(ar['sr.saveSaved'].text);
    saved.unmount();
    const draft = render(<SaveState saveState="draft" />);
    expect(draft.container.querySelector('.mds-visually-hidden')).toBeNull();
  });

  it('sending is busy with no announcement (23.17)', () => {
    const { container } = render(<SaveState saveState="sending" />);
    expect((container.firstElementChild as HTMLElement).getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('.mds-visually-hidden')).toBeNull();
  });

  it('the saved check draws with the check-draw motion (677)', () => {
    const css = readFileSync(join(__dirname, 'SaveState.css'), 'utf8');
    expect(css).toContain('var(--mds-motion-check-draw-ms)');
    expect(css).toContain('var(--mds-motion-check-draw-ease)');
    expect(css).toContain('stroke-dashoffset');
    expect(css).toContain('prefers-reduced-motion');
  });

  it('fits its content and never breaks (1347)', () => {
    const css = readFileSync(join(__dirname, 'SaveState.css'), 'utf8');
    expect(css).toContain('display: inline-flex');
    // 140b441 (S12/2, font-200% rejection 2) removed the nowrap lock: the
    // plain sentence reflows under the text-scale rule («كل مكوّن يعمل حتى
    // 200% بلا قص»). The stale toContain assertion here was left behind by
    // that commit — flipped to the protected absence.
    expect(css).not.toContain('white-space: nowrap');
  });
});
