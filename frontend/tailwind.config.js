/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        charcoal: '#121212',
        smoke: '#1c1c1c',
        cream: '#f5efe4',
        gold: '#00f0c0',
        amberglow: '#76ffe0',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 70px rgba(215, 168, 79, 0.18)',
        soft: '0 24px 80px rgba(0, 0, 0, 0.38)',
      },
      backgroundImage: {
        'studio-grid': 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
