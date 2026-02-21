/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:    '#faf7f2',
        earth:    '#c8a97e',
        'earth-lt':'#e8d8c0',
        teal:     '#3d8b7a',
        'teal-dk':'#2a6357',
        'teal-lt':'#7fc4b5',
        green:    '#5a8a4a',
        'green-lt':'#d4e8cc',
        charcoal: '#2c2c2c',
        'warm-gray':'#8a7e74',
      },
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 40px rgba(61,139,122,0.12)',
        'lg-soft': '0 20px 60px rgba(61,139,122,0.18)',
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #2a6357 0%, #3d8b7a 50%, #5a8a4a 100%)',
        'donate-gradient': 'linear-gradient(135deg, #3d8b7a 0%, #5a8a4a 100%)',
      },
    },
  },
  plugins: [],
}
