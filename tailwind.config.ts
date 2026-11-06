import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 6-Color Palette from Designer Swatch (Akansha Gupta)
        palette: {
          walkie: "#F8F6FC",    // Walkie Chalkie - Canvas & soft background
          lavender: "#E4E0EC",  // Homeopathic Lavender - Subtle border & pill background
          chalice: "#CCCAD2",   // Chrome Chalice - Subtle divider & border
          grape: "#8E8A9C",     // Gentle Grape - Secondary text, muted labels, icons
          anemone: "#8C60F3",   // Purple Anemone - Primary brand, active pill, CTAs
          velvet: "#353148",    // Deep Velvet - Dark headings, dark cards, dark buttons
        },
        dev: {
          bg: "#0B0A16",
          surface: "#100E23",
          card: "#14132B",
          cardHover: "#1B1939",
          border: "#25234A",
          borderLight: "#37346A",
          purple: "#8C60F3",     // Updated to Purple Anemone
          purpleHover: "#7A4AEB",
          indigo: "#6366F1",
          cyan: "#06B6D4",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B",
          text: "#F8FAFC",
          muted: "#8E8A9C",      // Updated to Gentle Grape
          subtle: "#64748B",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "dev-gradient": "linear-gradient(135deg, #8C60F3 0%, #6366F1 100%)",
        "dev-glow": "radial-gradient(circle at 50% 0%, rgba(140, 96, 243, 0.25) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-purple": "0 0 35px -5px rgba(140, 96, 243, 0.4)",
        "glow-card": "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(140, 96, 243, 0.15)",
        "vengeance": "0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "vengeance-hover": "0 0 0 1px rgba(140, 96, 243, 0.4), 0 8px 30px -4px rgba(140, 96, 243, 0.25)",
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "shimmer-slide": {
          "to": {
            "transform": "translate(calc(100% + var(--shimmer-width, 100%)), 0)",
          },
        },
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration, 15) * 1s) infinite linear",
        "shimmer-slide": "shimmer-slide var(--speed, 2s) ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
