/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-text': '#181511',
        'secondary-text': '#887c63',
        'background': '#f4f3f0',
        'white': '#ffffff',
      },
      fontFamily: {
        'work-sans': ['"Work Sans"', 'sans-serif'],
        'playfair': ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};