import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--inter)'],
        serif: ['var(--bricolage-grotesque)']
      },

      animation: {
        'toast-countdown': 'toast-countdown 3s linear forwards'
      },

      keyframes: {
        'toast-countdown': {
          from: {
            width: '100%'
          },

          to: {
            width: '0%'
          }
        }
      }
    }
  },
  plugins: []
}
export default config
