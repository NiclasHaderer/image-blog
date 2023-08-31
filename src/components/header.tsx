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
  capabilities: string[];
  className?: string;
  title: string;
  backgroundImage: LocalImageProps;
  backgroundColor?: string | undefined;
  secondMenuBelow?: boolean;
}> = ({ groupUrls, capabilities, backgroundImage, className, title, secondMenuBelow = false, backgroundColor }) => {
  groupUrls = [{ label: 'Home', href: '/' }, ...groupUrls];

  const images = useImageSizes(backgroundImage, 'normal');
  const srcSet = useImageSrcSet(images);
  return (
    <>
      <nav
        className={`
          h-[60vh]
          md:h-[70vh]
          lg:h-[80vh]
          ${className ?? ''}
          relative w-full select-none text-white`}
        style={{ backgroundColor }}
      >
        {!backgroundColor && (
          <img
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
            {...backgroundImage.getSize('original', 'normal')}
            srcSet={srcSet}
            alt="Navigation background"
          />
        )}
        <h1 className="pb-1 pt-2 text-center font-amsterdam-four text-5xl leading-loose">{title}</h1>
        <div className="mt-2 hidden justify-center lg:flex">
          {groupUrls.map((group, i, arr) => (
            <Link href={group.href} key={i} className="group uppercase">
              <span className="p-2 group-hover:underline">{group.label}</span>
              {i < arr.length - 1 && <span className="p-2">|</span>}
            </Link>
          ))}
        </div>
        <Menu as="div" className="flex flex-col items-center lg:hidden ">
          <Menu.Button>
            <IconMenuDeep className="h-14 w-14 cursor-pointer p-1" />
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
              <Menu.Items className="absolute left-1/2 top-0 w-56 -translate-x-1/2 divide-gray rounded-md bg-elevate shadow-lg focus:outline-none">
                <div className="px-1 py-1">
                  {groupUrls.map(({ href, label }, i) => (
                    <Menu.Item key={i}>
                      <Link href={href} className="flex items-center">
                        <span className="w-full whitespace-nowrap rounded-lg px-2 py-1 uppercase text-gray transition-colors hover:bg-elevate-1">
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
      {secondMenuBelow && <SecondMenu capabilities={capabilities} />}
    </>
  );
};

const SecondMenu: FC<{
  capabilities: string[];
}> = ({ capabilities }) => {
  return (
    <>
      <h1 className="p-2 pt-3 text-center text-2xl font-normal uppercase">Photographer based in Amsterdam</h1>
      <div className="flex flex-wrap justify-center py-2">
        {capabilities.map((group, i, arr) => (
          <div key={i}>
            <span className="p-2 uppercase">{group}</span>
            {i < arr.length - 1 && <span>|</span>}
          </div>
        ))}
      </div>
    </>
  );
};
