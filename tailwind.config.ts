import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#F0B429",
        "gold-light": "#FFD166",
        "gold-dark": "#B8860B",
        "black-deep": "#000000",
        "black-dark": "#0F0F0F",
        "black-mid": "#18181B",
        "black-card": "#1F1F23",
        "black-border": "#5A5A5A",
        "black-accent": "#D1D5DB",
        "blue-deep": "#000000",
        "blue-dark": "#0F0F0F",
        "blue-mid": "#18181B",
        "blue-card": "#1F1F23",
        "blue-border": "#6B7280",
        "blue-accent": "#9CA3AF",
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        heading: ["Rajdhani", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in",
        fadeInUp: "fadeInUp 0.5s ease-out",
        shimmer: "shimmer 2s infinite",
        "live-pulse": "live-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "live-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      backgroundImage: {
        stadium:
          "radial-gradient(circle at 50% 50%, rgba(240, 180, 41, 0.1) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
