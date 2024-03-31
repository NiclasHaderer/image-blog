import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        'top-2xl': '0 -25px 50px -12px rgb(0 0 0 / 0.25)',
      },
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
        ubuntu:
          "'Ubuntu', sans-serif, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--black)',
            fontWeight: 'light',
            'strong, a, th, h1, h2, h3, h4, h5, h6': {
              fontWeight: 'normal',
            },
            'blockquote, code': {
              fontWeight: 'normal',
            },
            'blockquote, strong, a, h1, h2, h3, h4, h5, h6': {
              color: 'var(--black)',
            },
            blockquote: {
              textAlign: 'center',
              borderTop: '1px solid var(--tw-prose-quote-borders)',
              borderBottom: '1px solid var(--tw-prose-quote-borders)',
              borderLeft: 'none',
            },
          },
        },
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
      white: 'var(--white)',
      black: 'var(--black)',
      backdrop: 'var(--backdrop)',
      transparent: 'transparent',
      elevate: 'var(--elevate)',
      'elevate-1': 'var(--elevate-1)',
      'elevate-2': 'var(--elevate-2)',
      gray: 'var(--gray)',
      'light-gray': 'var(--light-gray)',
    },
    minWidth: {
      '1/7': '14.2%',
    },
    maxWidth: {
      '1/7': '14.2%',
    },
  },
  plugins: [typography()],
};
export default config;
