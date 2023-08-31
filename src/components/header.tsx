import { FC, Fragment } from 'react';
import Link from 'next/link';
import { LocalImageProps } from '@/utils/image-props';
import { useImageSizes, useImageSrcSet } from '@/hooks/image';
import { Menu, Transition } from '@headlessui/react';
import { IconMenuDeep } from '@tabler/icons-react';

export const Header: FC<{
  groupUrls: {
    label: string;
    href: string;
  }[];
  className?: string;
  title: string;
  backgroundImage: LocalImageProps;
  backgroundColor?: string | undefined;
  secondMenuBelow?: boolean;
}> = ({ groupUrls, backgroundImage, className, title, secondMenuBelow = false, backgroundColor }) => {
  groupUrls = [{ label: 'Home', href: '/' }, ...groupUrls];

  const images = useImageSizes(backgroundImage, 'normal');
  const srcSet = useImageSrcSet(images);
  return (
    <>
      <nav
        className={`
          h-[20vh]
          sm:h-[40vh]
          md:h-[60vh]
          lg:h-[80vh]
          ${className ?? ''}
          relative w-full text-white select-none`}
        style={{ backgroundColor }}
      >
        {!backgroundColor && (
          <img
            className="absolute -z-10 inset-0 w-full h-full object-cover object-center"
            {...backgroundImage.getSize('original', 'normal')}
            srcSet={srcSet}
            alt="Navigation background"
          />
        )}
        <h1 className="font-amsterdam-four pt-2 pb-1 leading-loose text-4xl text-center">{title}</h1>
        <div className="hidden lg:flex justify-center mt-2">
          {groupUrls.map((group, i, arr) => (
            <Link href={group.href} key={i} className="uppercase group">
              <span className="p-2 group-hover:underline">{group.label}</span>
              {i < arr.length - 1 && <span className="p-2">|</span>}
            </Link>
          ))}
        </div>
        <Menu as="div" className="lg:hidden flex-col flex items-center ">
          <Menu.Button>
            <IconMenuDeep className="w-14 h-14 cursor-pointer p-1" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="relative z-10">
              <Menu.Items className="top-0 left-1/2 -translate-x-1/2 absolute w-56 bg-white shadow-lg focus:outline-none rounded-md divide-gray">
                <div className="px-1 py-1">
                  {groupUrls.map(({ href, label }, i) => (
                    <Menu.Item key={i}>
                      <Link href={href} className="flex items-center">
                        <span className="rounded-lg px-2 py-1 text-lg text-gray hover:bg-elevate transition-colors whitespace-nowrap w-full">
                          {label}
                        </span>
                      </Link>
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </div>
          </Transition>
        </Menu>
      </nav>
      {secondMenuBelow && <SecondMenu groupUrls={groupUrls} />}
    </>
  );
};

const SecondMenu: FC<{
  groupUrls: {
    label: string;
    href: string;
  }[];
}> = ({ groupUrls }) => {
  return (
    <div className="hidden md:block">
      <h1 className="text-3xl text-center pt-3 p-2">PHOTOGRAPHER FROM AMSTERDAM</h1>
      <div className="flex justify-center">
        {groupUrls.map((group, i, arr) => (
          <Link href={group.href} key={i} className="uppercase group">
            <span className="p-2 group-hover:underline">{group.label}</span>
            {i < arr.length - 1 && <span className="p-2">|</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};
