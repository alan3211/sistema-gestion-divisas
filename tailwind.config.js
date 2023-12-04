/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/shared/header/HeaderComponent.jsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}