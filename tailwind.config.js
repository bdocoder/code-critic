import { radixThemePreset } from "radix-themes-tw";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [radixThemePreset],
};
