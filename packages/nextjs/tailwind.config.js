/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2270A3",
          "primary-content": "#03385A",
          secondary: "#649A81",
          "secondary-content": "#03385A",
          accent: "#2270A3",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#FFFDE6",
          "base-200": "#C5DAD1",
          "base-300": "#649A81",
          "base-content": "#03385A",
          info: "#408163",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#064974",
          "primary-content": "#F9FBFF",
          secondary: "#2270A3",
          "secondary-content": "#F9FBFF",
          accent: "#4385AF",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#2270A3",
          "base-100": "#2270A3",
          "base-200": "#064974",
          "base-300": "#03385A",
          "base-content": "#F9FBFF",
          info: "#2270A3",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      fontFamily: {
        "bai-jamjuree": ["Bai Jamjuree", "sans-serif"],
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
