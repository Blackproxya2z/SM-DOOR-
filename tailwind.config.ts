import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        wood: {
          50: "#FAF6F0",
          100: "#F4ECE1",
          200: "#E6D6C3",
          300: "#D3B99F",
          400: "#B89371",
          500: "#9C734D",
          600: "#7F5635",
          700: "#633F23",
          800: "#4A2E19", // Primary Wood Brown
          900: "#321E0F",
          950: "#1D1007", // Deep Timber
        },
        gold: {
          50: "#FCF9EE",
          100: "#F7F0D4",
          200: "#EFE0A8",
          300: "#E4CA75",
          400: "#D8B244",
          500: "#D4AF37", // Warm Gold / Oak
          600: "#B58E26",
          700: "#8C6A1D",
          800: "#6B4F1B",
          900: "#553F19",
        },
        timber: {
          cream: "#FAF8F5",
          ivory: "#F4EFEA",
          dark: "#140D08",
          card: "#FFFFFF",
        },
        light: {
          bg: "#FAF8F5",
          surface: "#FFFFFF",
          text: "#2B1A12",
          muted: "#7A6A5F",
          accent: "#C59B27",
          border: "#E8DED4",
          chip: "#F4ECE1",
        },
      },
      fontFamily: {
        serif: ["var(--font-tiro-bangla)", "var(--font-playfair)", "serif"],
        sans: ["var(--font-hind-siliguri)", "var(--font-inter)", "system-ui", "sans-serif"],
        "tiro-bangla": ["var(--font-tiro-bangla)", "serif"],
        "hind-siliguri": ["var(--font-hind-siliguri)", "sans-serif"],
      },
      boxShadow: {
        wood: "0 10px 30px -10px rgba(43, 26, 18, 0.08)",
        gold: "0 10px 30px -10px rgba(197, 155, 39, 0.25)",
        luxury: "0 20px 40px -15px rgba(43, 26, 18, 0.08)",
        card: "0 4px 20px -2px rgba(43, 26, 18, 0.05)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
