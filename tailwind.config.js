/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bordo: {
          DEFAULT: '#8B1E2E',
          dark: '#6B1520',
          light: '#A8293C',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96A',
          dark: '#A8883A',
        },
        cream: '#FAF8F5',
        dark: '#1A0A0F',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        lato: ['Lato', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(90deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
        'bordo-gradient': 'linear-gradient(135deg, #6B1520 0%, #8B1E2E 50%, #A8293C 100%)',
        'hero-pattern': "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,30,46,0.2) 0%, transparent 40%)",
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(201,168,76,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(201,168,76,0.9), 0 0 40px rgba(201,168,76,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        pulse_glow: 'pulse_glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
