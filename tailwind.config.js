/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#262321',
        canvas: '#F5F1EA',
        surface: '#FFFFFF',
        pine: {
          50: '#E7EFEC',
          100: '#C9DBD3',
          400: '#3D766A',
          600: '#1F4D45',
          700: '#163A34',
        },
        ochre: {
          400: '#C9A055',
          500: '#B8863B',
          600: '#9A6E2E',
        },
        danger: '#B0432E',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
