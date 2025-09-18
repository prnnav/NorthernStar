import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(235 15% 25%)",
        input: "hsl(235 15% 20%)",
        ring: "hsl(45 100% 65%)",
        background: "hsl(235 25% 7%)",
        foreground: "hsl(48 100% 96%)",
        primary: {
          DEFAULT: "hsl(45 100% 65%)",
          foreground: "hsl(235 25% 7%)",
        },
        secondary: {
          DEFAULT: "hsl(280 45% 35%)",
          foreground: "hsl(48 100% 96%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
        },
        muted: {
          DEFAULT: "hsl(235 15% 18%)",
          foreground: "hsl(220 15% 65%)",
        },
        accent: {
          DEFAULT: "hsl(220 70% 50%)",
          foreground: "hsl(48 100% 96%)",
        },
        popover: {
          DEFAULT: "hsl(235 20% 12%)",
          foreground: "hsl(48 100% 96%)",
        },
        card: {
          DEFAULT: "hsl(235 20% 12%)",
          foreground: "hsl(48 100% 96%)",
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, hsl(45 100% 65%), hsl(45 100% 75%))",
        "gradient-magical":
          "linear-gradient(135deg, hsl(45 85% 65%), hsl(45 95% 75%), hsl(30 80% 60%))",
        "gradient-space":
          "linear-gradient(135deg, hsl(280 45% 35%), hsl(220 70% 50%))",
      },
      boxShadow: {
        magical: "0 10px 30px -5px hsl(45 85% 65% / 0.3)",
        "accent-glow": "0 0 40px hsl(45 100% 75% / 0.4)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        sparkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(45 100% 65% / 0.2)",
          },
          "50%": {
            boxShadow: "0 0 20px hsl(45 100% 65% / 0.4)",
          },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        sparkle: "sparkle 2s infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
