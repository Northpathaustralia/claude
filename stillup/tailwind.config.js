import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(dirname, 'index.html'),
    path.join(dirname, 'src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F14',
        paper: '#F6F7F5',
        mist: '#B9C2C8',
        up: '#1AA870',
        down: '#E0453E',
        accent: '#2E5CFF',
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        pulse2: 'pulse2 2s ease-in-out infinite',
      },
      keyframes: {
        pulse2: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
    },
  },
  plugins: [],
};
