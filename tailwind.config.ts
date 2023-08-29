import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      minWidth: (utils) => ({
        ...utils.theme('width'),
        none: 'none',
      }),
      maxWidth: (utils) => ({
        ...utils.theme('width'),
        none: 'none',
      }),
      fontFamily: {
        'amsterdam-four': 'Amsterdam Four',
      },
    },
    padding: {
      0: '0',
      1: 'var(--p)',
      2: 'var(--p-m)',
      3: 'var(--p-l)',
    },
    margin: {
      0: '0',
      1: 'var(--p)',
      2: 'var(--p-m)',
      3: 'var(--p-l)',
      auto: 'auto',
    },
    colors: {
      white: '#fff',
      transparent: 'transparent',
      elevate: 'var(--elevate)',
      'elevate-1': 'var(--elevate-1)',
      gray: 'var(--gray)',
      'light-gray': 'var(--light-gray)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      warning: 'var(--warning)',
      error: 'var(--error)',
    },
  },
  plugins: [typography()],
};
export default config;
