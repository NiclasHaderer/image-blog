import { FC, ReactNode } from 'react';

export const CONTENT_WIDTH = `w-full lg:w-[900px] xl:w-[1000px] 2xl:w-[1400px] mx-auto p-2 lg:p-[3rem] transition-all`;

export const MainOutlet: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <main className={CONTENT_WIDTH}>{children}</main>;
};
