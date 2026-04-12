import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#232834",
        background: "#090d14",
        panel: "#101624",
        muted: "#8b93a7",
        accent: "#7cc8ff",
        success: "#8ce99a",
        warning: "#ffd479",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
