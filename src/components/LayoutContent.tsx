'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

const HIDE_NAVBAR_PATTERNS = [/^\/correction\/[^/]+$/];

function shouldHideNavbar(pathname: string) {
  return HIDE_NAVBAR_PATTERNS.some((pattern) => pattern.test(pathname));
}

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = shouldHideNavbar(pathname ?? '');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? '' : 'pt-[80px]'}>{children}</div>
    </>
  );
}
