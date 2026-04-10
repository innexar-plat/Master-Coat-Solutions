import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff7ff",
          100: "#dbeefe",
          200: "#bddffd",
          300: "#8bc7fc",
          400: "#52a5f7",
          500: "#2b86ee",
          600: "#156adf",
          700: "#1455c8",
          800: "#1747a1",
          900: "#183d80"
        },
        paint: {
          amber: "#f59e0b",
          teal: "#0f766e",
          slate: "#0f172a"
        }
      },
      boxShadow: {
        card: "0 20px 45px -28px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
