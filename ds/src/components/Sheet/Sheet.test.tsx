import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { Sheet } from './Sheet';
import { SheetStates } from './Sheet.states';

const TITLE = ar['sheet.sampleTitle'].text;

afterEach(cleanup);

describe('Sheet (BRIEF 23.11, 23.15)', () => {
  it('renders mounted with handle, title and close button (mount to open)', () => {
    const { container } = render(
      <Sheet label={TITLE} onDismiss={() => {}}>
        <p>body</p>
      </Sheet>,
    );
    expect(container.querySelector('.mds-sheet-handle')).not.toBeNull();
    expect(container.querySelector('.mds-sheet-title')?.textContent).toBe(TITLE);
    expect(container.querySelector('.mds-sheet-close .mds-icon-button')).not.toBeNull();
    expect(container.querySelector('.mds-sheet-body')?.textContent).toBe('body');
    expect(SheetStates).toContain('open');
  });

  it('carries the layer of its level (23.15)', () => {
    const { container } = render(<Sheet label={TITLE} onDismiss={() => {}} />);
    expect((container.querySelector('.mds-sheet') as HTMLElement).style.zIndex).toBe('');
    const css = readFileSync(join(__dirname, 'Sheet.css'), 'utf8');
    expect(css).toContain('z-index: var(--mds-layer-sheet)');
    expect(css).toContain('z-index: var(--mds-layer-sheet-2)');
  });

  it('takes the second level when another sheet is live (23.15)', async () => {
    render(<Sheet label={TITLE} onDismiss={() => {}} />);
    const { container } = render(<Sheet label={TITLE} onDismiss={() => {}} />);
    await waitFor(() => {
      expect(container.querySelector('[data-ds-sheet-level="2"]')).not.toBeNull();
    });
    expect(SheetStates).toContain('stacked');
  });

  it('closes from the scrim, the close button and Escape (each path plays the exit, addendum item 30)', async () => {
    for (const path of ['scrim', 'button', 'escape'] as const) {
      const onDismiss = vi.fn();
      const { container, unmount } = render(<Sheet label={TITLE} onDismiss={onDismiss} />);
      if (path === 'scrim') {
        fireEvent.click(container.querySelector('.mds-sheet-scrim') as HTMLElement);
      } else if (path === 'button') {
        const closeBtn = container.querySelector('.mds-icon-button') as HTMLElement;
        fireEvent.pointerDown(closeBtn);
        fireEvent.pointerUp(closeBtn);
      } else {
        fireEvent.keyDown(window, { key: 'Escape' });
      }
      await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
      unmount();
    }
  });

  it('a second dismiss request while closing is a no-op (the exit runs once)', async () => {
    const onDismiss = vi.fn();
    const { container } = render(<Sheet label={TITLE} onDismiss={onDismiss} />);
    fireEvent.click(container.querySelector('.mds-sheet-scrim') as HTMLElement);
    fireEvent.click(container.querySelector('.mds-sheet-scrim') as HTMLElement);
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('follows the finger 1:1 downward only during the drag', () => {
    const { container } = render(
      <Sheet label={TITLE} onDismiss={() => {}}>
        <p>body</p>
      </Sheet>,
    );
    const grab = container.querySelector('.mds-sheet-grab') as HTMLElement;
    const panel = container.querySelector('.mds-sheet-panel') as HTMLElement;
    fireEvent.pointerDown(grab, { clientY: 300, pointerId: 1 });
    fireEvent.pointerMove(grab, { clientY: 380, pointerId: 1 });
    expect(panel.style.transform).toBe(`translateY(${380 - 300}px)`);
    // upward drag is clamped to 0 (a sheet never moves up)
    fireEvent.pointerMove(grab, { clientY: 200, pointerId: 1 });
    expect(panel.style.transform).toBe('');
    expect(SheetStates).toContain('dragging');
  });

  it('dismisses past 30% of the panel height and returns otherwise (23.11)', async () => {
    // A 300px-tall panel: 30% = 90px. Drag 200px -> dismiss.
    const onDismiss = vi.fn();
    const first = render(<Sheet label={TITLE} onDismiss={onDismiss} />);
    const panel = first.container.querySelector('.mds-sheet-panel') as HTMLElement;
    panel.getBoundingClientRect = () =>
      ({ height: 300, width: 360, top: 480, left: 0, right: 360, bottom: 780, x: 0, y: 480, toJSON: () => {} }) as DOMRect;
    const grab = first.container.querySelector('.mds-sheet-grab') as HTMLElement;
    fireEvent.pointerDown(grab, { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(grab, { clientY: 300, pointerId: 1 });
    fireEvent.pointerUp(grab, { pointerId: 1 });
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    expect(SheetStates).toContain('pastThreshold');

    // A short drag (below threshold, slow) returns instead. Space the
    // synthetic events across real time so the measured velocity is
    // honest (same-tick fireEvent gives dt=0-1ms and a huge px/ms that
    // would dismiss anything).
    cleanup();
    const onDismiss2 = vi.fn();
    const second = render(<Sheet label={TITLE} onDismiss={onDismiss2} />);
    const panel2 = second.container.querySelector('.mds-sheet-panel') as HTMLElement;
    panel2.getBoundingClientRect = () =>
      ({ height: 300, width: 360, top: 480, left: 0, right: 360, bottom: 780, x: 0, y: 480, toJSON: () => {} }) as DOMRect;
    const nowSpy = vi
      .spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(2000);
    const grab2 = second.container.querySelector('.mds-sheet-grab') as HTMLElement;
    fireEvent.pointerDown(grab2, { clientY: 100, pointerId: 2 });
    fireEvent.pointerMove(grab2, { clientY: 130, pointerId: 2 });
    fireEvent.pointerUp(grab2, { pointerId: 2 });
    nowSpy.mockRestore();
    await waitFor(() => {
      expect((second.container.querySelector('.mds-sheet-panel') as HTMLElement).style.transform).toBe('');
    });
    expect(onDismiss2).not.toHaveBeenCalled();
  });

  it('contains the scroll inside the body (23.11)', () => {
    const css = readFileSync(join(__dirname, 'Sheet.css'), 'utf8');
    expect(css).toContain('overscroll-behavior: contain');
  });

  it('plays the exit motion then dismisses, and a touch cancels the close (addendum item 30, 23.11)', async () => {
    const onDismiss = vi.fn();
    const { container } = render(<Sheet label={TITLE} onDismiss={onDismiss} />);
    const panel = container.querySelector('.mds-sheet-panel') as HTMLElement;
    const real = getComputedStyle(panel);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ ...real, transitionDuration: '0.2s' } as CSSStyleDeclaration);
    fireEvent.click(container.querySelector('.mds-sheet-scrim') as HTMLElement);
    // the closing class is on, the target transform is written, the
    // dismiss has NOT fired yet — the exit is playing
    expect(container.querySelector('.mds-sheet--closing')).not.toBeNull();
    await waitFor(() => expect(panel.style.transform).toBe('translateY(100%)'));
    expect(onDismiss).not.toHaveBeenCalled();
    // the transition ends -> THEN onDismiss
    panel.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'transform' }));
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    vi.mocked(window.getComputedStyle).mockRestore();

    // a new touch on the grab zone cancels the close where the panel is
    const onDismiss2 = vi.fn();
    const second = render(<Sheet label={TITLE} onDismiss={onDismiss2} />);
    const panel2 = second.container.querySelector('.mds-sheet-panel') as HTMLElement;
    const real2 = getComputedStyle(panel2);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ ...real2, transitionDuration: '0.2s' } as CSSStyleDeclaration);
    fireEvent.click(second.container.querySelector('.mds-sheet-scrim') as HTMLElement);
    const grab2 = second.container.querySelector('.mds-sheet-grab') as HTMLElement;
    fireEvent.pointerDown(grab2, { clientY: 400, pointerId: 9 });
    expect(second.container.querySelector('.mds-sheet--closing')).toBeNull();
    expect(onDismiss2).not.toHaveBeenCalled();
    vi.mocked(window.getComputedStyle).mockRestore();
  });

  it('uses no brand-signal-text (owner terracotta decision)', () => {
    const css = readFileSync(join(__dirname, 'Sheet.css'), 'utf8');
    expect(css).not.toContain('brand-signal-text');
  });
});
