/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        openSans: ['"Open Sans"', 'sans-serif'],
      },
      colors: {
        blue: {
          DEFAULT: '#add8e6',
        },
        gray: {
          DEFAULT: '#d3d3d3',
        },
      },
      screens: {
        xxs: '30rem',
        xs: '36rem',
      },
    },
  },
  plugins: [],
};
