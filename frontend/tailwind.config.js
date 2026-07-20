/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101417',
        charcoal: '#1a1e22',
        smoke: '#15191d',
        // Theme-aware primary text color (cream on dark, charcoal on light)
        cream: 'rgb(var(--cream) / <alpha-value>)',
        gold: '#f4c875',
        amberglow: '#ffe0a0',
        mint: '#b8f3e6',
        aqua: '#8ee7d2',
        peach: '#ffd3ba',
        lilac: '#d9ccff',
        rose: '#ffc7d8',
        tealDark: '#6bc4a8',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 70px rgba(244, 200, 117, 0.18)',
        soft: '0 24px 80px rgba(0, 0, 0, 0.38)',
      },
      backgroundImage: {
        'studio-grid': 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
      },
    },
  },
  plugins: [
    ({ addVariant }) => addVariant('light', 'html[data-theme="light"] &'),
  ],
}
