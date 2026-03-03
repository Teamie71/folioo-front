'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { ProfileButton } from '@/components/ProfileButton';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { ProfileModal } from '@/components/ProfileModal';
import { LogoutModal } from '@/components/LogoutModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthControllerHandleLogout } from '@/api/endpoints/auth/auth';
import { cn } from '@/utils/utils';

const LOGIN_REQUIRED_AUTO_CLOSE_MS = 2000;

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
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);
  const myButtonRef = useRef<HTMLButtonElement>(null);
  const loginRequiredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      'group inline-block py-[8px] font-[16px] no-underline transition-colors',
      pathname === href || (href !== '/' && pathname.startsWith(href))
        ? 'font-bold text-[#5060C5]'
        : 'text-[#333333]',
    );

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLoginRequiredModalOpenChange = (open: boolean) => {
    if (!open) {
      if (loginRequiredTimerRef.current) {
        clearTimeout(loginRequiredTimerRef.current);
        loginRequiredTimerRef.current = null;
      }
      router.push('/login');
    }
    setIsLoginRequiredModalOpen(open);
  };

  useEffect(() => {
    if (!isLoginRequiredModalOpen) return;
    loginRequiredTimerRef.current = setTimeout(() => {
      loginRequiredTimerRef.current = null;
      setIsLoginRequiredModalOpen(false);
      router.push('/login');
    }, LOGIN_REQUIRED_AUTO_CLOSE_MS);
    return () => {
      if (loginRequiredTimerRef.current) {
        clearTimeout(loginRequiredTimerRef.current);
      }
    };
  }, [isLoginRequiredModalOpen, router]);

  const navLink = (href: string, label: string, requireLogin = false) => {
    const content = (
      <span className={linkClass(href)}>
        <span className='relative inline-block'>
          <span
            className='invisible inline-block whitespace-nowrap font-bold'
            aria-hidden
          >
            {label}
          </span>
          <span
            className={cn(
              'absolute top-0 left-0 whitespace-nowrap',
              isActive(href) && 'font-bold',
              'group-hover:font-bold',
            )}
          >
            {label}
          </span>
        </span>
      </span>
    );
    if (requireLogin && !isLoggedIn) {
      return (
        <button
          type='button'
          className='group inline-block py-[8px] font-[16px] no-underline transition-colors bg-transparent border-none cursor-pointer p-0'
          onClick={(e) => {
            e.preventDefault();
            setIsLoginRequiredModalOpen(true);
          }}
        >
          {content}
        </button>
      );
    }
    return <Link href={href}>{content}</Link>;
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

            {/* 네비게이션 링크 — hover 시 bold만 적용, 레이아웃 시프트 없음 */}
            <div className='flex items-center gap-[40px]'>
              {navLink('/log', '인사이트 로그')}
              {navLink('/experience', '경험 정리', true)}
              {navLink('/correction', '포트폴리오 첨삭', true)}
            </div>
          </div>

          <div className='flex items-center'>
            {!showAuthArea ? (
              <div className='h-[36px] w-[80px]' aria-hidden />
            ) : isLoggedIn ? (
              <div className='flex items-center gap-[2.5rem]'>
                <Link href='/topup' className={linkClass('/topup')}>
                  <span className='relative inline-block'>
                    <span
                      className='invisible inline-block whitespace-nowrap font-bold'
                      aria-hidden
                    >
                      이용권 구매
                    </span>
                    <span
                      className={cn(
                        'absolute top-0 left-0 whitespace-nowrap',
                        isActive('/topup') && 'font-bold',
                        'group-hover:font-bold',
                      )}
                    >
                      이용권 구매
                    </span>
                  </span>
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
                  <span className='relative inline-block'>
                    <span
                      className='invisible inline-block whitespace-nowrap font-bold'
                      aria-hidden
                    >
                      이용권 구매
                    </span>
                    <span
                      className={cn(
                        'absolute top-0 left-0 whitespace-nowrap',
                        isActive('/topup') && 'font-bold',
                        'group-hover:font-bold',
                      )}
                    >
                      이용권 구매
                    </span>
                  </span>
                </Link>
                <CommonButton
                  variantType='Primary'
                  px={28}
                  py={8}
                  onClick={handleLogin}
                >
                  로그인
                </CommonButton>
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
      <LoginRequiredModal
        open={isLoginRequiredModalOpen}
        onOpenChange={handleLoginRequiredModalOpenChange}
      />
    </nav>
  );
}
