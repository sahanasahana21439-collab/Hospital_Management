/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--surface-border)",
        background: "var(--bg-dark)",
        foreground: "var(--text-primary)",
        primary: "var(--primary)",
        "primary-foreground": "#ffffff",
        card: "var(--surface)",
        "card-foreground": "var(--text-primary)",
        muted: "var(--surface-hover)",
        "muted-foreground": "var(--text-secondary)",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
      },
    },
  },
  plugins: [],
};
