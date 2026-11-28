// The simulation mounts the @micro/ds components from their source through
// the '@micro/ds' alias (like the lab) — the consumer owns only its layout.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@micro/ds/styles.css';
import './tailwind-bridge.css';
import './sim.css';
import { App } from './App';

/*
 * PWA freshness (بلاغ المالك، جولة المستخدم 2026-11-28): the INSTALLED PWA
 * must never show a stale build. The workbox service worker is generated
 * with skipWaiting()+clientsClaim() (vite-plugin-pwa registerType:
 * 'autoUpdate'), so when a NEW service worker finishes installing it takes
 * control of this already-open page — and we reload ONCE so the owner lands
 * on the latest version the moment he opens the app, without closing or
 * deleting anything. Guard rails:
 *  - only reload when the page was ALREADY controlled (an update, not the
 *    very first install, which would reload pointlessly);
 *  - the flag survives only this page instance — after the reload the new
 *    worker is the controller, so no loop is possible.
 */
if ('serviceWorker' in navigator) {
  const hadController = navigator.serviceWorker.controller !== null;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
