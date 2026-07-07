import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Standalone build: bundles the entire app (JS + CSS) into ONE self-contained
// HTML file that runs by double-clicking it — no server, no install, nothing.
// Output: release/NorthPath-AI-OS.html (see "build:standalone" script).
// Data still persists via the browser's localStorage, exactly like the
// served version.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'release',
    emptyOutDir: true,
  },
});
