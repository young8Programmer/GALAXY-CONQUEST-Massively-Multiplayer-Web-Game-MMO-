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
        space: {
          dark: '#0a0e27',
          darker: '#050714',
          blue: '#1a237e',
          light: '#283593',
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0a0e27 0%, #1a237e 100%)',
      },
    },
  },
  plugins: [],
}
