/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Slate 900 (Fintech Dark)
        secondary: "#334155", // Slate 700
        accent: "#10B981", // Emerald 500 (Success Green)
      }
    },
  },
  plugins: [],
}