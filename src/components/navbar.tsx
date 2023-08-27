import { FC, forwardRef, Fragment, ReactNode } from 'react';
import Link from 'next/link';
import { IconMenuDeep } from '@tabler/icons-react';
import { Menu, Transition } from '@headlessui/react';
import { Logo } from '@/components/logo';

export const Navbar: FC<{
  navItems: { href: string; label: string }[];
}> = ({ navItems }) => {
  return (
    <nav className="p-1 shadow-sm drop-shadow-2xl min-w-full">
      <div className="hidden lg:flex gap-x-6">
        <NavbarItem href={'/'}>
          <Logo className="w-20 lg:h-20 rounded-lg hover:bg-surface-1 transition-colors" />
        </NavbarItem>

        {navItems.map(({ href, label }) => (
          <NavbarItem href={href} key={href}>
            {label}
          </NavbarItem>
        ))}
      </div>

      <div className="lg:hidden flex justify-between items-center">
        <NavbarItem href={'/'}>
          <Logo className="w-20 lg:h-20 rounded-lg hover:bg-surface-1 transition-colors" />
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
                {navItems.map(({ href, label }) => (
                  <Menu.Item key={href}>
                    <NavbarItem href={href}>{label}</NavbarItem>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

const NavbarItem = forwardRef<
  HTMLAnchorElement,
  {
    href: string;
    children: ReactNode;
  }
>(({ href, children }, ref) => {
  const childIsText = typeof children === 'string';
  return (
    <Link href={href} className="flex items-center" ref={ref}>
      {childIsText ? (
        <span className="rounded-lg px-2 py-1 text-lg text-text-unimportant hover:bg-surface-1 transition-colors whitespace-nowrap w-full">
          {children}
        </span>
      ) : (
        children
      )}
    </Link>
  );
});
NavbarItem.displayName = 'NavbarItem';
