/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT:"#6aa3ff", soft:"#1b2652", bg:"#0b1020", card:"#121936", line:"#2a366b" }
      }
    }
  },
  plugins: [],
}
