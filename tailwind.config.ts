import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
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
    },
    colors: {
      transparent: 'transparent',
      surface: 'var(--surface)',
      'surface-1': 'var(--surface-1)',
      'surface-2': 'var(--surface-2)',
      text: 'var(--text)',
      "text-unimportant": "var(--text-unimportant)",
      primary: 'var(--primary)',
      'primary-active': 'var(--primary-active)',
      'text-primary': 'var(--text-primary)',
      secondary: 'var(--secondary)',
      'secondary-active': 'var(--secondary-active)',
      'text-secondary': 'var(--text-secondary)',
    },
  },
  plugins: [
      require('@tailwindcss/typography')({
        target: "modern",
        className: "prose",
      })
  ],
};
export default config;
