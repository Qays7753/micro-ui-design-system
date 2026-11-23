import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

/**
 * Lab entry — a consumer of @micro/ds: it imports the package by name only
 * (plan D11, K1/K2) and renders the S3 component pages.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
