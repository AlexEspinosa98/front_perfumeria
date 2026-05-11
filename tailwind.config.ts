import type { Config } from "tailwindcss";

function rgb(variable: string): string {
  return (({ opacityValue }: { opacityValue?: string }) =>
    opacityValue !== undefined
      ? `rgba(var(${variable}), ${opacityValue})`
      : `rgb(var(${variable}))`) as unknown as string;
}

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
        background:                rgb("--c-bg"),
        surface:                   rgb("--c-surface"),
        "surface-dim":             rgb("--c-surface-dim"),
        "surface-bright":          rgb("--c-surface-bright"),
        "surface-container-low":   rgb("--c-surface-low"),
        "surface-container":       rgb("--c-surface-cnt"),
        "surface-container-high":  rgb("--c-surface-high"),
        "surface-container-highest": rgb("--c-surface-highest"),
        "surface-container-lowest": rgb("--c-surface-lowest"),
        "on-surface":              rgb("--c-on-surface"),
        "on-surface-variant":      rgb("--c-on-surface-var"),
        primary:                   rgb("--c-primary"),
        "primary-fixed-dim":       rgb("--c-primary-dim"),
        "primary-container":       rgb("--c-primary-cnt"),
        "on-primary":              rgb("--c-on-primary"),
        "outline-variant":         rgb("--c-outline-var"),
        outline:                   rgb("--c-outline"),
        "surface-variant":         rgb("--c-surface-var"),
        secondary:                 rgb("--c-secondary"),
        "on-secondary":            rgb("--c-on-secondary"),
        error:                     rgb("--c-error"),
        "error-container":         rgb("--c-error-cnt"),
        "on-error":                rgb("--c-on-error"),
        /* Static — no cambian entre temas */
        "inverse-primary":         "#775a19",
        "on-primary-fixed":        "#261900",
        "surface-tint":            "#e9c176",
        "tertiary":                "#c8c6c5",
        "on-tertiary":             "#313030",
        "inverse-surface":         "#e3e2e2",
        "inverse-on-surface":      "#2f3031",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile":  "20px",
        "stack-lg":       "32px",
        "stack-sm":       "8px",
        "container-max":  "1440px",
        "margin-desktop": "80px",
        "section-gap":    "160px",
        "stack-md":       "16px",
        gutter:           "24px",
      },
      fontFamily: {
        serif:        ["var(--font-bodoni)", "Georgia", "serif"],
        sans:         ["var(--font-hanken)", "system-ui", "sans-serif"],
        "headline-sm":["var(--font-bodoni)", "Georgia", "serif"],
        "body-lg":    ["var(--font-hanken)", "system-ui", "sans-serif"],
        "headline-lg":["var(--font-bodoni)", "Georgia", "serif"],
        "headline-md":["var(--font-bodoni)", "Georgia", "serif"],
        "headline-xl":["var(--font-bodoni)", "Georgia", "serif"],
        "label-sm":   ["var(--font-hanken)", "system-ui", "sans-serif"],
        "body-md":    ["var(--font-hanken)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "headline-sm": ["24px", { lineHeight: "1.4", fontWeight: "500" }],
        "body-lg":     ["18px", { lineHeight: "1.6", letterSpacing: "0.01em", fontWeight: "400" }],
        "headline-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "400" }],
        "headline-xl-mobile": ["40px", { lineHeight: "1.1", fontWeight: "400" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
        "label-sm":    ["12px", { lineHeight: "1.0", letterSpacing: "0.15em", fontWeight: "600" }],
        "body-md":     ["16px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      maxWidth: {
        "container-max": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
