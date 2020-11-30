const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const forms = require("@tailwindcss/forms");

module.exports = {
  future: {},
  purge: ["./public/**/*.html", "./src/**/*.vue", "./src/*.vue"],
  theme: {
    extends: {
      colors: {
        "light-blue": colors.lightBlue,
        cyan: colors.cyan
      }
    }
  },
  variants: {},
  plugins: [defaultTheme, colors, forms]
};
