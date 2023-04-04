const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
    padding: {
      0: '0',
      s: 'var(--p)',
      m: 'var(--p-m)',
      l: 'var(--p-l)',
    },
    margin: {
      0: '0',
      s: 'var(--p)',
      m: 'var(--p-m)',
      l: 'var(--p-l)',
    },
    colors: {
      surface: 'var(--surface)',
      'surface-1': 'var(--surface-1)',
      'surface-2': 'var(--surface-2)',
      text: 'var(--text)',
      primary: 'var(--primary)',
      'primary-active': 'var(--primary-active)',
      'text-primary': 'var(--text-primary)',
      secondary: 'var(--secondary)',
      'secondary-active': 'var(--secondary-active)',
      'text-secondary': 'var(--text-secondary)',
    },
  },
  plugins: [],
};
