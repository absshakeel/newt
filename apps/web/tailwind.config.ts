import type { Config } from 'tailwindcss';

/**
 * Global Tourism Platform design tokens.
 * Warm editorial travel system: light sand surfaces, deep ink text,
 * sea + terracotta accents. See prompts/15-PREMIUM-TRAVEL-UI-UX-DESIGN.md §7.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FDFBF7',
          100: '#F8F3EA',
          200: '#EFE6D8',
          300: '#E1D3BE',
          400: '#CBB79B',
          500: '#B29B7C',
          600: '#8E7960',
        },
        ink: {
          100: '#E9EFF2',
          200: '#D1DDE2',
          300: '#A6C1CC',
          400: '#6E9AAC',
          500: '#48788D',
          600: '#2F5C71',
          700: '#1E4356',
          800: '#14303F',
          900: '#0C1C2C',
          950: '#08131F',
        },
        sea: {
          100: '#E3F1F1',
          200: '#BCDDDE',
          300: '#7FBFC2',
          400: '#3B9BA0',
          500: '#147A80',
          600: '#0F6167',
          700: '#0B4A4F',
        },
        terracotta: {
          100: '#FAE9E0',
          200: '#F3D2C1',
          300: '#E8AE90',
          400: '#D98B68',
          500: '#C96B45',
          600: '#B45736',
          700: '#98472A',
        },
        gold: {
          300: '#E6CE93',
          400: '#D6B45E',
          500: '#C29B3C',
          600: '#A9822B',
        },
        // Legacy alias so any residual `primary-*` utility keeps resolving.
        primary: {
          50: '#E3F1F1',
          100: '#BCDDDE',
          200: '#7FBFC2',
          300: '#3B9BA0',
          400: '#147A80',
          500: '#0F6167',
          600: '#0B4A4F',
          700: '#0B4A4F',
          800: '#14303F',
          900: '#0C1C2C',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-sm': ['clamp(2rem, 1.4rem + 2.6vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        display: ['clamp(2.5rem, 1.6rem + 4vw, 4.5rem)', { lineHeight: '1.03', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(3rem, 1.8rem + 5.5vw, 5.75rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      spacing: { 18: '4.5rem', 22: '5.5rem', 30: '7.5rem' },
      borderRadius: { card: '1.5rem', panel: '2rem', pill: '999px' },
      boxShadow: {
        soft: '0 1px 2px rgba(12, 28, 44, 0.04), 0 8px 24px -12px rgba(12, 28, 44, 0.12)',
        lift: '0 2px 6px rgba(12, 28, 44, 0.06), 0 24px 48px -20px rgba(12, 28, 44, 0.22)',
        panel: '0 32px 80px -40px rgba(12, 28, 44, 0.35)',
        focus: '0 0 0 3px rgba(20, 122, 128, 0.35)',
      },
      backgroundImage: {
        'sand-fade': 'linear-gradient(180deg, #FDFBF7 0%, #F8F3EA 100%)',
        'ink-veil':
          'linear-gradient(0deg, rgba(8,19,31,0.86) 0%, rgba(8,19,31,0.42) 45%, rgba(8,19,31,0.05) 100%)',
      },
      keyframes: {
        'reveal-up': {
          from: { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        drift: {
          from: { transform: 'translate3d(-6%, 0, 0)' },
          to: { transform: 'translate3d(6%, 0, 0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        'draw-route': {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        'pulse-marker': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'reveal-up': 'reveal-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        drift: 'drift 26s ease-in-out infinite alternate',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'draw-route': 'draw-route 3.2s cubic-bezier(0.65, 0, 0.35, 1) both',
        'pulse-marker': 'pulse-marker 2.4s ease-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out both',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;