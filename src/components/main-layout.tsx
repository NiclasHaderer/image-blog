import { FC, ReactNode } from 'react';
import { Navbar } from '@/components/navbar';

export const MainLayout: FC<{
  children: ReactNode;
  navItems: { href: string; label: string }[];
}> = ({ children, navItems }) => {
  return (
    <div className="flex h-full flex-col items-center">
      <Navbar navItems={navItems} />
      <main className="flex-grow overflow-y-auto w-full lg:w-[900px] xl:w-[1000px] 2xl:w-[1400px] mx-auto p-2 lg:p-[3rem] transition-all">
        {children}
      </main>
    </div>
  );
};

/*
1. Wedding photography
2. Animal photography
3. Blog
4. About
5. Contact
*/
