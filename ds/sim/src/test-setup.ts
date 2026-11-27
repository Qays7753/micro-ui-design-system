/**
 * Test setup: React Testing Library cleanup between tests (vitest runs with
 * globals off, so RTL's auto-cleanup hook is not registered automatically),
 * and the jsdom matchMedia polyfill (the splash reads prefers-reduced-motion).
 */
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
