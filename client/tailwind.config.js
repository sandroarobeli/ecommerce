module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        oswald: ["var(--font-oswald)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      // animation class
      animation: {
        fade: "slideshow 1.5s ease-out",
      },
      // actual animation
      keyframes: () => ({
        slideshow: {
          "0%": { opacity: 0.4 },
          "100%": { opacity: 1 },
        },
      }),
    },
  },
  plugins: [],
};
