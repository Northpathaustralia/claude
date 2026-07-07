import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NPAOS Vite configuration.
// The "@" alias keeps imports stable as the module tree grows.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
