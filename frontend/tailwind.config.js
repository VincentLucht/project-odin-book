/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.df': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.h2': {
          fontSize: '2rem',
          fontWeight: 'bold',
        },

      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}