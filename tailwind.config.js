/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sweet Angels palette — warm ivory base, blush + sage + sky accents
        cream: '#FFF9F2',
        blush: {
          50: '#FFF3F1',
          100: '#FCDFDD',
          200: '#F7C1C1',
          300: '#F0A3A8',
          400: '#E5828C',
          500: '#D66575',
        },
        sage: {
          50: '#F1F8F1',
          100: '#DCEEDD',
          200: '#BFE3C6',
          300: '#9CD3AA',
          400: '#77BE8E',
          500: '#57A472',
        },
        sky: {
          50: '#F0F8FB',
          100: '#D8EEF5',
          200: '#B9E1EC',
          300: '#93CFE0',
        },
        apricot: {
          100: '#FCE7D2',
          300: '#F7C08C',
          500: '#EE9B54',
        },
        ink: '#3A2F35',
        clay: '#8B7A80',
      },
      fontFamily: {
        display: ['"Fredoka"', 'ui-rounded', 'sans-serif'],
        body: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        cloud: '2rem',
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(58, 47, 53, 0.15)',
        card: '0 4px 16px -6px rgba(58, 47, 53, 0.12)',
      },
    },
  },
  plugins: [],
};
