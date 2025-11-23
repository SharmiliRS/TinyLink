/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",  // <-- Add this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
