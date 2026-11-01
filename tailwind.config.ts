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
        black: "var(--black)",
        royal: "var(--royal)",
        "royal-hover": "var(--royal-hover)",
        paper: "var(--paper)",
        "paper-line": "var(--paper-line)",
        copper: "var(--copper)",
        "pale-blue": "var(--pale-blue)",
        redline: "var(--redline)",
        "redline-text": "var(--redline-text)",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-ibm-plex-sans)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      fontSize: {
        // Display Type Scale (Bricolage Grotesque)
        "display-3xl": ["48px", { lineHeight: "52px", letterSpacing: "normal", fontWeight: "700" }],
        "display-2xl": ["36px", { lineHeight: "40px", letterSpacing: "normal", fontWeight: "700" }],
        "display-xl": ["28px", { lineHeight: "32px", letterSpacing: "normal", fontWeight: "600" }],
        "display-lg": ["22px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-base": ["18px", { lineHeight: "22px", fontWeight: "500" }],
        // Body Type Scale (IBM Plex Sans)
        "body-lg": ["16px", { lineHeight: "24px" }],
        "body-base": ["14px", { lineHeight: "20px" }],
        "body-sm": ["12px", { lineHeight: "16px" }],
        // Technical Mono Readouts (IBM Plex Mono)
        "mono-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em" }],
        "mono-xs": ["10px", { lineHeight: "14px", letterSpacing: "0.05em" }],
        "mono-xxs": ["8px", { lineHeight: "10px", letterSpacing: "0.05em" }],
      },
      spacing: {
        "cad-1": "var(--cad-space-1)", // 4px
        "cad-2": "var(--cad-space-2)", // 8px
        "cad-3": "var(--cad-space-3)", // 12px
        "cad-4": "var(--cad-space-4)", // 16px
        "cad-6": "var(--cad-space-6)", // 24px
        "cad-8": "var(--cad-space-8)", // 32px
        "cad-12": "var(--cad-space-12)", // 48px
        "cad-16": "var(--cad-space-16)", // 64px
        "cad-24": "var(--cad-space-24)", // 96px
      },
      maxWidth: {
        prose: "75ch",
      },
      transitionTimingFunction: {
        "cad-ease": "var(--ease-cad-deliberate)",
        "cad-snap": "var(--ease-cad-snap)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        deliberate: "var(--duration-deliberate)",
      },
    },
  },
  plugins: [],
};

export default config;
