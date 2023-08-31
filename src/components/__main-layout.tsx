import { FC, forwardRef, Fragment, ReactNode } from 'react';
import { Logo } from '@/components/logo';
import { Menu, Transition } from '@headlessui/react';
import { IconMenuDeep } from '@tabler/icons-react';
import Link from 'next/link';
import { CONTENT_WIDTH } from '@/components/main-outlet';

const Navbar: FC<{
  navItems: { href: string; label: string }[];
}> = ({ navItems }) => {
  return (
    <nav className="min-w-full p-1 shadow-sm drop-shadow-2xl">
      <div className="hidden gap-x-6 lg:flex">
        <NavbarItem href={'/'}>
          <Logo className="w-20 rounded-lg transition-colors hover:bg-elevate lg:h-20" />
        </NavbarItem>

        {navItems.map(({ href, label }) => (
          <NavbarItem href={href} key={href}>
            {label}
          </NavbarItem>
        ))}
      </div>

      <div className="flex items-center justify-between lg:hidden">
        <NavbarItem href={'/'}>
          <Logo className="w-20 rounded-lg transition-colors hover:bg-elevate lg:h-20" />
        </NavbarItem>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center">
            <IconMenuDeep className="h-14 w-14 cursor-pointer rounded-lg p-1 hover:bg-elevate" />
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
            <Menu.Items className="bg-surface divide-surface-1 absolute right-0 mt-2 w-56 origin-top-right divide-y rounded-md shadow-lg focus:outline-none">
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
        <span className="w-full whitespace-nowrap rounded-lg px-2 py-1 text-lg text-gray transition-colors hover:bg-elevate">
          {children}
        </span>
      ) : (
        children
      )}
    </Link>
  );
});
NavbarItem.displayName = 'NavbarItem';

/*
1. Wedding photography
2. Animal photography
3. Blog
4. About
5. Contact
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __mainLayout: FC<{
  children: ReactNode;
  navItems: { href: string; label: string }[];
}> = ({ children, navItems }) => {
  return (
    <div className="flex h-full flex-col items-center">
      <Navbar navItems={navItems} />
      <main className={`flex-grow overflow-y-auto ${CONTENT_WIDTH}`}>{children}</main>
    </div>
  );
};
