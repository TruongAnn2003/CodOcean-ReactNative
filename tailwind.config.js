// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#030BA6",
        secondary: {
          DEFAULT: "#030ABC",
          100: "#0455BF",
          200: "#1B72BF",
        },
        black: {
          DEFAULT: "#000000",
          100: "#232323",
        },
        gray: {
          100: "#5B5B5B",
          200: "#BCBDC1",
          300: "#F1F1F1",
        },
        pink: "#DC4C67",
        yellow: "#FBD601",
        green: "#00B485",
        greenblue: "#4ED7D9",
        white:"#FFFFFF"
      },
      fontFamily: {
        sscthin: ["SairaSemiCondensed-Thin", "sans-serif"],
        sscextralight: ["SairaSemiCondensed-ExtraLight", "sans-serif"],
        ssclight: ["SairaSemiCondensed-Light", "sans-serif"],
        sscregular: ["SairaSemiCondensed-Regular", "sans-serif"],
        sscmedium: ["SairaSemiCondensed-Medium", "sans-serif"],
        sscsemibold: ["SairaSemiCondensed-SemiBold", "sans-serif"],
        sscbold: ["SairaSemiCondensed-Bold", "sans-serif"],
        sscextrabold: ["SairaSemiCondensed-ExtraBold", "sans-serif"],
        sscblack: ["SairaSemiCondensed-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
