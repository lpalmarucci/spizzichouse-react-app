import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "spizzi",
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {}, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            background: "#121212",
            colors: {
              primary: {
                DEFAULT: "#BEF264",
                foreground: "#000000",
              },
              focus: "#BEF264",
            },
          }, // dark theme colors
        },
        // ... custom themes
      },
    }),
  ],
};
