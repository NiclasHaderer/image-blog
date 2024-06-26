import '../styles/globals.scss';
import '../styles/tailwind.scss';
import '../styles/fonts.scss';

import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
