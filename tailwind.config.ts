import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./emails/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Tyrrhenian blue — primary brand scale (600 = #1F4E9E)
        brand: {
          50: "#F3F7FC",
          100: "#E3ECF8",
          200: "#C4D6F0",
          300: "#95B5E3",
          400: "#5E8BD0",
          500: "#3A6DBE",
          600: "#1F4E9E",
          700: "#193F82",
          800: "#14336A",
          900: "#0F2753",
          950: "#0A1A38",
        },
        // Sicilian lemon — sparing accent for sale tags & ratings
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C4",
          200: "#FDE68A",
          300: "#FBD85A",
          400: "#F7CB3E",
          500: "#F4C430",
          600: "#D9A614",
          700: "#B08110",
          800: "#8A6512",
          900: "#6F5214",
          950: "#402E06",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "0" }],
        "display-md": ["2.75rem", { lineHeight: "1.1", letterSpacing: "0" }],
        "display-lg": ["3.5rem", { lineHeight: "1.06", letterSpacing: "-0.005em" }],
        "display-xl": ["4.25rem", { lineHeight: "1.04", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        section: "clamp(4rem, 8vw, 7.5rem)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "calc(var(--radius) + 6px)",
        "3xl": "calc(var(--radius) + 14px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(15 42 20 / 0.05)",
        sm: "0 1px 3px 0 rgb(15 42 20 / 0.07), 0 1px 2px -1px rgb(15 42 20 / 0.07)",
        DEFAULT: "0 2px 8px -1px rgb(15 42 20 / 0.08), 0 1px 3px -1px rgb(15 42 20 / 0.06)",
        md: "0 6px 16px -3px rgb(15 42 20 / 0.1), 0 3px 6px -3px rgb(15 42 20 / 0.07)",
        lg: "0 12px 28px -6px rgb(15 42 20 / 0.12), 0 6px 12px -6px rgb(15 42 20 / 0.08)",
        xl: "0 24px 48px -12px rgb(15 42 20 / 0.18)",
        glow: "0 0 0 1px hsl(var(--primary) / 0.12), 0 8px 24px -4px hsl(var(--primary) / 0.25)",
        "gold-glow": "0 8px 24px -6px rgb(244 196 48 / 0.45)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--marquee-gap, 3rem)))" },
        },
        "leaf-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 1.5s infinite",
        marquee: "marquee 32s linear infinite",
        "leaf-float": "leaf-float 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-links": "hsl(var(--primary))",
            maxWidth: "72ch",
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, typography, forms({ strategy: "class" })],
} satisfies Config;

export default config;
