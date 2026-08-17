module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff'
      },
      
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Helvetica Neue"', 'sans'],
      },
    },
  },

  plugins: [],

}
