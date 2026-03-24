/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1F4E79",
        teal: "#1D9E75"
      },
      fontFamily: {
        sans: ["system-ui", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};

