/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      screens: {
        '970px': '970px',
        '870px': '870px',
        '500px': '500px', // Egendefinert breakpoint for 970px
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
