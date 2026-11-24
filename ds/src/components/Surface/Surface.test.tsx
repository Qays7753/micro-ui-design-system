import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { Surface } from './Surface';
import { SurfaceStates } from './Surface.states';

// Labels come from the dictionary (no Arabic literals here — ds-copy).
const TITLE = ar['title.needsYou'].text;

describe('Surface (BRIEF 9.2, 23.1(5), 23.21)', () => {
  it('renders a plain container with the surface classes', () => {
    const { container } = render(<Surface>{TITLE}</Surface>);
    expect(container.querySelector('.mds-surface')).not.toBeNull();
    expect(container.querySelector('.mds-surface--list')).toBeNull();
    expect(SurfaceStates).toContain('default');
  });

  it('renders the optional header with a title-card title (9.2)', () => {
    const { container } = render(<Surface label={TITLE}>{TITLE}</Surface>);
    const title = container.querySelector('.mds-surface-title');
    expect(title?.textContent).toBe(TITLE);
    expect(title?.tagName).toBe('H3');
    expect(SurfaceStates).toContain('withHeader');
  });

  it('renders one trailing action in the header (23.21)', () => {
    const { container } = render(
      <Surface label={TITLE} trailing={<button type="button">{ar['button.all'].text}</button>}>
        {TITLE}
      </Surface>,
    );
    expect(container.querySelector('.mds-surface-action button')).not.toBeNull();
    expect(SurfaceStates).toContain('withAction');
  });

  it('switches to list density: 8 block padding, 0 inline (23.1(5))', () => {
    const { container } = render(<Surface density="list">{TITLE}</Surface>);
    expect(container.querySelector('.mds-surface--list')).not.toBeNull();
    expect(SurfaceStates).toContain('list');
  });

  it('passes data attributes through to the container (lab hooks)', () => {
    const { container } = render(<Surface data-ds-check="surface">{TITLE}</Surface>);
    expect(container.querySelector('[data-ds-check="surface"]')).not.toBeNull();
  });
});
