import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Standalone build: bundles StillUp into ONE self-contained HTML file that
// runs by double-clicking it — no server, no install, nothing. Output:
// release/StillUp.html (see "stillup:build:standalone" script). Data still
// persists via the browser's localStorage, exactly like the served version.
export default defineConfig({
  root: dirname,
  base: './',
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: { '@stillup': path.join(dirname, 'src') },
  },
  build: {
    outDir: path.join(dirname, '..', 'release', 'stillup'),
    emptyOutDir: true,
  },
});
