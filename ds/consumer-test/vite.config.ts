// The consumer's own Vite setup — the EXACT Micro versions (D12):
// vite 7.3.7 + @vitejs/plugin-react + the Tailwind 4.3.3 vite plugin.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
