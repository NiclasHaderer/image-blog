import '../styles/globals.scss';
import '../styles/tailwind.scss';

import type { AppProps } from 'next/app';
import {MainLayout} from "@/components/main-layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <MainLayout>
    <Component {...pageProps} />
  </MainLayout>
}
