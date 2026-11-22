/**
 * use-visual-viewport.ts — track window.visualViewport (BRIEF 27.4).
 *
 * Used by bars that must stay above the keyboard (ActionBar) and by fields
 * that must remain visible while typing. The keyboard height is a heuristic:
 * innerHeight − (viewport height + offsetTop), clamped at 0 — the standard
 * visualViewport technique (the brief mandates the behavior, not the math).
 */
import { useEffect, useState } from 'react';

export interface VisualViewportState {
  /** Layout height of the visual viewport in px. */
  readonly height: number;
  /** Top offset of the visual viewport within the layout viewport in px. */
  readonly offsetTop: number;
  /** Pinch-zoom scale. */
  readonly scale: number;
  /**
   * Estimated on-screen keyboard height in px (heuristic, see file docs).
   * 0 when the keyboard is closed or the API is unavailable.
   */
  readonly keyboardHeight: number;
}

const initialState = (): VisualViewportState => {
  if (typeof window === 'undefined' || !window.visualViewport) {
    return {
      height: typeof window === 'undefined' ? 0 : window.innerHeight,
      offsetTop: 0,
      scale: 1,
      keyboardHeight: 0,
    };
  }
  return readViewport(window.visualViewport);
};

function readViewport(viewport: VisualViewport): VisualViewportState {
  const height = viewport.height;
  const offsetTop = viewport.offsetTop;
  const keyboardHeight = Math.max(0, window.innerHeight - height - offsetTop);
  return { height, offsetTop, scale: viewport.scale, keyboardHeight };
}

/** Subscribe to the visual viewport; safe when the API is missing. */
export function useVisualViewport(): VisualViewportState {
  const [state, setState] = useState<VisualViewportState>(initialState);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return; // state stays at the window defaults

    const update = () => setState(readViewport(viewport));
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return state;
}
