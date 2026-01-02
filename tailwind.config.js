/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f2',
          100: '#dbf1e0',
          200: '#b9e3c3',
          300: '#8acf9d',
          400: '#55b672',
          500: '#359e55',
          600: '#027333',
          700: '#0c5d2b',
          800: '#0e4a27',
          900: '#0d3d23',
          DEFAULT: '#027333',
        }
      },
      fontFamily: {
        sans: ['Nunito Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}