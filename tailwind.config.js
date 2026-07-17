/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c2d3ff",
          300: "#93b0fe",
          400: "#6089fc",
          500: "#3b63f7",
          600: "#2445e8",
          700: "#1c34d5",
          800: "#1d2eac",
          900: "#1e2d88",
          950: "#161e55",
        },
      },
    },
  },
  plugins: [],
};
