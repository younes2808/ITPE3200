/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      screens: {
        '1650px': '1650px',
        '1350px': '1350px',
        '1250px': '1250px',
        '1150px': '1150px',
        '970px': '970px',
        '870px': '870px',
        '700px': '700px', 
        '580px': '580px',
        '510px': '510px', 
        '500px': '500px', 
        '400px': '400px',
        '355px': '355px',
        '300px': '300px',
        '200px': '200px',
        '100px': '100px', // Custom breakpoints
      },
      fontFamily: {
        clash: ['ClashGrotesk', 'sans-serif'], // Add your custom font here
        general: ['General', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
