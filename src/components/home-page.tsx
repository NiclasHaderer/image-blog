import { FC } from 'react';
import Link from 'next/link';
import { LocalImageProps } from '@/utils/image-props';
import { useImageSizes, useImageSrcSet } from '@/hooks/image';

export const HomePage: FC<{
  groupUrls: {
    label: string;
    href: string;
  }[];
  backgroundImage: LocalImageProps;
}> = ({ groupUrls, backgroundImage }) => {
  groupUrls = [{ label: 'Home', href: '/' }, ...groupUrls];

  const images = useImageSizes(backgroundImage, 'normal');
  const srcSet = useImageSrcSet(images);
  return (
    <>
      <nav
        className="
        h-[20vh]
        sm:h-[40vh]
        md:h-[60vh]
        lg:h-[80vh]
        relative w-full text-white select-none"
      >
        <img
          className="absolute -z-10 inset-0 w-full h-full object-cover object-center"
          {...backgroundImage.getSize('original', 'normal')}
          srcSet={srcSet}
          alt="Navigation background"
        />
        <h1 className="font-amsterdam-four pt-2 pb-1 leading-loose text-4xl text-center">Sarah Lenz</h1>
        <div className="flex justify-center">
          {groupUrls.map((group, i, arr) => (
            <Link href={group.href} key={i} className="hover:underline transition-all uppercase">
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
  groupUrls: {
    label: string;
    href: string;
  }[];
}> = ({ groupUrls }) => {
  return (
    <>
      <h1 className="text-3xl text-center pt-3 p-2">PHOTOGRAPHER FROM AMSTERDAM</h1>
      <div className="flex justify-center">
        {groupUrls.map((group, i, arr) => (
          <Link href={group.href} key={i} className="hover:underline transition-all uppercase">
            <span className="p-2">{group.label}</span>
            {i < arr.length - 1 && <span className="p-2">|</span>}
          </Link>
        ))}
      </div>
    </>
  );
};
