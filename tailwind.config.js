/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        DeepPurple: {
          50: "#ede7f6",
          100: "#d1c4e9",
          200: "#b39ddb",
          300: "#9575cd",
          400: "#7e57c2",
          500: "#673ab7",
          600: "#5e35b1",
          700: "#512da8",
          800: "#4527a0",
          900: "#311b92",
        },
      },
    },
  },
  plugins: [],
});

// module.exports = {
//     content: ["./src/**/*.{html,js}"],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   }
