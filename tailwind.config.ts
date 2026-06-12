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
        "black-dark": "#111111",
        "black-mid": "#141414",
        "black-card": "#111111",
        "black-border": "#2A2A2A",
        "black-accent": "#4B4B4B",
        "blue-deep": "#000000",
        "blue-dark": "#111111",
        "blue-mid": "#141414",
        "blue-card": "#111111",
        "blue-border": "#2A2A2A",
        "blue-accent": "#4B4B4B",
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
