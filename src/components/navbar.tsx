import { FC, Fragment, ReactNode } from 'react';
import Link from 'next/link';
import { IconMenuDeep } from '@tabler/icons-react';
import { Menu, Transition } from '@headlessui/react';

export const Navbar: FC = () => {
  return (
    <nav className="mx-2 mb-2">
      <div className="hidden lg:flex gap-x-6">
        <NavbarItem href={'/'}>
          <img
            src="/logo/logo-200.webp"
            alt="Home"
            className="w-20 lg:h-20 rounded-lg hover:bg-surface-1 transition-colors"
          />
        </NavbarItem>

        <NavbarItem href={'/wedding-photography'}>Wedding Photography</NavbarItem>

        <NavbarItem href={'/animal-photography'}>Animal Photography</NavbarItem>

        <NavbarItem href={'/blog'}>Blog</NavbarItem>

        <NavbarItem href={'/about'}>About</NavbarItem>

        <NavbarItem href={'/contact'}>Contact</NavbarItem>
      </div>

      <div className="lg:hidden flex justify-between items-center">
        <NavbarItem href={'/'}>
          <img
            src="/logo/logo-200.webp"
            alt="Home"
            className="w-20 lg:h-20 rounded-lg hover:bg-surface-1 transition-colors"
          />
        </NavbarItem>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center">
            <IconMenuDeep className="w-14 h-14 cursor-pointer hover:bg-surface-1 rounded-lg p-1" />
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
            <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-surface divide-y divide-surface-1 rounded-md shadow-lg focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  <NavbarItem href={'/wedding-photography'}>Wedding Photography</NavbarItem>
                </Menu.Item>
                <Menu.Item>
                  <NavbarItem href={'/animal-photography'}>Animal Photography</NavbarItem>
                </Menu.Item>
                <Menu.Item>
                  <NavbarItem href={'/blog'}>Blog</NavbarItem>
                </Menu.Item>
                <Menu.Item>
                  <NavbarItem href={'/about'}>About</NavbarItem>
                </Menu.Item>
                <Menu.Item>
                  <NavbarItem href={'/contact'}>Contact</NavbarItem>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

const NavbarItem: FC<{
  href: string;
  children: ReactNode;
}> = ({ href, children }) => {
  const childIsText = typeof children === 'string';
  return (
    <Link href={href} className="flex items-center">
      {childIsText ? (
        <span className="rounded-lg px-2 py-1 text-lg text-text-unimportant hover:bg-surface-1 transition-colors whitespace-nowrap w-full">
          {children}
        </span>
      ) : (
        children
      )}
    </Link>
  );
};
