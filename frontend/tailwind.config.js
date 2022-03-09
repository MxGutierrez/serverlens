module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1'
      },
      animation: {
        'spin-reverse': 'spin-reverse 1s linear infinite'
      },
      keyframes: {
        'spin-reverse': {
          from: {
            transform: 'rotate(360deg)'
          },
        }
      }
    },
  },
  plugins: [],
}
