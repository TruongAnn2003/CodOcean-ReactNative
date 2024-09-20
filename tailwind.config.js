/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
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
      },
      fontFamily: {
        ssc: {
          thin: ["SairaSemiCondensed-Thin", "sans-serif"],
          extralight: ["SairaSemiCondensed-ExtraLight", "sans-serif"],
          light: ["SairaSemiCondensed-Light", "sans-serif"],
          regular: ["SairaSemiCondensed-Regular", "sans-serif"],
          medium: ["SairaSemiCondensed-Medium", "sans-serif"],
          semibold: ["SairaSemiCondensed-SemiBold", "sans-serif"],
          bold: ["SairaSemiCondensed-Bold", "sans-serif"],
          extrabold: ["SairaSemiCondensed-ExtraBold", "sans-serif"],
          black: ["SairaSemiCondensed-Black", "sans-serif"],
        },
      },
    },
  },
  plugins: [],
};
