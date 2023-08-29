import { FC } from 'react';
import Link from 'next/link';

export const HomePage: FC<{
  groupUrls: { label: string; href: string }[];
  backgroundImage: string;
}> = ({ groupUrls }) => {
  groupUrls = [{ label: 'Home', href: '/' }, ...groupUrls];
  const backgroundImage = 'https://wallpaperaccess.com/download/4k-nature-31189';
  return (
    <>
      <nav
        className="h-[80vh] relative w-full bg-cover bg-center bg-no-repeat text-white select-none"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <h1 className="font-amsterdam-four pt-2 pb-1 leading-loose text-4xl text-center">Sarah Lenz</h1>
        <div className="flex justify-center">
          {groupUrls.map((group, i, arr) => (
            <Link href={group.href} key={i} className="hover:underline transition-all">
              <span className="p-2">{group.label}</span>
              {i < arr.length - 1 && <span className="p-2">|</span>}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export const Test: FC<{
  groupUrls: { label: string; href: string }[];
}> = ({ groupUrls }) => {
  return (
    <>
      <h1 className="text-4xl text-center pt-3 pb-2">PHOTOGRAPHER FROM AMSTERDAM</h1>
      <div className="flex justify-center">
        {groupUrls.map((group, i, arr) => (
          <Link href={group.href} key={i} className="hover:underline transition-all">
            <span className="p-2">{group.label}</span>
            {i < arr.length - 1 && <span className="p-2">|</span>}
          </Link>
        ))}
      </div>
    </>
  );
};
