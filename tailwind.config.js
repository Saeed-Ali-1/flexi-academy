/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0a0e1a',
        'slate-deep': '#141a2b',
        'slate-soft': '#1c2238',
        'slate-rise': '#242b44',
        iris: {
          DEFAULT: '#7c5cff',
          soft: '#9d84ff',
          deep: '#5a3fd8',
        },
        aurora: {
          DEFAULT: '#3ddcb2',
          soft: '#6ce8c6',
          deep: '#1fb893',
        },
        'amber-warm': '#f5b86a',
        alabaster: '#f6f7fb',
        muted: '#8a93b0',
        'muted-soft': '#aab2cc',
        danger: '#ff6b8a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(10, 14, 26, 0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        glow: '0 0 40px rgba(124, 92, 255, 0.35)',
        'glow-aurora': '0 0 40px rgba(61, 220, 178, 0.3)',
        lift: '0 12px 40px -8px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'iris-gradient': 'linear-gradient(135deg, #7c5cff 0%, #5a3fd8 100%)',
        'aurora-gradient': 'linear-gradient(135deg, #3ddcb2 0%, #1fb893 100%)',
        'midnight-veil':
          'radial-gradient(circle at 20% 0%, rgba(124,92,255,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 100%, rgba(61,220,178,0.12) 0%, transparent 50%)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(2%, -2%)' },
        },
        'blob-a': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40px, 30px)' },
        },
        'blob-b': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-30px, -40px)' },
        },
        'blob-c': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        drift: 'drift 18s ease-in-out infinite',
        'blob-a': 'blob-a 22s ease-in-out infinite',
        'blob-b': 'blob-b 26s ease-in-out infinite',
        'blob-c': 'blob-c 8s ease-in-out infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
