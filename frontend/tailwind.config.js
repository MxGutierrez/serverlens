module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        primary: 'var(--primary-color)'
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
