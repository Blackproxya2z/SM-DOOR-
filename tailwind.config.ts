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
          card: "#1C140E",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        wood: "0 10px 30px -10px rgba(74, 46, 25, 0.2)",
        gold: "0 10px 30px -10px rgba(212, 175, 55, 0.25)",
        luxury: "0 20px 40px -15px rgba(29, 16, 7, 0.35)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
