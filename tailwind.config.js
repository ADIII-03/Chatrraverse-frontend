/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui],
      daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
     mytheme: {
      "primary": "#3b82f6",     // Blue-500
          "secondary": "#60a5fa",   // Blue-400
          "accent": "#93c5fd",      // Blue-300
          "neutral": "#1e3a8a",     // Dark Blue
          "base-100": "#f0f9ff",    // Light Blue Background
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#facc15",
          "error": "#ef4444",
    },
  },
  
}