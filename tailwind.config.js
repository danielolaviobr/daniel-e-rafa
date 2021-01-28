module.exports = {
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        "3/4": "75%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
