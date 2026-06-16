/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm-neutral surface scale driven by CSS vars so it flips per theme
        // (see :root / html.light in index.css). Alpha modifiers still work.
        coffee: {
          50: 'rgb(var(--c-50) / <alpha-value>)',
          100: 'rgb(var(--c-100) / <alpha-value>)',
          200: 'rgb(var(--c-200) / <alpha-value>)',
          300: 'rgb(var(--c-300) / <alpha-value>)',
          400: 'rgb(var(--c-400) / <alpha-value>)',
          500: 'rgb(var(--c-500) / <alpha-value>)',
          600: 'rgb(var(--c-600) / <alpha-value>)',
          700: 'rgb(var(--c-700) / <alpha-value>)',
          800: 'rgb(var(--c-800) / <alpha-value>)',
          900: 'rgb(var(--c-900) / <alpha-value>)',
          950: 'rgb(var(--c-950) / <alpha-value>)',
        },
        // Brand accents (from supplied palette + logo) — constant across themes.
        brand: {
          red: '#E84B3D',
          deep: '#D00600',
          teal: '#069494',
          tealLight: '#0bb3b3',
        },
        crema: 'rgb(var(--crema) / <alpha-value>)', // headings/highlights
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
