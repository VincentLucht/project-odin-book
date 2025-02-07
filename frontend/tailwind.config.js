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
        '.bg-accent-gray': {
          backgroundColor: '#3F4246'
        },
        '.bg-hover-gray': {
          backgroundColor: '#4A4D51'
        },
        '.bg-hover-gray-secondary': {
          backgroundColor: '#4A4D5140'
        },
        '.bg-active-gray': {
          backgroundColor: '#545759'
        },
        '.text-bg-gray': {
          color: 'rgba(37,37,37,255)'
        },
        '.text-gray-secondary': {
          color: '#B0B5BB'
        },
        '.bg-hover-transition': {
          '@apply transition-all': {}
        },
        '.dropdown-btn-transition': {
          '@apply transition-all duration-200 hover:bg-hover-gray active:bg-active-gray ease-in-out': {}
        },
        '.center-main': {
          '@apply w-full flex justify-center': {}
        },
        '.center-main-content': {
          '@apply grid w-full max-w-[1072px] grid-cols-[1fr_300px] gap-4': {}
        },
        '.interaction-button-wrapper': {
          '@apply flex h-8 items-center gap-1 rounded-full bg-accent-gray': {}
        },
        '.interaction-button-wrapper-secondary': {
          '@apply flex h-8 items-center gap-1 rounded-full': {}
        },
        '.interaction-button-arrow': {
          '@apply h-8 w-8 rounded-full df hover:bg-hover-gray active:bg-active-gray transition-all': {}
        },
        '.interaction-button-arrow-secondary': {
          '@apply h-8 w-8 rounded-full df hover:bg-hover-gray active:bg-active-gray transition-all': {}
        },
        '.hover-upvote': {
          '@apply hover:bg-orange-600 active:bg-orange-700': {}
        },
        '.hover-upvote-comment': {
          '@apply hover:bg-orange-600 active:bg-orange-700': {}
        },
        '.hover-downvote': {
          '@apply hover:bg-purple-600 active:bg-purple-700': {}
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}