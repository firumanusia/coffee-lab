/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#faf6f1',
          100: '#f1e7da',
          200: '#e2cdb3',
          300: '#cfac84',
          400: '#bd8a5b',
          500: '#a96f40',
          600: '#915834',
          700: '#74442d',
          800: '#5f3a2a',
          900: '#4f3125',
          950: '#2c1810',
        },
        crema: '#e7c9a0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
