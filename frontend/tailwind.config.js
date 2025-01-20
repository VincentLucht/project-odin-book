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
        '.h-dvh': {
          minHeight: '100dvh',
          maxHeight: '100dvh'
        },
        '.prm-button': {
          '@apply transform rounded-full px-4 font-bold text-white':
            {},
        },
        '.prm-button-blue': {
          '@apply transform rounded-full bg-blue-500 px-4 font-bold text-white transition-all duration-200 ease-in-out hover:bg-blue-600 active:scale-95 active:bg-blue-700':
          {},
        },
        '.prm-button-white': {
          '@apply transform rounded-full bg-white px-4 text-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-100 active:scale-95 active:bg-gray-200 border border-gray-200': 
          {},
        },
        '.bg-gray': {
          backgroundColor: 'rgba(37,37,37,255)'
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}