/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050706',
        charcoal: '#0E1110',
        smoke: '#121715',
        cream: '#FFF7EA',
        gold: '#00F5D4',
        amberglow: '#BFFFEF',
        mint: '#BFFFEF',
        tealDark: '#00BFA6',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 70px rgba(0, 245, 212, 0.18)',
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
