import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: null,
            code: {
              backgroundColor: 'rgb(var(--tw-prose-pre-bg))',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            pre: {
              backgroundColor: 'rgb(var(--tw-prose-pre-bg))',
              padding: '1rem',
              borderRadius: '0.375rem',
              overflow: 'auto',
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
} satisfies Config;
