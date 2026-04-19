/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4f6ef7',
          600: '#3f5de6',
          700: '#334bc2',
        },
        ink: {
          500: '#667085',
          700: '#475467',
          900: '#101828',
        },
        line: '#e6e4f5',
        shell: '#f8f7ff',
        success: '#12b76a',
        danger: '#ff2e63',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
}
