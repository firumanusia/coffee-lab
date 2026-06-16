/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Repurposed as the MENOOWEL warm-neutral DARK surface scale.
        coffee: {
          50: '#f6f5f4',
          100: '#e7e4e2',
          200: '#cbc7c4',
          300: '#9d9794',
          400: '#6f6a67',
          500: '#534f4d',
          600: '#3d3a39',
          700: '#2f2c2b',
          800: '#272423',
          900: '#1c1a19',
          950: '#141312',
        },
        // Brand accents (from supplied palette + logo).
        brand: {
          red: '#E84B3D',
          deep: '#D00600',
          teal: '#069494',
          tealLight: '#0bb3b3',
        },
        crema: '#f3efec', // warm near-white for headings/highlights
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
