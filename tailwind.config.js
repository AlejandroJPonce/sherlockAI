
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        audit: {
          primary: "#1a2540",
          muted: "#94a3b8",
          subtle: "#64748b",
          border: "#e2e8f0",
          surface: "#f8fafc",
          success: "#0f6e56",
          "success-light": "#e1f5ee",
          info: "#1e4f8c",
          "info-light": "#eff6ff",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  }
}

