/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode: Formal Navy
        primary: "#0f172a", // Slate 900
        
        // Dark Mode: "Executive" Palette (Zinc)
        darkbg: "#09090b",   // Zinc 950 (Deep Matte Black)
        darkcard: "#18181b", // Zinc 900 (Subtle contrast)
        darkborder: "#27272a", // Zinc 800
        
        // Accents
        accent: "#10B981", // Emerald 500 (Money Green - kept for positive numbers)
      }
    },
  },
  plugins: [],
}