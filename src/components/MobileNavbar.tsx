'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthControllerHandleLogout } from '@/api/endpoints/auth/auth';
import { useUserControllerGetProfile } from '@/api/endpoints/user/user';
import { HamburgerIcon } from '@/components/icons/HamburgerIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { MobileLogIcon } from '@/components/icons/mobile/MobileLogIcon';
import { MobileExperienceIcon } from '@/components/icons/mobile/MobileExperienceIcon';
import { MobileCorrectionIcon } from '@/components/icons/mobile/MobileCorrectionIcon';
import { MobileTicketIcon } from '@/components/icons/mobile/MobileTicketIcon';
import { MobileLogoutIcon } from '@/components/icons/mobile/MobileLogoutIcon';
import { MobileProfileButtonIcon } from '@/components/icons/mobile/MobileProfileButtonIcon';
import { LogoutModal } from '@/components/LogoutModal';
import Image from 'next/image';
import Link from 'next/link';

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isLoggedIn = accessToken != null;

  const { data: profileData } = useUserControllerGetProfile({
    query: { enabled: isLoggedIn },
  });
  const profile = profileData?.result;

  const { mutate: logout } = useAuthControllerHandleLogout({
    mutation: {
      onSuccess: () => {
        clearAuth();
        setIsOpen(false);
        router.push('/');
      },
      onError: () => {
        clearAuth();
        setIsOpen(false);
        router.push('/');
      },
    },
  });

  // 페이지 이동 시 드로어 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 드로어 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  const handleBack = () => {
    router.back();
  };

  const getPageTitle = (path: string) => {
    if (path.startsWith('/log')) return '인사이트 로그';
    if (path.startsWith('/experience')) return '경험 정리';
    if (path.startsWith('/correction')) return '포트폴리오 첨삭';
    if (path.startsWith('/topup')) return '이용권 구매';
    if (path.startsWith('/profile')) return '프로필';
    if (path.startsWith('/invoice/refund')) return '환불 신청';
    if (path.startsWith('/invoice')) return '이용권 거래 내역';
    if (path === '/tos') return '';
    if (path === '/privacy') return '';
    if (path === '/marketing') return '';
    if (path === '/') return 'Folioo';
    return '';
  };

  const pageTitle = getPageTitle(pathname || '');

  const menuItems = [
    {
      label: '인사이트 로그',
      href: '/log',
      icon: <MobileLogIcon />,
    },
    {
      label: '경험 정리',
      href: '/experience',
      icon: <MobileExperienceIcon />,
    },
    {
      label: '포트폴리오 첨삭',
      href: '/correction',
      icon: <MobileCorrectionIcon />,
    },
    {
      label: '이용권 구매',
      href: '/topup',
      icon: <MobileTicketIcon />,
    },
  ];

  return (
    <>
      <nav className='fixed top-0 right-0 left-0 z-[60] flex h-[52px] min-w-[22.5rem] items-center justify-between border-b border-[#F0F0F0] bg-white px-[0.25rem]'>
        <div className='flex items-center'>
          {pathname !== '/' && (
            <button
              type='button'
              onClick={handleBack}
              className='flex h-10 w-10 items-center justify-center'
            >
              <ChevronLeftIcon className='h-6 w-6 text-[#1A1A1A]' />
            </button>
          )}
          {pathname === '/' ? (
            <div className='flex h-10 items-center pl-2'>
              <Image
                src='/MainLogo.svg'
                alt='Folioo'
                width={90}
                height={24}
                priority
              />
            </div>
          ) : (
            pageTitle && (
              <span className='typo-h5 text-gray9 font-bold'>{pageTitle}</span>
            )
          )}
        </div>
        <button
          type='button'
          onClick={toggleDrawer}
          className='flex h-10 w-10 items-center justify-center'
        >
          <HamburgerIcon className='h-6 w-6 text-[#1A1A1A]' />
        </button>
      </nav>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className='fixed inset-0 z-[100] bg-black/40'
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-0 right-0 bottom-0 z-[110] w-[18.125rem] bg-white'
            >
              <div className='flex h-full flex-col'>
                {/* Close Button */}
                <div className='flex justify-end p-4'>
                  <button onClick={toggleDrawer}>
                    <CloseIcon className='h-6 w-6 text-[#1A1A1A]' />
                  </button>
                </div>

                {/* Profile Section */}
                <div className='px-6 py-6'>
                  {isLoggedIn ? (
                    <div
                      className='cursor-pointer'
                      onClick={() => {
                        router.push('/profile');
                      }}
                    >
                      <div className='flex items-center gap-[0.5rem]'>
                        <div className='flex items-center gap-1'>
                          <span className='typo-h4 text-gray9'>
                            {profile?.name || '사용자'}
                          </span>
                          <span className='text-gray9 text-[1rem]'>
                            님 프로필
                          </span>
                        </div>
                        <MobileProfileButtonIcon />
                      </div>
                      <div className='mt-2 flex items-center gap-2'>
                        {/* 소셜 로그인 아이콘 */}
                        <div className='flex h-5 w-5 items-center justify-center overflow-hidden rounded-full'>
                          {profile?.socialAccounts?.[0]?.socialType ===
                            'GOOGLE' && (
                            <Image
                              src='/GoogleEmailLogo.svg'
                              alt='Google'
                              width={20}
                              height={20}
                            />
                          )}
                          {profile?.socialAccounts?.[0]?.socialType ===
                            'KAKAO' && (
                            <Image
                              src='/KakaoEmailLogo.svg'
                              alt='Kakao'
                              width={20}
                              height={20}
                            />
                          )}
                          {profile?.socialAccounts?.[0]?.socialType ===
                            'NAVER' && (
                            <Image
                              src='/NaverEmailLogo.svg'
                              alt='Naver'
                              width={20}
                              height={20}
                            />
                          )}
                          {!profile?.socialAccounts?.[0]?.socialType && (
                            <div className='bg-gray4 h-full w-full' />
                          )}
                        </div>
                        <span className='typo-c1 text-gray6'>
                          {(profile?.socialAccounts?.[0]
                            ?.socialEmail as unknown as string) || ''}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className='cursor-pointer'
                      onClick={() => router.push('/login')}
                    >
                      <div className='flex items-center gap-[0.5rem]'>
                        <span className='typo-h4 text-gray9'>로그인</span>
                        <MobileProfileButtonIcon />
                      </div>
                      <p className='typo-c1 text-gray6 mt-1'>
                        Folioo와 커리어 기록을 시작하세요.
                      </p>
                    </div>
                  )}
                </div>

                <div className='border-gray3 mx-6 border-t' />

                {/* Nav Items */}
                <div className='mt-4 flex flex-col gap-2 px-6'>
                  {menuItems.map((item, idx) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className='flex items-center justify-between py-4'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='flex h-5 w-5 items-center justify-center'>
                            {item.icon}
                          </div>
                          <span className='typo-b2 text-gray9'>
                            {item.label}
                          </span>
                        </div>
                        <MobileProfileButtonIcon />
                      </Link>
                      {/* 포트폴리오 첨삭 밑에 구분선 (인덱스 기준 2번 아이템 뒤) */}
                      {idx === 2 && (
                        <div className='border-gray3 my-2 border-t' />
                      )}
                    </div>
                  ))}
                </div>

                {/* Logout Button - 하단 2.5rem 고정 */}
                {isLoggedIn && (
                  <div className='absolute bottom-[2.5rem] left-6'>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className='text-gray7 flex items-center gap-2 text-[1rem]'
                    >
                      <MobileLogoutIcon />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={logout}
        variant='mobile'
      />
    </>
  );
}
