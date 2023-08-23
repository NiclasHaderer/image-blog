import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export const MainLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

const Footer: FC = () => {
  return (
    <footer>
      <Link href={'/licenses'}>Licenses</Link>
    </footer>
  );
};

/*
1. Wedding photography
2. Animal photography
3. Blog
*/
