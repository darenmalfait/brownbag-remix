const path = require('path')

const fromRoot = p => path.join(__dirname, p)

module.exports = {
  mode: 'jit',
  theme: {},
  darkMode: 'class', // or 'media' or 'class'
  content: [
    // ... paths that use tailwind
    fromRoot('./app/**/*.{js,jsx,ts,tsx}'),
  ],
  plugins: [],
}
