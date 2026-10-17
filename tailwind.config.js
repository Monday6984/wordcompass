/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
      colors: {
        border: "hsl(var(--border))",
        cream: "#faf7f2",
        warm: "#fff9f4",
        charcoal: "#1c1c1e",
        mid: "#52525b",
        gold: "#d4a843",
        coral: "#e8614a",
        teal: { DEFAULT: "#1a9482", dark: "#0f6457", light: "#2ab89e" },
        purple: "#8b5cf6",
        sky: "#0ea5e9",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
