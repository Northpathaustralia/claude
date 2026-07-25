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
        ink: '#090909',
        bone: '#F1EEE6',
        concrete: '#BFC0BA',
        cobalt: '#1747FF',
        signal: '#FF4A1F',
      },
      fontFamily: {
        display: ['"Archivo"', 'Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      animation: {
        ticker: 'ticker 28s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
