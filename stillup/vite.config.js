import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// StillUp prototype — separate Vite root so the existing NPAOS app at the
// repo root (and the TIDESTATE store) are untouched. Shares the repo's
// node_modules. Relative base so the build works on GitHub Pages or any
// subpath (HashRouter).
export default defineConfig({
  root: dirname,
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@stillup': path.join(dirname, 'src') },
  },
  build: {
    outDir: path.join(dirname, 'dist'),
    emptyOutDir: true,
  },
});
