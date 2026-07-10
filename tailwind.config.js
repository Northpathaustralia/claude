/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // NorthPath workspace palette (legacy pages) — swap to rebrand.
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdbff',
          300: '#8ec4ff',
          400: '#59a3ff',
          500: '#3380fc',
          600: '#1d60f1',
          700: '#154bde',
          800: '#183eb4',
          900: '#19398d',
          950: '#142456',
        },
        // ATLAS ONE palette: deep navy, graphite, soft white, emerald accents.
        navy: {
          950: '#060d1a',
          900: '#0a1424',
          850: '#0d1a2f',
          800: '#122340',
          700: '#1b3157',
          600: '#27446f',
          500: '#365a8c',
          400: '#5b7fae',
          300: '#8aa6c9',
          200: '#bdcde2',
          100: '#e2eaf4',
          50: '#f4f7fb',
        },
      },
    },
  },
  plugins: [],
};
