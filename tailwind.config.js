// tailwind.config.js

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#AEF353",
        secondary: "#EDF3F5",
        textPrimary: "#F4F9FB",
      },
      aspectRatio: {
        "990/296": "990 / 296",
      },
    },
  },
  plugins: [],
};
