/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf7f2',
        earth: '#c8a97e',
        'earth-lt': '#e8d8c0',
        'earth-dk': '#a07840',
        teal: '#3d8b7a',
        'teal-dk': '#2a6357',
        'teal-lt': '#7fc4b5',
        'teal-pale': '#e8f5f2',
        green: '#5a8a4a',
        'green-lt': '#d4e8cc',
        'green-dk': '#3d6030',
        charcoal: '#2c2c2c',
        'charcoal-deep': '#1e2022',
        'warm-gray': '#8a7e74',
        'light-gray': '#f0ece6',
      },
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 40px rgba(61,139,122,0.12)',
        'lg-soft': '0 20px 60px rgba(61,139,122,0.18)',
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #2a6357 0%, #3d8b7a 50%, #5a8a4a 100%)',
        'donate-gradient': 'linear-gradient(135deg, #3d8b7a 0%, #5a8a4a 100%)',
      },
      keyframes: {
        'site-enter': {
          '0%': {
            opacity: '0',
            transform: 'translateY(22px) scale(0.995)',
            filter: 'saturate(88%)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'saturate(100%)'
          }
        },
        'nav-enter': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'rise-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(28px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'hero-title-enter': {
          '0%': {
            opacity: '0',
            transform: 'translateY(26px)',
            letterSpacing: '0.02em'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
            letterSpacing: '0'
          }
        },
        'hero-copy-enter': {
          '0%': {
            opacity: '0',
            transform: 'translateY(22px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      }
    },
  },
  plugins: [],
}
