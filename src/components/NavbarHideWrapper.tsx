'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

function shouldHideNavbar(_pathname: string): boolean {
  // 경험정리 settings/chat/createloading 경로 분기 제거됨 (리뉴얼 전 정리)
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
