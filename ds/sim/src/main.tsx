// The simulation mounts the @micro/ds components from their source through
// the '@micro/ds' alias (like the lab) — the consumer owns only its layout.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@micro/ds/styles.css';
import './tailwind-bridge.css';
import './sim.css';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
