/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          100: '#E8D58F',
          200: '#D68EA4',
          300: '#9A6A3A',
          400: '#7F4E2B',
          500: '#C29F7F', // коричневый 500
          600: '#4A2A13',
          700: '#3B1D0E',
          800: '#2E140A',
          900: '#1F0F05',
        },
      },
    },
  },
  plugins: [],
}

