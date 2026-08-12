import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'soft-glow': '0 20px 60px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(180deg, rgba(15,23,42,0.7), rgba(15,23,42,0.95))',
      },
    },
  },
  plugins: [],
};

export default config;
