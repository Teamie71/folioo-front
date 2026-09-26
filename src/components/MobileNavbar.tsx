'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthControllerHandleLogout } from '@/api/endpoints/auth/auth';
import { useUserControllerGetProfile } from '@/api/endpoints/user/user';
import { MobileLogoutIcon } from '@/components/icons/mobile/MobileLogoutIcon';
import { MobileProfileButtonIcon } from '@/components/icons/mobile/MobileProfileButtonIcon';
import { LogoutModal } from '@/components/LogoutModal';
import {
  SIDEBAR_MENU_ITEMS,
  isSidebarItemActive,
} from '@/constants/sidebarNavigation';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isLoggedIn = accessToken != null;

  const { data: profileData } = useUserControllerGetProfile({
    query: { enabled: isLoggedIn },
  });
  const profile = profileData?.result;
  const socialAccount = profile?.socialAccounts?.[0];
  const socialLogo =
    socialAccount?.socialType === 'GOOGLE'
      ? '/GoogleEmailLogo.svg'
      : socialAccount?.socialType === 'KAKAO'
        ? '/KakaoEmailLogo.svg'
        : socialAccount?.socialType === 'NAVER'
          ? '/NaverEmailLogo.svg'
          : '/sidebar/profile-placeholder.svg';

  const finishLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push('/');
  };

  const { mutate: logout } = useAuthControllerHandleLogout({
    mutation: {
      onSuccess: finishLogout,
      onError: finishLogout,
    },
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const hideBorder =
    pathname === '/experience' ||
    pathname === '/experience/list' ||
    pathname === '/experience/workspace';

  const getPageTitle = (path: string) => {
    const menuItem = SIDEBAR_MENU_ITEMS.find((item) =>
      isSidebarItemActive(path, item),
    );
    if (menuItem) return menuItem.label;
    if (path.startsWith('/log')) return '인사이트 로그';
    if (path.startsWith('/profile')) return '프로필';
    if (path.startsWith('/invoice/refund')) return '환불 신청';
    if (path.startsWith('/invoice')) return '이용권 거래 내역';
    return '';
  };

  const pageTitle = getPageTitle(pathname);
  const isProfilePage = pathname === '/profile';

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <nav
          aria-label='모바일 내비게이션'
          className={cn(
            'fixed top-0 right-0 left-0 z-[60] flex items-center justify-between bg-white px-2',
            isProfilePage ? 'h-14' : 'h-[52px]',
            pathname !== '/' &&
              !hideBorder &&
              !isProfilePage &&
              'border-b border-[#F0F0F0]',
          )}
        >
          <div className='flex items-center'>
            {pathname !== '/' && (
              <button
                type='button'
                onClick={() => router.back()}
                aria-label='뒤로 가기'
                className='flex h-10 w-10 items-center justify-center'
              >
                <Image
                  src='/mobile/back.svg'
                  alt=''
                  width={24}
                  height={24}
                  className='-rotate-90'
                />
              </button>
            )}
            {pathname === '/' ? (
              <Link
                href='/'
                aria-label='Folioo 홈으로 이동'
                className='flex h-10 items-center pl-2'
              >
                <Image
                  src='/MainLogo.svg'
                  alt='Folioo'
                  width={90}
                  height={24}
                  priority
                />
              </Link>
            ) : (
              pageTitle && (
                <span className='typo-h5 text-gray9 font-bold'>
                  {pageTitle}
                </span>
              )
            )}
          </div>
          <Dialog.Trigger asChild>
            <button
              type='button'
              aria-label='사이드바 열기'
              className='flex h-10 w-10 items-center justify-center'
            >
              <span className='relative size-6'>
                <Image
                  src='/mobile/menu.svg'
                  alt=''
                  width={18}
                  height={19.814}
                  className='absolute top-1 left-[3px]'
                />
              </span>
            </button>
          </Dialog.Trigger>
        </nav>

        <Dialog.Portal>
          <Dialog.Overlay className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out fixed inset-0 z-[100] bg-black/40 duration-200' />
          <Dialog.Content
            aria-describedby={undefined}
            className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right fixed top-0 right-0 bottom-0 z-[110] flex w-[18.125rem] max-w-full flex-col overflow-y-auto overscroll-contain bg-white duration-200 outline-none'
          >
            <Dialog.Title className='sr-only'>사이드바</Dialog.Title>
            <div className='flex h-[76px] shrink-0 items-center justify-between pr-3 pl-[15px]'>
              <Link
                href='/'
                onClick={() => setIsOpen(false)}
                aria-label='Folioo 홈으로 이동'
              >
                <Image
                  src='/sidebar/logo.svg'
                  alt='Folioo'
                  width={112}
                  height={28}
                />
              </Link>
              <Dialog.Close asChild>
                <button
                  type='button'
                  aria-label='사이드바 닫기'
                  className='flex size-10 items-center justify-center'
                >
                  <Image
                    src='/mobile/sidebar-close.svg'
                    alt=''
                    width={24}
                    height={24}
                  />
                </button>
              </Dialog.Close>
            </div>

            <nav
              aria-label='주요 메뉴'
              className='flex flex-col gap-1 px-[15px]'
            >
              {SIDEBAR_MENU_ITEMS.map((item) => {
                const active = isSidebarItemActive(pathname, item);
                return (
                  <div key={item.href}>
                    {item.href === '/feedback' && (
                      <div className='mx-[5.5px] mt-1 mb-[7px] h-px bg-[url(/mobile/sidebar-divider.svg)] bg-repeat-x' />
                    )}
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex h-10 items-center justify-between gap-2 rounded p-2',
                        active ? 'bg-sub1' : 'hover:bg-gray2',
                      )}
                    >
                      <span className='flex items-center gap-2'>
                        <span className='relative size-5 shrink-0'>
                          <Image
                            src={item.expandedIcon}
                            alt=''
                            width={item.activePath === '/experience' ? 16 : 20}
                            height={
                              item.activePath === '/experience' ? 14.6667 : 20
                            }
                            className={
                              item.activePath === '/experience'
                                ? 'absolute top-[3px] left-[2px]'
                                : undefined
                            }
                          />
                        </span>
                        <span className='typo-b2 text-gray9'>{item.label}</span>
                      </span>
                      <MobileProfileButtonIcon />
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div className='mx-[20.5px] mt-2 h-px shrink-0 bg-[url(/mobile/sidebar-divider.svg)] bg-repeat-x' />

            {sessionRestoreAttempted && (
              <div className='px-5 pt-[15px] pb-5'>
                {isLoggedIn ? (
                  <Link
                    href='/profile'
                    onClick={() => setIsOpen(false)}
                    aria-label='프로필 열기'
                    className='block'
                  >
                    <span className='flex items-center gap-1'>
                      <span className='typo-b2-b text-gray9 mr-1 truncate'>
                        {profile?.name || '사용자'}
                      </span>
                      <span className='typo-c1 text-gray9 shrink-0'>
                        님 프로필
                      </span>
                      <MobileProfileButtonIcon />
                    </span>
                    <span className='mt-1 flex min-w-0 items-center gap-2'>
                      <Image
                        src={socialLogo}
                        alt=''
                        width={20}
                        height={20}
                        className='shrink-0'
                      />
                      <span className='typo-c1 text-gray6 truncate'>
                        {(socialAccount?.socialEmail as unknown as string) ||
                          ''}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <Link
                    href='/login'
                    onClick={() => setIsOpen(false)}
                    className='block'
                  >
                    <span className='flex items-center gap-1'>
                      <span className='typo-b2-b text-gray9'>로그인</span>
                      <MobileProfileButtonIcon />
                    </span>
                    <span className='typo-c1 text-gray6 mt-1 block'>
                      Folioo와 커리어 기록을 시작하세요.
                    </span>
                  </Link>
                )}
              </div>
            )}

            {sessionRestoreAttempted && isLoggedIn && (
              <div className='mt-auto shrink-0 px-5 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]'>
                <button
                  type='button'
                  onClick={() => {
                    setIsOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className='typo-b2 text-gray9 flex min-h-10 items-center gap-2'
                >
                  <MobileLogoutIcon />
                  <span>로그아웃</span>
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <LogoutModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={logout}
        variant='mobile'
      />
    </>
  );
}
