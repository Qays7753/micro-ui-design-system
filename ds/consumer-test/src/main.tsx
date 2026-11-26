// The consumer mounts the components FROM the installed package (K15):
// everything comes from '@micro/ds' — nothing is copied from the repo.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@micro/ds/styles.css';
import './tailwind-bridge.css';
import { ConsumerApp } from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ConsumerApp />
  </StrictMode>,
);
