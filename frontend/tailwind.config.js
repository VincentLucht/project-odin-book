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
        '.text-hidden-ellipsis': {
          '@apply overflow-ellipsis whitespace-nowrap overflow-hidden':
            {},
        },  
        '.prm-button': {
          '@apply transform rounded-full px-4 font-bold text-white':
            {},
        },
        '.prm-button-blue': {
          '@apply transform rounded-full bg-blue-500 px-4 font-bold text-white transition-all duration-200 ease-in-out hover:bg-blue-600 active:scale-95 active:bg-blue-700':
          {},
        },
        '.prm-button-red': {
          '@apply transform rounded-full bg-red-600 px-4 font-bold text-white transition-all duration-200 ease-in-out hover:bg-red-700 active:scale-95 active:bg-red-800':
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
        '.border-bg-gray': {
          borderColor: 'rgba(37,37,37,255)'
        },
        '.text-bg-gray': {
          color: 'rgba(37,37,37,255)'
        },
        '.text-gray-secondary': {
          color: '#B0B5BB'
        },
        // TODO: Replace it with this class for every header btn
        '.bg-hover-transition': {
          '@apply transition-all h-10 w-10 df rounded-full hover:bg-accent-gray cursor-pointer': {}
        },
        '.dropdown-btn-transition': {
          '@apply transition-all duration-200 hover:bg-hover-gray active:bg-active-gray ease-in-out': {}
        },
        // TODO: Add active color
        '.normal-bg-transition' :{
          '@apply transition-colors bg-accent-gray hover:bg-active-gray' : {}
        },
        '.bg-transition-hover' :{
          '@apply transition-colors hover:bg-accent-gray active:bg-active-gray' : {}
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
        '.create-btn': {
          '@apply relative rounded-lg p-2 font-semibold transition-colors hover:bg-accent-gray': {}
        },
        '.create-btn-before': {
          '@apply before:absolute before:top-8 before:left-1/2 before:block before:h-1 before:w-[80%] before:rounded-lg before:bg-blue-500 before:-translate-x-1/2': {}
        },
        '.create-comm-btn' : {
          '@apply h-8 rounded-full p-5 text-sm': {}
        },
        '.community-sidebar': {
          '@apply h-fit box-shadow rounded-md bg-gray-700 p-4 flex flex-col gap-2': {}
        },
        '.sidebar-heading': {
          '@apply text-xl font-semibold break-words': {}
        },
        '.sidebar-btn': {
          '@apply bg-transition-hover flex h-10 w-[215px] items-center rounded-lg px-4 py-1': {}
        },
        '.transparent-btn': {
          '@apply border border-gray-400 font-semibold transition-all duration-200 ease-in-out df prm-button hover:border-white active:scale-95 active:border-gray-200 active:bg-gray-200 active:text-bg-gray': {}
        },
        '.focus-blue': {
          '@apply focus:outline focus:outline-2 focus:outline-blue-500': {}
        },
        '.focus-red': {
          '@apply focus:outline focus:outline-2 focus:outline-red-500': {}
        },
        '.box-shadow': {
          boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.1)'
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}