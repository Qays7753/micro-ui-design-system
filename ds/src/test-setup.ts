/**
 * Test setup: React Testing Library cleanup between tests (vitest runs with
 * globals off, so RTL's auto-cleanup hook is not registered automatically).
 */
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
