/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html, js}',
    './js/*.{html, js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'kalnia': 'Kalnia'
      }
    },
  },
  plugins: [],
}

