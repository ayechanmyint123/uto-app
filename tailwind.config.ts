import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        'print': { 'raw': 'print' },
      },
      animation: {
        ripple: 'ripple 0.8s',
      },
      keyframes: {
        ripple: {
          '100%': {
            opacity: '0',
            transform: 'scale(2)'
         },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;

