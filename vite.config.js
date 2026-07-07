import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NPAOS Vite configuration.
// The "@" alias keeps imports stable as the module tree grows.
export default defineConfig({
  // Relative base so the built app works at any URL path (e.g. GitHub Pages
  // project sites like /claude/). Safe with HashRouter.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
