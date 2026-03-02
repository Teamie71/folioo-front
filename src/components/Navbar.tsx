'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ProfileButton } from '@/components/ProfileButton';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { ProfileModal } from '@/components/ProfileModal';
import { LogoutModal } from '@/components/LogoutModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthControllerHandleLogout } from '@/api/endpoints/auth/auth';
import { cn } from '@/utils/utils';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const myButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate: logout } = useAuthControllerHandleLogout({
    mutation: {
      onSuccess: () => {
        clearAuth();
        router.push('/');
      },
      onError: () => {
        // API 실패해도 로컬 인증 초기화
        clearAuth();
        router.push('/');
      },
    },
  });

  const isLoggedIn = accessToken != null;
  const showAuthArea = sessionRestoreAttempted;

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
  };

  const linkClass = (href: string) =>
    cn(
      'inline-block py-[8px] font-[16px] no-underline transition-colors hover:font-bold',
      pathname === href || (href !== '/' && pathname.startsWith(href))
        ? 'font-bold text-[#5060C5]'
        : 'text-[#333333]',
    );

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <nav className='fixed top-0 right-0 left-0 z-50 w-full bg-white'>
      <div className='mx-auto w-[1056px]'>
        <div className='flex h-[80px] items-center justify-between'>
          <div className='flex items-center gap-[60px]'>
            <Link href='/'>
              <Image
                src='/MainLogo.svg'
                alt='MainLogo'
                width={128}
                height={32}
                className='cursor-pointer'
              />
            </Link>

            {/* 네비게이션 링크 */}
            <div className='flex items-center gap-[40px]'>
              <Link href='/log' className={linkClass('/log')}>
                인사이트 로그
              </Link>
              <Link href='/experience' className={linkClass('/experience')}>
                경험 정리
              </Link>
              <Link href='/correction' className={linkClass('/correction')}>
                포트폴리오 첨삭
              </Link>
            </div>
          </div>

          <div className='flex items-center'>
            {!showAuthArea ? (
              <div className='h-[36px] w-[80px]' aria-hidden />
            ) : isLoggedIn ? (
              <div className='flex items-center gap-[2.5rem]'>
                <Link href='/topup' className={linkClass('/topup')}>
                  이용권 구매
                </Link>
                <ProfileButton
                  ref={myButtonRef}
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  isOpen={isProfileDropdownOpen}
                />
                <ProfileDropdown
                  open={isProfileDropdownOpen}
                  onClose={() => setIsProfileDropdownOpen(false)}
                  triggerRef={myButtonRef}
                  onProfileClick={() => setIsProfileModalOpen(true)}
                  onLogoutClick={handleLogoutClick}
                />
              </div>
            ) : (
              <div className='flex items-center gap-[2.5rem]'>
                <Link href='/topup' className={linkClass('/topup')}>
                  이용권 구매
                </Link>
                <button
                  onClick={handleLogin}
                  className='cursor-pointer rounded-[100px] border-none bg-[#5060C5] px-[28px] py-[8px] text-[16px] font-bold text-[#FFFFFF] outline-none focus:outline-none'
                >
                  로그인
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
      <LogoutModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={handleLogoutConfirm}
      />
    </nav>
  );
}
