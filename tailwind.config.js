/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 5%)",
        foreground: "hsl(0 0% 98%)",
        primary: {
          DEFAULT: "#ff5722", // That Epstien Orange
          foreground: "hsl(0 0% 100%)",
        },
        card: "hsl(0 0% 8%)",
        border: "hsl(0 0% 15%)",
      },
    },
  },
  plugins: [],
};
