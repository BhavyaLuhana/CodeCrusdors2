/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:   "#f0f0ff",
          100:  "#e4e3ff",
          200:  "#cccaff",
          300:  "#a9a5ff",
          400:  "#8a83ff",
          500:  "#6c63ff",
          600:  "#5b4ef8",
          700:  "#4c3de4",
          800:  "#3d30b8",
          900:  "#2e2389",
        },
        surface: {
          50:  "#ffffff",
          100: "#f8f8fb",
          200: "#f0f0f7",
          300: "#e4e4f0",
          400: "#c8c8de",
        },
        ink: {
          DEFAULT: "#0f0f1a",
          muted:   "#6b6b8a",
          faint:   "#a0a0bc",
        },
        accent: {
          violet: "#6c63ff",
          indigo: "#4c3de4",
          rose:   "#ff4d6d",
          teal:   "#00c9a7",
          amber:  "#ffb627",
        },
      },
      fontFamily: {
        display: ["DM Sans", "sans-serif"],
        body:    ["Outfit", "sans-serif"],
      },
      boxShadow: {
        "glow-sm":  "0 0 12px rgba(108,99,255,0.15)",
        "glow-md":  "0 0 24px rgba(108,99,255,0.2)",
        "glow-lg":  "0 0 48px rgba(108,99,255,0.25)",
        "card":     "0 1px 3px rgba(15,15,26,0.06), 0 4px 16px rgba(15,15,26,0.06)",
        "card-hover": "0 4px 8px rgba(15,15,26,0.08), 0 12px 32px rgba(15,15,26,0.1)",
        "float":    "0 8px 32px rgba(108,99,255,0.2)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-up":       "fadeUp 0.5s ease-out both",
        "fade-in":       "fadeIn 0.4s ease-out both",
        "scale-in":      "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        "slide-right":   "slideRight 0.4s ease-out both",
        "float":         "float 6s ease-in-out infinite",
        "pulse-glow":    "pulseGlow 2s ease-in-out infinite",
        "shimmer":       "shimmer 2s linear infinite",
        "bounce-soft":   "bounceSoft 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        "spin-slow":     "spin 8s linear infinite",
        "marquee":       "marquee 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.88)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideRight: {
          "0%":   { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 12px rgba(108,99,255,0.2)" },
          "50%":     { boxShadow: "0 0 32px rgba(108,99,255,0.5)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSoft: {
          "0%":   { opacity: "0", transform: "scale(0.8)" },
          "60%":  { transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};