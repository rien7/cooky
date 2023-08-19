/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'alabaster': '#F0EDE2',
        'primary': '#1E1E1E',
        'secondary': '#666666',
        'sliver': '#CCCCCC',
        'platinum': '#E0E0E0',
      }
    },
  },
  plugins: [],
}

