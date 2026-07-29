'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

function shouldHideNavbar(pathname: string): boolean {
  // experience/settings 페이지
  if (pathname === '/experience/settings') return true;
  // experience/settings/[id]/chat 페이지
  if (/^\/experience\/settings\/[^/]+\/chat$/.test(pathname)) return true;
  if (/^\/experience\/settings\/[^/]+\/createloading$/.test(pathname))
    return true;
  return false;
}

export default function NavbarHideWrapper({
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
