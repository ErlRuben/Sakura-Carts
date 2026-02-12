/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff0f5',
          100: '#ffe3ed',
          200: '#FFC5D3',
          300: '#f5a3b8',
          400: '#EB77B2',
          500: '#d9609e',
          600: '#c04d88',
          700: '#a23d6f',
          800: '#86335c',
          900: '#6e2b4d',
        },
        dark: {
          DEFAULT: '#505050',
        },
        washi: {
          50: '#fdfcfb',
          100: '#f5f0eb',
          200: '#ede4db',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
