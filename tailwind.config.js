/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Euclid Square", ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
