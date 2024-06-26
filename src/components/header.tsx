import { FC, Fragment, useState } from 'react';
import Link from 'next/link';
import { LocalImageProps } from '@/utils/image-props';
import { useImageSizes, useImageSrcSet } from '@/hooks/image';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { IconMenuDeep } from '@tabler/icons-react';

type GroupUrl = {
  label: string;
  href: string;
};

// TODO if there are multiple background-images create a carousel
// TODO nested navigation
export const Header: FC<{
  groupUrls: GroupUrl[];
  keywords: string[];
  className?: string;
  title: string;
  backgroundImage: LocalImageProps;
  headerColor: string | undefined;
  headerSize: 'small' | 'medium' | 'large';
  subheader: string | undefined;
}> = ({ groupUrls, headerSize, keywords, backgroundImage, subheader, className, title, headerColor }) => {
  groupUrls = [{ label: 'Home', href: '/' }, ...groupUrls];

  const images = useImageSizes(backgroundImage, 'normal');
  const srcSet = useImageSrcSet(images);
  const headerSizeClasses = {
    small: 'h-[20vh] md:h-[25vh]',
    medium: 'h-[40vh] md:h-[50vh] lg:h-[60vh]',
    large: 'h-[60vh] md:h-[70vh] lg:h-[80vh]',
  }[headerSize];

  return (
    <>
      <nav
        className={`
          ${className ?? ''}
          ${headerSizeClasses}
          relative w-full select-none overflow-hidden text-white`}
        style={{ backgroundColor: headerColor }}
      >
        {!headerColor && (
          <img
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
            {...backgroundImage.getSize('original', 'normal')}
            style={
              headerSize
                ? {
                    scale: '1.1',
                    filter: 'brightness(0.7) blur(1px)',
                  }
                : {}
            }
            srcSet={srcSet}
            alt="Navigation background"
          />
        )}
        <h1 className="mt-1 pb-1 pt-2 text-center font-amsterdam-four text-5xl leading-loose">{title}</h1>

        <MenuLarge groupUrls={groupUrls} />
        <MenuMedium groupUrls={groupUrls} />
        <MenuSmall groupUrls={groupUrls} />
      </nav>
      <Keywords keywords={keywords} subheader={subheader} />
    </>
  );
};

const MenuLarge: FC<{ groupUrls: GroupUrl[] }> = ({ groupUrls }) => {
  return (
    <div className="mt-2 hidden justify-center lg:flex">
      {groupUrls.map((group, i, arr) => (
        <Link href={group.href} key={i} className="group uppercase">
          <span className="p-2 group-hover:underline">{group.label}</span>
          {i < arr.length - 1 && <span className="p-2">|</span>}
        </Link>
      ))}
    </div>
  );
};

const MenuMedium: FC<{ groupUrls: GroupUrl[] }> = ({ groupUrls }) => {
  return (
    <Menu as="div" className="hidden flex-col items-center md:flex lg:hidden">
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
  );
};

const MenuSmall: FC<{ groupUrls: GroupUrl[] }> = ({ groupUrls }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        style={{ '--tw-shadow': '0 25px 50px 5px rgba(0, 0, 0, 0.25)' } as any}
        className="fixed bottom-0 left-1/2 z-40 mb-1 -translate-x-1/2 cursor-pointer rounded-xl bg-elevate p-1 text-black shadow-2xl drop-shadow-2xl"
      >
        <IconMenuDeep className="h-10 w-10" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-in duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-backdrop" />
          </Transition.Child>

          <Transition.Child
            as={'div'}
            className="fixed bottom-0 left-0 right-0"
            enter="ease-in-out duration-200"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in-out duration-150"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="w-full bg-white shadow-top-2xl">
              {groupUrls.map(({ href, label }, i) => (
                <Link href={href} className="flex items-center" key={i} onClick={() => setIsOpen(false)}>
                  <span className="w-full whitespace-nowrap rounded-lg p-2 text-xl uppercase text-gray transition-colors hover:bg-elevate-1">
                    {label}
                  </span>
                </Link>
              ))}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

const Keywords: FC<{
  keywords: string[];
  subheader: string | undefined;
}> = ({ keywords, subheader }) => {
  return (
    <>
      {subheader && <h1 className="p-2 pt-3 text-center text-2xl font-normal uppercase">{subheader}</h1>}
      <div className="flex flex-wrap justify-center py-2">
        {keywords.map((group, i, arr) => (
          <div key={i}>
            <span className="p-2 uppercase">{group}</span>
            {i < arr.length - 1 && <span className="select-none">|</span>}
          </div>
        ))}
      </div>
    </>
  );
};
