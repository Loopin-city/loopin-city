module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF9E3',
          100: '#FFF4C7',
          200: '#FFE98F',
          300: '#FFDE57',
          400: '#FFD600',
          500: '#E6C100',
          600: '#CCAC00',
          700: '#B39700',
          800: '#998200',
          900: '#806D00',
          DEFAULT: '#FFD600',
        },
        accent: {
          black: '#000000',
          white: '#FFFFFF',
          cream: '#FFF9E3',
        },
        background: {
          yellow: '#FFD600',
          cream: '#FFF9E3',
          white: '#FFFFFF',
          black: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'tech': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'tech-hover': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'glow': '0 0 10px #FFD600',
      },
    },
  },
  plugins: [],
}