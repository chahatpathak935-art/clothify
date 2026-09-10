/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: "#1B1815",
        paper: "#FFFFFF",
        stone: "#EFEAE1",
        olive: {
          DEFAULT: "#5B6B4F",
          dark: "#465039",
        },
        rust: "#A34A3D",
        mute: "#8A8377",
        line: "#E4DFD4",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};
